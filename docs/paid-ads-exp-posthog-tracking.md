# Paid Ads Experiment PostHog Tracking

This document explains the PostHog tracking plan for the `paid-ads-exp` prototype. It is intended for stakeholders who need to understand what user behavior is measured, which events to use in PostHog, and how to answer common campaign and engagement questions.

## Prototype Context

The prototype route is:

- `/paid-ads-exp`
- `/paid-ads-exp/chat`

Users from a paid campaign land on the chat experience with a prefilled Medscape AI answer. The primary measurement goal is to understand whether users engage with the Medscape AI experience after landing:

- Did they land successfully?
- Did they stay long enough to evaluate the page?
- Did they scroll?
- Did they interact with the answer, ad, references, follow-up prompts, or feedback controls?
- Did they start typing?
- Did they send a question or open the Medscape AI search destination?
- Which buttons received clicks?

## Shared Properties On Events

Most events include the standard analytics context automatically:

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

Prototype-specific events also include:

- `prototype_family`: `paid-ads`
- `prototype_route`: `/paid-ads-exp`
- `prototype_slug`: `paid-ads-exp`
- `screen_type`: `prototype_chat`
- `conversation_id`
- `turn_id`, when the action belongs to a specific answer turn
- `ad_placement`: `above-question`
- `key_points_variant`: `collapsed-read-more`
- `answer_variant`

These fields are what stakeholders should use to filter PostHog data to this specific prototype.

Recommended base filter for most PostHog charts:

```text
prototype_slug = paid-ads-exp
```

For pageview-level reports, use:

```text
$pathname = /paid-ads-exp/chat
```

## Important Privacy Note

For this testing phase, raw prompt capture is allowed if the PostHog environment configuration enables it. That means `question_text` and `follow_up_text` can appear on some events.

If raw prompt capture is disabled in the environment or feature flag, the analytics sanitizer removes raw prompt fields and still keeps the engagement metadata such as length, source, and button actions.

## Event Catalog

### `$pageview`

**What it tracks:** A route view when the user lands on or navigates to the prototype.

**Implemented in:** `AnalyticsRouteTracker`, which calls `capturePageView()` on route changes.

**Key properties:**

- `$current_url`
- `$host`
- `$pathname`
- `title`
- standard UTM and browser context

**Use this to answer:**

- How many page views did the paid campaign produce?
- Which UTM campaigns/sources drove traffic?
- What devices and viewport sizes were used?

**PostHog check:**

Create an Insights trend for `$pageview`, filtered by `$pathname = /paid-ads-exp/chat`.

### `prototype_viewed`

**What it tracks:** The Medscape AI prototype screen mounted.

**Implemented in:** `MedscapeAiCurrentScreen` on screen mount.

**Key properties:**

- `prototype_slug`
- `prototype_route`
- `prototype_family`
- `screen_type`
- `initial_mode`

For this prototype, `initial_mode` is usually `complete` because the first answer is prefilled and rendered as a completed mock answer after the configured delay.

**Use this to answer:**

- How many users reached the actual prototype experience?
- Did users land in the expected initial mode?
- How does paid-ads-exp traffic compare with other prototypes?

**PostHog check:**

Create an Insights trend for `prototype_viewed`, filtered by `prototype_slug = paid-ads-exp`.

### `paid_ads_landing_viewed`

**What it tracks:** A paid-ads-specific landing event for this exact campaign experience.

**Implemented in:** `MedscapeAiCurrentScreen`, only when `prototypeRoute` is `/paid-ads-exp`.

**Key properties:**

- `campaign_entry`: `true`
- `has_prefilled_question`
- `initial_mode`
- `initial_question_source`
- prototype metadata

**Use this to answer:**

- How many campaign users landed on the paid-ads experiment?
- Did the experience load with the intended prefilled question?
- What was the initial source, such as `workspace_card`, `direct_url`, or campaign-provided source?

**PostHog check:**

