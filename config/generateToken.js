import jwt from "jsonwebtoken";

export const generateToken = (data) => {
  const { id, email } = data;
  const accessTokenPayload = {
    id: id,
    email: email,
    type: "access", // type access token
  };

  const refreshTokenPayload = {
    id: id,
    email: email,
    type: "refresh",
  };

  const accessToken = jwt.sign(
    accessTokenPayload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );
  const refreshToken = jwt.sign(
    refreshTokenPayload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "20m",
    }
  );

  return { accessToken, refreshToken };
};
