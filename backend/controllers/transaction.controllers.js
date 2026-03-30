import { Readable } from "stream";
import csv from "csv-parser";
import { Transaction } from "../models/transaction.models.js";
import { Category } from "../models/category.models.js";
import { Account } from "../models/account.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ── Shared helper: resolve category by name ───────────────────────────────────
// Looks up the category by name (case-insensitive) for this user.
// Auto-creates it if not found so the user never hits a 404.
const resolveCategory = async (categoryName, userId, type = "expense") => {
  let cat = await Category.findOne({
    user: userId,
    name: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") },
  });
  if (!cat) {
    cat = await Category.create({
      user: userId,
      name: categoryName.trim(),
      type,
      isDefault: false,
    });
  }
  return cat;
};

// ── Shared helper: resolve account ────────────────────────────────────────────
// Gets the user's first active account.
// Auto-creates a default "Main Account" if none exists.
const resolveAccount = async (userId) => {
  let account = await Account.findOne({ user: userId, isActive: true });
  if (!account) {
    account = await Account.create({
      user: userId,
      name: "Main Account",
      type: "bank",
      balance: 0,
      initialBalance: 0,
      currency: "INR",
      isActive: true,
    });
  }
  return account;
};

// ── Shared helper: validate a single transaction row ─────────────────────────
const validateRow = ({ name, category, date, amount, type }) => {
  const errors = [];

  if (!name || !String(name).trim()) errors.push("name is required");
  if (!category || !String(category).trim()) errors.push("category is required");
  if (!date || isNaN(new Date(date))) errors.push("date is invalid");
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
    errors.push("amount must be a positive number");
  if (!type || !["income", "expense", "transfer"].includes(String(type).toLowerCase()))
    errors.push("type must be income, expense, or transfer");

  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/transactions/add
// Body: { name, category, date, amount, type, note?, paymentMethod?, status? }
// ─────────────────────────────────────────────────────────────────────────────
const addTransaction = asyncHandler(async (req, res) => {
  const { name, category: categoryName, date, amount, type, note, paymentMethod, status } =
    req.body;

  // 1. Validate required fields
  const errors = validateRow({ name, category: categoryName, date, amount, type });
  if (errors.length) {
    throw new ApiError(400, `Validation failed: ${errors.join(", ")}`);
  }

  // 2. Resolve category (auto-creates if missing)
  const categoryDoc = await resolveCategory(categoryName, req.user._id, type.toLowerCase());

  // 3. Resolve account (auto-creates if missing)
  const accountDoc = await resolveAccount(req.user._id);

  // 4. Save transaction
  const transaction = await Transaction.create({
    user: req.user._id,
    account: accountDoc._id,
    category: categoryDoc._id,
    name: name.trim(),
    amount: Number(amount),
    type: type.toLowerCase(),
    date: new Date(date),
    note: note?.trim() || undefined,
    paymentMethod: paymentMethod || "other",
    status: status || "completed",
  });

  // 5. Update account balance
  const balanceDelta =
    type.toLowerCase() === "income" ? Number(amount) : -Number(amount);
  await Account.findByIdAndUpdate(accountDoc._id, {
    $inc: { balance: balanceDelta },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, transaction, "Transaction added successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/transactions/upload
// Multipart form-data: file field = "file" (CSV)
// CSV columns: name, category, date, amount, type
// ─────────────────────────────────────────────────────────────────────────────
const uploadTransactions = asyncHandler(async (req, res) => {
  // 1. Ensure file was attached by multer
  if (!req.file) {
    throw new ApiError(400, "No CSV file uploaded. Attach the file under the key 'file'.");
  }

  // 2. Resolve the user's default account once (auto-creates if missing)
  const accountDoc = await resolveAccount(req.user._id);

  // 3. Parse CSV from the in-memory buffer (multer memoryStorage)
  const rows = await new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(req.file.buffer);
    stream
      .pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase() }))
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });

  if (!rows.length) {
    throw new ApiError(400, "The CSV file is empty.");
  }

  // 4. Process each row: validate → resolve category → build transaction doc
  const saved = [];
  const skipped = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // row 1 = header

    // 4a. Field-level validation
    const errors = validateRow(row);
    if (errors.length) {
      skipped.push({ row: rowNum, reason: errors.join(", "), data: row });
      continue;
    }

    // 4b. Resolve category (auto-creates if missing)
    const categoryDoc = await resolveCategory(row.category, req.user._id, String(row.type).toLowerCase());

    saved.push({
      user: req.user._id,
      account: accountDoc._id,
      category: categoryDoc._id,
      name: String(row.name).trim(),
      amount: Number(row.amount),
      type: String(row.type).toLowerCase(),
      date: new Date(row.date),
      status: "completed",
    });
  }

  // 5. Bulk insert all valid rows in one DB call
  let inserted = [];
  if (saved.length) {
    inserted = await Transaction.insertMany(saved, { ordered: false });

    // 6. Recalculate and update account balance from inserted transactions
    const balanceDelta = inserted.reduce((sum, t) => {
      return sum + (t.type === "income" ? t.amount : -t.amount);
    }, 0);

    await Account.findByIdAndUpdate(accountDoc._id, {
      $inc: { balance: balanceDelta },
    });
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        totalRows: rows.length,
        savedCount: inserted.length,
        skippedCount: skipped.length,
        skipped, // tells the client exactly which rows failed and why
      },
      `${inserted.length} transaction(s) saved, ${skipped.length} skipped.`
    )
  );
});

export { addTransaction, uploadTransactions, getTransactions };

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/transactions
// Query: ?type=income|expense&limit=50&page=1
// ─────────────────────────────────────────────────────────────────────────────
const getTransactions = asyncHandler(async (req, res) => {
  const { type, limit = 100, page = 1 } = req.query;

  const filter = { user: req.user._id };
  if (type) filter.type = type;

  const transactions = await Transaction.find(filter)
    .populate('category', 'name icon color')
    .populate('account', 'name type')
    .sort({ date: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Transaction.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, { transactions, total }, 'Transactions fetched successfully')
  );
});