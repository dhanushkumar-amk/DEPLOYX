import { createLogger, format, transports } from "winston";
import path from "path";
import { icons } from "./icons";

const logPath = path.join(process.cwd(), "logs", "app.log");

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => {
      const icon = icons[info.level as keyof typeof icons] || "";
      return `${info.timestamp} ${icon} [${info.level.toUpperCase()}] ${info.message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logPath }),
  ],
});
