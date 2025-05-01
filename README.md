# Monarch Money MCP Server

This project provides a Model Context Protocol (MCP) server for Monarch Money, allowing you to interact with your Monarch Money data using MCP-compatible clients (like Windsurf).

## Features

- Exposes Monarch Money API endpoints as MCP tools
- Tools for accounts, budgets, and transactions
- Input validation with Zod
- Logging to `dist/mcp-startup.log`

## Requirements

- Node.js 18+
- A Monarch Money API token ([see here](https://github.com/pbassham/monarch-money-api#usage))

## Setup

1. **Clone the repository:**
   ```sh
   git clone git@github.com:mjstramel/monarch-money-mcp.git
   cd monarch-money-mcp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set your Monarch Money token:**
   ```sh
   export MONARCH_TOKEN=your_token_here
   ```
4. **Build and run:**
   ```sh
   npm run build
   npm start
   ```

## Project Structure

- `src/index.ts` — Main MCP server entry point
- `src/operations/monarch.ts` — Monarch Money API wrappers and Zod schemas

## Add to cursor

```json
{
  "mcpServers": {
    "monarch-money": {
      "command": "node",
      "args": ["<path-to-mcp-server>/dist/index.js"],
      "env": {
        "MONARCH_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Adding More Tools

To add more Monarch Money API endpoints, expand `src/operations/monarch.ts` and register new tools in `src/index.ts`.

## License

Proprietary / Private
