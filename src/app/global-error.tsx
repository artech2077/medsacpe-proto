"use client";

import { useEffect } from "react";
import { captureClientError } from "@/lib/analytics/posthog";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    captureClientError(error, {
      error_digest: error.digest,
      error_surface: "global_error_boundary",
      screen_type: "global_error",
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7fafe] px-6 text-center text-[#161b1d]">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#647484]">
            Something went wrong
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            The prototype could not load.
          </h1>
          <button
            type="button"
            onClick={reset}
            className="rounded-[8px] bg-[#064aa7] px-5 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
