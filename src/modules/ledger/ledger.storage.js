const STORAGE_KEY = "life-os:ledger-records";

export function loadLedgerRecords() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const records = JSON.parse(raw);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error("讀取記帳資料失敗", error);
    return [];
  }
}

export function saveLedgerRecords(records) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
