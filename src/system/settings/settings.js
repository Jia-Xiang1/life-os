import { getModules } from "../../core/registry.js";
import { bottomNavigation } from "../dashboard/dashboard.js";

export function renderSettings() {
  return `
    <main class="app-shell">
      <header class="page-header">
        <a class="back-button" href="/" data-route="/" aria-label="返回首頁">‹</a>
        <div><p class="eyebrow">SYSTEM</p><h1>設定</h1></div>
      </header>

      <section class="card settings-card">
        <div class="card-heading">
          <div><p class="section-kicker">MODULE MANAGER</p><h2>模組管理</h2></div>
        </div>
        ${getModules().map((module) => `
          <label class="setting-row">
            <span class="setting-icon">${module.icon}</span>
            <span class="setting-copy">
              <strong>${module.name}</strong>
              <small>${module.code} · ${module.description}</small>
            </span>
            <input class="switch" type="checkbox" data-module-toggle="${module.id}" ${module.enabled ? "checked" : ""} />
          </label>`).join("")}
      </section>

      <section class="card settings-card">
        <div class="info-row"><span>主題</span><strong>Warm Japan</strong></div>
        <div class="info-row"><span>版本</span><strong>F0</strong></div>
        <div class="info-row"><span>Build</span><strong>02</strong></div>
      </section>

      ${bottomNavigation("/settings")}
    </main>`;
}