Use this event as the first step of the main paid campaign funnel.

Suggested first funnel step:

```text
paid_ads_landing_viewed
```

### `engagement_timer_reached`

**What it tracks:** The user remained on the page long enough to hit a dwell-time milestone.

**Implemented in:** `MedscapeAiCurrentScreen`, only for `/paid-ads-exp`.

**Milestones:**

- 5 seconds
- 15 seconds
- 30 seconds
- 60 seconds
- 120 seconds

**Key properties:**

- `milestone_seconds`
- prototype metadata

**Use this to answer:**

- Are paid campaign visitors bouncing immediately?
- What percentage of users stay at least 15, 30, or 60 seconds?
- Which UTM source produces more engaged visits?

**PostHog check:**

Create a funnel:

```text
paid_ads_landing_viewed
engagement_timer_reached where milestone_seconds = 15
engagement_timer_reached where milestone_seconds = 30
```

Break down by:

- `utm_source`
- `utm_campaign`
- `device_type`

### `page_engagement_ended`

**What it tracks:** A session-level engagement summary when the user leaves, hides the tab, or the screen unmounts.

**Implemented in:** `MedscapeAiCurrentScreen`, only for `/paid-ads-exp`.

**Key properties:**

- `engaged_time_ms`
- `max_scroll_depth_percent`
- `composer_started`
- `question_submitted`
- `clicked_any_button`
- `ad_viewed`
- prototype metadata

**Use this to answer:**

- How long did users stay on the experience?
- Did users interact at all?
- Did users scroll?
- Did users see the ad?
- Did users type or submit?

**PostHog check:**

Create an Insights trend or table for `page_engagement_ended`, filtered by `prototype_slug = paid-ads-exp`.

Useful breakdowns:

- Average `engaged_time_ms`
- Distribution of `max_scroll_depth_percent`
- Breakdown by `composer_started`
- Breakdown by `clicked_any_button`
- Breakdown by `ad_viewed`

### `scroll_depth_reached`

**What it tracks:** The user scrolled the chat response container to a content-depth milestone.

**Implemented in:** `MedscapeAiCurrentScreen`, only for `/paid-ads-exp`.

The implementation only counts user-initiated scroll input. Programmed prototype movement, including the automatic ad reveal scroll, is excluded from the dashboard by requiring `scroll_source = user`.

**Milestones:**

- 25%
- 50%
- 75%
- 90%
- 100%

**Key properties:**

- `scroll_container`: `chat_response`
- `scroll_depth_basis`: `viewport_bottom_content_exposure`
- `scroll_depth_percent`
- `scroll_source`: `user`
- prototype metadata

**Use this to answer:**

- Are users scrolling below the initial answer area?
- How many users reach the references, follow-up questions, or answer actions?
- How does scroll engagement differ by device or campaign?

**PostHog check:**

Create an Insights trend for `scroll_depth_reached`, filtered by:

```text
prototype_slug = paid-ads-exp
scroll_source = user
```

Break down by:

- `scroll_depth_percent`
- `device_type`
- `utm_campaign`

### `composer_focused`

**What it tracks:** The user focused the input field for the first time on the page.

**Implemented in:** `AiResponseChatComposer`.

**Key properties:**

- `source_surface`: `medscape_current_chat`
- `conversation_id`
- prototype metadata

**Use this to answer:**

- How many users show intent to ask a question?
- How often do users click into the input but not type or send?

**PostHog check:**

Funnel:

```text
paid_ads_landing_viewed
composer_focused
composer_typing_started
composer_submit_clicked
```

### `composer_typing_started`

**What it tracks:** The first time a user enters non-empty text into the input.

**Implemented in:** `MedscapeAiCurrentScreen`, only for `/paid-ads-exp`.

**Key properties:**

- `source_surface`: `medscape_current_chat`
- prototype metadata

**Use this to answer:**

