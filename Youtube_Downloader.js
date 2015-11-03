// ==UserScript==
// @name        Youtube Downloader
// @namespace   DL
// @description You wouldn't steal an album, so just download it.
// @include     https://www.youtube.com/watch?v=*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

// THIS SCRIPT NEED THE YOUTUBE-MP3.ORG ADDON TO RUN AND THE YOUTUBE_DOWNLOADER CORE SCRIPT
// YOU ALSO NEED TO SET THE "browser.tabs.loadDivertedInBackground" VARIABLE IN ABOUT:CONFIG TO TRUE FOR PROPER TAB OPENING

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

function download()
{
  var videoId = getId();
  window.open('http://www.youtube-mp3.org/#v_id=' + videoId);
}

function getId()
{
  var link = window.location.href;
  var id = link.split('/')[3].split('=')[1].split('?')[0];
  return (id);
}

function autoDownloadClick()
{
  var btn = document.getElementById("autoDown");
  if (GM_getValue("autoDL"))
    {
      btn.childNodes[0].style = "color: default;";
      GM_setValue("autoDL", false);
    }
  else
    { 
      btn.childNodes[0].style = "color: red;";
      GM_setValue("autoDL", true);
    }
}

function downloadBtn()
{
  var panel = document.getElementById("watch8-secondary-actions");
  var btn = document.createElement('div');
  btn.className = "yt-uix-menu";
  btn.id = "down";
  btn.innerHTML = "<button aria-controls='aria-menu-id-7' aria-labelledby='yt-uix-tooltip42-arialabel' data-tooltip-text='Download' class='yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-trigger yt-uix-tooltip yt-uix-menu-trigger-selected yt-uix-button-toggled' type='button' title='Download' role='button' aria-pressed='false' aria-haspopup='true'><span class='yt-uix-button-content'>Download</span></button>";
  panel.appendChild(btn);
  btn.onclick = download;
}

function autoDownload()
{
  document.querySelector('video').removeEventListener('ended', autoDownload);
  if (GM_getValue("autoDL"))
    download();
  document.querySelector('video').addEventListener('ended', autoDownload);
}

function autoBtn()
{
  if (GM_getValue("autoDL"))
    var color = 'color: red';
  else
    var color = 'color: default';
  var panel = document.getElementById("watch8-secondary-actions");
  var btn = document.createElement('div');
  btn.className = "yt-uix-menu";
  btn.id = "autoDown";
  btn.innerHTML = "<button aria-controls='aria-menu-id-7' aria-labelledby='yt-uix-tooltip42-arialabel' data-tooltip-text='Auto Download' class='yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-trigger yt-uix-tooltip yt-uix-menu-trigger-selected yt-uix-button-toggled' type='button' title='Auto Download' role='button' aria-pressed='false' aria-haspopup='true'><span class='yt-uix-button-content'>Auto DL</span></button>";
  btn.childNodes[0].style = color;
  panel.appendChild(btn);
  btn.onclick = autoDownloadClick;
  document.querySelector('video').addEventListener('ended', autoDownload);
}

function addBtn()
{
  var down = document.getElementById('down');
  var auto = document.getElementById('autoDown');
  if (down != undefined)
    down.remove();
  if (auto != undefined)
    auto.remove();
  downloadBtn();
  autoBtn();
}

function startObserver()
{
  var observer = new MutationObserver(Plug);
  var config = { attributes: true, childList: true, characterData: true, subtree: true };
  var target = document.getElementById('eow-title');
  observer.observe(target, config);
}

function removeYTMP3()
{
  var btn = document.getElementById("ytmp3_row");
  if (btn != undefined)
    btn.style = "display: none;";
}

function Plug()
{
   if (document.getElementById("watch8-secondary-actions") != null)
     {
        window.onresize = addBtn;
        addBtn();
        setTimeout(removeYTMP3, 1000);
        startObserver();
     }
}

setTimeout(Plug, 1000);

document.addEventListener('DOMNodeInserted', function (event) {
  if (document.getElementById('down') == undefined && 
      document.getElementById('autoDown') == undefined)
  {
    document = event.currentTarget;
    Plug();
  }
}, false);
