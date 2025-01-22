import { Router } from "express";
import transactionRouter from "./transaction.routes";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {});
indexRouter.use("/transactions", transactionRouter);

export default indexRouter;
