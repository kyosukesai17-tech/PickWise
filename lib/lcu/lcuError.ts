import type { LcuRequestErrorCode } from "./types";

export class LcuRequestError extends Error {
  constructor(
    readonly code: LcuRequestErrorCode,
    readonly status?: number,
  ) {
    super(code);
    this.name = "LcuRequestError";
  }
}
