# Analytics Tagging Plan

This document is the source of truth for Medscape AI prototype analytics naming, payload design, and QA coverage.

## Scope

The workspace currently tracks:

- Workspace discovery flows on `/`
- Gallery discovery on `/gallery`
- Landing and chat flows for:
  - `/ai-response`
  - `/medscape-ai-current`
  - `/ad-above-the-question`
  - `/ad-after-keypoints`
  - `/ad-after-keypoints-collapsed`
  - `/paid-ads-exp`
- Quality telemetry:
  - `$pageview`
  - `web_vital_reported`
  - `client_error_captured`

## Naming Rules

- Use `snake_case` event names and property names.
- Use verb-first names for user actions: `question_submitted`, `answer_copied`.
- Use noun-plus-state names for visibility or lifecycle markers: `prototype_viewed`, `scroll_to_latest_shown`.
- Keep prototype metadata on all prototype-specific events:
  - `prototype_family`
  - `prototype_route`
  - `prototype_slug`
  - `screen_type`

## Shared Properties

All custom events inherit browser context from [`src/lib/analytics/events.ts`](/Users/faroukbousaaid/Vibes/Medscape proto/src/lib/analytics/events.ts:1):

- `app_environment`
- `app_version`
- `device_type`
- `is_authenticated`
- `pathname`
- `raw_prompt_capture`
- `referrer`
- `route`
- `utm_campaign`
- `utm_medium`
- `utm_source`
- `viewport_height`
- `viewport_width`

Prototype flows additionally use these common fields when relevant:

- `prototype_family`
- `prototype_route`
- `prototype_slug`
- `screen_type`
- `conversation_id`
- `turn_id`
- `session_id`

## Privacy Rules

- Do not send `email`, `name`, `study_id`, `tester_id`, `tester_role`, or `user_id`.
- Do not call `identify`, aliasing, or group APIs without a separate privacy review.
- `question_text`, `prompt_text`, and `follow_up_text` are allowed only when raw prompt capture is enabled.
- Do not set `distinct_id` manually in app code. PostHog manages it.

## Event Catalog

### Workspace And Discovery

- `$pageview`
  - Trigger: route change or initial page load
  - Key properties: `$current_url`, `$host`, `$pathname`, `title`

- `workspace_home_viewed`
  - Trigger: workspace home mounts on `/`
  - Key properties: `active_prototype_count`, `prototype_count`, `screen_type=workspace_home`

- `gallery_opened`
  - Trigger: user clicks `Open gallery` on `/`
  - Key properties: `destination_route`, `screen_type=workspace_home`

- `prototype_card_clicked`
  - Trigger: user clicks a prototype card on `/`
  - Key properties: `card_position`, `destination_route`, `prototype_family`, `prototype_route`, `prototype_slug`, `screen_type=workspace_home`

- `gallery_viewed`
  - Trigger: gallery page mounts on `/gallery`
  - Key properties: `category_count`, `component_count`, `screen_type=gallery`

### Landing And Navigation

- `prototype_viewed`
  - Trigger: prototype landing or chat screen mounts
  - Key properties: `initial_mode`, `prototype_family`, `prototype_route`, `prototype_slug`, `screen_type`
  - Expected values:
    - Landing: `initial_mode=landing`, `screen_type=prototype_landing`
    - Chat: `initial_mode=stream` or `complete`, `screen_type=prototype_chat`

- `prompt_suggestion_clicked`
  - Trigger: user selects a prompt card on a landing page
  - Key properties: `prompt_index`, `prompt_section`, `prompt_text`, prototype metadata

- `composer_focused`
  - Trigger: composer receives focus for the first time on a page
  - Key properties: `source_surface`

- `composer_changed`
  - Trigger: composer text enters a new length bucket for the first time on a page
  - Key properties: `char_bucket`, `has_text`, `source_surface`
  - Buckets: `1-10`, `11-50`, `51-100`, `101-250`, `251+`

- `voice_input_clicked`
  - Trigger: user clicks the empty composer action
  - Key properties: `source_surface`

- `sidebar_opened`
  - Trigger: user opens the AI Response sidebar
  - Key properties: prototype metadata, optional `conversation_id` on chat

- `sidebar_closed`
  - Trigger: user closes the AI Response sidebar
  - Key properties: prototype metadata, optional `conversation_id` on chat

- `home_clicked`
  - Trigger: user navigates from a prototype to `/`
  - Key properties: prototype metadata, optional `conversation_id`

- `new_chat_clicked`
  - Trigger: user resets to a landing state or taps the new chat action
  - Key properties: prototype metadata, optional `conversation_id`

- `history_conversation_clicked`
  - Trigger: user opens a prefilled history conversation
  - Key properties: `question_text`, prototype metadata, optional `conversation_id`

### Conversation Lifecycle

