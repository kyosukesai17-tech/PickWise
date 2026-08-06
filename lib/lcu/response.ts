import "server-only";

import { LcuRequestError } from "./lcuError";

import type { LcuFailureReason } from "../../types/lcu";

export function getLcuFailureReason(error: unknown): LcuFailureReason {
  if (error instanceof LcuRequestError) {
    return error.code === "AUTHENTICATION_FAILED"
      ? "AUTHENTICATION_FAILED"
      : "CONNECTION_FAILED";
  }

  return "UNKNOWN_ERROR";
}

export function jsonNoStore(data: unknown): Response {
  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
