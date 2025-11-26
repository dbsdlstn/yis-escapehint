# PostgreSQL Setup for EscapeHint Project

This document explains how to set up PostgreSQL for the EscapeHint project using the provided configuration.

## Environment Configuration

The project uses a `.env` file in the `backend` directory with the following configuration:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/escapehint

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API Configuration
API_URL=http://localhost:3000
PORT=3000

# Logging
LOG_LEVEL=info

# Prisma Configuration
PRISMA_LOG_LEVEL=info
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (locally installed) OR Docker

## Setup Options

### Option 1: Using Docker (Recommended)

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```
4. The database will be available at `localhost:5432` with the database name `escapehint`
5. The schema will be automatically applied during initialization

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL from https://www.postgresql.org/download/
2. During installation, set the password for the `postgres` user as `password` (or update the .env file accordingly)
3. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE escapehint;"
   ```
4. Apply the schema:
   ```bash
   psql -U postgres -d escapehint -f ../database/schema.sql
   ```

## Testing the Connection

To test the connection, run:

```bash
cd backend
node test-connection.js
```

## PostgreSQL MCP Server

The project includes a PostgreSQL MCP (Model Context Protocol) server configuration in `.mcp.json`:

```json
{
  "mcpServers": {
    "postgresql-mcp": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@henkey/postgres-mcp-server"]
    }
  }
}
```

To run the MCP server (after setting up PostgreSQL):

```bash
cd backend
npx @henkey/postgres-mcp-server
```

The MCP server allows AI models to interact with the PostgreSQL database through a controlled interface.

## Troubleshooting

- If you get a connection error, make sure PostgreSQL is running
- Verify the credentials in the .env file match your PostgreSQL setup
- Check that port 5432 is not blocked by a firewall