moruna["injectEvent"] = async function(){
    moruna["inject"] = document.querySelector("#moruna")

    moruna["inject"].querySelector("#close").addEventListener("click", moruna["injectClose"]) // injectClose
    moruna["inject"].querySelector("#resize-bar").onmousedown = moruna["injectMove"]; // injectMove
    moruna["inject"].querySelector("#naver-search").addEventListener("click", moruna["naverSearch"]) // naverSearch
}



// inject 열기
moruna["injectOpen"] = async function(){
    // inject 있으면 삭제
    if(document.querySelector("#moruna")){ return moruna["injectClose"]() }
    // inject 없으면 추가
    document.head.appendChild(Object.assign(document.createElement("link"),{ rel: "stylesheet", type: "text/css", href: chrome.runtime.getURL("/inject/inject.css") }));
    document.body.appendChild(new DOMParser().parseFromString(await(await fetch(chrome.runtime.getURL("/inject/inject.html"))).text(), 'text/html').querySelector("#moruna") );
    
    moruna["injectEvent"]()
}

// inject 닫기
moruna["injectClose"] = async function(){
    moruna["inject"]?.replaceWith(moruna.inject.cloneNode(true));
    document.querySelector("#moruna").remove();
    document.querySelector('link[href*="inject.css"]')?.remove();
    document.body.style.setProperty("margin-right", "0px", "important");
}

// inject 확대/축소
moruna["injectMove"] = async function(e){
    e.preventDefault();
    const move = e => { const w = Math.min(Math.max(window.innerWidth - e.clientX, 300), window.innerWidth * 0.25); Object.assign(moruna.inject.style, { width: w + "px" }); document.body.style.setProperty("margin-right", w + "px", "important") };
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up) }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
}



// naverSearch
moruna["naverSearch"] = async function(){
    const naverKeyword = moruna["inject"].querySelector("#naver-keyword").value
    if(!naverKeyword){ return alert("키워드를 입력하세요.") }

    chrome.runtime.sendMessage({ to: "background", type: "naverSearch", naverKeyword });
}