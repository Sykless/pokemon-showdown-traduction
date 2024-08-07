import { PLAY_SHOWDOWN_HOST } from "../translator";

// Only load Teambuilder on Showdown simulator (this excludes replays)
if (window.location.host == PLAY_SHOWDOWN_HOST)
{
	// Inject Showdown variables inside teambuilderTranslate.js
	var s = document.createElement('script');
	s.src = chrome.runtime.getURL('teambuilderTranslate.js');

	// This fires after the page script finishes executing
	s.onload = function() {
		const storage = chrome.storage.sync || chrome.storage.local;

		// Retrieve modeAdversaire in Chrome storage
		storage.get('modeAdversaire', function(data) {
			var spritesURL = chrome.runtime.getURL('sprites/');
		
			// Send spritesURL and modeAdversaire to the rest of the code
			var event = new CustomEvent('RecieveContent', {
				detail: {
					spritesURL: spritesURL,
					modeAdversaire: data.modeAdversaire
				}
			});

			window.dispatchEvent(event);
		});
	};

	(document.head || document.documentElement).appendChild(s);
	console.log("teambuilderContentScript loaded");
}
