if (performance.navigation.type == 1) {
  chrome.runtime.sendMessage({ type: "pageRefreshed" });
}
