import type { Transaction } from "../types/transaction";

export type TransactionFilter = "ALL" | "INCOME" | "EXPENSE";

export declare function filterTransactions(
  transactions: Transaction[],
  filter: TransactionFilter,
): Transaction[];
