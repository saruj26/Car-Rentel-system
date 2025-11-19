import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, changeRoleToOwner } from "../controllers/ownerContoller.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.get("/change-role" ,protect, changeRoleToOwner);
ownerRouter.post("/add-car", protect ,upload.single("image"), addCar);

export default ownerRouter;