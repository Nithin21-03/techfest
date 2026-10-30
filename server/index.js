import app from './app.js';
import { initializeDatabase } from './db.js';

const PORT = process.env.PORT || 5000;

// Initialize Database on startup
initializeDatabase().catch((err) => {
  console.warn('Database initialization note:', err.message);
});

// Process Crash Guards
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception intercepted:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('CRITICAL: Unhandled Rejection intercepted:', reason);
});

// Start listening
app.listen(PORT, () => {
  console.log(`ZYNTRA '26 High-Concurrency Hardened Server operational on http://localhost:${PORT}`);
});
