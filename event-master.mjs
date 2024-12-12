export default class EventMaster {
	constructor() {
		this.callbackList = new Set();
		this.callbackListOnce = new Set();
	}

	triger() {
		this.callbackListOnce.forEach((func) => {
			func();
		});
		this.callbackList.forEach((func) => {
			func();
		});
	}

	add(func) {
		this.callbackList.add(func);
	}

	remove(func) {
		this.callbackList.delete(func);
	}

	addOnce(func) {
		this.callbackListOnce.add(func);
	}

	removeOnce(func) {
		this.callbackListOnce.delete(func);
	}
}