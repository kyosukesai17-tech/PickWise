"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  LcuChampSelectResponse,
  LcuChampSelectSession,
} from "../types/lcu";

const LCU_SYNC_INTERVAL_MS = 1_000;

type UseLcuSyncOptions = Readonly<{
  onSessionLoaded: (session: LcuChampSelectSession) => void;
}>;

type ActiveRequest = Readonly<{
  controller: AbortController;
  manual: boolean;
}>;

export function useLcuSync({
  onSessionLoaded,
}: UseLcuSyncOptions) {
  const [autoSync, setAutoSync] = useState(true);
  const [result, setResult] = useState<LcuChampSelectResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const activeRequestRef = useRef<ActiveRequest | null>(null);

  const fetchSession = useCallback(async (manual: boolean) => {
    if (activeRequestRef.current) {
      return;
    }

    const controller = new AbortController();

    activeRequestRef.current = {
      controller,
      manual,
    };

    if (manual) {
      setIsChecking(true);
    }

    try {
      const response = await fetch("/api/lcu/champ-select", {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("LCU status request failed");
      }

      const nextResult = await response.json() as LcuChampSelectResponse;

      setResult(nextResult);
      setRequestFailed(false);
      setLastUpdatedAt(new Date());

      if (nextResult.connected && nextResult.inChampSelect && nextResult.session) {
        onSessionLoaded(nextResult.session);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setRequestFailed(true);
      }
    } finally {
      if (activeRequestRef.current?.controller === controller) {
        activeRequestRef.current = null;
      }

      if (manual) {
        setIsChecking(false);
      }
    }
  }, [onSessionLoaded]);

  useEffect(() => {
    if (!autoSync) {
      return;
    }

    const initialSyncId = window.setTimeout(() => {
      void fetchSession(false);
    }, 0);

    const intervalId = window.setInterval(() => {
      void fetchSession(false);
    }, LCU_SYNC_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialSyncId);
      window.clearInterval(intervalId);

      if (activeRequestRef.current && !activeRequestRef.current.manual) {
        activeRequestRef.current.controller.abort();
      }
    };
  }, [autoSync, fetchSession]);

  const checkConnection = useCallback(() => {
    void fetchSession(true);
  }, [fetchSession]);

  return {
    autoSync,
    setAutoSync,
    result,
    isChecking,
    requestFailed,
    lastUpdatedAt,
    checkConnection,
  };
}
