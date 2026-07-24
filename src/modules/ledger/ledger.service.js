import { loadLedgerRecords, saveLedgerRecords } from "./ledger.storage.js";
function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getLedgerRecords() {
  return loadLedgerRecords().sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    return dateCompare || b.createdAt.localeCompare(a.createdAt);
  });
}

export function addLedgerRecord(input) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("金額必須大於 0");
  }

  if (!input.category.trim()) {
    throw new Error("請選擇分類");
  }

  const record = {
    id: createId(),
    type: input.type,
    amount: Math.round(input.amount),
    category: input.category.trim(),
    note: input.note?.trim() ?? "",
    date: input.date,
    createdAt: new Date().toISOString(),
  };

  saveLedgerRecords([record, ...loadLedgerRecords()]);
  return record;
}

export function deleteLedgerRecord(id) {
  saveLedgerRecords(loadLedgerRecords().filter((record) => record.id !== id));
}

export function getMonthlyLedgerSummary(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const summary = loadLedgerRecords().reduce(
    (result, record) => {
      const recordDate = new Date(`${record.date}T00:00:00`);
      if (recordDate.getFullYear() !== year || recordDate.getMonth() !== month) {
        return result;
      }

      if (record.type === "income") result.income += record.amount;
      if (record.type === "expense") result.expense += record.amount;
      result.balance = result.income - result.expense;
      return result;
    },
    { income: 0, expense: 0, balance: 0 },
  );

  return summary;
}
