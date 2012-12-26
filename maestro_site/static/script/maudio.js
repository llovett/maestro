/**
 * maudio.js
 *
 * Initialize audio for Maestro.
 * This must be loaded after audio.js
 */

audiojs.events.ready(
    function() {
	var as = audiojs.createAll();
    }
);
