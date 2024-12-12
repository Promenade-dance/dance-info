// import {MusicItem} from "./music_handler.mjs";
import Details from "./components/details/details.mjs";
import MusicPlayer from "./components/music/musicPlayer.mjs";
import VideoLink from "./components/video/videoLink.mjs";

export default function getDanceCard(obj) {
	let res = document.createDocumentFragment();
	let part;
	if ("title" in obj) {
		part = document.createElement("h1");
		part.setAttribute("id", "title");
		part.innerHTML = obj["title"];
		res.append(part);
	}
	if ("comment" in obj) {
		part = document.createElement("div");
		part.setAttribute("id", "comment");
		part.innerHTML = obj["comment"];
		res.append(part);
	}
	if ("scheme_short" in obj) {
		part = Details("Схема (кратко)", obj["scheme_short"], "scheme-short");
		res.append(part);
	}
	if ("scheme_long" in obj) {
		let part = Details("Схема (подробно)", obj["scheme_long"], "scheme-long");
		res.append(part);
	}
	if ("music" in obj) {
		part = Details("Музыка", "", "music");
		obj["music"].forEach((m) => {
			part.contentElement.appendChild(MusicPlayer(m["title"], m["url"]));
		});
		res.append(part);
	}
	if ("video" in obj) {
		part = Details("Видео", "", "video");
		obj["video"].forEach((v) => {
			part.contentElement.appendChild(VideoLink(v["url"], v["text"], v["source"]));
		});
		res.append(part);
	}
	return res;
}