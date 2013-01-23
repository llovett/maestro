var maestro = {};
$(document).ready(
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
	// should match STATIC_URL from django settings
	var STATIC_URL = "/static/";

	// Set up some of the UI elements
	$("#timecontrol").slider( {
	    min:0,
	    max:10000,
	    step:1,
	    disabled:true
	} );
	$("#volcontrol").slider( {
	    min:0,
	    max:100,
	    step:1,
	    stop: function( event, ui ) {
		// max value of slider is 100, need a float between 0 and 1
		var vol = ui.value / 100.0;
		sendToAllPlayers( "volume", vol );
	    }
	} );
	    
	// This will be set once the user selects a song
	INSTRUMENTS = [];

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
		       // Do we have a song title yet?
		       if ( data.songtitle ) {
			   
		       }
		       // Go to the root of the website if we get the 'redirect' message from the server
		       if ( data.redirect ) {
			   window.location = "/";
		       }
		       // Music is ready to play
		       else if ( data.ready ) {
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
		       }
		       // Music should not be playing
		       else if ( maestro.playing ) {
			   maestro.utils.stopPlayback();
		       }
		   }
		 );
	};

	// This calculates the time offset for this computer, and starts polling the server
	maestro.utils.getTimeOffset(
	    function() {
		maestro.utils.pollTimer = setInterval( maestro.utils.pollPlayback, 1000 );
	    }
	);

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
		    wmode:"window",
		    timeupdate: function( event ) {
			maestro.playback = maestro.playback || {};
			maestro.playback.completed = event.jPlayer.status.currentPercentAbsolute*100.0;
			$("#timecontrol").slider( "option", "value", maestro.playback.completed );
		    }
		});
	    }
	    if ( index > 1 ) {
		return INSTRUMENTS[index-2].faudio;
	    }
	    return "";
	}

	maestro.utils.stopPlayback();
	$("#volcontrol").slider( "option", "value", 75 );

	$("#song_select_list").click(
	    function() {
		var songtitle = $("#song_select_list option:selected").text();
		if ( songtitle === "Pick a song, any song..." ) return;
		songname = encodeURIComponent( songtitle );

		var artistname = INSTRUMENTS.length > 0 ? INSTRUMENTS[0].artist : "";
		$(".track_title").text( songtitle );
		$(".artist_title").text( artistname );

		if ( songname == "Pick a song, any song..." ) return;
		$.get( '/stemget/?title='+songname,
		       function( data ) {
			   // Show play/pause button
			   $("#playpause").empty();
			   var img = $("<img/>");
			   img.attr( {"src":STATIC_URL+"img/play_large.png",
				      "alt":"play"} );
			   img.addClass( "playpause_button" );
			   img.addClass( "play" );
			   // click handler for play
			   img.click(
			       function( event ) {
				   // play button
				   if ( $(this).hasClass("play") ) {
				       $.post( '/play' );
				       $(this).removeClass("play");
				       $(this).attr( {"src":STATIC_URL+"img/pause_large.png"} );
				   }
				   // pause button
				   else {
				       $(this).addClass("play");
				       $(this).attr( {"src":STATIC_URL+"img/play_large.png"} );

				       // TODO: this needs to pause ALL players on all machines
				       sendToAllPlayers( "pause" );
				       $.post( '/reset',
					       { 'time':maestro.playback.completed/100.0 } );
				       maestro.utils.playTimer = null;
				       clearInterval( maestro.utils.dotCounter );
				       maestro.playing = false;
				   }
			       }
			   );
			   $("#playpause").append( img );

			   // Show controls
			   $("#controls").show();

			   // De-populate instrument select list
			   $("#instrument_select_list").empty();

			   // Populate instrument select list
			   INSTRUMENTS = data.stems;
			   for ( var i=1; i<=INSTRUMENTS.length; i++ ) {
			       var newitem = $("<li></li>");
			       newitem.addClass( "instrument_"+i );
			       newitem.addClass( "inst_"+(((i-1)%5/*5 different colors*/)+1) );
			       newitem.addClass( "deselected" );
			       var newdiv = $("<div></div>");
			       newdiv.addClass("inst_listing");
			       var newlink = $("<a></a>");
			       newlink.attr( {href:"#" } );
			       newlink.append( INSTRUMENTS[i-1].instr );
			       newdiv.append( newlink );
			       newdiv.click(
				   function( event ) {
				       event.preventDefault();
				       var listitem = $(this).parent("li");
				       listitem.toggleClass( "selected" );
				       listitem.toggleClass( "deselected" );
				   }
			       );

			       newitem.append( newdiv );
			       $("#instrument_select_list").append( newitem );
			   }

			   // Get rid of current jplayers
			   $("#player").empty();
			   // Build jplayers
			   for ( var i=1; i<=INSTRUMENTS.length; i++ ) {
			       $("#player").append('<div id="jquery_jplayer_'+i+'" class="jp-jplayer"></div><div id="jp_container_'+i+'" class="jp-audio"><div class="jp-type-single"><div class="jp-gui jp-interface"><ul class="jp-controls"><li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li><li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li><li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li><li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li><li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li><li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li></ul><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div><div class="jp-time-holder"><div class="jp-current-time"></div><div class="jp-duration"></div><ul class="jp-toggles"><li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li><li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li></ul></div></div><div class="jp-title"><ul><li>Bubble</li></ul></div><div class="jp-no-solution"><span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.</div></div></div>');
			   }

			   // Instantiate with audio
			   getFile( 1 );
		       }
		     );
	    }
	);
    }
);
