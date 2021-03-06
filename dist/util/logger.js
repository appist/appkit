import pino, { stdTimeFunctions } from "pino";
import { config } from "./global";
export function getLogger() {
    let logger;
    const redact = {
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
    }
    else {
        logger = pino({
            ...opts,
        }, pino.destination({ sync: false }));
    }
    return logger;
}
export default getLogger();