- How many users start composing a question?
- Where do users drop off between focusing, typing, and sending?

**PostHog check:**

Use this as the “started typing” step in a composer funnel.

Suggested funnel:

```text
paid_ads_landing_viewed
composer_focused
composer_typing_started
composer_submit_clicked
external_ai_search_opened
```

### `composer_changed`

**What it tracks:** The input moved into a new text-length bucket for the first time.

**Implemented in:** `AiResponseChatComposer`.

**Key properties:**

- `char_bucket`
- `has_text`
- `source_surface`
- `conversation_id`
- prototype metadata

Length buckets:

- `1-10`
- `11-50`
- `51-100`
- `101-250`
- `251+`

**Use this to answer:**

- How substantial are user-entered questions?
- Are users typing short exploratory queries or longer clinical prompts?
- Where do users drop off by question length?

**PostHog check:**

Create an Insights breakdown of `composer_changed` by `char_bucket`, filtered by `prototype_slug = paid-ads-exp`.

### `composer_submit_clicked`

**What it tracks:** The user submitted the composer by clicking send or pressing Enter.

**Implemented in:** `AiResponseChatComposer`.

**Key properties:**

- `submit_method`: `button` or `enter`
- `has_text`
- `question_length`
- `char_bucket`
- `source_surface`
- `redirects_to_ai_search`
- `conversation_id`
- prototype metadata

**Use this to answer:**

- How many users try to send a question?
- Do users submit by clicking the send button or pressing Enter?
- How long are submitted questions?
- How often does send lead to external Medscape AI search?

**PostHog check:**

Create an Insights trend for `composer_submit_clicked`.

Break down by:

- `submit_method`
- `char_bucket`
- `redirects_to_ai_search`

### `external_ai_search_opened`

**What it tracks:** The prototype opened the Medscape AI search destination.

**Implemented in:** `MedscapeAiCurrentScreen` when a submitted composer question or follow-up question triggers `queryRedirectUrl`.

**Key properties:**

- `destination_url`
- `question_source`
- `question_text`, when raw prompt capture is enabled
- `conversation_id`
- prototype metadata

**Use this to answer:**

- How many users moved from the prototype into the real Medscape AI search destination?
- Was the outbound action caused by composer input or a follow-up question?

**PostHog check:**

Use as the final step in the activation funnel:

```text
paid_ads_landing_viewed
composer_typing_started
composer_submit_clicked
external_ai_search_opened
```

Break down by:

- `question_source`
- `utm_campaign`
- `device_type`

### `question_submitted`

**What it tracks:** A question was submitted into the mock conversation flow.

**Implemented in:** `MedscapeAiCurrentScreen`.

**Key properties:**

- `conversation_id`
- `entry_surface`
- `question_length`
- `question_length_bucket`
- `question_source`
- `question_text`, when raw prompt capture is enabled
- `is_prefilled_question`
- `session_id`
- `turn_id`
- prototype metadata

**Important for this prototype:** Composer submissions are configured to open `https://www.medscape.com/ai-search`. For user-typed composer sends, `composer_submit_clicked` and `external_ai_search_opened` are the most important events. `question_submitted` is still useful for the prefilled answer and any flows that remain inside the mock conversation.

**Use this to answer:**

- Was the prefilled question rendered into the conversation?
- Which question sources entered the mock answer lifecycle?
- How long are submitted questions?

**PostHog check:**

Create a trend for `question_submitted`, filtered by `prototype_slug = paid-ads-exp`.

Break down by:

- `question_source`
- `is_prefilled_question`
- `question_length_bucket`

### `generation_completed`

**What it tracks:** The mock Medscape AI answer completed.

**Implemented in:** `MedscapeAiCurrentScreen`.

**Key properties:**

- `answer_length`
- `conversation_id`
- `follow_up_count`
- `reference_count`
- `generation_mode`
- `mock_generation`
- `time_to_complete_ms`
- `turn_id`
- prototype metadata

