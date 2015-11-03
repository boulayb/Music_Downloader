// ==UserScript==
// @name        Youtube Downloader Core
// @namespace   YD
// @description You wouldn't steal an album, so just download it
// @include     http://www.youtube-mp3.org/*
// @version     1
// @grant       none
// ==/UserScript==

function download()
{
  var links = document.getElementById('dl_link').getElementsByTagName('a');
  if (links.length == 0)
    setTimeout(download, 100);
  else
    {
     for (var link in links)
      {
        if (links[link].style.display == "")
          {
            links[link].click();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
      }
    }
}

download();
