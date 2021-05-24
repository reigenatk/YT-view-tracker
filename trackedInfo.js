document.addEventListener("DOMContentLoaded", function() {
    const bg = chrome.extension.getBackgroundPage();
    Object.keys(bg.videos).forEach(function (url) {
        const div = document.createElement('div')
        div.textContent = `${bg.videos[url].title}: ${bg.videos[url].views}`
        document.body.appendChild(div);
    })
})