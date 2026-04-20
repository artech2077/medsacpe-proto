"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import {
  captureAnalyticsEvent,
  capturePageView,
} from "@/lib/analytics/posthog";

const reportWebVital: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  captureAnalyticsEvent("web_vital_reported", {
    metric_delta: metric.delta,
    metric_id: metric.id,
    metric_name: metric.name,
    metric_rating: metric.rating,
    metric_value: metric.value,
  });
};

function AnalyticsRouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    capturePageView();
  }, [pathname, searchParamsString]);

  useReportWebVitals(reportWebVital);

  return null;
}

export function AnalyticsRouteTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsRouteTrackerInner />
    </Suspense>
  );
}
