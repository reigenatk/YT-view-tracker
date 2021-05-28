
<div align="center">
<h1 align="center">THE PROBLEM</h1>
<img src="https://user-images.githubusercontent.com/69275171/119916296-e5820580-bf29-11eb-91d6-007b5e99a1a5.png"/>
</div>

<h2 align="center">WHAT DID I DO?</h2>
<br>

Everyone watches a lot of youtube. Have you ever watched a video and thought to yourself: "I've definitely seen this before, but I'm not sure when or how many times." 

Well that's what my chrome extension is here to help you with! You'd think there would be a feature on youtube that lets you track this info, but right now youtube only gives you a history, no numbers! 

There are a few extensions out there that help dim the youtube video if you've seen it before. Something like this below:

<div align="center">
<img src="https://user-images.githubusercontent.com/69275171/119933691-31dd3d80-bf4a-11eb-9569-37f63d882cc9.png" width="613px"/>
</div>
<br>
But that only tells you if you've seen it before. There's no number behind how many times! My Chrome extension uses Chrome local storage system which stores directly into your hard drive to keep track of when and which videos you watch! Furthermore, there is an interactive site that shows your all time most watched videos along with how much storage it is taking up on your hard drive.

![image](https://user-images.githubusercontent.com/69275171/120036581-faac7200-bfc5-11eb-99b9-de78b4195978.png)

You can also see exactly how many views you've done on a certain video as it is right next to the number of total views:

![image](https://user-images.githubusercontent.com/69275171/120036843-5840be80-bfc6-11eb-803d-484ea86f9778.png)

If you want to, the local storage stores into this path on Windows

```
C\Users\Your User\AppData\Local\Google\Chrome\User Data\Default\Local Storage\LevelDB
```

Don't worry about it using too much storage, I only store a few KB worth of data each time you visit a video!

<h2 align="center">DEFINITIONS</h2>

Youtube's definiton of a view involves a temporal aspect (need to watch a video for a certain amount of time before it counts), as well as many ways of stopping page refreshes from abusing the view system (IP tracking, the 301 views idea, etc.) Also plenty of it is simply unknown to the public, in order to avoid view bots from being successful. I recommend [this](https://filmora.wondershare.com/youtube/how-does-youtube-count-views.html) article.

My definition is simple: I will count a page load as a "view", refreshes included. Also, all replays will be included. I think this is simple enough and will for the most part track the info that people will want to know.

Overall this was a great project to make. I've always wanted to learn how to make a Chrome Extension that would be useful to others and myself. I came away better at Javascript, which is what matters the most!
