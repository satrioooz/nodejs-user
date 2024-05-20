import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/generateToken.js";

// GET ALL USER
const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (err) {
    res.status(400).json({
      message: "Ups ," + err,
    });
  }
};

// REGISTER
const Register = async (req, res) => {
  const { name, password, email, confirmPassword } = req.body;

  if (!name) return res.json({ message: "Ups, name property cannot be empty" });
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ message: "Ups, password and confirm password is not same" });

  const salt = await bcrypt.genSalt();
  const hashPw = await bcrypt.hash(password, salt);
  try {
    await Users.findOne({ where: { email: email } }).then((user) => {
      if (user) {
        res.status(400);
        res.json({
          message: "Ups The same user is available",
        });
      } else {
        Users.create({
          name,
          email,
          password: hashPw,
        });
        res.json({
          msg: "Create user successfully",
          data: { name, email, password: hashPw },
        });
      }
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
};

// FIND DETAIL USER
const getUserId = async (req, res) => {
  const { id } = req.params;
  try {
    await Users.findOne({ where: { id } }).then((user) => {
      if (user) {
        res.status(200);
        res.json({
          data: user,
        });
      } else {
        res.json({
          message: "User Not Found!",
        });
      }
    });
  } catch (error) {
    res.json({
      message: err,
    });
  }
};

// delete user
const deletUserById = async (req, res) => {
  const { id } = req.params;

  try {
    await Users.findOne({ where: { id } }).then((user) => {
      if (user) {
        res.json({
          message: "Delete user successfully",
          data: user,
        });
        user.destroy();
      } else {
        res.json({
          message: "User Not Found!",
        });
      }
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  try {
    await Users.findOne({ where: { id } }).then((user) => {
      if (user) {
        user.update({
          name: name,
          email: email,
        });
        res.json({
          message: "Update user successfully",
          data: user,
        });
      } else {
        res.json({
          message: "User not found",
        });
      }
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Users.findOne({
      where: { email },
    });
    const data = {
      id: user.id,
      email: user.email,
    };
    const { accessToken, refreshToken } = generateToken(data);

    if (!user) return res.status(400).json({ message: "Ups Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Ups Wrong password" });
    await Users.update(
      { refreshToken },
      {
        where: { id: user.id },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true  => if u use  https
    });
    res.json({
      message: "Login successfully",
      accessToken,
    });
  } catch (error) {
    res.status(400).json({
      message: "Ups, " + error,
    });
  }
};

export { getUsers, Register, getUserId, deletUserById, updateUser, loginUser };
