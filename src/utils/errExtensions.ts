import { ZodFormattedError, ZodIssue } from "zod";

export class ValidationError extends Error {
  constructor(message: string, validationErr: Array<ZodIssue>) {
    const errMsg = validationErr.map((e) => [e.path, e.message].join(": ")).join("\n");
    super(message + ` ${errMsg}`);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
  }
}
