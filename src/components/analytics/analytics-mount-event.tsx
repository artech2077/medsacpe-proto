"use client";

import { useEffect } from "react";
import type { AnalyticsProperties } from "@/lib/analytics/events";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

type AnalyticsMountEventProps = {
  eventName: string;
  properties?: AnalyticsProperties;
};

export function AnalyticsMountEvent({
  eventName,
  properties,
}: AnalyticsMountEventProps) {
  useEffect(() => {
    captureAnalyticsEvent(eventName, properties);
  }, [eventName, properties]);

  return null;
}
