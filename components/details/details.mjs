window.cssLoader.addCss(import.meta.resolve("./details.css"));

export default function Details(title, content, id=undefined) {
	const el = document.createElement("div");
	el.classList.add("component__Details");
	if (id !== undefined) {
		el.setAttribute("id", id);
	}
	el.innerHTML = `
	<div class="title">
		<svg viewBox="-12 -12 24 24">
			<path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke="var(--brown)" stroke-width="4" stroke-linecap="round"/>
		</svg>
		<div class="title-content">${title}</div>
	</div>
	<div class="roll"><div class="content">${content}</div></div>`;
	el.contentElement = el.querySelector("& > .roll > .content");
	el.titleElement = el.querySelector("& > .title > .title-content");
	el.openHide = openHide;
	el.onclick = onClick;
	return el;
}

function openHide(open = undefined) {
	if (open === undefined) {
		open = !this.classList.contains("open");
	}
	const content = this.querySelector(".content");
	const roll = this.querySelector(".roll");
	if (open) {
		this.classList.add("open");
		roll.style.maxHeight = `${content.offsetHeight}px`;
	} else {
		this.classList.remove("open");
		roll.style.maxHeight = 0;
	}
}

function onClick(event) {
	if (this.querySelector("& > .title").contains(event.target)) {
		this.openHide();
	}
}