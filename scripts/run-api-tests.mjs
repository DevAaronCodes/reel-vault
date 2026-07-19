import { spawn } from 'node:child_process';
import process from 'node:process';

const port = process.env.PORT ?? '3001';
const env = {
  ...process.env,
  NODE_ENV: 'test',
  PORT: port,
  TMDB_API_TOKEN: process.env.TMDB_API_TOKEN ?? 'test-token'
};
const pythonCommand = process.platform === 'win32' ? 'python.exe' : 'python';

function npmCommand(args) {
  if (process.platform !== 'win32') {
    return { command: 'npm', args };
  }

  return {
    command: process.env.ComSpec ?? 'cmd.exe',
    args: ['/d', '/s', '/c', ['npm', ...args].join(' ')]
  };
}

const serverCommand = npmCommand(['--workspace', 'server', 'run', 'dev']);
const server = spawn(serverCommand.command, serverCommand.args, {
  env,
  stdio: ['ignore', 'inherit', 'inherit']
});

const stopServer = () => {
  if (!server.killed) {
    server.kill(process.platform === 'win32' ? undefined : 'SIGTERM');
  }
};

process.on('exit', stopServer);
process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});

async function waitForHealth() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://localhost:${port}/api/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error('Timed out waiting for API health endpoint.');
}

try {
  await waitForHealth();
  const pytest = spawn(pythonCommand, ['-m', 'pytest', 'tests'], {
    env: { ...process.env, API_BASE_URL: `http://localhost:${port}` },
    stdio: 'inherit'
  });

  pytest.on('exit', (code) => {
    stopServer();
    process.exit(code ?? 1);
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  stopServer();
  process.exit(1);
}
