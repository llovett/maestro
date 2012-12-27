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
		    alert( csrftoken );
		    xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	    }
	});

	// Bind user interface to handlers
	$('#playbutton').click(
	    function( event ) {
		event.preventDefault();
		$.post( 'play' );
		$('#text_status').text("playing");
		maestro.utils.dotCounter = setInterval(
		    function() {
			$('#status_text').text(
			    $('#status_text').text()+"."
			);
		    },
		    200
		);
	    }
	);
	$('#resetbutton').click(
	    function( event ) {
		event.preventDefault();
		$.post( 'reset' );
		maestro.utils.playTimer = null;
		clearInterval( maestro.utils.dotCounter );
		$('#text_status').text("");
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
	maestro.utils.playTimer = null;
	maestro.utils.pollPlayback = function() {
	    $.get( "poll",
		   function( data ) {
		       if ( data.ready ) {
			   maestro.utils.waitFor =
			       data.playtime -
			       (new Date()).getTime() -
			       maestro.utils.clientServerTimeOffset;

			   if ( null == maestro.utils.playTimer ) {
			       maestro.utils.playTimer = setTimeout(
				   // Function to click play button
				   function() {
				       $(".play-pause").trigger("click");
				       clearInterval( maestro.utils.dotCounter );
				       $('#status_text').text("");
				   },
				   // How long to wait to play (calculated above)
				   maestro.utils.waitFor
			       );
			   }
		       }
		   }
		 );
	};

	maestro.utils.pollTimer = setInterval( maestro.utils.pollPlayback, 1000 );
    }
);