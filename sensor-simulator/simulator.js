/**
 * SDRP Sensor Data Simulator (software-only — not real IoT hardware)
 *
 * Usage:
 *   node simulator.js normal
 *   node simulator.js high
 *   node simulator.js high --watch
 *
 * Env:
 *   API_URL=http://localhost:5000
 */

const API_URL = process.env.API_URL || 'http://localhost:5000';

const SCENARIOS = {
  normal: {
    scenario: 'NORMAL',
    rainfall: 20,
    waterLevel: 1.2,
    humidity: 65,
    temperature: 28,
    locationName: 'Anantapur, Andhra Pradesh',
    latitude: 14.68,
    longitude: 77.6,
  },
  high: {
    scenario: 'HIGH_RISK',
    rainfall: 180,
    waterLevel: 5.2,
    humidity: 95,
    temperature: 27,
    locationName: 'Anantapur, Andhra Pradesh',
    latitude: 14.68,
    longitude: 77.6,
  },
};

async function sendReading(scenarioName) {
  const payload = SCENARIOS[scenarioName];
  if (!payload) {
    console.error(`Unknown scenario "${scenarioName}". Use: normal | high`);
    process.exit(1);
  }

  console.log(`\n[SIMULATED] Sending ${scenarioName.toUpperCase()} sensor reading...`);
  console.log(JSON.stringify(payload, null, 2));

  const res = await fetch(`${API_URL}/api/sensors/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Failed:', data.message || res.statusText);
    process.exit(1);
  }

  console.log('\nResponse:');
  console.log(`  Risk level: ${data.data?.prediction?.riskLevel}`);
  console.log(`  Probability: ${data.data?.prediction?.riskProbability}`);
  console.log(`  Alert created: ${Boolean(data.data?.alertResult?.alert)}`);
  console.log(`  Notifications: ${data.data?.alertResult?.notificationCount ?? 0}`);
  console.log(`  ${data.data?.disclaimer || data.message}\n`);
}

const scenario = (process.argv[2] || 'normal').toLowerCase();
const watch = process.argv.includes('--watch');

if (watch) {
  sendReading(scenario).then(() => {
    console.log('Watch mode: sending every 30s. Ctrl+C to stop.');
    setInterval(() => sendReading(scenario), 30000);
  });
} else {
  sendReading(scenario);
}
