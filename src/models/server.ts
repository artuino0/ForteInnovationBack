import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import databaseConn from "@/config/mongodb";
import indexRouter from "@/routes";
import { env } from "@/config/envLoad";

class Server {
  app: Application;
  basePath: string = "/api/v1";
  PORT: string = env.PORT || "4000";

  constructor() {
    this.app = express();
    this.db();
    this.middlewares();
    this.routes();
  }

  async db() {
    await databaseConn();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use(this.basePath, indexRouter);
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`Server running on port: ${this.PORT}`);
    });
  }
}

export default Server;
