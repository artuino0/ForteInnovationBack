import { Router } from "express";
import {
  createClient,
  getClients,
  getClientById,
} from "../controllers/client.ctrl";

const router = Router();

router.post("/create", createClient);
router.get("/list", getClients);
router.get("/retrieve/:id", getClientById);

export default router;
