const musicHandler = {};
musicHandler.currentMusicPlayer = undefined;
musicHandler.setCurMPlayer = function (musicPlayer) {
	if (musicPlayer != musicHandler.currentMusicPlayer) {
		if (musicHandler.currentMusicPlayer) {
			musicHandler.currentMusicPlayer.audio.pause();
			musicHandler.currentMusicPlayer.stop();
		}
		musicHandler.currentMusicPlayer = musicPlayer;
	}
}

export {musicHandler};