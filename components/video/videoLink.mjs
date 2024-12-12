window.cssLoader.addCss(import.meta.resolve("./videoLink.css"));

export default function VideoLink(url, text, source) {
	const el = document.createElement("div");
	el.classList.add("component__VideoLink");
	let res = "";
	switch (source) {
		case "youtube":
			res += '<img src="./icons/youtube.svg" />';
			break;
		case "vk":
			res += '<img src="./icons/vk.svg" />';
			break;
	
		default:
			res += '<img src="./icons/link_icon.svg" />';
			break;
	}
	res += `<a href="${url}" target="_blank">${text}</a>`;
	el.innerHTML = res;
	return el;
}