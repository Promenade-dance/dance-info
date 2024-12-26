import ProgressBar from "./progressBar.mjs";
import { musicHandler} from "./musicHandler.mjs";

window.cssLoader.addCss(import.meta.resolve("./musicPlayer.css"));

export default function MusicPlayer(title, url) {
	const el = document.createElement("div");
	el.classList.add("component__MusicPlayer", "play", "hide-progress");
	el.innerHTML = `
	<svg viewBox="-11 -11 22 22" class="play-pause-button" >
		<defs>
			<g id="loader" class="loader">
				<circle r="1" fill="var(--brown)" transform="translate(0 -10)"/>
			</g>
		</defs>
		<circle r="10" fill="var(--background-color-2)"/>
		<path class="play" d="M -2 3.46 L -2 -3.46 L 4 0 Z" fill="var(--brown)" stroke="var(--brown)" stroke-width="2" stroke-linejoin="round" />
		<path class="pause" d="M -2 3.46 L -2 -3.46 M 2 3.46 L 2 -3.46" stroke="var(--brown)" stroke-width="2" stroke-linecap="round" />
		<use id="loader1" href="#loader"/>
		<use id="loader2" href="#loader"/>
		<use id="loader3" href="#loader"/>
	</svg>
	<div class="info">
		<p class="music-name">${title}</p>
	</div>`;
	el.progressBar = ProgressBar(el);
	el.querySelector("& > .info").appendChild(el.progressBar);
	el.playPauseButton = el.querySelector(".play-pause-button");
	el.state = "stop";
	el.audio = new Audio(url);
	el.audio.preload = "none";
	el.play = play;
	el.pause = pause;
	el.stop = stop;
	el.loadingOn = loadingOn;
	el.loadingOff = loadingOff;
	setEventListeners(el);
	return el;
}

function play() {
	this.state = "playing";
	this.classList.remove("hide-progress");
	this.classList.add("show-progress");
	this.classList.remove("play");
	this.classList.add("pause");
}
function pause() {
	this.state = "paused";
	this.classList.remove("pause");
	this.classList.add("play");
}
function stop() {
	this.state = "stop";
	this.classList.remove("show-progress");
	this.classList.add("hide-progress");
	this.classList.remove("pause");
	this.classList.add("play");
}
function loadingOn() {
	this.classList.add("loading");
}
function loadingOff() {
	this.classList.remove("loading");
}

function setEventListeners(el) {
	function clickPlayPause() {
		if (el.state == "playing") {
			el.audio.pause(el);
		} else {
			musicHandler.setCurMPlayer(el);
			if (el.audio.duration) {
				el.audio.currentTime = el.audio.duration * el.progressBar.progress;
			}
			el.audio.play(el);
		}
	}
	el.playPauseButton.addEventListener("click", clickPlayPause);
	el.audio.addEventListener("play", () => { el.play() });
	el.audio.addEventListener("pause", () => { el.pause() });
	el.audio.addEventListener("timeupdate", () => { if (!el.audio.paused) {el.progressBar.setProgress(el.audio.currentTime / el.audio.duration)} });
	el.audio.addEventListener("waiting", () => { el.loadingOn() });
	el.audio.addEventListener("playing", () => { el.loadingOff() });
}