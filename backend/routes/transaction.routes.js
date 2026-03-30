import { Router } from "express";
import { addTransaction, uploadTransactions, getTransactions } from "../controllers/transaction.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getTransactions);
router.post("/add", addTransaction);
router.post("/upload", upload.single("file"), uploadTransactions);

export default router;