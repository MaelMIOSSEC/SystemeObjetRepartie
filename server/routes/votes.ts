import { Router, context } from "@oak/oak";
import { errorMiddleware } from "../middlewares/middlewareError";
import { ApiErrorCode, APIException } from "../types/exceptionType";

Router.get("/votes/:pollId", errorMiddleware, (ctx: context) => {
  const pollId = ctx.params.pollId;

  if (!pollId) {
    throw new APIException(ApiErrorCode.NOT_FOUND, 404, "Poll not found");
  }

  if (!ctx.isUpgradable) {
    throw new APIException(ApiErrorCode.BAD_REQUEST, 400, "WebSocket required");
  }

  const ws = ctx.upgrade();

  ws.onopen = () => {
    console.log("WebSocket connection established !");
    ws.send("Hello Server !");
  };

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);

    if (msg.type === "vote_cast") {
        console.log("A vote has just been cast : ", msg);
    } else {
        console.log("Rceived : ", msg);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed !");
  };

  ws.onerror = (e) => {
    console.error("WebSocket error observed : ", e);
  };
});
