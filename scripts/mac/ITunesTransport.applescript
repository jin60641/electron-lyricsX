

on ApplicationIsRunning(appName)
	tell application "System Events" to set appNameIsRunning to exists (processes where name is appName)
	return appNameIsRunning
end ApplicationIsRunning

on IsRunning()
	return ApplicationIsRunning("Music")
end IsRunning

on IsPlaying()
	if ApplicationIsRunning("Music") then
		tell application "Music"
			return player state is playing
		end tell
	else
		return false
	end if
end IsPlaying

on GetCurrentTrack()
	if IsPlaying() then
		tell application "Music"
			if not (exists current track) then return null
			set trackName to (get name of current track)
			set trackArtist to (get artist of current track)
			set trackDuration to (get duration of current track)
			return "{\"name\":\"" & trackName & "\",\"artist\":\"" & trackArtist & "\",\"duration\":" & trackDuration & ",\"position\":" & player position & "}"
		end tell
	else
		return "null"
	end if
end GetCurrentTrack


on run argv
	return GetCurrentTrack()
end run