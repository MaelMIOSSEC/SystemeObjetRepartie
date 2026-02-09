import { randomInt} from "node:crypto";

import { Context, Next } from "@oak/oak";

import { ApiErrorCode, APIException, ApiFailure } from "../types.ts";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function errorMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof APIException) {
      const responseBody: ApiFailure = {
        success: false,
        error: {
          code: err.code,
          message: err.message,
        }
      };

      ctx.response.status = err.status;
      ctx.response.body = responseBody;

      console.log(responseBody);
    } else {
      console.error(err);

      const responseBody: ApiFailure = {
        success: false,
        error: {
          code: ApiErrorCode.SERVER_ERROR,
          message: "Unexpected server error",
        }
      };

      ctx.response.status = 500;
      ctx.response.body = responseBody;
    }
  }
}

export async function entropyMiddleware(ctx: Context, next: Next) {
  const d10 = randomInt(0, 10);

  if (d10 === 9) {
    throw new APIException(ApiErrorCode.SERVER_ERROR, 500, "Entropy error :-)");
  }

  if (d10 >= 3 && d10 < 9) {
    const timeout = randomInt(0, 5);

    await delay(timeout * 1000);
  }

  await next();
}