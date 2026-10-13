# Browser consultations

This uses native WebRTC, not Zoom. No Zoom account or additional npm dependency is required.

## Local testing

1. Run `npm run db:migrate` and `npm run dev`.
2. Open a user card in admin, click **Видеозвонок**, select an expiration period and create an invitation.
3. Copy the private link into another browser window, or use **Подготовить письмо** to review and send an invitation through the existing mailbox. Creating an invitation does not send email automatically.
4. On the private page click **Позвонить консультанту**. Keep an admin page open; its incoming-call popup has a **Принять** button that accepts the call and opens the call screen.
5. Allow camera/microphone access in both browsers; no second acceptance is required. Test mute, camera toggle and hangup. Headphones prevent feedback during local testing.

Use one tab per participant per invitation. Clients can call again using the same unexpired invitation after a 20-second cooldown. Rejected, ended or disconnected calls can be retried; revoked invitations cannot. Unanswered calls time out after about 60 seconds. Both participants must keep their call page open. Incoming admin calls display a modal and play a repeating ringtone. Browser audio restrictions can require clicking “Включить звук звонка”. Push notifications are not implemented.

## Deployment

Deploy the migration and serve the website over HTTPS. Plain HTTP LAN addresses cannot request camera/microphone access; localhost can.

Configure a managed TURN service supporting shared-secret credentials or run coturn separately on the VPS:

- `CALL_TURN_URL`: comma-separated relay URLs, for example `turn:relay.example.com:3478,turns:relay.example.com:5349`.
- `CALL_TURN_SECRET`: the relay's `static-auth-secret`, with coturn `use-auth-secret` enabled. Never expose this secret to the browser. The app generates credentials valid for one hour.
- Open the configured TURN listening ports and relay port range in the firewall. Configure a valid TLS certificate for `turns:` and coturn's public/external IP correctly.
- `CALL_STUN_URL` defaults to Google's public STUN endpoint; replace it if desired.

Without TURN, local or direct peer connections may work, but remote calls across restrictive networks can fail. Calls longer than an hour should be tested against the relay credential lifetime before use.

## Storage and access

Private links contain 256-bit random bearer tokens; only their SHA-256 hashes are stored. Anyone holding the link can access the invitation. Pages are non-indexable and use a no-referrer policy. Expiration is checked on the server for page access and all signaling requests. Admin operations require the existing admin session in production; development follows the site's existing local admin bypass.

PostgreSQL stores invitation details, call states, SDP and ICE signaling. Media is not recorded or stored by the app; it travels peer-to-peer or through TURN. Signaling can contain network metadata. Expired rows can be removed using `DELETE FROM browser_calls WHERE expires_at < now() - interval '7 days';`; associated signals cascade. Schedule this cleanup on the VPS according to your retention requirements.

Signaling polls every 1.5 seconds; incoming admin calls poll every 3 seconds. This works with the existing Next.js/Nginx setup without WebSocket upgrades. A participant missing for about 45 seconds ends an active call when the remaining participant polls. Sleeping/background browser tabs can trigger this timeout.

Verification during implementation: API/database integration for token isolation, role restrictions, state transitions and expiration; two Chrome tabs with simulated audio/video verified connection, mute and remote hangup. Remote TURN routing and physical-device compatibility still require deployment testing.
