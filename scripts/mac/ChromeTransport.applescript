on ApplicationIsRunning(appName)
	tell application "System Events" to set appNameIsRunning to exists (processes where name is appName)
	return appNameIsRunning
end ApplicationIsRunning


on GetCurrentTrack()
	if ApplicationIsRunning("Google Chrome") then
		tell application "Google Chrome"
			set ret to "null"
			set a to "null"
			set youtubeTabsRef to a reference to (tabs of windows whose URL contains "youtube.com/watch")
			repeat with youtubeTabs in youtubeTabsRef
				set a to execute youtubeTabs javascript "
          function getData() {
            try {
              // youtube
              const video = document.querySelector('#movie_player > div.html5-video-container > video');
               if (!video) {
                return 'null';
              }
              const name = document.querySelector('#container > h1')?.innerText?.replace(/\\(official (audio|video|MV)\\)/i,'');
              const { currentTime: position, duration } = video;
              return JSON.stringify({ name, duration, position });
            } catch (e) {
              return 'null';
            }
          }
          getData();
        "
				if a is not equal to "null" then
					set ret to a
					exit repeat
				end if
			end repeat
			set youtubeMusicTabsRef to a reference to (tabs of windows whose URL contains "music.youtube.com")
			repeat with youtubeMusicTabs in youtubeMusicTabsRef
				set a to execute youtubeMusicTabs javascript "
          function getData() {
            try {
              const ytmusic = document.querySelector('.ytmusic-app');
              const video = document.querySelector('video.video-stream.html5-main-video');
               if (!ytmusic || !video) {
                return 'null';
              }
              const artist = document.querySelector('.ytmusic-player-bar .subtitle a:nth-child(1)').innerText;
              const name = document.querySelector('.ytmusic-player-bar yt-formatted-string').innerText;
              const { currentTime: position, duration } = video;
              return JSON.stringify({ name, artist, duration, position });
            } catch (e) {
						  console.log(e);

              return 'null';
            }
          }
          getData();
        "
				if a is not equal to "null" then
					set ret to a
					exit repeat
				end if
			end repeat
			log a
			log ret
			return ret
		end tell
	else
		return "null"
	end if
end GetCurrentTrack

on run
	return GetCurrentTrack()
end run
