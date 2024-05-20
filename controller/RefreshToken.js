import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";

const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    const user = await Users.findAll({
      where: { refreshToken },
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.sendStatus(403);
      }
    );
    const data = {
      id: user.id,
      email: user.email,
    };
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

export { RefreshToken };
