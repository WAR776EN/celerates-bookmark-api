import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async (userId: string, name: string) => {
  return prisma.category.create({
    data: { userId, name },
  });
};

export const getOne = async (userId: string, id: string) => {
  return prisma.category.findFirst({
    where: { id, userId },
    select: {
      id: true,
      name: true,
      bookmarks: {
        select: {
          id: true,
          title: true,
          tags: true,
        },
      },
    },
  });
};

export const getMany = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
  });
};

export const updateOne = async (userId: string, id: string, name: string) => {
  return prisma.category.update({
    where: { id, userId },
    data: { name },
  });
};

export const deleteOne = async (userId: string, id: string) => {
  return prisma.category.delete({
    where: { id, userId },
  });
};
