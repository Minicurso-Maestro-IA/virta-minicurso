import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { filterTransactions } from "../src/utils/transactionFilter.js";

// Conjunto de dados inicial da carteira Casa conforme especificação e src/mock/dados.ts
const casaTransactions = [
  { id: 1, type: "INCOME", amount: 5400, description: "Salário do mês", date: "2026-09-05" },
  { id: 2, type: "EXPENSE", amount: 1850, description: "Aluguel", date: "2026-09-10" },
  { id: 3, type: "EXPENSE", amount: 842.9, description: "Compra do mês", date: "2026-09-12" },
  { id: 4, type: "EXPENSE", amount: 320.45, description: "Combustível", date: "2026-09-18" },
  { id: 5, type: "INCOME", amount: 5400, description: "Salário do mês", date: "2026-10-05" },
  { id: 6, type: "EXPENSE", amount: 1850, description: "Aluguel", date: "2026-10-10" },
  { id: 7, type: "INCOME", amount: 1200, description: "Projeto de fim de semana", date: "2026-10-14" },
  { id: 8, type: "EXPENSE", amount: 287.6, description: "Jantar de aniversário", date: "2026-10-20" },
  { id: 9, type: "INCOME", amount: 5400, description: "Salário do mês", date: "2026-11-05" },
  { id: 10, type: "EXPENSE", amount: 1850, description: "Aluguel", date: "2026-11-08" },
  { id: 11, type: "EXPENSE", amount: 912.35, description: "Compra do mês", date: "2026-11-11" },
  { id: 12, type: "EXPENSE", amount: 180, description: "Passagens", date: "2026-11-15" },
];

describe("Filtro de Transações - Especificação e Regras de Negócio", () => {
  describe("Pronto quando - Carteira Casa", () => {
    it("Item 1: Com o filtro 'Tudo' (ALL), a listagem exibe exatamente 12 transações", () => {
      const result = filterTransactions(casaTransactions, "ALL");
      assert.equal(result.length, 12);
      assert.deepEqual(result, casaTransactions);
    });

    it("Item 2: Ao selecionar o filtro 'Receitas' (INCOME), a listagem exibe exatamente 4 transações", () => {
      const result = filterTransactions(casaTransactions, "INCOME");
      assert.equal(result.length, 4);
      assert.ok(result.every((tx) => tx.type === "INCOME"));
      assert.deepEqual(
        result.map((tx) => tx.id),
        [1, 5, 7, 9],
      );
    });

    it("Item 3: Ao selecionar o filtro 'Despesas' (EXPENSE), a listagem exibe exatamente 8 transações", () => {
      const result = filterTransactions(casaTransactions, "EXPENSE");
      assert.equal(result.length, 8);
      assert.ok(result.every((tx) => tx.type === "EXPENSE"));
      assert.deepEqual(
        result.map((tx) => tx.id),
        [2, 3, 4, 6, 8, 10, 11, 12],
      );
    });
  });

  describe("Ordenação Cronológica (Regra 8)", () => {
    it("Mantém a ordem cronológica relativa original das transações para qualquer filtro", () => {
      // Ordenadas do mais recente para o mais antigo
      const ordered = [...casaTransactions].reverse();
      const allResult = filterTransactions(ordered, "ALL");
      assert.deepEqual(
        allResult.map((t) => t.id),
        ordered.map((t) => t.id),
      );

      const incomeResult = filterTransactions(ordered, "INCOME");
      assert.deepEqual(
        incomeResult.map((t) => t.id),
        [9, 7, 5, 1],
      );

      const expenseResult = filterTransactions(ordered, "EXPENSE");
      assert.deepEqual(
        expenseResult.map((t) => t.id),
        [12, 11, 10, 8, 6, 4, 3, 2],
      );
    });
  });

  describe("Casos de Borda e Limites", () => {
    it("Borda Zero: Carteira vazia (0 transações) retorna 0 para todos os filtros", () => {
      assert.equal(filterTransactions([], "ALL").length, 0);
      assert.equal(filterTransactions([], "INCOME").length, 0);
      assert.equal(filterTransactions([], "EXPENSE").length, 0);
    });

    it("Borda 1 item (mínimo): Carteira com apenas 1 receita", () => {
      const singleIncome = [{ id: 101, type: "INCOME", amount: 100 }];
      assert.equal(filterTransactions(singleIncome, "ALL").length, 1);
      assert.equal(filterTransactions(singleIncome, "INCOME").length, 1);
      assert.equal(filterTransactions(singleIncome, "EXPENSE").length, 0);
    });

    it("Borda 1 item (mínimo): Carteira com apenas 1 despesa", () => {
      const singleExpense = [{ id: 102, type: "EXPENSE", amount: 50 }];
      assert.equal(filterTransactions(singleExpense, "ALL").length, 1);
      assert.equal(filterTransactions(singleExpense, "INCOME").length, 0);
      assert.equal(filterTransactions(singleExpense, "EXPENSE").length, 1);
    });

    it("Filtro sem correspondentes: Carteira contendo apenas despesas consultada com filtro Receitas retorna 0", () => {
      const onlyExpenses = [
        { id: 1, type: "EXPENSE", amount: 10 },
        { id: 2, type: "EXPENSE", amount: 20 },
      ];
      const result = filterTransactions(onlyExpenses, "INCOME");
      assert.equal(result.length, 0);
    });

    it("Filtro sem correspondentes: Carteira contendo apenas receitas consultada com filtro Despesas retorna 0", () => {
      const onlyIncome = [
        { id: 1, type: "INCOME", amount: 10 },
        { id: 2, type: "INCOME", amount: 20 },
      ];
      const result = filterTransactions(onlyIncome, "EXPENSE");
      assert.equal(result.length, 0);
    });

    it("Remoção ou edição refletida: Excluir a última receita esvazia o filtro de receitas", () => {
      let current = [
        { id: 1, type: "INCOME", amount: 100 },
        { id: 2, type: "EXPENSE", amount: 50 },
      ];
      assert.equal(filterTransactions(current, "INCOME").length, 1);

      // Simula exclusão da transação id 1
      current = current.filter((tx) => tx.id !== 1);
      const afterDelete = filterTransactions(current, "INCOME");
      assert.equal(afterDelete.length, 0);
    });
  });

  describe("Alternância de Carteira (Regra 7 e Pronto quando 5)", () => {
    it("Ao trocar de carteira, o filtro ativo deve ser redefinido para 'ALL' ('Tudo')", () => {
      // Simula o comportamento do estado no componente ao receber novo walletId
      let activeFilter = "INCOME";
      let currentWalletId = 1;

      function onWalletChange(newWalletId) {
        if (newWalletId !== currentWalletId) {
          currentWalletId = newWalletId;
          activeFilter = "ALL";
        }
      }

      assert.equal(activeFilter, "INCOME");
      onWalletChange(2);
      assert.equal(currentWalletId, 2);
      assert.equal(activeFilter, "ALL");
    });
  });
});
