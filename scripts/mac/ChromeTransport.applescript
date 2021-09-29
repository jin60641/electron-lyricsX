on ApplicationIsRunning(appName)
	tell application "System Events" to set appNameIsRunning to exists (processes where name is appName)
	return appNameIsRunning
end ApplicationIsRunning


on GetCurrentTrack()
	if ApplicationIsRunning("Google Chrome") then
		tell application "Google Chrome"
			set a to "null"
			set youtubeTabsRef to a reference to (tabs of windows whose URL contains "youtube.com/watch")
			repeat with youtubeTabs in youtubeTabsRef
				
				set a to execute youtubeTabs javascript "
					function getData() {
						try {
							const video = document.querySelector('#movie_player > div.html5-video-container > video');
				   			if (!video) { return 'null'; }
							const name = document.querySelector('#container > h1').innerText;
							const { currentTime: position, duration } = video;
					  		return JSON.stringify({ name, duration, position });
						} catch (e) {
							return JSON.stringify(e.message);
						}
					}
					getData();
				"
				exit repeat
			end repeat
			return a
		end tell
	else
		return "null"
	end if
end GetCurrentTrack

on run
	return GetCurrentTrack()
end run