**Use this to answer:**

- Did the prefilled experience render the completed answer?
- How many answer turns completed?
- What answer metadata was shown, such as reference and follow-up counts?

**PostHog check:**

Use as a QA and reliability event after `question_submitted`.

Suggested funnel:

```text
paid_ads_landing_viewed
question_submitted
generation_completed
```

### `ad_slot_viewed`

**What it tracks:** An ad slot was at least 50% visible for 1 second.

**Implemented in:** `MedscapeCurrentAdBlock`.

**Key properties:**

- `ad_placement`
- `ad_slot`
- `conversation_id`
- `time_visible_ms`
- `turn_id`
- `visible_ratio`
- prototype metadata

For this prototype, the main slot is:

- `ad_slot`: `above_question`
- `ad_placement`: `above-question`

**Use this to answer:**

- How many users actually saw the ad?
- Did auto-scroll expose the ad?
- How does ad visibility differ by device or campaign source?

**PostHog check:**

Create an Insights trend for `ad_slot_viewed`, filtered by `prototype_slug = paid-ads-exp`.

Break down by:

- `ad_slot`
- `device_type`
- `utm_campaign`

### `button_clicked`

**What it tracks:** A normalized click event for important buttons in the prototype.

**Implemented across:** `MedscapeAiCurrentScreen`, `AiResponseChatComposer`, `AiResponseAnswerActions`, `AiResponseKeyPoints`, and `AiResponseReferences`.

**Key properties:**

- `button_id`
- `button_label`
- `button_role`
- `button_surface`
- `conversation_id`, when available
- `turn_id`, when available
- prototype metadata

Current button IDs include:

- `top_rail_history`
- `top_rail_new_chat`
- `composer_send`
- `composer_stop`
- `composer_voice_input`
- `external_ai_search_open`
- `scroll_to_latest`
- `summary_read_more`
- `summary_show_less`
- `key_points_header_toggle`
- `key_points_read_full_answer`
- `key_points_hide_full_answer`
- `answer_helpful`
- `answer_not_helpful`
- `answer_copy`
- `references_toggle`
- `follow_up_question`

**Use this to answer:**

- Which buttons are clicked most?
- Which surfaces drive interaction?
- Are users interacting more with answer controls, follow-up prompts, the composer, or navigation?

**PostHog check:**

Create an Insights trend for `button_clicked`, filtered by `prototype_slug = paid-ads-exp`.

Break down by:

- `button_id`
- `button_surface`
- `button_role`

This is the main event for a stakeholder-friendly “button clicks by type” dashboard.

### `key_points_toggled`

**What it tracks:** The summary/key-points component was expanded or collapsed.

**Implemented in:** `AiResponseKeyPoints`.

**Key properties:**

- `expanded`
- `key_points_count`
- `trigger`: `header` or `read_more`
- `variant`: `collapsed-read-more`
- `conversation_id`
- `turn_id`
- prototype metadata

**Use this to answer:**

- Are users opening the full answer from the summary?
- Do users use the `Read full answer` affordance?
- How much engagement happens with the answer body beyond the summary?

**PostHog check:**

Create an Insights trend for `key_points_toggled`.

Filter:

```text
prototype_slug = paid-ads-exp
```

Break down by:

- `expanded`
- `trigger`

### `summary_answer_toggled`

**What it tracks:** The alternate answer summary read-more control expanded or collapsed.

**Implemented in:** `MedscapeAiCurrentAnswerSummary`.

**Key properties:**

- `expanded`
- `key_points_count`
- `conversation_id`
- `turn_id`
- prototype metadata

**Use this to answer:**

- Whether users expand a summarized answer in variants that use this summary component.

**PostHog check:**

For `paid-ads-exp`, the primary answer expansion event is usually `key_points_toggled`, because this route uses the collapsed read-more key-points variant. Keep `summary_answer_toggled` available for comparison with other Medscape AI variants.

