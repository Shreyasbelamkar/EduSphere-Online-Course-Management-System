import dotenv from 'dotenv';
dotenv.config();

import app from './server';
import { testDatabaseConnection } from './config/database';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await testDatabaseConnection();
    console.log('✅ Database connection established');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
