import { spawn } from 'node:child_process';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...process.argv.slice(2)], {
  stdio: ['inherit', 'pipe', 'inherit'],
});
let worker;
let output = '';
server.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  output = (output + chunk.toString()).slice(-4096);
  const address = output.match(/Local:\s+http:\/\/[^\s]+:(\d+)/);
  if (!worker && address && process.env.CRON_SECRET) {
    worker = spawn(process.execPath, ['scripts/consultation-maintenance.mjs'], {
      stdio: 'inherit', env: { ...process.env, PORT: address[1] },
    });
    console.log('Consultation email maintenance started (checks every minute).');
  }
});
server.on('exit', (code) => {
  worker?.kill();
  process.exitCode = code ?? 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => { worker?.kill(signal); server.kill(signal); });
}