### `references_toggled`

**What it tracks:** The user expanded or collapsed the References section.

**Implemented in:** `AiResponseReferences`.

**Key properties:**

- `expanded`
- `reference_count`
- `conversation_id`
- `turn_id`
- prototype metadata

**Use this to answer:**

- Are users checking sources/references?
- Do references contribute to perceived credibility or deeper engagement?

**PostHog check:**

Create a trend for `references_toggled`, filtered by `prototype_slug = paid-ads-exp`.

Break down by:

- `expanded`
- `reference_count`

### `follow_up_question_clicked`

**What it tracks:** The user clicked a suggested follow-up question.

**Implemented in:** `MedscapeAiCurrentScreen`.

**Key properties:**

- `conversation_id`
- `follow_up_index`
- `follow_up_text`, when raw prompt capture is enabled
- `parent_turn_id`
- prototype metadata

**Use this to answer:**

- Do users engage with suggested next questions?
- Which follow-up positions get clicked?
- Do follow-up questions drive users into Medscape AI search?

**PostHog check:**

Trend:

```text
follow_up_question_clicked
```

Filter:

```text
prototype_slug = paid-ads-exp
```

Break down by:

- `follow_up_index`

To measure continuation into search, create a funnel:

```text
follow_up_question_clicked
external_ai_search_opened where question_source = follow_up_question
```

### `answer_feedback_submitted`

**What it tracks:** The user clicked Helpful or Not Helpful.

**Implemented in:** `AiResponseAnswerActions`.

**Key properties:**

- `feedback`: `helpful` or `not_helpful`
- `answer_length`
- `conversation_id`
- `question_text`, when raw prompt capture is enabled
- `turn_id`
- prototype metadata

**Use this to answer:**

- Did users give quality feedback?
- Was feedback positive or negative?
- Which campaigns or devices produce more negative feedback?

**PostHog check:**

Create a trend for `answer_feedback_submitted`, filtered by `prototype_slug = paid-ads-exp`.

Break down by:

- `feedback`
- `utm_campaign`
- `device_type`

### `answer_copied`

**What it tracks:** The user copied the answer.

**Implemented in:** `AiResponseAnswerActions`.

**Key properties:**

- `answer_length`
- `copy_method`
- `conversation_id`
- `question_text`, when raw prompt capture is enabled
- `turn_id`
- prototype metadata

**Use this to answer:**

- Are users finding the answer useful enough to copy?
- Does copy behavior correlate with longer dwell time or deeper scroll?

**PostHog check:**

Create a trend for `answer_copied`, filtered by `prototype_slug = paid-ads-exp`.

Break down by:

- `copy_method`
- `device_type`

### `scroll_to_latest_shown`

**What it tracks:** The scroll-to-latest affordance became visible.

**Implemented in:** `MedscapeAiCurrentScreen`.

**Key properties:**

- `conversation_id`
- prototype metadata

**Use this to answer:**

- Did users move far enough from the latest content that the UI needed to show the scroll-to-latest control?

**PostHog check:**

Use primarily as UI behavior telemetry rather than a primary stakeholder metric.

### `scroll_to_latest_clicked`

**What it tracks:** The user clicked the scroll-to-latest affordance.

**Implemented in:** `MedscapeAiCurrentScreen`.

**Key properties:**

- `conversation_id`
- prototype metadata

**Use this to answer:**

- Are users navigating within the answer content?
- Is the long answer creating scroll recovery behavior?

**PostHog check:**

Create an Insights trend for `scroll_to_latest_clicked`, filtered by `prototype_slug = paid-ads-exp`.

### `history_conversation_clicked`

**What it tracks:** The user clicked History in the top rail.

**Implemented in:** `MedscapeAiCurrentScreen`.

**Key properties:**

- `conversation_id`
- `question_text`, when raw prompt capture is enabled
- prototype metadata

**Use this to answer:**

- Are users interacting with historical conversation/navigation controls?

