$(document).ready(
    function() {
	$("#song_select_list").click(
	    function() {
		var songname = encodeURIComponent($("#song_select_list option:selected").text());
		$.get( '/stemget/?title='+songname,
		       function( data ) {
			   alert(data);
		       } );
	    }
	);
    }
);
