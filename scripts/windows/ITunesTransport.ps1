 $itunes = New-Object  -ComObject iTunes.Application

if (!$itunes) {
    return "null";
}

if (!$itunes.CurrentTrack) {
    return "null";
}

$trackName = $itunes.CurrentTrack.name;
$trackArtist = $itunes.CurrentTrack.artist;
$trackDuration = $itunes.CurrentTrack.duration;
$trackPosition = $itunes.PlayerPosition;

return "{`"name`":`"$trackName`",`"artist`":`"$trackArtist`",`"duration`":$trackDuration,`"position`":$trackPosition}"
