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
	function sendToSelectedPlayers( command, params ) {
	    var selected = new Array();
	    $("#instrument_select_list .selected").each(
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
		    solution: "flash,html",
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
	// Show instrument listing
	for ( var i=0; i<INSTRUMENTS.length; i++ ) {
	    var instrument = INSTRUMENTS[i][0];
	    var newItem = $('<li></li>');
	    newItem.addClass( "instrument_"+(i+1) );
	    var newLink = $('<a></a>');
	    newLink.attr( {href:"#"} );
	    newLink.append( instrument );
	    // Click handler for the link
	    newItem.click(
		function( event ) {
		    event.preventDefault();
		    $( this ).toggleClass( "selected" );
		    var inst = $( this ).children().text();
		    // TODO: do something with this?
		}
	    );
	    newItem.append( newLink );
	    $("#instrument_select_list").append( newItem );
	}

	// Bind user interface to handlers
	function stopPlayback() {
	    sendToAllPlayers( "pause", 0 );
	    $.post( 'reset' );
	    maestro.utils.playTimer = null;
	    clearInterval( maestro.utils.dotCounter );
	    maestro.playing = false;
	    // $('#text_status').text("");
	}	    
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
		stopPlayback();
	    }
	);

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
	    $.get( "/poll",
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
				       sendToSelectedPlayers( "play" );
				       maestro.playing = true;
				       clearInterval( maestro.utils.dotCounter );
				       // $('#status_text').text("");
				   },
				   // How long to wait to play (calculated above)
				   maestro.utils.waitFor
			       );
			   }
		       } else if ( maestro.playing ) {
			   stopPlayback();
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
