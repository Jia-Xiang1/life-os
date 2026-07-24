import "./styles/base.css";
import "./styles/components.css";
import "./themes/warm-japan.css";

const app = document.querySelector("#app");

const state = {
  version: "F0",
  build: "Build 01",
  modules: [
    {
      id: "M01",
      name: "記帳",
      description: "收入、支出與統計管理",
      icon: "📒",
      enabled: true,
      status: "coming-soon",
    },
  ],
};

function renderDashboard() {
  const enabledModules = state.modules.filter((module) => module.enabled);

  app.innerHTML = `
    <main class="app-shell">
      <section class="hero-card">
        <p class="eyebrow">Personal Life Platform</p>
        <h1>Life OS</h1>
        <p class="subtitle">今天做的每一個決定，都要讓未來的自己更輕鬆。</p>
        <div class="version-pill">${state.version} · ${state.build}</div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2>模組</h2>
          <span>${enabledModules.length} enabled</span>
        </div>

        <div class="module-grid">
          ${enabledModules
            .map(
              (module) => `
                <article class="module-card">
                  <div class="module-icon">${module.icon}</div>
                  <div>
                    <h3>${module.name}</h3>
                    <p>${module.description}</p>
                    <small>準備於 V1 啟用</small>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <nav class="bottom-nav">
        <button class="nav-item active" data-page="dashboard">首頁</button>
        <button class="nav-item" data-page="settings">設定</button>
      </nav>
    </main>
  `;

  bindNavigation();
}

function renderSettings() {
  app.innerHTML = `
    <main class="app-shell">
      <section class="page-header">
        <h1>設定</h1>
        <p>管理 Life OS 的基礎設定。</p>
      </section>

      <section class="card">
        <h2>模組管理</h2>
        ${state.modules
          .map(
            (module) => `
              <label class="setting-row">
                <span>
                  <strong>${module.icon} ${module.name}</strong>
                  <small>${module.id}</small>
                </span>
                <input type="checkbox" data-module-id="${module.id}" ${
              module.enabled ? "checked" : ""
            } />
              </label>
            `
          )
          .join("")}
      </section>

      <section class="card">
        <h2>系統資訊</h2>
        <p>Version：${state.version}</p>
        <p>Build：${state.build}</p>
        <p>Theme：Warm Japan</p>
      </section>

      <nav class="bottom-nav">
        <button class="nav-item" data-page="dashboard">首頁</button>
        <button class="nav-item active" data-page="settings">設定</button>
      </nav>
    </main>
  `;

  document.querySelectorAll("[data-module-id]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const moduleId = event.target.dataset.moduleId;
      const targetModule = state.modules.find((module) => module.id === moduleId);
      targetModule.enabled = event.target.checked;
    });
  });

  bindNavigation();
}

function bindNavigation() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.dataset.page;
      if (page === "dashboard") renderDashboard();
      if (page === "settings") renderSettings();
    });
  });
}

renderDashboard();