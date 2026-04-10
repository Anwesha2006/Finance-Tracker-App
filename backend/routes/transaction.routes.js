const express = require("express");
const multer = require("multer");
const router = express.Router();
const TransactionController = require("../controllers/transaction.controller");
const protect = require("../middleware/auth.middleware");
router.post("/transaction", protect , TransactionController.addTransaction);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  router.get('/transaction', protect, TransactionController.getAllTransactions);
  router.delete('/transaction/:id', protect, TransactionController.deleteTransaction);
  router.post('/scan', upload.single('receipt'), TransactionController.scanReceipt);
module.exports = router;