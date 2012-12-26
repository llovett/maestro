/**
 * sync.js
 *
 * Synchronize with the offset between the client's time and the server's time.
 * This must be loaded after jQuery.
 */

var maestro = {};
$( document ).ready(
    function() {
	// Setup AJAX to use CSRF token. Source:
	// https://docs.djangoproject.com/en/dev/ref/contrib/csrf/
	function csrfSafeMethod(method) {
	    // these HTTP methods do not require CSRF protection
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
	    crossDomain: false,
	    beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type)) {
		    var csrftoken = $.cookie('csrftoken');
		    xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	    }
	});

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

	// Initialize maestro utilities
	maestro.utils = {};
	maestro.utils.getTimeOffset = function() {
	    // Current client time
	    var localMillisUTC = Date.parse( new Date().toUTCString() );

	    // AJAX request to find server date
	    var request = new XMLHttpRequest();
	    request.open( 'HEAD', document.location, false );
	    request.send( null );
	    var serverDate = request.getResponseHeader( 'date' );
	    var serverTimeMillisUTC = Date.parse( new Date(Date.parse(serverDate)).toUTCString() );

	    // The offset
	    var offset = serverTimeMillisUTC - localMillisUTC;
	    return offset;
	};

	// How long to wait until playing, when ready to play
	maestro.utils.waitFor = 0.0;
	// The difference between server time and client time
	maestro.utils.clientServerTimeOffset = maestro.utils.getTimeOffset();

	maestro.utils.pollPlayback = function() {
	    $.get( "poll",
		   function( data ) {
		       if ( data.ready ) {
			   maestro.utils.waitFor =
			       data.playtime -
			       (new Date()).getTime() -
			       maestro.utils.clientServerTimeOffset;
			   $('#status_text').text("playing in "+maestro.utils.waitFor);
		       }
		   }
		 );
	};

	maestro.utils.pollTimer = setInterval( maestro.utils.pollPlayback, 1000 );
    }
);