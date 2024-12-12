window.cssLoader = {}
window.cssLoader.urls = [];
window.cssLoader.isLoaded = [];
window.cssLoader.promise = Promise.resolve();
window.cssLoader.promiseResolved = true;
window.cssLoader.addCss = function(url) {
	if (window.cssLoader.promiseResolved) {
		const newPromise = Promise.withResolvers();
		window.cssLoader.promise = newPromise["promise"];
		window.cssLoader.promiseResolve = newPromise["resolve"];
		window.cssLoader.promiseResolved = false;
	}
	const link = document.createElement("link");
	link.href = url;
	link.type = "text/css";
	link.rel = "stylesheet";
	link.media = "screen,print";
	link.onload = () => {
		let allLoaded = true;
		for (let i = 0; i < window.cssLoader.urls.length; i++) {
			if (window.cssLoader.urls[i] == url) {
				window.cssLoader.isLoaded[i] = true;
			}
			if (!window.cssLoader.isLoaded[i]) {
				allLoaded = false;
			}
		}
		if (allLoaded) {
			window.cssLoader.promiseResolved = true;
			window.cssLoader.promiseResolve();
		}
	};

	window.cssLoader.urls.push(url);
	window.cssLoader.isLoaded.push(false);
	document.getElementsByTagName("head")[0].appendChild(link);
}