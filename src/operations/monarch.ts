// This file wraps monarch-money-api for MCP tools.
// Note: MONARCH_TOKEN must be set in the environment for monarch-money-api to work.
//
import { z } from "zod";
import {
  getAccounts,
  getBudgets,
  getTransactions
} from "monarch-money-api";

// Zod schemas for tool inputs
export const GetAccountsSchema = z.object({});

export const GetBudgetsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  useLegacyGoals: z.boolean().optional(),
  useV2Goals: z.boolean().optional()
});

export const GetTransactionsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  accountIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  hasAttachments: z.boolean().optional(),
  hasNotes: z.boolean().optional(),
  hiddenFromReports: z.boolean().optional(),
  isSplit: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  importedFromMint: z.boolean().optional(),
  syncedFromInstitution: z.boolean().optional()
});

// Wrappers for Monarch Money API
export async function mcpGetAccounts() {
  return await getAccounts();
}

export async function mcpGetBudgets(params: z.infer<typeof GetBudgetsSchema>) {
  return await getBudgets(
    params.startDate,
    params.endDate,
    params.useLegacyGoals,
    params.useV2Goals
  );
}

export async function mcpGetTransactions(params: z.infer<typeof GetTransactionsSchema>) {
  return await getTransactions(params);
} 
