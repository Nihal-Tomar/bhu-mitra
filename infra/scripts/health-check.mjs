// ==============================================================================
// BhuMitra — Automated Service Health Check Runner
// Verifies all three services: Web (3000), API (3001), Intelligence (8000)
// ==============================================================================

const services = [
  {
    name: 'Web Frontend (Next.js)',
    url: 'http://localhost:3000/api/health',
    required: true,
  },
  {
    name: 'Core API Gateway (NestJS)',
    url: 'http://localhost:3001/api/v1/health',
    required: true,
  },
  {
    name: 'Intelligence Service (FastAPI)',
    url: 'http://localhost:8000/health',
    required: false,
  },
];

console.log('\n========================================================');
console.log('  BHUMITRA — Service Health Verification');
console.log('========================================================\n');

async function checkService(svc) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(svc.url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const latency = Date.now() - start;

    if (res.ok) {
      const data = await res.json();
      console.log(`  ✅ [UP]   ${svc.name.padEnd(32)} (${latency}ms)`);
      return { ...svc, up: true, data };
    } else {
      console.log(`  ⚠️  [HTTP ${res.status}] ${svc.name.padEnd(32)} (${latency}ms)`);
      return { ...svc, up: false, status: res.status };
    }
  } catch (err) {
    const latency = Date.now() - start;
    console.log(`  ❌ [DOWN] ${svc.name.padEnd(32)} (${latency}ms) — ${err.message}`);
    return { ...svc, up: false, error: err.message };
  }
}

async function run() {
  const results = await Promise.all(services.map(checkService));
  const allRequiredUp = results.filter((r) => r.required).every((r) => r.up);

  console.log('\n--------------------------------------------------------');
  if (allRequiredUp) {
    console.log('  🎉 All required BhuMitra services are HEALTHY.');
  } else {
    console.log('  ⚠️  One or more required services are not running.');
    console.log('  Tip: Run "pnpm dev" to start all services.');
  }
  console.log('========================================================\n');
}

run();
