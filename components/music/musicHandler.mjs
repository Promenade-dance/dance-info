class MusicItem {
	url;
	blob;

	constructor(url) {
		this.url = url;
		this.blob = undefined;
	}

	async getBlob() {
		if (this.blob == undefined) {
			return fetch("audio/" + this.url).then(res => res.blob()).then(blob => this.blob = blob);
		} else {
			return Promise.resolve(this.blob);
		}
	}
}

const musicHandler = {};
musicHandler.audio = new Audio();
musicHandler.currentMusicPlayer = undefined;
function updateProgress() {
	if (musicHandler.audio.paused) {
		musicHandler.currentMusicPlayer.pause();
	} else {
		musicHandler.currentMusicPlayer.progressBar.setProgress(musicHandler.audio.currentTime / musicHandler.audio.duration);
		window.requestAnimationFrame(updateProgress);
	}
}
musicHandler.play = function (musicPlayer) {
	if (this.currentMusicPlayer == musicPlayer) {
		this.audio.currentTime = this.audio.duration * musicPlayer.progressBar.progress;
		this.audio.play();
		this.currentMusicPlayer.play();
	} else {
		if (this.currentMusicPlayer) {
			this.currentMusicPlayer.stop();
		}
		this.currentMusicPlayer = musicPlayer;
		musicPlayer.play();
		musicPlayer.musicItem.getBlob().then((blob) => {
			this.audio.src = URL.createObjectURL(blob);
			this.audio.play();
		});
	}
	window.requestAnimationFrame(updateProgress);
}
musicHandler.pause = function (musicPlayer) {
	if (this.currentMusicPlayer == musicPlayer) {
		this.audio.pause();
		this.currentMusicPlayer.pause();
	}
}

export {musicHandler, MusicItem};