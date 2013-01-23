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

	var STATIC_URL = "/static/";
	function sendToSelectedPlayers( command, params ) {
	    var selected = new Array();
	    $("#instrument_select .selected").each(
		function (index, el) {
		    selected.push( $(this).attr("class").split(' ')[0].split('_')[1] );
		}
	    );
	    for ( var i=1; i<=INSTRUMENTS.length; i++ ) {
		if ( selected.indexOf(""+i) < 0 ) continue;
	    	var playerID = "#jquery_jplayer_"+i;
		if ( typeof params == 'undefined' )
	    	    $( playerID ).jPlayer( command );
		else
		    $( playerID ).jPlayer( command, params );
	    }
	}
	function sendToAllPlayers( command, params ) {
	    for ( var i=1; i<=INSTRUMENTS.length; i++ ) {
	    	var playerID = "#jquery_jplayer_"+i;
		if ( typeof params == 'undefined' )
	    	    $( playerID ).jPlayer( command );
		else
		    $( playerID ).jPlayer( command, params );
	    }
	}

	// Initialize maestro utilities
	maestro.utils = {};
	maestro.utils.getTimeOffset = function( callback ) {
	    // Current client time
	    var localMillis = (new Date()).getTime();

	    $.get( "/time",
		   function( data ) {
		       var localMillisAfter = (new Date()).getTime();
		       var requestToResponse = localMillisAfter - localMillis;

		       // The offset
		       var offset = (data.time - requestToResponse) - localMillis;
		       maestro.utils.clientServerTimeOffset = offset;

		       // Continue doing what we need, now having the offset calculated for us
		       callback();
		   }
		 );
	};

	/**
	 * pauses playback in this browser
	 **/
	maestro.utils.stopPlayback = function() {
	    sendToAllPlayers( "pause" );
	    $.post( '/reset' );
	    maestro.utils.playTimer = null;
	    maestro.playing = false;
	    $('.playpause_button').addClass("play");
	    $('.playpause_button').attr( {"src":STATIC_URL+"img/play_large.png"} );
	}

	// How long to wait until playing, when ready to play
	maestro.utils.waitFor = 0.0;
	maestro.utils.playTimer = null;
	maestro.utils.pollPlayback = function() {
	    $.get( "/poll",
		   function( data ) {
		       if ( data.ready ) {
			   // Change to a pause button
			   $('.playpause_button').removeClass("play");
			   $('.playpause_button').attr( {"src":STATIC_URL+"img/pause_large.png"} );

			   // This depends on getTimeOffset() being called already, since we depend
			   // on the value of clientServerTimeOffset here.
			   maestro.utils.waitFor =
			       data.playtime -
			       (new Date()).getTime() -
			       maestro.utils.clientServerTimeOffset;

			   if ( null == maestro.utils.playTimer ) {
			       maestro.utils.playTimer = setTimeout(
				   // Function to click play button
				   function() {
				       if ( data.playposition ) {
					   sendToSelectedPlayers( "playHead", data.playposition );
				       }
				       sendToSelectedPlayers( "play" );
				       maestro.playing = true;
				   },
				   // How long to wait to play (calculated above)
				   maestro.utils.waitFor
			       );
			   }
		       } else if ( maestro.playing ) {
			   maestro.utils.stopPlayback();
		       }
		   }
		 );
	};

	maestro.utils.getTimeOffset(
	    function() {
		maestro.utils.pollTimer = setInterval( maestro.utils.pollPlayback, 1000 );
	    }
	);
    }
);
