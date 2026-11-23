import crypto from "node:crypto";
import { Session } from "../models/session.js";

export const createSession = async (userId) => {
  return Session.create({
    userId,
    accessToken: crypto.randomUUID(),
    refreshToken: crypto.randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
};

export const setSessionCookies = (res, session) => {
  const baseOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.cookie("accessToken", session.accessToken, {
    ...baseOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", session.refreshToken, {
    ...baseOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("sessionId", session._id, {
    ...baseOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
};
