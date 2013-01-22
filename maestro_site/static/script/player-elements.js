$(document).ready(
    function() {
	$("#controls").hide();
	
	$("#song_select_list").click(
	    function() {
		var songname = encodeURIComponent($("#song_select_list option:selected").text());
		$.get( '/stemget/?title='+songname,
		       function( data ) {
			   console.log(data);

			   // Show controls
			   $("#controls").show();

			   // De-populate instrument select list
			   $("#instrument_select").empty();

			   // Populate instrument select list
			   var stems = data.stems;
			   for ( var i=0; i<stems.length; i++ ) {
			       var newitem = $("<li></li>");
			       newitem.addClass( "instrument_"+i );
			       var newlink = $("<a></a>");
			       newlink.attr( {href:"#" } );
			       newlink.append( stems[i].instr );
			       newitem.click(
				   function( event ) {
				       event.preventDefault();
				       $(this).toggleClass( "selected" );
				   }
			       );
			       newitem.append( newlink );
			       $("#instrument_select").append( newitem );
			   }
		       } );
	    }
	);
    }
);
