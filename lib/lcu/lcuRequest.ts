import "server-only";

import { request as httpsRequest } from "node:https";
import { LcuRequestError } from "./lcuError";

import type {
  LcuConnectionInfo,
} from "./types";

const REQUEST_TIMEOUT_MS = 4_000;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

export async function lcuRequest<T>(
  connection: LcuConnectionInfo,
  path: string,
): Promise<T> {
  if (!path.startsWith("/")) {
    throw new LcuRequestError("CONNECTION_FAILED");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await new Promise<T>((resolve, reject) => {
      const request = httpsRequest(
        {
          protocol: `${connection.protocol}:`,
          hostname: connection.address,
          port: connection.port,
          path,
          method: "GET",
          auth: `${connection.username}:${connection.password}`,
          rejectUnauthorized: false,
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        },
        (response) => {
          const chunks: Buffer[] = [];
          let receivedBytes = 0;

          response.on("data", (chunk: Buffer) => {
            receivedBytes += chunk.length;

            if (receivedBytes > MAX_RESPONSE_BYTES) {
              request.destroy(new LcuRequestError("INVALID_RESPONSE"));
              return;
            }

            chunks.push(chunk);
          });

          response.on("end", () => {
            const status = response.statusCode ?? 500;

            if (status === 401 || status === 403) {
              reject(new LcuRequestError("AUTHENTICATION_FAILED", status));
              return;
            }

            if (status === 404) {
              reject(new LcuRequestError("NOT_FOUND", status));
              return;
            }

            if (status < 200 || status >= 300) {
              reject(new LcuRequestError("HTTP_ERROR", status));
              return;
            }

            const body = Buffer.concat(chunks).toString("utf8");

            if (body.length === 0) {
              resolve(undefined as T);
              return;
            }

            try {
              resolve(JSON.parse(body) as T);
            } catch {
              reject(new LcuRequestError("INVALID_RESPONSE", status));
            }
          });
        },
      );

      request.on("error", (error) => {
        reject(
          error instanceof LcuRequestError
            ? error
            : new LcuRequestError("CONNECTION_FAILED"),
        );
      });

      request.end();
    });
  } finally {
    clearTimeout(timeout);
  }
}
