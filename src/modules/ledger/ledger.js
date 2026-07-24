import { bottomNavigation } from "../../system/dashboard/dashboard.js";

export function renderLedger() {
  return `
    <main class="app-shell">
      <header class="page-header">
        <a class="back-button" href="/" data-route="/" aria-label="返回首頁">‹</a>
        <div><p class="eyebrow">M01</p><h1>記帳</h1></div>
      </header>

      <section class="balance-card">
        <p>本月結餘</p>
        <strong>NT$ 0</strong>
        <div class="balance-grid">
          <span><small>收入</small><b>NT$ 0</b></span>
          <span><small>支出</small><b>NT$ 0</b></span>
        </div>
      </section>

      <section class="card empty-state ledger-placeholder">
        <span class="placeholder-mark">＋</span>
        <h2>記帳模組已接入</h2>
        <p>下一個 Build 將加入新增收入、支出與本機儲存。</p>
        <button class="primary-button" type="button" disabled>新增一筆</button>
      </section>

      ${bottomNavigation("/ledger")}
    </main>`;
}
