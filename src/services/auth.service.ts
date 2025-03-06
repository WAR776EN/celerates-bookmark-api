import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

const JWT_SECRET = String(process.env.JWT_SECRET);

export const registerUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (existingUser) {
    throw new Error("Email already registered!");
  }

  const saltRound = Number(process.env.SALTROUND)
  const hashedPassword = await bcrypt.hash(password, saltRound);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return generateToken(user.id);
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  return generateToken(user.id);
};

export const verifyUserToken = (token: string) => {
  return verifyToken(token)
}


const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};