# Hermes Agent Gateway — API Reference for This Environment

This documents a specific, already-tested deployment of a "Hermes" agent
gateway on a local network. Everything below was confirmed by direct
testing against the real server (2026-09-17 through 2026-09-19), plus
cross-checked against NousResearch's own `hermes-agent` documentation
(`hermes-agent.nousresearch.com`) where noted. Where docs and observed
behavior disagreed, observed behavior is what's recorded here.

## What this is (and isn't)

- Base URL: `http://192.168.1.84:8642/v1` — a LAN-only host, not
  internet-routable. Confirm reachability before assuming this works
  from a different network.
- This is an **agent/orchestration gateway**, not a raw model endpoint,
  despite being named "Hermes." Asking it to self-identify its base
  model returns **`gpt-oss-120b`** (an OpenAI open-weight model, ~117B
  params, MoE, ~5B active/token), served via an Ollama cloud passthrough
  on the backend. It is fronted by a gateway that injects a large system
  prompt (~10,000+ input tokens baseline, confirmed via `usage` on a
  trivial request) carrying its own memory/tool context on every call.
- `GET /v1/models` reports exactly one model id: `"hermes-agent"` — a
  gateway alias, not the real underlying model name.

## Authentication

- Header: `Authorization: Bearer <HERMES_API_KEY>`
- Do not hardcode the key in any script or document that might be
  shared/committed — read it from wherever this environment's secrets
  live (in this repo: `HERMES_API_KEY` in `lausd_tools/.env`, loaded via
  `agent/llm_client.py`'s `get_hermes_client()`).
- A missing/wrong key returns a clean JSON error:
  `{"error": {"message": "Invalid gateway API key (API_SERVER_KEY)", "type": "gateway_auth_error", "code": "gateway_auth_failed"}}`

## Endpoints

### `POST /v1/responses` — use this one

The endpoint that actually supports structured output and multi-turn
chaining. Request body:

```json
{
  "model": "hermes-agent",
  "input": "plain string, OR an array of {role, content} message objects",
  "store": true,
  "previous_response_id": "resp_...",
  "response_format": {"type": "json_object"}
}
```

- `input` accepts **either** a bare string **or** a full OpenAI-style
  messages array (`[{"role": "user", "content": "..."}, ...]`) —
  confirmed working with multi-message arrays including a `system` role.
- `store: true` persists the **response object itself** (SQLite, max
  100 entries, LRU-evicted) so a *later* call can replay this exact
  thread via `previous_response_id` — see the Memory section below for
  why this is NOT the same as long-term memory.
- `previous_response_id`: chains onto one specific prior response,
  replaying its full context (including tool calls). An unknown/invalid
  id is rejected with an explicit error
  (`"Previous response not found: <id>"`), not silently ignored.
- Structured JSON output works via **either** convention — send one or
  both, both are honored:
  - `"response_format": {"type": "json_object"}` (the OpenAI
    chat-completions convention)
  - `"text": {"format": {"type": "json_object"}}` (the real OpenAI
    Responses API convention)

Response shape:

```json
{
  "id": "resp_...",
  "object": "response",
  "status": "completed",
  "created_at": 1234567890,
  "model": "hermes-agent",
  "output": [
    {"type": "message", "role": "assistant", "content": [
      {"type": "output_text", "text": "..."}
    ]}
  ],
  "usage": {"input_tokens": 10474, "output_tokens": 45, "total_tokens": 10519}
}
```

Extract the reply from `output[0].content[0].text` where
`output[].type == "message"`.

### `POST /v1/chat/completions` — plain OpenAI shape, no memory

Standard, fully stateless chat-completions contract. The client must
resend the entire `messages` array every turn. **Nothing sent through
this endpoint ever reaches Hermes's long-term memory**, regardless of
content — confirmed directly (a fact told only through this endpoint was
never recalled by any later call, through either endpoint).

### `GET /v1/models`, `GET /v1/capabilities`

`/v1/capabilities` advertises supported extensions, e.g.
`"session_key_header": "X-Hermes-Session-Key"` — check this endpoint if
behavior seems to differ from what's documented here; the deployment may
have changed.

## Headers that matter

- `Authorization: Bearer <key>` — required, every request.
- `X-Hermes-Session-Key` — **the real long-term-memory scoping
  mechanism.** Optional, max 256 chars, control characters (`\r`, `\n`,
  `\x00`) rejected. Send a fixed, consistent string per
  identity/application. Per the docs: *"Without the key, Honcho's
  per-session strategy produces a different scope per session_id"* —
  and `X-Hermes-Session-Id` (below) is fresh on every unchained call, so
  **omitting this header means every call effectively gets its own
  isolated memory scope.** This is a real, confirmed failure mode, not a
  theoretical one.
- `X-Hermes-Session-Id` — returned in every response's headers. This is
  a **transcript-scoped** id that rotates per call unless chained via
  `previous_response_id`. Do not confuse it with `X-Hermes-Session-Key`
  — they control different things (transcript replay vs. memory scope).

## Confirmed hard limitations — do not build around these being fixable

1. **No vision, at all.** An `image_url` content part gets a plain "I
   can't view images" reply. The underlying model (`gpt-oss-120b`) has
   no vision capability. There is no per-request override for this.
2. **No caller-supplied tool-calling, by design.** Confirmed both by
   direct testing (given an OpenAI `tools` schema, it never returns
   `tool_calls` — it just answers in prose, or resolves things through
   its own internal tools instead) and by NousResearch's own docs: *"the
   agent handles requests with its full toolset (terminal, file
   operations, web search, memory, skills)"* — meaning the server always
   runs **its own** internal tools regardless of what you send, and
   never executes or reports back a caller's own function definitions.
   **Do not design an integration that expects to receive `tool_calls`
   and execute them yourself** — that contract does not exist here.
   Also watch for the inverse leak: asking a question that resembles a
   file/system check (e.g. "do you see the file at `<path>`?") can
   return the **raw internal tool result** as the entire reply (e.g.
   `{"site_notes_present": true}`) instead of a natural-language answer
   — this is the gateway's own internal tooling surfacing directly, not
   something you control or requested.

## Memory model — the single most counter-intuitive part

- **The agent itself decides, per turn, whether something is worth
  committing to long-term memory.** This is a model judgment call, not
  a mechanical effect of any request parameter. Per the docs: *"The
  agent proactively saves facts when it learns them... you don't need
  to ask."* In practice this also means asking IS NOT SUFFICIENT either:
  confirmed directly, repeated, explicit "remember this fact" instructions
  were often never recalled minutes (or even much later) after being
  sent, while one earlier, similarly-phrased fact was reliably recalled
  indefinitely. There is no reliable, caller-controlled way to force a
  write.
- `store` and `previous_response_id` are unrelated to long-term memory
  — they only affect short-term response-chain replay (see above).
- `X-Hermes-Session-Key` only affects **which scope** a memory write (if
  one happens) lands in and is read from — it does not cause a write to
  happen.
- Treat anything this gateway claims to "remember" about you/a project
  as **unverified, not ground truth** — it has been observed stating
  specific, checkable claims (a wrong home-folder path, an invented
  product feature) with full confidence.

## Practical rules for an agent integrating with this API

1. Always call `POST /v1/responses`, never `/v1/chat/completions`, if
   there's any chance you want structured output or eventual memory
   access.
2. Always send a fixed `X-Hermes-Session-Key` for your
   application/identity — pick one string and keep using it. Without
   it, assume zero memory continuity between calls.
3. Never send a `tools` schema expecting it to be honored. If you need
   tool-calling with a model you control the tool execution for, this
   is the wrong endpoint for that turn — use it for plain
   reasoning/completions instead.
4. Never send image content — there is no vision support to fall back on.
5. Use `response_format`/`text.format` for JSON-mode output — this
   works reliably and is the one structured-output mechanism you can
   depend on.
6. Do not assume a "remember this" instruction durably persisted.
   If a fact matters, verify recall explicitly before depending on it,
   and do not build logic that requires a write to have succeeded.
7. Budget for a large fixed per-call overhead (~10,000+ input tokens),
   regardless of how short your actual prompt is — this affects both
   cost and latency estimates.
8. A `previous_response_id` referencing an unknown/expired response
   fails loudly (explicit error) rather than silently starting fresh —
   handle that error case rather than assuming the id is always valid.

## Minimal working examples

Plain completion:
```bash
curl -s http://192.168.1.84:8642/v1/responses \
  -H "Authorization: Bearer $HERMES_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Hermes-Session-Key: my-app-name" \
  -d '{"model":"hermes-agent","input":"Say hello in one word.","store":true}'
```

JSON-mode completion:
```bash
curl -s http://192.168.1.84:8642/v1/responses \
  -H "Authorization: Bearer $HERMES_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Hermes-Session-Key: my-app-name" \
  -d '{"model":"hermes-agent","input":"Return JSON with keys animal and sound for a cow.","text":{"format":{"type":"json_object"}}}'
```

Chained follow-up (replays the specific thread from `resp_id`):
```bash
curl -s http://192.168.1.84:8642/v1/responses \
  -H "Authorization: Bearer $HERMES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"hermes-agent","input":"And the next one?","previous_response_id":"resp_id_from_earlier_call"}'
```

Multi-message array input (system + user):
```bash
curl -s http://192.168.1.84:8642/v1/responses \
  -H "Authorization: Bearer $HERMES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"hermes-agent","input":[{"role":"system","content":"You are terse."},{"role":"user","content":"Say exactly: ok"}]}'
```

## Reference implementation

A tested, working Python client implementing everything above (auth,
`/v1/responses`, `response_format` translation, `X-Hermes-Session-Key`,
and explicit rejection of unsupported `tools`) exists at
`agent/llm_client.py` in the `camera-survey-agent` repo — see
`HermesResponsesClient` and the module's docstring for the full
narrative behind each of these findings, including dated notes on what
was tested and when.
