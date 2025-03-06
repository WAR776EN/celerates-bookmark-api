export interface ICreateBookmark {
  userId: string,
  title: string,
  url: string,
  categoryId?: string,
  tags?: string[]
}

export interface IUpdateBookmark extends Partial<ICreateBookmark> {}