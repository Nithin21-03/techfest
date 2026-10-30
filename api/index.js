import app from '../server/app.js';
import { initializeDatabase } from '../server/db.js';

let dbInitPromise = null;

export default async function handler(req, res) {
  // Ensure Cloud PostgreSQL pool and schemas are initialized
  if (!dbInitPromise) {
    dbInitPromise = initializeDatabase().catch((err) => {
      console.warn('Vercel Serverless Database initialization notice:', err.message);
    });
  }
  await dbInitPromise;

  // Hand off request to Express application
  return app(req, res);
}
