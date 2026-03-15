export type ServiceName = "Bags Website" | "Solana RPC" | "Bags API";
export type ServiceStatus = "UP" | "SLOW" | "DOWN";
export type ReportType = "wallet" | "trading" | "token";
export type IncidentStatus = "down" | "recovered";

export interface ServiceDefinition {
  id: string;
  name: ServiceName;
  url: string;
}

export interface ServiceResult {
  id: string;
  name: ServiceName;
  url: string;
  status: ServiceStatus;
  latency: number | null;
  checkedAt: string;
}

export interface LatencyPoint {
  checkedAt: string;
  services: Record<string, number>;
}

export interface ReportCounts {
  wallet: number;
  trading: number;
  token: number;
}

export interface IncidentRecord {
  id: string;
  service: string;
  status: IncidentStatus;
  latency: string;
  created_at: string;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: "website",
    name: "Bags Website",
    url: "https://bags.fm"
  },
  {
    id: "rpc",
    name: "Solana RPC",
    url: "https://api.mainnet-beta.solana.com"
  },
  {
    id: "api",
    name: "Bags API",
    url: "https://bags.fm/api"
  }
];

export const REPORT_LABELS: Record<ReportType, string> = {
  wallet: "Wallet issues",
  trading: "Trading issues",
  token: "Token page issues"
};

export const DEMO_REPORT_COUNTS: ReportCounts = {
  wallet: 12,
  trading: 7,
  token: 3
};

export const DEMO_SERVICE_RESULTS: ServiceResult[] = [
  {
    id: "website",
    name: "Bags Website",
    url: "https://bags.fm",
    status: "UP",
    latency: 128,
    checkedAt: new Date().toISOString()
  },
  {
    id: "rpc",
    name: "Solana RPC",
    url: "https://api.mainnet-beta.solana.com",
    status: "SLOW",
    latency: 286,
    checkedAt: new Date().toISOString()
  },
  {
    id: "api",
    name: "Bags API",
    url: "https://bags.fm/api",
    status: "UP",
    latency: 164,
    checkedAt: new Date().toISOString()
  }
];

export const DEMO_LATENCY_HISTORY: LatencyPoint[] = Array.from(
  { length: 10 },
  (_, index) => {
    const minutesAgo = (9 - index) * 3;
    const checkedAt = new Date(Date.now() - minutesAgo * 60_000).toISOString();

    return {
      checkedAt,
      services: {
        website: 110 + (index % 3) * 9,
        rpc: 210 + ((index + 1) % 4) * 18,
        api: 140 + (index % 5) * 11
      }
    };
  }
);