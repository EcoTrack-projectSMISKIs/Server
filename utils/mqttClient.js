const mqtt = require('mqtt');
const dotenv = require("dotenv");

  dotenv.config();
  
  const client = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });


client.on('connect', () => {
  console.log('✅ MQTT connected (backend)');
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

module.exports = client;