- `question_submitted`
  - Trigger: question submitted from composer, prompt suggestion, history, direct URL, or follow-up
  - Key properties: `conversation_id`, `entry_surface`, `question_length`, `question_source`, `question_text`, `session_id`, `turn_id`, prototype metadata

- `generation_started`
  - Trigger: mock streaming generation begins
  - Key properties: `conversation_id`, `generation_mode=stream`, `mock_generation=true`, `question_text`, `session_id`, `turn_id`, prototype metadata

- `generation_preparing_viewed`
  - Trigger: preparing state renders before first content
  - Key properties: `conversation_id`, `progress_text`, `turn_id`, prototype metadata
  - Notes:
    - AI Response also sets `ad_placement=after-progress`
    - Medscape current variants reuse prototype-level ad metadata

- `generation_first_content`
  - Trigger: first streamed answer content appears
  - Key properties: `conversation_id`, `leading_key_points_count`, `time_to_first_content_ms`, `turn_id`, prototype metadata

- `generation_completed`
  - Trigger: answer finishes streaming
  - Key properties: `answer_length`, `conversation_id`, `follow_up_count`, `reference_count`, `time_to_complete_ms`, `turn_id`, prototype metadata

- `generation_stopped`
  - Trigger: user clicks stop during generation
  - Key properties: `answer_length_at_stop`, `conversation_id`, `elapsed_ms`, `had_key_points`, `turn_id`, prototype metadata

- `scroll_to_latest_shown`
  - Trigger: scroll-to-latest affordance becomes visible
  - Key properties: `conversation_id`, prototype metadata

- `scroll_to_latest_clicked`
  - Trigger: user taps scroll-to-latest
  - Key properties: `conversation_id`, prototype metadata

### Response Interaction

- `key_points_toggled`
  - Trigger: key points card expands or collapses
  - Key properties: `conversation_id`, `expanded`, `key_points_count`, `trigger`, `turn_id`, `variant`, prototype metadata
  - Trigger values: `header`, `read_more`

- `answer_copied`
  - Trigger: user copies an answer
  - Key properties: `answer_length`, `conversation_id`, `copy_method`, `question_text`, `turn_id`, prototype metadata

- `answer_feedback_submitted`
  - Trigger: user marks answer helpful or not helpful
  - Key properties: `answer_length`, `conversation_id`, `feedback`, `question_text`, `turn_id`, prototype metadata
  - Feedback values: `helpful`, `not_helpful`

- `follow_up_question_clicked`
  - Trigger: user selects a suggested follow-up question
  - Key properties: `conversation_id`, `follow_up_index`, `follow_up_text`, `parent_turn_id`, prototype metadata

- `ad_slot_viewed`
  - Trigger: ad is at least 50% visible for 1 second
  - Key properties: `ad_placement`, `ad_slot`, `conversation_id`, `screen_type`, `time_visible_ms`, `turn_id`, `visible_ratio`, prototype metadata
  - Expected slots:
    - `preparing`
    - `above_question`
    - `after_keypoints`
    - `answer_footer`

### Quality And Diagnostics

- `web_vital_reported`
  - Trigger: Next.js web vital callback fires
  - Key properties: `metric_delta`, `metric_id`, `metric_name`, `metric_rating`, `metric_value`

- `client_error_captured`
  - Trigger: app or global error boundary runs
  - Key properties: `error_digest`, `error_surface`, `screen_type`
  - Surfaces:
    - `app_error_boundary`
    - `global_error_boundary`

## QA Checklist

### Setup

- Start the app with `pnpm dev`.
- Open the correct PostHog project and region for the key in `.env.local`.
- In browser DevTools:
  - Network filter: `posthog`, `/e/`, or `/i/v0/e/`
  - Optional console check: `window.posthog`
- In PostHog Live Events, remove restrictive filters before testing.

### How To Inspect Events In PostHog

- Use PostHog raw events for QA, not only the event catalog.
- Open `Product Analytics` and go to `Activity` or `Live Events` depending on your PostHog navigation.
  - This is the fastest place to confirm that the event was actually ingested from your test run.
- Search or filter by the event name from this plan, then trigger the UI action in the app.
- Open the newest matching row to inspect the full payload.
  - Validate event name, timestamp, `distinct_id`, and all expected properties for that single capture.
- If you need to verify the full journey for one tester, open the person or `distinct_id` from that event row and review the activity feed for the sequence of events in the session.
- Use `Data management` -> `Event definitions` when you need the event's catalog page.
  - Search the event name there to confirm the event exists in the project, see when it was last seen, and review which properties PostHog has observed for it.
  - Do not use the definition page as proof that your latest QA action fired; use `Activity` or `Live Events` for that.

### Workspace Home

- Open `/`.
  - Expect: `$pageview`, `workspace_home_viewed`
- Click `Open gallery`.
  - Expect: `gallery_opened`
