import { musicHandler } from "./musicHandler.mjs";

export default function ProgressBar(musicPlayer) {
	const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	el.musicPlayer = musicPlayer;
	el.classList.add("component__ProgressBar");
	el.setAttribute("height", "1em");
	el.innerHTML = `
		<g class="group">
			<g stroke-width="0.15em" stroke-linecap="round">
				<line class="trackLine1" stroke="var(--background-color-2)" />
				<line class="trackLine2" stroke="var(--brown)" />
			</g>
			<circle class="thumb" fill="var(--brown)" />
		</g>`;
	el.group = el.querySelector(".group");
	el.trackLine1 = el.querySelector(".trackLine1");
	el.trackLine2 = el.querySelector(".trackLine2");
	el.thumb = el.querySelector(".thumb");
	el.trackLineLength = 0;
	el.trackLineOffset = 0;
	el.progress = 0;
	el.resizeObserver = new ResizeObserver((entries) => {
		entries.forEach((entry) => {
			const h = entry.contentRect.height;
			const w = entry.contentRect.width;
			const r = h / 4;
			entry.target.trackLineLength = w - 2*r;
			entry.target.trackLineOffset = r;
			entry.target.group.setAttribute("transform", `translate(${r})`);

			entry.target.thumb.setAttribute("cx", 0);
			entry.target.thumb.setAttribute("cy", h / 2);
			entry.target.thumb.setAttribute("r", r);

			entry.target.trackLine1.setAttribute("x1", 0);
			entry.target.trackLine1.setAttribute("y1", h / 2);
			entry.target.trackLine1.setAttribute("x2", w - 2*r);
			entry.target.trackLine1.setAttribute("y2", h / 2);

			entry.target.trackLine2.setAttribute("x1", 0);
			entry.target.trackLine2.setAttribute("y1", h / 2);
			entry.target.trackLine2.setAttribute("y2", h / 2);

			entry.target.drawProgress();
		});
	});
	el.resizeObserver.observe(el);
	el.drawProgress = drawProgress;
	el.setProgress = setProgress;
	el.clickManager = new ClickManager(el);
	return el;
}

function drawProgress() {
	let l = this.trackLineLength;
	this.trackLine2.setAttribute("x2", l * this.progress);
	this.thumb.setAttribute("transform", `translate(${l * this.progress})`);
}

function setProgress(val) {
	if (val)
	if (val < 0) { val = 0; }
	if (val > 1) { val = 1; }
	if (val != this.progress) {
		this.progress = val;
	}
	this.drawProgress();
}

class ClickManager {
	constructor(target) {
		this.target = target;
		this.isMouseMoving = false;
		this.isTouchMoving = false;
		this.touchStartX = 0;
		this.touchStartThumbX = 0;
		this.touchStartTime = undefined;
		this.touchId = undefined;
		this.offsetX = 0;
		this.addMouseEvents();
		this.addTouchEvents();
	}

	setProgressMouseX(mouseX) {
		this.target.setProgress((mouseX - this.target.getBoundingClientRect().x - this.target.trackLineOffset) / this.target.trackLineLength);
	}

	setProgressTouchX(touchX) {
		this.target.setProgress((touchX - this.touchStartX + this.touchStartThumbX) / this.target.trackLineLength);
	}

	addMouseEvents() {
		const onMouseDown = (event) => {
			event.preventDefault();
			musicHandler.pause(this.target.musicPlayer);
			this.isMouseMoving = true;
			this.isTouchMoving = false;
			this.setProgressMouseX(event.x);
			document.addEventListener("mousemove", onMouseMove);
		}
		const onMouseMove = (event) => {
			if (event.buttons & 1) {
				event.preventDefault();
				this.setProgressMouseX(event.x);
			} else {
				this.isMouseMoving = false;
				document.removeEventListener("mousemove", onMouseMove);
			}
		}
		this.target.addEventListener("mousedown", onMouseDown);
	}

	addTouchEvents() {
		const onTouchStart = (event) => {
			event.preventDefault();
			musicHandler.pause(this.target.musicPlayer);
			this.isMouseMoving = false;
			if (this.isTouchMoving) { return; }
			this.isTouchMoving = true;
			this.touchId = event.targetTouches[0].identifier;
			this.touchStartTime = performance.now();
			this.touchStartX = event.targetTouches[0].clientX;
			this.touchStartThumbX = this.target.progress * this.target.trackLineLength;
			document.addEventListener("touchmove", onTouchMove);
			document.addEventListener("touchend", onTouchEnd);
			document.addEventListener("touchcancel", onTouchEnd);
		}
		const onTouchMove = (event) => {
			for (let i=0; i < event.targetTouches.length; i++) {
				if (event.targetTouches[i].identifier == this.touchId) {
					this.setProgressTouchX(event.targetTouches[i].clientX);
				}
			}
		}
		const onTouchEnd = (event) => {
			for (let i=0; i < event.targetTouches.length; i++) {
				if (event.targetTouches[i].identifier == this.touchId) {
					return;
				}
			}
			// Short click
			if (performance.now() - this.touchStartTime < 200) {
				this.setProgressMouseX(this.touchStartX);
			}
			this.isTouchMoving = false;
			document.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("touchend", onTouchEnd);
			document.removeEventListener("touchcancel", onTouchEnd);
		}
		this.target.addEventListener("touchstart", onTouchStart);
	}
}