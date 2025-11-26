require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not set in the environment variables');
        return;
    }

    console.log('Attempting to connect to:', databaseUrl);

    const client = new Client({
        connectionString: databaseUrl,
    });

    try {
        await client.connect();
        console.log('✅ Successfully connected to PostgreSQL database!');

        // Test a simple query
        const result = await client.query('SELECT NOW() as timestamp;');
        console.log('Query result:', result.rows[0]);

        // Test if our schema exists by querying for the theme table
        try {
            const tableResult = await client.query(`
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'theme';
            `);

            if (tableResult.rows.length > 0) {
                console.log('✅ Schema exists - found "theme" table');
            } else {
                console.log('⚠️  Schema might not be set up yet - "theme" table not found');
            }
        } catch (err) {
            console.log('⚠️  Could not check schema:', err.message);
        }

    } catch (err) {
        console.error('❌ Failed to connect to PostgreSQL database:', err.message);
        console.log('\n💡 To fix this issue:');
        console.log('   1. Install PostgreSQL locally or use Docker');
        console.log('   2. Make sure the PostgreSQL service is running');
        console.log('   3. Ensure the database "escapehint" exists');
        console.log('   4. Update the .env file with correct credentials if needed');
        console.log('\nFor Docker setup, run:');
        console.log('   docker-compose up -d');
        console.log('\nFor PostgreSQL MCP server to work, you need an actual PostgreSQL instance running.');
    } finally {
        await client.end();
    }
}

console.log('🔍 Testing PostgreSQL connection using .env configuration...');
console.log('📌 Current DATABASE_URL:', process.env.DATABASE_URL);
testConnection();