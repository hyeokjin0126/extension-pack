let formId

// message
chrome.runtime.onMessage.addListener(async function (req, sender, sendResponse) {
    if(req.to != "form"){ return }

    formId = req.formId
});

// create Tab
async function createTab(url, message, sleep=5000) {
    const newTab = await chrome.tabs.create({ url, active: false });
    const listener = async function(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            await new Promise(r => setTimeout(r, sleep));
            chrome.tabs.sendMessage(newTab.id, message);
        }
    };
    chrome.tabs.onUpdated.addListener(listener);
}