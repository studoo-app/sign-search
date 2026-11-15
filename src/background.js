// Service worker : relaie le clic sur l'icône et le raccourci clavier
// vers le script injecté dans l'onglet sign.com.

const SIGN_URL = /^https:\/\/sign\.com\//;

async function toggle(tab) {
  if (!tab || !tab.id) return;
  if (!SIGN_URL.test(tab.url || "")) {
    await chrome.tabs.create({ url: "https://sign.com/storage/all-documents" });
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "signsearch:toggle" });
  } catch (e) {
    // Le script n'est pas encore chargé (onglet ouvert avant l'installation).
    await chrome.tabs.reload(tab.id);
  }
}

chrome.action.onClicked.addListener(toggle);

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-panel") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  toggle(tab);
});
