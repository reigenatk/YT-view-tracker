// content script runs whenever we have a match

let views_by_you = document.getElementsByClassName('view-count style-scope ytd-video-view-count-renderer')[0].innerHTML;
let videoTitle = document.getElementsByClassName('title style-scope ytd-video-primary-info-renderer')[0].innerText;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


let addView = (() => {
    alert('view added');
    const d = new Date();
    let dateString = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 
    + monthNames[d.getMonth()] + " " + d.getDay() + ", " + d.getFullYear();
    
    chrome.runtime.sendMessage({type: "add-view", url: window.location.href, title: videoTitle, date: dateString}, (response) => {
        let updated_num_of_views = response.views;
        views_by_you += ", " + updated_num_of_views + " views by you";
        alert("updated UI");
    });
})();

let play_button = document.getElementsByClassName('ytp-play-button ytp-button');

play_button.addEventListener('click', checkIfReplay);
let checkIfReplay = () => {
    let title = play_button.getAttribute('title');
    if (title == "Replay") {
        // this counts as a view 
        addView();
    }
}

