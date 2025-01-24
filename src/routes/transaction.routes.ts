import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
  reportTransaction,
  getDashboard,
} from "../controllers/transaction.ctrl";

const router = Router();

router.post("/create", createTransaction);
router.get("/list", getTransactions);
router.get("/dashboard", getDashboard);
router.put("/retrieve/:id", getTransaction);
router.put("/update/:id", updateTransaction);
router.delete("/delete/:id", deleteTransaction);

router.get("/report/:clientId", reportTransaction);

export default router;
