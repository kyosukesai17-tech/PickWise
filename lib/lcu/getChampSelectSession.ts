import "server-only";

import { requestChampSelectSession } from "./champSelectSessionCore";
import { lcuRequest } from "./lcuRequest";

import type { LcuConnectionInfo } from "./types";
import type { LcuChampSelectSession } from "../../types/lcu";

export async function getChampSelectSession(
  connection: LcuConnectionInfo,
): Promise<LcuChampSelectSession | null> {
  return requestChampSelectSession(connection, lcuRequest);
}
