## Current

- Conversations: Convex function fetches from ElevenLabs and saves to Convex. Plan is to run it via a Convex cron (currently manual/triggered).
- Conversation details (transcript): Fetched on demand from ElevenLabs via API route when the user opens details.
- Audio: Fetched on demand from ElevenLabs via API route; we return the audio after downloading the full file.

## Considering

- Cache transcripts in Convex with a 7‑day TTL; use ElevenLabs fetch as a fallback after TTL expires.
- Ingest conversation data via an ElevenLabs webhook instead of (or alongside) polling.


