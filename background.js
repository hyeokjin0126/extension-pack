let contentId
function chromeMessage(message){ chrome.notifications.create({ type: "basic", iconUrl: "NB.png", title: "Shopic", message}) }


// 우클릭 메뉴
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "injectOpen", title: "NaverBest 수집", contexts: ["all"] });
});

// 우클릭 메뉴 event
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    chrome.tabs.get(tab.id, async (tabInfo) => {
        if(tabInfo.status != 'complete') { return chromeMessage("탭이 로딩된 후 시도해주세요.") };
        if(info.menuItemId === "injectOpen"){ contentId = tab.id; chrome.tabs.sendMessage(tab.id, { to: "content", type:"injectOpen" }) }
    })
})



// message
chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
    if(req.to != "background"){ return }
    if(!contentId || contentId != sender.tab.id){ return } // contnet 중복 차단
})


// formOpen
async function formOpen(message){
    const {id:formId} = await chrome.tabs.create({ url: "/form/form.html", active: true });
    chrome.tabs.onUpdated.addListener(function listener(id, changeInfo) {
        if (id === formId && changeInfo.status === "complete") {
            chrome.tabs.sendMessage(formId, Object.assign(message, {to: "form", formId}));
            chrome.tabs.onUpdated.removeListener(listener);
        }
    });
}