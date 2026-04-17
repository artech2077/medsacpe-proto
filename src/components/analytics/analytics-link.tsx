"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import type { AnalyticsProperties } from "@/lib/analytics/events";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

type AnalyticsLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventProperties?: AnalyticsProperties;
};

export function AnalyticsLink({
  eventName,
  eventProperties,
  onClick,
  ...props
}: AnalyticsLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    captureAnalyticsEvent(eventName, eventProperties);
    onClick?.(event);
  };

  return <Link {...props} onClick={handleClick} />;
}
