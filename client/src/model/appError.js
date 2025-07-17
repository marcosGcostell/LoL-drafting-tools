class AppError extends Error {
  constructor(message, { origin, type }) {
    super(message);
    this.origin = origin;
    this.type = type;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
