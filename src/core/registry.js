const STORAGE_KEY = "life-os:modules";

const modules = [
  {
    id: "ledger",
    code: "M01",
    name: "記帳",
    description: "管理每日收入、支出與統計",
    icon: "帳",
    route: "/ledger",
    enabled: true,
    status: "ready",
  },
];

function readEnabledState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getModules() {
  const enabledState = readEnabledState();
  return modules.map((module) => ({
    ...module,
    enabled: enabledState[module.id] ?? module.enabled,
  }));
}

export function getEnabledModules() {
  return getModules().filter((module) => module.enabled);
}

export function setModuleEnabled(moduleId, enabled) {
  const enabledState = readEnabledState();
  enabledState[moduleId] = enabled;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledState));
}
