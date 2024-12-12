import ProgressBar from "./progressBar.mjs";
import { musicHandler, MusicItem } from "./musicHandler.mjs";

window.cssLoader.addCss(import.meta.resolve("./musicPlayer.css"));

export default function MusicPlayer(title, url) {
	const el = document.createElement("div");
	el.classList.add("component__MusicPlayer", "play", "hide-progress");
	el.innerHTML = `
	<svg viewBox="-10 -10 20 20" class="play-pause-button">
		<circle r="10" fill="#ffddb3"/>
		<path class="play" d="M -2 3.46 L -2 -3.46 L 4 0 Z" fill="#b9663a" stroke="#b9663a" stroke-width="2" stroke-linejoin="round" />
		<path class="pause" d="M -2 3.46 L -2 -3.46 M 2 3.46 L 2 -3.46" stroke="#b9663a" stroke-width="2" stroke-linecap="round" />
	</svg>
	<div class="info">
		<p class="music-name">${title}</p>
	</div>`;
	el.progressBar = ProgressBar(el);
	el.querySelector("& > .info").appendChild(el.progressBar);
	el.playPauseButton = el.querySelector(".play-pause-button");
	el.state = "stop";
	el.musicItem = new MusicItem(url);
	el.play = play;
	el.pause = pause;
	el.stop = stop;
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
	this.classList.remove("hide-progress");
	this.classList.add("show-progress");
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

function setEventListeners(el) {
	function clickPlayPause() {
		if (el.state == "playing") {
			musicHandler.pause(el);
		} else {
			musicHandler.play(el);
		}
	}
	el.playPauseButton.addEventListener("click", clickPlayPause);
}