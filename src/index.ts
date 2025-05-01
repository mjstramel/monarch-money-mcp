import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as monarch from './operations/monarch.js';
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '..', 'dist', 'mcp-startup.log');

function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  try {
    const logDir = path.dirname(logFilePath);
    if (!fs.existsSync(logDir)){
        fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`, 'utf8');
  } catch (err: any) {
    const errorMsg = `[File Log Error] Failed to write to ${logFilePath}: ${err?.message || String(err)}`;
    console.error(errorMsg);
    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }
    console.error(`[Original Message] ${message}`);
  }
}

const logDir = path.dirname(logFilePath);
try {
    if (!fs.existsSync(logDir)){
        fs.mkdirSync(logDir, { recursive: true });
    }
    fs.writeFileSync(logFilePath, '', 'utf8');
    logToFile('[MCP Server Log] Log file cleared/initialized.');
} catch (err: any) {
    const errorMsg = `[MCP Startup Error] Failed to initialize log file at ${logFilePath}: ${err?.message || String(err)}`;
    console.error(errorMsg);
    if (err instanceof Error && err.stack) {
        console.error(err.stack);
    }
    process.exit(1);
}

process.on('uncaughtException', (err, origin) => {
  let message = `[MCP Server Log] Uncaught Exception. Origin: ${origin}. Error: ${err?.message || String(err)}`;
  logToFile(message);
  if (err && err.stack) {
    logToFile(err.stack);
  }
  logToFile('[MCP Server Log] Exiting due to uncaught exception.');
  process.exit(1);
});

logToFile('[MCP Server Log] Initializing Monarch Money MCP Server...');

const MONARCH_TOKEN = process.env.MONARCH_TOKEN;
if (!MONARCH_TOKEN) {
  logToFile('FATAL: MONARCH_TOKEN environment variable is not set.');
  process.exit(1);
}
logToFile('[MCP Server Log] Monarch token found.');

const server = new McpServer({
  name: "monarch-money-mcp-server",
  version: "0.1.0",
  context: {}
});

server.tool(
  "get_accounts",
  monarch.GetAccountsSchema.shape,
  async (_request: any) => {
    const result = await monarch.mcpGetAccounts();
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "get_budgets",
  monarch.GetBudgetsSchema.shape,
  async (request: any) => {
    const result = await monarch.mcpGetBudgets(request);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "get_transactions",
  monarch.GetTransactionsSchema.shape,
  async (request: any) => {
    const result = await monarch.mcpGetTransactions(request);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "create_manual_account",
  monarch.CreateManualAccountSchema.shape,
  async (request: any) => {
    const result = await monarch.mcpCreateManualAccount(request);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

(async () => {
  try {
      logToFile('[MCP Server Log] Server initialization complete. Ready for connection.');
      const transport = new StdioServerTransport();
      await server.connect(transport);
      logToFile('[MCP Server Log] Connected via stdio transport.');
  } catch (error: any) {
      logToFile(`[MCP Server Log] FATAL Error during server setup: ${error?.message || String(error)}`);
      if (error instanceof Error && error.stack) {
          logToFile(error.stack);
      }
      process.exit(1);
  }
})();

process.on('unhandledRejection', (reason, promise) => {
  let reasonStr = reason instanceof Error ? reason.message : String(reason);
  let stack = reason instanceof Error ? `\nStack: ${reason.stack}` : '';
  logToFile(`[MCP Server Log] Unhandled Rejection at: ${promise}, reason: ${reasonStr}${stack}`);
});

process.on('SIGINT', () => {
  logToFile('[MCP Server Log] Received SIGINT. Exiting gracefully.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logToFile('[MCP Server Log] Received SIGTERM. Exiting gracefully.');
  process.exit(0);
});
