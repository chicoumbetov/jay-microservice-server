const { createLogger, transports } = require("winston");
const { AppError } = require("./app-errors");

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app_error.log" }),
  ],
});

class ErrorLogger {
  constructor() {}
  async logError(err: any) {
    console.log("==================== Start Error Logger ===============");
    LogErrors.log({
      private: true,
      level: "error",
      message: `${new Date()}
      -${JSON.stringify(err)}
      - ${err.name}
      - ${err.message}
      - Stack: ${err.stack || "No stack trace"}`,
    });
    console.log("==================== End Error Logger ===============");
    // log error with Logger plugins

    return false;
  }

  isTrustError(error: any) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

const ErrorHandler = async (
  err: any,
  req: Express.Request,
  res: any,
  next: any
) => {
  const errorLogger = new ErrorLogger();

  process.on("uncaughtException", (reason: any, promise: any) => {
    console.log(reason, "UNHANDLED");
    throw reason; // need to take care
  });

  process.on("uncaughtException", (error) => {
    errorLogger.logError(error);
    if (errorLogger.isTrustError(err)) {
      //process exist // need restart
    }
  });

  process.on("unhandledRejection", (reason: any, promise: any) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    errorLogger.logError(reason);
  });

  // console.log(err.description, '-------> DESCRIPTION')
  // console.log(err.message, '-------> MESSAGE')
  // console.log(err.name, '-------> NAME')
  if (err) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(err.statusCode).json({ message: errorDescription });
      }
      const statusCode = Number.isInteger(err.statusCode)
        ? err.statusCode
        : 500;
      return res.status(statusCode).json({ message: err.message }); // err.statusCode
    } else {
      //process exit // terriablly wrong with flow need restart
    }
    const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
    return res.status(statusCode).json({ message: err.message }); // err.statusCode
  }
  next();
};

module.exports = ErrorHandler;
