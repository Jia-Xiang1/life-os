import { createRouter } from "./router.js";
import { renderDashboard } from "../system/dashboard/dashboard.js";
import { renderSettings } from "../system/settings/settings.js";
import { bindLedgerPage, renderLedger } from "../modules/ledger/index.js";

export function createApp(root) {
  if (!root) throw new Error("找不到 #app 容器");

  const renderPage = (renderer, binder) => () => {
    const refresh = () => {
      root.innerHTML = renderer();
      bindModuleToggles();
      binder?.(refresh);
    };

    refresh();
  };

  const router = createRouter(
    {
      "/": renderPage(renderDashboard),
      "/settings": renderPage(renderSettings),
      "/ledger": renderPage(renderLedger, bindLedgerPage),
      "/404": () => {
        root.innerHTML = `
          <main class="app-shell">
            <section class="card empty-state">
              <span class="empty-code">404</span>
              <h1>找不到頁面</h1>
              <a class="primary-button" href="/" data-route="/">返回首頁</a>
            </section>
          </main>`;
      },
    },
    () => window.scrollTo({ top: 0, behavior: "instant" }),
  );

  function bindModuleToggles() {
    document.querySelectorAll("[data-module-toggle]").forEach((input) => {
      input.addEventListener("change", async (event) => {
        const { setModuleEnabled } = await import("./registry.js");
        setModuleEnabled(event.target.dataset.moduleToggle, event.target.checked);
      });
    });
  }

  router.render();
}
