console.log("trackedInfo");

colorPairs = {
  // key is bg color, val is color of video text
  "#FE654F": "#FED18C",
  "#270722": "#9AC2C5",
  "#282B28": "#D36135",
  "#CE4760": "#DDF093",
  "#664147": "#E5F9E0",
  "#4C3B4D": "#C9EDDC",
  "#89937C": "#69385C",
  "#D1BCE3": "#19297C",
  "#A63D40": "#90A959",
  "#F7A072": "#A31621",
  "#84DCCF": "#312F2F",
  "#F6AE2D": "#758E4F",
  "#938BA1": "#D5A021",
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let rollRandomColorPair = () => {
  let val = getRandomInt(Object.keys(colorPairs).length);
  // console.log(Object.values(colorPairs)[val]);
  return [Object.keys(colorPairs)[val], Object.values(colorPairs)[val]];
};

document.addEventListener("DOMContentLoaded", function () {
  const bg = chrome.extension.getBackgroundPage();
  let parent_div = document.querySelector(".all-videos");
  // every reload let's query the storage for what to displayt
  parent_div.innerHTML = "";

  let keysToValues = [];
  Object.keys(bg.videos).forEach((url) => {
    keysToValues.push({ name: url, value: bg.videos[url].views });
  });

  function custom_compare(a, b) {
    // sorted by values nonincreasing
    return a.value - b.value;
  }

  keysToValues.sort(custom_compare).reverse();

  for (let i = 0; i < keysToValues.length; i++) {
    let url = keysToValues[i].name;
    // console.log(url);
    const div = document.createElement("div");
    div.classList.add("video");

    var videolink = document.createElement("a");
    videolink.href = url;
    var thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail-img");

    // id of a youtube video always after the ?v= part
    let video_id = url.split("?v=")[1].substr(0, 11);
    thumbnail.src = "https://img.youtube.com/vi/" + video_id + "/mqdefault.jpg";

    // console.log(thumbnail.src);

    videolink.appendChild(thumbnail);
    div.appendChild(videolink);
    let text = document.createElement("h1");
    text.innerHTML = `${bg.videos[url].title}`;
    div.appendChild(text);

    let viewText = document.createElement("h2");
    viewText.innerHTML = `Views: ${bg.videos[url].views}`;
    div.appendChild(viewText);
    parent_div.appendChild(div);

    // dropdown dates using bootstrap
    // reference:
    // <div class="dropdown">
    //   <button class="dropbtn">Dropdown</button>
    //   <div class="dropdown-content">
    //     <a href="#">Link 1</a>
    //     <a href="#">Link 2</a>
    //     <a href="#">Link 3</a>
    //   </div>
    // </div>
    let dropdownDiv = document.createElement("div");
    dropdownDiv.classList.add("dropdown");

    let dropdownButton = document.createElement("button");
    dropdownButton.innerText = "Dates viewed";
    dropdownButton.classList.add("dropbtn");
    dropdownDiv.appendChild(dropdownButton);

    let dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdown-content");

    let dates = bg.videos[url].dates; // an array of strings
    // console.log(dates);
    // we need to display the dates now
    dates.forEach((date) => {
      // console.log(date);
      let a = document.createElement("a");
      a.innerText = date;
      a.style.color = "white";
      dropdownContent.appendChild(a);
    });

    dropdownDiv.appendChild(dropdownContent);
    div.appendChild(dropdownDiv);

    // let's roll a random color scheme
    [div.style.backgroundColor, text.style.color] = rollRandomColorPair();
  }

  chrome.runtime.sendMessage({ type: "getDataSize" }, (res) => {
    let spaceTaken = res.spaceTaken; // in KB
    if (spaceTaken > 1024) {
      // MB
      spaceTaken = spaceTaken / 1024;
      spaceTaken = spaceTaken.toFixed(2);
      document.querySelector("#reset").innerText += " (" + spaceTaken + " MB)";
    } else {
      document.querySelector("#reset").innerText += " (" + spaceTaken + " KB)";
    }
  });

  document.querySelector("#reset").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "reset" });
    // console.log("reset signal sent");
    alert("Data cleared from local storage! Refresh to see changes");
  });

  document.querySelector("#yt_toggle").addEventListener("click", () => {
    alert("Feature coming soon...");
    // chrome.runtime.sendMessage({ type: "toggleYTEnable" }, (res) => {
    //   if (res.enabled === false) {
    //     alert("Now hiding add ons on Youtube site");
    //   } else {
    //     alert("Now showing add ons on Youtube site");
    //   }
    // });
  });

  // document.querySelector("#getData").addEventListener("click", () => {
  //   chrome.runtime.sendMessage({ type: "getData" });
  // });
});
