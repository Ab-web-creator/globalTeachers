import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.CRON_SECRET) throw new Error('CRON_SECRET is required for consultation maintenance.');
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const endpoint = `http://127.0.0.1:${port}/api/consultation/maintenance`;
let running = false;
async function tick() {
  if (running) return;
  running = true;
  try {
    const response = await fetch(endpoint, {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      signal: AbortSignal.timeout(55000),
    });
    if (!response.ok) console.error(`Consultation maintenance returned ${response.status}`);
    else {
      const result = await response.json();
      if (Object.values(result).some((count) => typeof count === 'number' && count > 0)) {
        console.log('Consultation maintenance processed:', result);
      }
    }
  } catch { console.error('Consultation maintenance unavailable; retrying in one minute.'); }
  finally { running = false; }
}
void tick();
const timer = setInterval(tick, 60000);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { clearInterval(timer); process.exit(0); });
