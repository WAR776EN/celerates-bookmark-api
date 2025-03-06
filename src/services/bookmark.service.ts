import { PrismaClient } from "@prisma/client";
import { ICreateBookmark, IUpdateBookmark } from "../interfaces/common/createBookmark.interface";
import { NotFoundError } from "../utils/errExtensions";

const prisma = new PrismaClient();

export const createBookmark = async (params: ICreateBookmark) => {
  const { userId, title, url, categoryId, tags } = params;

  return prisma.bookmark.create({
    data: { userId, title, url, categoryId, tags },
  });
};

export const getBookmarks = async (userId: string) => {
  return prisma.bookmark.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      url: true,
    },
  });
};

export const getBookmarkById = async (userId: string, id: string) => {
  return prisma.bookmark.findFirst({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      url: true,
      tags: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateBookmark = async (userId: string, id: string, data: IUpdateBookmark) => {
  // check if data exists
  const exists = await prisma.bookmark.findFirst({
    where: { id, userId },
  });
  if (!exists) {
    throw new NotFoundError("Bookmark not found");
  }

  return prisma.bookmark.update({
    where: { id, userId },
    data,
  });
};

export const updateMany = async (userId: string, ids: string[], data: IUpdateBookmark) => {
  return prisma.bookmark.updateMany({
    where: { id: { in: ids }, userId },
    data,
  });
};

export const deleteBookmark = async (userId: string, id: string) => {
  return prisma.bookmark.delete({
    where: { id, userId },
  });
};
