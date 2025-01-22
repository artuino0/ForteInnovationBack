import { Router } from "express";
import transactionRouter from "./transaction.routes";
import clientRouter from "./client.routes";
import { clientExistsHandler } from "@/middlewares/client.middlewares";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  const data = {
    api: "Transacciones API",
    version: "1.0.0",
    basePath: "/api/v1",
    author: "Arturo Muñoz",
    project: "ForteInnovation",
  };
  res.json(data);
});

indexRouter.use("/transactions", transactionRouter);
indexRouter.use("/clients", clientExistsHandler, clientRouter);

export default indexRouter;
