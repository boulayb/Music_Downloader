// ==UserScript==
// @name        DubTrack Downloader
// @namespace   DL
// @description Plug it back !
// @include     https://www.dubtrack.fm/join/*
// @include     https://www.youtube.com/embed/*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// ==/UserScript==

var autoDL = false;
var autoDLObserver;
autoDLObserver = new MutationObserver(download);

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

function download(videoId)
{
  if (videoId == undefined || typeof(videoId) != "string")
    videoId = GM_getValue("id");
  if (videoId != undefined)
    window.open('http://www.youtube-mp3.org/#v_id=' + videoId);
}

function getId()
{
  var link = document.getElementsByClassName('ytp-watermark')[0].getAttribute('href');
  var id = link.split('/')[3].split('=')[1].split('?')[0];
  GM_setValue("id", id);
}

function autoDownload()
{
  var btn = document.getElementById("autoDown");
  var target = document.getElementsByClassName('currentSong')[0];
  var config = { attributes: false, childList: true, characterData: true, subtree: true };
  if (autoDL)
    {
      btn.style = "color: #FFF";
      autoDLObserver.disconnect();
      autoDL = false;
    }
  else
    { 
      btn.style = "color: #0FF";
      autoDLObserver.observe(target, config);
      autoDL = true;
    }
}

function downloadBtn()
{
  var panel = document.getElementsByClassName("player-controller-container")[0];
  var btn = document.createElement('span');
  btn.className = "icon-createplaylist";
  btn.id = "down";
  panel.appendChild(btn);
  btn.onclick = download;
}

function autoBtn()
{
  if (autoDL)
    var color = 'color: #0FF';
  else
    var color = 'color: #FFF';
  var bar = document.getElementsByClassName("player-controller-container")[0];
  var btn = document.createElement('span');
  btn.id = "autoDown";
  btn.className = "icon-play";
  btn.style = color;
  bar.appendChild(btn);
  btn.onclick = autoDownload;
}

function startObserver()
{
  var observer = new MutationObserver(Plug);
  var config = { attributes: true, childList: true, characterData: true, subtree: true };
  var target = document.getElementById('room-main-player-container');
  observer.observe(target, config);
}

function embeded()
{
  var observer = new MutationObserver(getId);
  var config = { attributes: true, childList: true, characterData: true, subtree: true };
  var target = document.getElementsByClassName('video-stream')[0];
  observer.observe(target, config);
  getId();
}

function Plug()
{
  console.log("test");
  if (document.getElementById("room-main-player-container-youtube").childNodes.length < 1)
    setTimeout(Plug, 100);
  else
    {
      var down = document.getElementById('down');
      var auto = document.getElementById('autoDown');
      if (down != undefined)
        down.remove();
      if (auto != undefined)
        auto.remove();
      window.onresize = Plug;
      downloadBtn();
      autoBtn();
    }
}

GM_deleteValue("id");

if (window.location.href.indexOf("https://www.youtube.com/embed/") > -1)
  setTimeout(embeded, 1000);
else
  {
    setTimeout(Plug, 1000);
    setTimeout(startObserver, 3000);
  }
