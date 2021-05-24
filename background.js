// background script always running

window.videos = {}

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.type == "add-view") {
        if (req.url in window.videos) {
            window.videos[req.url].views = window.videos[req.url].views + 1;
            window.videos[req.url].dates.append(req.date);
        }
        else {
            window.videos[req.url] = {
                title: req.title,
                views: 1,
                dates: [req.date]
            }
        }
        
        
        sendResponse({views: window.videos[req.url].views})
    }
    

})
