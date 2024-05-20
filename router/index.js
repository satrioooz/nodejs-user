import Express from "express";
import {
  getUsers,
  Register,
  deletUserById,
  updateUser,
  loginUser,
  getUserId,
} from "../controller/index.js";
import { VerifyToken } from "../middleware/verifyToken.js";
import { RefreshToken } from "../controller/RefreshToken.js";

const router = Express.Router();

router.post("/user/login", loginUser);
router.post("/user/register", Register);
router.get("/user/token", RefreshToken);
router.get("/users", VerifyToken, getUsers);
router.put("/user/:id", VerifyToken, updateUser);
router.delete("/user/:id", VerifyToken, deletUserById);
router.get("/user/:id", VerifyToken, getUserId);

export default router;
