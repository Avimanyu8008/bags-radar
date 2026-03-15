import {
  DEMO_LATENCY_HISTORY,
  DEMO_REPORT_COUNTS,
  DEMO_SERVICE_RESULTS,
  type LatencyPoint,
  type ReportCounts,
  type ReportType,
  type ServiceResult,
  type ServiceStatus
} from "@/data/services";

const reportFallbackStore: { type: ReportType; createdAt: string }[] = [];
let latestResults: ServiceResult[] = DEMO_SERVICE_RESULTS;
let latencyHistory: LatencyPoint[] = DEMO_LATENCY_HISTORY;
const lastKnownServiceStates = new Map<string, ServiceStatus>();

export function saveServiceSnapshot(results: ServiceResult[]) {
  latestResults = results;

  const services = Object.fromEntries(
    results.map((service) => [service.id, service.latency ?? 0])
  );

  latencyHistory = [
    ...latencyHistory,
    {
      checkedAt: new Date().toISOString(),
      services
    }
  ].slice(-10);
}

export function getLatestResults() {
  return latestResults;
}

export function getLatencyHistory() {
  return latencyHistory;
}

export function getPreviousServiceStatus(serviceId: string) {
  return lastKnownServiceStates.get(serviceId);
}

export function setPreviousServiceStatus(serviceId: string, status: ServiceStatus) {
  lastKnownServiceStates.set(serviceId, status);
}

export function addFallbackReport(type: ReportType) {
  reportFallbackStore.push({
    type,
    createdAt: new Date().toISOString()
  });
}

export function getFallbackCounts() {
  const thirtyMinutesAgo = Date.now() - 30 * 60_000;
  const counts: ReportCounts = { ...DEMO_REPORT_COUNTS };

  for (const report of reportFallbackStore) {
    if (new Date(report.createdAt).getTime() >= thirtyMinutesAgo) {
      counts[report.type] += 1;
    }
  }

  return counts;
}