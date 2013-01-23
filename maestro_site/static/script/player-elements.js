$(document).ready(
    function() {
	// Set up some of the UI elements
	$("#timecontrol").slider( {
	    min:0,
	    max:100,
	    step:1,
	    disabled:true
	} );
	$("#volcontrol").slider( {
	    min:0,
	    max:100,
	    step:1
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
	    if ( index > 1 ) {
		return INSTRUMENTS[index-2].faudio;
	    }
	    return "";
	}

	// Hide controls by default
	$("#controls").hide();

	$("#song_select_list").click(
	    function() {
		var songname = $("#song_select_list option:selected").text();
		if ( songname === "Pick a song, any song..." ) return;
		songname = encodeURIComponent( songname );
		
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
				       $.post( '/reset' );
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
			   $("#instrument_select").empty();

			   // Populate instrument select list
			   INSTRUMENTS = data.stems;
			   for ( var i=1; i<=INSTRUMENTS.length; i++ ) {
			       var newitem = $("<li></li>");
			       newitem.addClass( "instrument_"+i );
			       var newdiv = $("<div></div>");
			       newdiv.addClass("inst_listing");
			       var newlink = $("<a></a>");
			       newlink.attr( {href:"#" } );
			       newlink.append( INSTRUMENTS[i-1].instr );
			       newdiv.append( newlink );
			       newdiv.click(
				   function( event ) {
				       event.preventDefault();
				       $(this).toggleClass( "selected" );
				   }
			       );

			       newitem.append( newdiv );
			       $("#instrument_select").append( newitem );
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
