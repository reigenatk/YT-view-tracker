# YT-view-tracker

### THE PROBLEM

![image](https://user-images.githubusercontent.com/69275171/119916296-e5820580-bf29-11eb-91d6-007b5e99a1a5.png)

_hmmmmmmmm.. this sounds like a problem for javascript..._

Everyone watches a lot of youtube. Have you ever watched a video and thought to yourself: "I've definitely seen this before, but I'm not sure when or how many times."

Well that's what my chrome extension is here to help you with! You'd think there would be a feature on youtube that lets you track this info, but right now youtube only gives you a history, no numbers!

There are a few extensions out there that help dim the youtube video if you've seen it before. Something like this below:

<img src="https://user-images.githubusercontent.com/69275171/119933691-31dd3d80-bf4a-11eb-9569-37f63d882cc9.png" width="613px"/>

But that only tells you if you've seen it before. There's no number behind how many times! My Chrome extension uses Chrome local storage system which stores directly into your hard drive to keep track of when and which videos you watch! I've enabled the "unlimitedStorage" permission for this extension so it can use up more than 10MB. If you want to know where exactly it's storing the data, the path is

```
C\Users\Your User\AppData\Local\Google\Chrome\User Data\Default\Local Storage\LevelDB
```

Don't worry about it using too much storage, I only store a few KB worth of data each time you visit a video!

Youtube's definiton of a view involves a temporal aspect (need to watch a video for a certain amount of time before it counts), as well as many ways of stopping page refreshes from abusing the view system (IP tracking, the 301 views idea, etc.) Also plenty of it is simply unknown to the public, in order to avoid view bots from being successful. I recommend [this](https://filmora.wondershare.com/youtube/how-does-youtube-count-views.html) article.

My definition is simple: I will count a page load as a "view", refreshes included. Also, all replays will be included. I think this is simple enough and will for the most part track the info that people will want to know.

Overall this was a great project to make. I've always wanted to learn how to make a Chrome Extension that would be useful to others and myself. I came away better at Javascript, which is what matters the most!
