

on ApplicationIsRunning(appName)
	tell application "System Events" to set appNameIsRunning to exists (processes where name is appName)
	return appNameIsRunning
end ApplicationIsRunning

on IsRunning()
	return ApplicationIsRunning("Spotify")
end IsRunning

on IsPlaying()
	if ApplicationIsRunning("Spotify") then
		tell application "Spotify"
			if player state is playing then
				return true
			else if player state is paused then
				return true
			else
				return false
			end if
			
		end tell
	else
		return false
	end if
end IsPlaying

on GetCurrentTrack()
	if IsPlaying() then
		tell application "Spotify"
			set trackName to (get name of current track)
			set trackArtist to (get artist of current track)
			set trackDuration to (get duration of current track) / 1000
			set trackPosition to player position
			return "{\"name\":\"" & trackName & "\",\"artist\":\"" & trackArtist & "\",\"duration\":" & trackDuration & ",\"position\":" & trackPosition & "}"
		end tell
	else
		return "null"
	end if
end GetCurrentTrack


on run argv
	return GetCurrentTrack()
end run
