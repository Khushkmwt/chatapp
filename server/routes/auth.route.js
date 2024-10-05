
import { Router } from "express";
import { login, signup ,getUserInfo,updateProfile, addProfileImage, removeProfileImage, logout} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/profiles/" });

const authRoutes = Router();
authRoutes.post('/signup', signup);
authRoutes.post('/login',login)
authRoutes.get('/userinfo',verifyToken, getUserInfo)
authRoutes.post('/update-profile' ,verifyToken ,updateProfile)
authRoutes.post("/add-profile-image" ,verifyToken, upload.single("profile-image"), addProfileImage)
authRoutes.delete("/remove-profile-image",verifyToken, removeProfileImage)
authRoutes.post("/logout" , logout)
export default authRoutes
