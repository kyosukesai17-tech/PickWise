import "server-only";

import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

import type {
  LcuConnectionInfo,
  LcuDetectionResult,
} from "./types";

const execFileAsync = promisify(execFile);
const LOCKFILE_NAME = "lockfile";

async function findLeagueClientExecutable(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "$process = Get-CimInstance Win32_Process -Filter \"Name='LeagueClientUx.exe'\" | Select-Object -First 1; if ($process) { $process.ExecutablePath }",
      ],
      {
        windowsHide: true,
        timeout: 2_500,
        maxBuffer: 4_096,
      },
    );
    const executablePath = stdout.trim();

    return executablePath.length > 0 ? executablePath : null;
  } catch {
    return null;
  }
}

function getLockfileCandidates(processExecutable: string | null): string[] {
  const candidates = new Set<string>();

  if (processExecutable) {
    candidates.add(join(dirname(processExecutable), LOCKFILE_NAME));
  }

  const systemDrive = process.env.SystemDrive ?? "C:";
  candidates.add(join(systemDrive, "Riot Games", "League of Legends", LOCKFILE_NAME));

  for (const root of [
    process.env.ProgramFiles,
    process.env["ProgramFiles(x86)"],
    process.env.RIOT_GAMES_DIR,
  ]) {
    if (root) {
      candidates.add(join(root, "Riot Games", "League of Legends", LOCKFILE_NAME));
      candidates.add(join(root, "League of Legends", LOCKFILE_NAME));
    }
  }

  return [...candidates];
}

function parseLockfile(contents: string): LcuConnectionInfo | null {
  const [processName, processId, portValue, password, protocol] = contents
    .trim()
    .split(":");
  const port = Number(portValue);

  if (
    !processName ||
    !processId ||
    !password ||
    protocol !== "https" ||
    !Number.isInteger(port) ||
    port <= 0 ||
    port > 65_535
  ) {
    return null;
  }

  return {
    protocol: "https",
    address: "127.0.0.1",
    port,
    username: "riot",
    password,
  };
}

export async function findLeagueClient(): Promise<LcuDetectionResult> {
  if (process.platform !== "win32") {
    return {
      connection: null,
      clientRunning: false,
      reason: "UNSUPPORTED_PLATFORM",
    };
  }

  const processExecutable = await findLeagueClientExecutable();
  const lockfileCandidates = getLockfileCandidates(processExecutable);

  for (const lockfilePath of lockfileCandidates) {
    try {
      const contents = await readFile(lockfilePath, "utf8");
      const connection = parseLockfile(contents);

      if (connection) {
        return {
          connection,
          clientRunning: true,
        };
      }
    } catch {
      // Candidate paths are expected to be absent on many installations.
    }
  }

  return {
    connection: null,
    clientRunning: processExecutable !== null,
    reason: processExecutable
      ? "LOCKFILE_NOT_FOUND"
      : "LEAGUE_CLIENT_NOT_FOUND",
  };
}
