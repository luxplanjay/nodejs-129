import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies;

  if (!accessToken || !sessionId) {
    throw createHttpError(401, "Bad session");
  }

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session) {
    throw createHttpError(401, "Bad session");
  }

  const isTokenExpired = new Date() > session.accessTokenValidUntil;

  if (isTokenExpired) {
    throw createHttpError(401, "Bad session");
  }

  const user = await User.findOne({ _id: session.userId });
  if (!user) {
    throw createHttpError(401, "Bad session");
  }

  req.user = user;

  next();
};
