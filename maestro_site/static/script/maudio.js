/**
 * maudio.js
 *
 * Initialize audio for Maestro.
 * This must be loaded after audio.js
 */

audiojs.events.ready(
    function() {
	// Bind user interface to handlers
	$('#playbutton').click(
	    function() {
		$.post( 'play' );
	    }
	);
	$('#resetbutton').click(
	    function() {
		$.post( 'reset' );
	    }
	);
	var as = audiojs.createAll();
    }
);
