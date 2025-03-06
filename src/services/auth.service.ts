import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

const JWT_ACCESS_SECRET = String(process.env.JWT_ACCESS_SECRET);
const JWT_REFRESH_SECRET = String(process.env.JWT_REFRESH_SECRET);

export const registerUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (existingUser) {
    throw new Error("Email already registered!");
  }

  const saltRound = Number(process.env.SALTROUND) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, refresh_token: "" },
  });

  return generateTokens(user.id);
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  return generateTokens(user.id);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
};

export const saveRefreshToken = async (userId: string, refreshToken: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refresh_token: refreshToken },
  });
};

export const validateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  return user;
};

export const findUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch (err) {
    throw err;
  }
};

export const generateTokens = (userId: string) => {
  return {
    accessToken: jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: "1h" }),
    refreshToken: jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: "1d" }),
  };
};
