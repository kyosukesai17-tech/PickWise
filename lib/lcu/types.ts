export type LcuConnectionInfo = Readonly<{
  protocol: "https";
  address: "127.0.0.1";
  port: number;
  username: string;
  password: string;
}>;

export type LcuDetectionResult =
  | Readonly<{
      connection: LcuConnectionInfo;
      clientRunning: true;
    }>
  | Readonly<{
      connection: null;
      clientRunning: boolean;
      reason:
        | "LEAGUE_CLIENT_NOT_FOUND"
        | "LOCKFILE_NOT_FOUND"
        | "UNSUPPORTED_PLATFORM";
    }>;

export type LcuRequestErrorCode =
  | "AUTHENTICATION_FAILED"
  | "NOT_FOUND"
  | "HTTP_ERROR"
  | "CONNECTION_FAILED"
  | "INVALID_RESPONSE";