**PostHog check:**

This event is useful for interaction completeness. For simple button reporting, use `button_clicked` with `button_id = top_rail_history`.

### `new_chat_clicked`

**What it tracks:** The user clicked New Chat in the top rail.

**Implemented in:** `MedscapeAiCurrentScreen`.

**Key properties:**

- `conversation_id`
- prototype metadata

**Use this to answer:**

- Are users trying to restart or create a new question?

**PostHog check:**

This event is useful for semantic navigation reporting. For simple button reporting, use `button_clicked` with `button_id = top_rail_new_chat`.

### `web_vital_reported`

**What it tracks:** Next.js web vitals reported by the browser.

**Implemented in:** `AnalyticsRouteTracker`.

**Key properties:**

- `metric_name`
- `metric_rating`
- `metric_value`
- `metric_delta`
- `metric_id`

**Use this to answer:**

- Did the campaign experience have performance issues?
- Are poor Core Web Vitals correlated with lower engagement?

**PostHog check:**

Create a trend/table for `web_vital_reported`, filtered by route or pathname.

Break down by:

- `metric_name`
- `metric_rating`
- `device_type`

### `client_error_captured`

**What it tracks:** Client-side errors caught by the app/global error boundaries.

**Implemented in:** app error boundaries and the shared analytics client.

**Key properties:**

- `error_surface`
- `error_digest`
- `screen_type`

**Use this to answer:**

- Did users hit a broken state?
- Did errors affect engagement or conversion?

**PostHog check:**

Create an Insights trend for `client_error_captured`.

Filter by:

```text
route contains /paid-ads-exp
```

## Recommended PostHog Dashboards

### 1. Paid Campaign Landing Overview

Charts:

- `$pageview` filtered by `$pathname = /paid-ads-exp/chat`
- `paid_ads_landing_viewed`
- `prototype_viewed`
- `page_engagement_ended` average `engaged_time_ms`
- `page_engagement_ended` breakdown by `clicked_any_button`
- `page_engagement_ended` breakdown by `composer_started`

Breakdowns:

- `utm_source`
- `utm_campaign`
- `device_type`

### 2. Engagement Funnel

Recommended funnel:

```text
paid_ads_landing_viewed
engagement_timer_reached where milestone_seconds = 15
scroll_depth_reached where scroll_depth_percent >= 50
button_clicked
composer_typing_started
composer_submit_clicked
external_ai_search_opened
```

Use this to communicate campaign quality and depth of engagement.

### 3. Composer Funnel

Recommended funnel:

```text
paid_ads_landing_viewed
composer_focused
composer_typing_started
composer_changed
composer_submit_clicked
external_ai_search_opened
```

Break down by:

- `submit_method`
- `char_bucket`
- `device_type`
- `utm_campaign`

### 4. Answer Engagement

Charts:

- `key_points_toggled`, breakdown by `expanded`
- `references_toggled`, breakdown by `expanded`
- `answer_feedback_submitted`, breakdown by `feedback`
- `answer_copied`
- `follow_up_question_clicked`, breakdown by `follow_up_index`

Use this to explain whether users are evaluating the Medscape AI answer rather than only landing on the page.

### 5. Button Click Report

Primary event:

```text
button_clicked
```

Break down by:

- `button_id`
- `button_surface`
- `button_role`

This is the simplest way to answer: “For each button specifically, how many clicks did it get?”

### 6. Ad Exposure

Primary event:

```text
ad_slot_viewed
```

Key chart:

- Count of `ad_slot_viewed`, filtered by `prototype_slug = paid-ads-exp`
- Breakdown by `ad_slot`, `device_type`, and `utm_campaign`

Use this to understand whether campaign users actually saw the paid placement inside the prototype.

## Common Questions And Which Events To Use

