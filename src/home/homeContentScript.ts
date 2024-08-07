// Inject Showdown variables inside homeTranslate.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('homeTranslate.js');

// This fires after the page script finishes executing
s.onload = function() {
	const storage = chrome.storage.sync || chrome.storage.local;

	// Retrieve modeAdversaire in Chrome storage
	storage.get('modeAdversaire', function(data) {
		var spritesURL = chrome.runtime.getURL('sprites/');
	
		// Send spritesURL and modeAdversaire to the rest of the code
		var event = new CustomEvent('ReceiveContent', {
			detail: {
				spritesURL: spritesURL,
				modeAdversaire: data.modeAdversaire
			}
		});

		window.dispatchEvent(event);
	});
};

console.log("homeContentScript loaded");

(document.head || document.documentElement).appendChild(s);