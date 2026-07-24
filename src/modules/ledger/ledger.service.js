import { loadLedgerRecords, saveLedgerRecords } from "./ledger.storage.js";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeLedgerInput(input) {
  const type = input.type === "income" ? "income" : "expense";
  const amount = Number(input.amount);
  const category = String(input.category ?? "").trim();
  const note = String(input.note ?? "").trim();
  const date = String(input.date ?? "");

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("金額必須大於 0");
  }

  if (!category) {
    throw new Error("請選擇分類");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("請選擇有效日期");
  }

  return {
    type,
    amount: Math.round(amount),
    category,
    note,
    date,
  };
}

export function getLedgerRecords() {
  return loadLedgerRecords().sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    return dateCompare || b.createdAt.localeCompare(a.createdAt);
  });
}

export function getLedgerRecord(id) {
  return loadLedgerRecords().find((record) => record.id === id) ?? null;
}

export function addLedgerRecord(input) {
  const normalized = normalizeLedgerInput(input);
  const record = {
    id: createId(),
    ...normalized,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  saveLedgerRecords([record, ...loadLedgerRecords()]);
  return record;
}

export function updateLedgerRecord(id, input) {
  const normalized = normalizeLedgerInput(input);
  const records = loadLedgerRecords();
  const recordIndex = records.findIndex((record) => record.id === id);

  if (recordIndex === -1) {
    throw new Error("找不到要修改的紀錄");
  }

  const updatedRecord = {
    ...records[recordIndex],
    ...normalized,
    updatedAt: new Date().toISOString(),
  };

  records[recordIndex] = updatedRecord;
  saveLedgerRecords(records);
  return updatedRecord;
}

export function deleteLedgerRecord(id) {
  saveLedgerRecords(loadLedgerRecords().filter((record) => record.id !== id));
}

export function getMonthlyLedgerSummary(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  return loadLedgerRecords().reduce(
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
}
