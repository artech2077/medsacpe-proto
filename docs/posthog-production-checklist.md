# PostHog Production Checklist

This project captures anonymous production analytics only. Do not add `identify`, user IDs, names, emails, tester IDs, study IDs, or group calls without a separate privacy review.

## Required Environment

```bash
NEXT_PUBLIC_POSTHOG_ENABLED=true
NEXT_PUBLIC_POSTHOG_KEY=<project-key>
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_POSTHOG_CAPTURE_RAW_PROMPTS=true
NEXT_PUBLIC_POSTHOG_REPLAY_ENABLED=true
```

Use the host that matches the PostHog project region. Keep `NEXT_PUBLIC_POSTHOG_ENABLED=false` for local development unless you are intentionally testing analytics.

## Launch Gate

Raw prompt capture is intentionally supported, but public medical prompts may include PHI. Before enabling production capture:

- Confirm legal/privacy approval for raw prompt events and replay text.
- Confirm the privacy notice explains prompt and replay capture.
- Restrict PostHog project access to approved roles.
- Set a retention policy for raw prompts and replays.
- Create the `analytics_raw_prompt_capture_enabled` feature flag and keep it enabled only after approval.
- Document the owner who can disable raw prompt capture immediately.

## PostHog MCP Setup

After restarting Codex with the PostHog MCP available, create or verify:

- Event/property definitions for the custom events in `src/lib/analytics/events.ts`.
- Dashboard: activation funnel from `prototype_viewed` to `question_submitted` to `generation_completed` to `answer_feedback_submitted`.
- Dashboard: prototype comparison broken down by `prototype_slug`, `ad_placement`, `key_points_variant`, `question_source`, and `device_type`.
- Replay playlists for `not_helpful`, `generation_stopped`, high `time_to_first_content_ms`, and high ad exposure sessions.
- Feature flags: `analytics_raw_prompt_capture_enabled`, `medscape_ai_ad_placement`, and `medscape_ai_key_points_variant`.
- Surveys after `generation_completed` and after `answer_feedback_submitted` where `feedback=not_helpful`.

## Verification

- Run `pnpm test`, `pnpm lint`, and `pnpm build`.
- Use PostHog debug/live events to verify home, gallery, prototype open, prompt suggestion, composer submit, generation first content, generation complete, stop, copy, feedback, follow-up, key-points toggle, scroll-to-latest, ad view, error, and web-vital events.
- Confirm no custom event includes `user_id`, `email`, `name`, `tester_id`, `tester_role`, `study_id`, or `distinct_id`.
- Disable `analytics_raw_prompt_capture_enabled` and confirm `question_text`, `prompt_text`, and `follow_up_text` stop appearing in custom event properties.
