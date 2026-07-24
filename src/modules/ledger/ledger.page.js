import { bottomNavigation } from "../../system/dashboard/dashboard.js";
import {
  addLedgerRecord,
  deleteLedgerRecord,
  getLedgerRecord,
  getLedgerRecords,
  getMonthlyLedgerSummary,
  updateLedgerRecord,
} from "./ledger.service.js";

const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

let editingRecordId = null;

function todayValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selected(value, expected) {
  return value === expected ? "selected" : "";
}

function checked(value, expected) {
  return value === expected ? "checked" : "";
}

function renderRecordList() {
  const records = getLedgerRecords();

  if (!records.length) {
    return `
      <div class="card empty-state ledger-empty">
        <span class="placeholder-mark">＋</span>
        <h2>還沒有記帳紀錄</h2>
        <p>新增第一筆收入或支出，開始建立你的生活帳本。</p>
      </div>`;
  }

  return `
    <section class="section ledger-history">
      <div class="section-header">
        <div><p class="section-kicker">RECENT RECORDS</p><h2>最近紀錄</h2></div>
        <span>${records.length} 筆</span>
      </div>
      <div class="record-list">
        ${records
          .map(
            (record) => `
              <article class="record-card">
                <span class="record-type ${record.type}">${record.type === "income" ? "收" : "支"}</span>
                <div class="record-copy">
                  <strong>${escapeHtml(record.category)}</strong>
                  <small>${record.date}${record.note ? ` · ${escapeHtml(record.note)}` : ""}</small>
                </div>
                <div class="record-amount ${record.type}">
                  <strong>${record.type === "income" ? "+" : "−"}${currency.format(record.amount)}</strong>
                  <div class="record-actions">
                    <button type="button" data-ledger-edit="${record.id}">編輯</button>
                    <button type="button" data-ledger-delete="${record.id}">刪除</button>
                  </div>
                </div>
              </article>`,
          )
          .join("")}
      </div>
    </section>`;
}

export function renderLedger() {
  const summary = getMonthlyLedgerSummary();
  const editingRecord = editingRecordId ? getLedgerRecord(editingRecordId) : null;
  const formRecord = editingRecord ?? {
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: todayValue(),
  };

  if (editingRecordId && !editingRecord) editingRecordId = null;

  return `
    <main class="app-shell">
      <header class="page-header">
        <a class="back-button" href="/" data-route="/" aria-label="返回首頁">‹</a>
        <div><p class="eyebrow">M01</p><h1>記帳</h1></div>
      </header>

      <section class="balance-card">
        <p>本月結餘</p>
        <strong>${currency.format(summary.balance)}</strong>
        <div class="balance-grid">
          <span><small>收入</small><b>${currency.format(summary.income)}</b></span>
          <span><small>支出</small><b>${currency.format(summary.expense)}</b></span>
        </div>
      </section>

      <section class="card ledger-form-card">
        <div class="card-heading">
          <div>
            <p class="section-kicker">${editingRecord ? "EDIT RECORD" : "NEW RECORD"}</p>
            <h2>${editingRecord ? "編輯紀錄" : "新增一筆"}</h2>
          </div>
          ${editingRecord ? '<button class="text-button" type="button" data-ledger-cancel>取消</button>' : ""}
        </div>

        <form id="ledger-form" class="ledger-form">
          <div class="type-toggle" role="group" aria-label="收支類型">
            <label><input type="radio" name="type" value="expense" ${checked(formRecord.type, "expense")}><span>支出</span></label>
            <label><input type="radio" name="type" value="income" ${checked(formRecord.type, "income")}><span>收入</span></label>
          </div>

          <label class="field">
            <span>金額</span>
            <input name="amount" type="number" inputmode="numeric" min="1" step="1" value="${escapeHtml(formRecord.amount)}" placeholder="例如：120" required>
          </label>

          <div class="form-grid">
            <label class="field">
              <span>日期</span>
              <input name="date" type="date" value="${escapeHtml(formRecord.date)}" required>
            </label>
            <label class="field">
              <span>分類</span>
              <select name="category" required>
                <option value="">請選擇</option>
                <option ${selected(formRecord.category, "餐飲")}>餐飲</option>
                <option ${selected(formRecord.category, "交通")}>交通</option>
                <option ${selected(formRecord.category, "購物")}>購物</option>
                <option ${selected(formRecord.category, "生活")}>生活</option>
                <option ${selected(formRecord.category, "娛樂")}>娛樂</option>
                <option ${selected(formRecord.category, "薪資")}>薪資</option>
                <option ${selected(formRecord.category, "獎金")}>獎金</option>
                <option ${selected(formRecord.category, "其他")}>其他</option>
              </select>
            </label>
          </div>

          <label class="field">
            <span>備註</span>
            <input name="note" type="text" maxlength="60" value="${escapeHtml(formRecord.note)}" placeholder="選填">
          </label>

          <p class="form-message" data-ledger-message aria-live="polite"></p>
          <button class="primary-button ledger-submit" type="submit">${editingRecord ? "儲存修改" : "儲存紀錄"}</button>
        </form>
      </section>

      ${renderRecordList()}
      ${bottomNavigation("/ledger")}
    </main>`;
}

export function bindLedgerPage(refresh) {
  const form = document.querySelector("#ledger-form");
  const message = document.querySelector("[data-ledger-message]");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const input = {
      type: String(data.get("type")),
      amount: Number(data.get("amount")),
      category: String(data.get("category") ?? ""),
      note: String(data.get("note") ?? ""),
      date: String(data.get("date") ?? ""),
    };

    try {
      if (editingRecordId) {
        updateLedgerRecord(editingRecordId, input);
        editingRecordId = null;
      } else {
        addLedgerRecord(input);
      }
      refresh();
    } catch (error) {
      if (message) message.textContent = error instanceof Error ? error.message : "儲存失敗";
    }
  });

  document.querySelector("[data-ledger-cancel]")?.addEventListener("click", () => {
    editingRecordId = null;
    refresh();
  });

  document.querySelectorAll("[data-ledger-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      editingRecordId = button.dataset.ledgerEdit ?? null;
      refresh();
      document.querySelector("#ledger-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-ledger-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm("確定要刪除這筆紀錄嗎？")) return;
      const recordId = button.dataset.ledgerDelete ?? "";
      deleteLedgerRecord(recordId);
      if (editingRecordId === recordId) editingRecordId = null;
      refresh();
    });
  });
}
