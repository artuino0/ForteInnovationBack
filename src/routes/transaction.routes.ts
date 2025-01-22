import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
  reportTransaction,
} from "../controllers/transaction.ctrl";

const router = Router();

router.post("/create", createTransaction);
router.get("/list", getTransactions);
router.put("/retrieve/:id", getTransaction);
router.put("/update/:id", updateTransaction);
router.delete("/delete/:id", deleteTransaction);

router.get("/report/:clientId", reportTransaction);

export default router;
