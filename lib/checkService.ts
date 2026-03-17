import { ServiceStatus } from "@/data/services";

export interface CheckServiceResult {
  status: ServiceStatus;
  latency: number | null;
}

const TIMEOUT_MS = 4_000;

function simulateServiceCheck(url: string): CheckServiceResult {
  const baseSeed = url.length + new Date().getUTCMinutes();
  const latency = 120 + (baseSeed % 4) * 35;

  if (baseSeed % 11 === 0) {
    return {
      status: "DOWN",
      latency: null
    };
  }

  if (baseSeed % 5 === 0) {
    return {
      status: "SLOW",
      latency: 260
    };
  }

  return {
    status: latency < 200 ? "UP" : "SLOW",
    latency
  };
}

/**
 * Measures service latency using fetch and Date.now, then maps the result to a dashboard status.
 */
export async function checkService(url: string): Promise<CheckServiceResult> {
  if (url.startsWith("simulate://")) {
    return simulateServiceCheck(url);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = Date.now();

  try {
    const isSolanaRpc = url.includes("api.mainnet-beta.solana.com");
    const response = await fetch(url, {
      method: isSolanaRpc ? "POST" : "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "user-agent": "BagsRadar/1.0"
      },
      body: isSolanaRpc
        ? JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getHealth"
          })
        : undefined
    });

    const latency = Date.now() - start;

    if (!response.ok) {
      return { status: "DOWN", latency: null };
    }

    if (latency < 200) {
      return { status: "UP", latency };
    }

    if (latency <= 500) {
      return { status: "SLOW", latency };
    }

    return { status: "DOWN", latency };
  } catch {
    return {
      status: "DOWN",
      latency: null
    };
  } finally {
    clearTimeout(timeout);
  }
}