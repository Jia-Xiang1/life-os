import { getEnabledModules } from "../../core/registry.js";

function todayLabel() {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

export function renderDashboard() {
  const modules = getEnabledModules();

  return `
    <main class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">PERSONAL LIFE PLATFORM</p>
          <h1>Life OS</h1>
        </div>
        <span class="version-pill">V1 · Build 02</span>
      </header>

      <section class="welcome-card">
        <p class="date-label">${todayLabel()}</p>
        <h2>讓今天的每一步，成為未來的秩序。</h2>
        <p>從一個簡單的記錄開始，逐步建立屬於你的生活系統。</p>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <p class="section-kicker">YOUR MODULES</p>
            <h2>我的模組</h2>
          </div>
          <span>${modules.length} 個啟用</span>
        </div>

        <div class="module-grid">
          ${modules.length
            ? modules.map((module) => `
              <a class="module-card" href="${module.route}" data-route="${module.route}">
                <span class="module-icon">${module.icon}</span>
                <span class="module-copy">
                  <strong>${module.name}</strong>
                  <small>${module.description}</small>
                </span>
                <span class="module-arrow">›</span>
              </a>`).join("")
            : `<div class="card empty-state"><p>目前沒有啟用中的模組。</p></div>`}
        </div>
      </section>

      ${bottomNavigation("/")}
    </main>`;
}

export function bottomNavigation(activeRoute) {
  return `
    <nav class="bottom-nav" aria-label="主要導覽">
      <a class="nav-item ${activeRoute === "/" ? "active" : ""}" href="/" data-route="/">
        <span>⌂</span><small>首頁</small>
      </a>
      <a class="nav-item ${activeRoute === "/ledger" ? "active" : ""}" href="/ledger" data-route="/ledger">
        <span>¥</span><small>記帳</small>
      </a>
      <a class="nav-item ${activeRoute === "/settings" ? "active" : ""}" href="/settings" data-route="/settings">
        <span>⚙</span><small>設定</small>
      </a>
    </nav>`;
}
