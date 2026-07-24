export function createRouter(routes, onNavigate) {
  const normalize = (path) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const clean = path.startsWith(base) ? path.slice(base.length) : path;
    return clean || "/";
  };

  const render = () => {
    const path = normalize(window.location.pathname);
    const route = routes[path] || routes["/404"];
    route();
    onNavigate?.(path);
  };

  const navigate = (path) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    window.history.pushState({}, "", `${base}${path}`);
    render();
  };

  window.addEventListener("popstate", render);
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-route]");
    if (!link) return;
    event.preventDefault();
    navigate(link.dataset.route);
  });

  return { render, navigate };
}
