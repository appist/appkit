import pino, { stdTimeFunctions, redactOptions } from "pino";
import { config } from "./global";

export type Logger = pino.Logger;

export function getLogger(): pino.Logger {
  let logger: pino.Logger;

  const redact: redactOptions = {
    censor: "[redacted]",
    paths: config.loggerRedactPaths,
    remove: false,
  };

  const opts = {
    redact,
    timestamp: stdTimeFunctions.isoTime,
  };

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    logger = pino({
      level: "debug",
      prettyPrint: true,
      ...opts,
    });
  } else {
    logger = pino(
      {
        ...opts,
      },
      pino.destination({ sync: false })
    );
  }

  return logger;
}

export default getLogger();
