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

	// Initialize the audio player
	var INSTRUMENTS = [
	    [ "voice","hcts_vox.m4a" ],
	    [ "bass","hcts_bass.m4a" ],
	    [ "synth and strings","hcts_ss.m4a" ],
	    [ "guitar","hcts_guitar.m4a" ],
	    [ "drums","hcts_drums.m4a" ]
	];
	var STATIC_URL = "/static/";
	var JPLAYER_ID = "#jquery_jplayer_1";
	function sendToAllPlayers( message ) {
	    for ( var i=1; i<=INSTRUMENTS.length; i++ ) {
	    	var playerID = "#jquery_jplayer_"+i;
	    	$( playerID ).jPlayer( message );
	    }
	}
	// TODO: Is there a less hacky way to do this? Is this even hacky?
	function getFile( index ) {
	    if ( index <= INSTRUMENTS.length ) {
		var playerID = "#jquery_jplayer_"+index;
		$( playerID ).jPlayer({
		    ready: function () {
			$( this ).jPlayer("setMedia", {
			    m4a: STATIC_URL+"audio/"+getFile( index+1 )
			});
		    },
		    preload: "auto",
		    swfPath: STATIC_URL+"script",
		    supplied: "m4a",
		    cssSelectorAncestor: "#jp_container_"+index,
		    wmode:"window"
		});
	    }
	    if ( index > 1 )
		return INSTRUMENTS[index-2][1];
	    return "";
	}
	// This initializes all jPlayers in strict order!
	getFile( 1 );

	// var instCounter = 1;
	// for ( var instrument in INSTRUMENTS ) {
	//     var playerID = "#jquery_jplayer_"+instCounter;
	//     alert("playerID is "+playerID);
	//     $( playerID ).jPlayer({
	// 	ready: function () {
	// 	    $( this ).jPlayer("setMedia", {
	// 		m4a: STATIC_URL+"audio/"+INSTRUMENTS[instrument]
	// 	    });
	// 	},
	// 	preload: "auto",
	// 	swfPath: STATIC_URL+"script",
	// 	supplied: "m4a",
	// 	cssSelectorAncestor: "#jp_container_"+instCounter,
	// 	wmode:"window"
	//     });
	//     instCounter++;
	// }
	// $(JPLAYER_ID).jPlayer({
        //     ready: function () {
	// 	$(this).jPlayer("setMedia", {
	// 	    m4a: STATIC_URL+"audio/hcts_guitar.m4a"
	// 	});
        //     },
	//     preload: "auto",
        //     swfPath: STATIC_URL+"script",
        //     supplied: "m4a"
	// });

	// Bind user interface to handlers
	$('#playbutton').click(
	    function( event ) {
		event.preventDefault();
		$.post( 'play' );
		// $('#text_status').text("playing");
		maestro.utils.dotCounter = setInterval(
		    function() {
			// $('#status_text').text(
			//     $('#status_text').text()+"."
			// );
		    },
		    200
		);
	    }
	);
	$('#resetbutton').click(
	    function( event ) {
		event.preventDefault();
		// $(JPLAYER_ID).jPlayer( "stop" );
		sendToAllPlayers( "stop" );
		$.post( 'reset' );
		maestro.utils.playTimer = null;
		clearInterval( maestro.utils.dotCounter );
		// $('#text_status').text("");
	    }
	);

	// Initialize maestro utilities
	maestro.utils = {};
	maestro.utils.getTimeOffset = function( callback ) {
	    // Current client time
	    var localMillis = (new Date()).getTime();

	    $.get( "time",
		   function( data ) {
		       var localMillisAfter = (new Date()).getTime();
		       var requestToResponse = (localMillisAfter - localMillis)/2.0;

		       // The offset
		       var offset = data.time - localMillis - requestToResponse;
		       maestro.utils.clientServerTimeOffset = offset;

		       // For debugging only
		       $('#status_text').text("server: "+data.time+", local: "+localMillis+"; your time offset is "+offset);

		       // Continue doing what we need, now having the offset calculated for us
		       callback();
		   }
		 );
	};

	// How long to wait until playing, when ready to play
	maestro.utils.waitFor = 0.0;
	maestro.utils.playTimer = null;
	maestro.utils.pollPlayback = function() {
	    $.get( "poll",
		   function( data ) {
		       if ( data.ready ) {
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
				       sendToAllPlayers( "play" );
				       // $(JPLAYER_ID).jPlayer( "play" );
				       clearInterval( maestro.utils.dotCounter );
				       // $('#status_text').text("");
				   },
				   // How long to wait to play (calculated above)
				   maestro.utils.waitFor
			       );
			   }
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