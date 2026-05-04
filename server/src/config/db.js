const dns = require('node:dns');
const mongoose = require('mongoose');

const connectWithDnsFallback = async (uri) => {
  const options = {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  };

  try {
    await mongoose.connect(uri, options);
  } catch (error) {
    const shouldRetryWithPublicDns =
      uri.startsWith('mongodb+srv://') &&
      error &&
      error.code === 'ECONNREFUSED' &&
      error.syscall === 'querySrv';

    if (!shouldRetryWithPublicDns) {
      throw error;
    }

    const previousServers = dns.getServers();

    try {
      dns.setServers(['1.1.1.1', '8.8.8.8']);
      await mongoose.connect(uri, options);
    } finally {
      dns.setServers(previousServers);
    }
  }
};

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    await connectWithDnsFallback(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:');
    console.error(err && err.stack ? err.stack : err);
    // Give a clearer message for SRV/DNS failures
    if (err && err.message && err.message.includes('querySrv')) {
      console.error('\nSRV DNS lookup failed. Common causes:');
      console.error('- Local network / firewall blocking DNS SRV lookups');
      console.error('- VPN or corporate DNS intercepting SRV records');
      console.error('- Offline machine or DNS resolver misconfiguration');
      console.error('\nTry running: nslookup -type=SRV _mongodb._tcp.cluster0.gej30p9.mongodb.net');
      console.error('Or use a standard (non-SRV) MongoDB connection string from Atlas.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
