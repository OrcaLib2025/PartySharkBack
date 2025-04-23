export default class ApiError extends Error {
    constructor(
      public status: number,
      public message: string,
      public errors: unknown[] = [],
      public originalError?: Error
    ) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
    }
  
    // Для правильной сериализации в koa-json-error
    toJSON() {
      return {
        status: this.status,
        message: this.message,
        errors: this.errors,
        ...(this.originalError && { originalError: this.originalError.message })
      };
    }
  }