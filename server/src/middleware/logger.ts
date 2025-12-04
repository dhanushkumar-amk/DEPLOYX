import morgan from "morgan";
import { logger } from "../utils/logger";
import { icons } from "../utils/logger/icons";

export const requestLogger = morgan(function (tokens, req, res) {
  return [
    icons.request,
    tokens.method(req, res),
    tokens.url(req, res),
    "-",
    icons.response,
    tokens.status(req, res),
    tokens['response-time'](req, res), "ms"
  ].join(" ");
}, {
  stream: {
    write: msg => logger.info(msg.trim())
  }
});
