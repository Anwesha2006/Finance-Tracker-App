const Transaction=require('../models/transaction.model');
const {createWorker} = require('tesseract.js');
exports.addTransaction=async(req,res)=>{
    try{
        const {amount,description,category}=req.body;
     const userId=req.user.id;
        if(!amount || !description){
            return res.status(400).json({error:"Amount and description are required"});
        }
        const receiptPath=req.file ? req.file.path : null;
        const transaction=await Transaction.create({userId,amount,receipt:receiptPath,description,category: category || "Other"});
        return res.status(201).json({message:"Transaction created successfully", transaction});
    }
    catch(err){
        console.error("createTransaction error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
    }
 exports.scanReceipt=async(req,res)=>{
        try{
            if(!req.file){  
                return res.status(400).json({error:"No receipt image uploaded"});
            }
            const imagePath=req.file.path;
            const worker=await createWorker('eng');
            const result=await worker.recognize(imagePath);
            await worker.terminate();
            const text=result.data.text;
            const amounts=text.match(/(\d+(\.\d{1,2})?)/g);
                const maxAmount=amounts ? Math.max(...amounts.map(Number)) : null;
                return res.json({extractedText:text,detectedAmount:maxAmount});
        }
        catch(err){
            console.error("scanReceipt error", err);
            return res.status(500).json({error:"Something went wrong"});
        }
        };

exports.getAllTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
        return res.json(transactions);
    } catch (err) {
        console.error("getAllTransactions error", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;
        const transaction = await Transaction.findOneAndDelete({ _id: transactionId, userId });
        if (!transaction) return res.status(404).json({ error: "Transaction not found or unauthorized" });
        return res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
        console.error("deleteTransaction error", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};