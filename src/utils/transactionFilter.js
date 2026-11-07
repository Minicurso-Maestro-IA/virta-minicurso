/**
 * Filtra uma lista de transações com base no tipo selecionado.
 * Preserva a ordenação original recebida.
 *
 * @param {Array<{ id: number, type: "INCOME" | "EXPENSE", [key: string]: any }>} transactions
 * @param {"ALL" | "INCOME" | "EXPENSE"} filter
 * @returns {Array<{ id: number, type: "INCOME" | "EXPENSE", [key: string]: any }>}
 */
export function filterTransactions(transactions, filter) {
  if (filter === "INCOME") {
    return transactions.filter((tx) => tx.type === "INCOME");
  }
  if (filter === "EXPENSE") {
    return transactions.filter((tx) => tx.type === "EXPENSE");
  }
  return transactions;
}
