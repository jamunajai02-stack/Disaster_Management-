require('dotenv').config({ path: require('path').join(__dirname, '../../backend/.env') });
const { handler } = require('./handler');

async function run() {
  const sampleEvent = {
    source: 'DEMO',
    disasterType: 'FLOOD',
    riskLevel: 'HIGH',
    locationName: 'Anantapur, Andhra Pradesh',
    latitude: 14.68,
    longitude: 77.6,
  };

  const result = await handler(sampleEvent);
  console.log(JSON.stringify(result, null, 2));
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