| Question | Events to check | Key properties |
| --- | --- | --- |
| How many users landed from the campaign? | `$pageview`, `paid_ads_landing_viewed` | `$pathname`, `utm_source`, `utm_campaign` |
| Did users stay? | `engagement_timer_reached`, `page_engagement_ended` | `milestone_seconds`, `engaged_time_ms` |
| Did users scroll? | `scroll_depth_reached`, `page_engagement_ended` | `scroll_depth_percent`, `max_scroll_depth_percent` |
| Did users click anything? | `button_clicked`, `page_engagement_ended` | `button_id`, `clicked_any_button` |
| Which button got the most clicks? | `button_clicked` | `button_id`, `button_surface` |
| Did users start typing? | `composer_typing_started`, `composer_changed` | `char_bucket`, `source_surface` |
| Did users click send? | `composer_submit_clicked` | `submit_method`, `question_length`, `char_bucket` |
| Did users go to Medscape AI search? | `external_ai_search_opened` | `question_source`, `destination_url` |
| Did users read beyond the summary? | `key_points_toggled`, `scroll_depth_reached` | `expanded`, `trigger`, `scroll_depth_percent` |
| Did users check references? | `references_toggled` | `expanded`, `reference_count` |
| Did users click follow-up questions? | `follow_up_question_clicked`, `button_clicked` | `follow_up_index`, `button_id` |
| Did users give feedback? | `answer_feedback_submitted` | `feedback` |
| Did users copy the answer? | `answer_copied` | `copy_method`, `answer_length` |
| Did users see the ad? | `ad_slot_viewed`, `page_engagement_ended` | `ad_slot`, `ad_viewed` |
| Did performance/errors affect engagement? | `web_vital_reported`, `client_error_captured` | `metric_name`, `metric_rating`, `error_surface` |

## Implementation References

Core tracking files:

- `src/lib/analytics/posthog.ts`: PostHog initialization and event capture wrapper.
- `src/lib/analytics/events.ts`: shared analytics payload, URL sanitization, raw prompt handling, UTM/device properties.
- `src/components/analytics/analytics-route-tracker.tsx`: `$pageview` and web vital reporting.
- `src/components/screens/medscape-ai-current-screen.tsx`: paid-ads-specific landing, dwell, scroll, session summary, outbound search, question lifecycle, and top-level prototype events.
- `src/components/medscape/ai-response/chat-composer.tsx`: composer focus, text buckets, submit, and composer button clicks.
- `src/components/medscape/ai-response/answer-actions.tsx`: helpful/not helpful/copy actions.
- `src/components/medscape/ai-response/key-points.tsx`: summary/key-points expand/collapse.
- `src/components/medscape/ai-response/references.tsx`: references expand/collapse.
- `src/components/medscape/ai-current/ad-block.tsx`: ad visibility tracking.

Route configuration:

- `src/app/(prototypes)/paid-ads-exp/page.tsx`
- `src/app/(prototypes)/paid-ads-exp/chat/page.tsx`

## QA Checklist Before Sharing Campaign Results

1. Confirm PostHog is enabled in the deployment environment.
2. Open `/paid-ads-exp/chat` with campaign UTM parameters.
3. Confirm `$pageview`, `prototype_viewed`, and `paid_ads_landing_viewed` appear in PostHog Live Events.
4. Wait at least 15 seconds and confirm `engagement_timer_reached`.
5. Scroll through the answer and confirm `scroll_depth_reached`.
6. Expand the summary/full answer and confirm `key_points_toggled` plus `button_clicked`.
7. Expand References and confirm `references_toggled`.
8. Click Helpful, Not Helpful, and Copy in a test session and confirm the corresponding events.
9. Type in the composer and confirm `composer_typing_started` and `composer_changed`.
10. Submit the composer and confirm `composer_submit_clicked` and `external_ai_search_opened`.
11. Confirm `page_engagement_ended` appears after leaving or hiding the tab.
12. Check that all relevant charts are filtered by `prototype_slug = paid-ads-exp`.