- Return to `/`.
- Click each prototype card once.
  - Expect: `prototype_card_clicked`
  - Validate: `card_position`, `destination_route`, `prototype_slug`

### Gallery

- Open `/gallery`.
  - Expect: `$pageview`, `gallery_viewed`
  - Validate: `category_count`, `component_count`

### Landing Flows

- Open `/ai-response`.
  - Expect: `prototype_viewed` with `initial_mode=landing`
- Focus the composer once.
  - Expect: `composer_focused` with `source_surface=ai_response_landing`
- Type text that crosses at least three buckets:
  - 5 chars, 20 chars, 60 chars
  - Expect: `composer_changed` once per bucket
- Clear the composer so the voice action is visible, then tap it.
  - Expect: `voice_input_clicked`
- Click one prompt suggestion.
  - Expect: `prompt_suggestion_clicked`
- Open and close the sidebar on AI Response landing.
  - Expect: `sidebar_opened`, `sidebar_closed`
- Trigger landing navigation actions:
  - Home button: `home_clicked`
  - Sidebar history item: `history_conversation_clicked`
  - Sidebar new chat action: `new_chat_clicked`

- Repeat the same checks on:
  - `/medscape-ai-current`
  - Validate `prototype_family=medscape-ai-current`
  - Validate `source_surface=medscape_current_landing`

### Chat Generation Lifecycle

- Open `/ai-response/chat?q=test+question`.
  - Expect on load: `$pageview`, `prototype_viewed`
  - Expect after submit path starts: `question_submitted`, `generation_started`, `generation_preparing_viewed`
- Wait for first streamed content.
  - Expect: `generation_first_content`
- Wait for the answer to finish.
  - Expect: `generation_completed`
- Validate:
  - Same `conversation_id` across the turn lifecycle
  - Same `turn_id` across the turn lifecycle
  - `question_source` matches the entry path

- Submit a second question from the composer.
  - Expect another full lifecycle with a new `turn_id`

- Start a generation and click Stop before completion.
  - Expect: `generation_stopped`
  - Validate: `answer_length_at_stop > 0` when stopped after streaming begins

### Scroll Behavior

- On a long completed answer, scroll upward until the scroll-to-latest button appears.
  - Expect: `scroll_to_latest_shown`
- Click the scroll-to-latest button.
  - Expect: `scroll_to_latest_clicked`

### Answer Interaction

- After a completed answer:
  - Expand or collapse key points
    - Expect: `key_points_toggled`
  - Click `Helpful`
    - Expect: `answer_feedback_submitted` with `feedback=helpful`
  - Click `Not Helpful`
    - Expect: `answer_feedback_submitted` with `feedback=not_helpful`
  - Click `Copy`
    - Expect: `answer_copied`
  - Click a follow-up question
    - Expect: `follow_up_question_clicked`
    - Then expect a new generation lifecycle for the follow-up turn

### Ad Validation

- Test these routes and keep each ad at least 50% visible for more than 1 second:
  - `/ai-response/chat?q=test`
  - `/medscape-ai-current/chat?q=test`
  - `/ad-above-the-question/chat?q=test`
  - `/ad-after-keypoints/chat?q=test`
  - `/ad-after-keypoints-collapsed/chat?q=test`
  - `/paid-ads-exp/chat?q=test`
  - `/paid-ads-exp-2/chat?q=test`
- Expect `ad_slot_viewed` for the relevant slot:
  - `preparing`
  - `above_question`
  - `after_keypoints`
  - `answer_footer`
- Validate `ad_placement`, `ad_slot`, `visible_ratio`, and `time_visible_ms`

### Variant-Specific Checks

- `/ad-after-keypoints-collapsed/chat?q=test`
  - Validate `key_points_default_expanded=false`
  - Validate `key_points_variant=default`
- `/paid-ads-exp/chat?q=test`
- `/paid-ads-exp-2/chat?q=test`
  - Click `Read More`
  - Expect: `key_points_toggled` with `trigger=read_more`
  - Validate `key_points_variant=collapsed-read-more`

### Diagnostics

- Reload any page and confirm `web_vital_reported` appears eventually.
- In dev only, trigger a rendering error in either boundary and confirm:
  - `client_error_captured`
  - `error_surface`
  - `screen_type`

### Privacy Validation

- Confirm custom payloads do not contain:
  - `email`
  - `name`
  - `study_id`
  - `tester_id`
  - `tester_role`
  - `user_id`
- With raw prompt capture enabled:
  - confirm `question_text`, `prompt_text`, and `follow_up_text` are present where expected
- With raw prompt capture disabled:
  - confirm those fields are removed from event properties

### Sign-Off Criteria

- Every event in the catalog has been observed at least once in Live Events.
- Every lifecycle event preserves the expected prototype, conversation, and turn context.
- Every route variant emits the correct ad and key points metadata.
- No event returns an ingestion error in DevTools.
