import express from "express";
import upload from "../middleware/uploadImage.js";
import { visualSearch } from "../controllers/visualSearchController.js";

const router = express.Router();

router.post("/", upload.single("image"), visualSearch);

export default router;
