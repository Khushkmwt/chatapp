import { Router } from "express";
import { getAllContacts, searchContact ,searchContactForDmList} from "../controllers/contact.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const contactRoutes = Router()
contactRoutes.post("/search" ,verifyToken ,searchContact)
contactRoutes.get("/get-contacts-for-dm" ,verifyToken , searchContactForDmList)
contactRoutes.get("/get-all-contacts",verifyToken,getAllContacts)

export default contactRoutes