const moruna = {}

chrome.runtime.onMessage.addListener(async function (req, sender, sendResponse) {
    if(req.to != "content"){ return }
    if(req.type == "injectOpen"){ moruna["injectOpen"](); } // injectOpen
});