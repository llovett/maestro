/**
 * sync.js
 *
 * Synchronize with the offset between the client's time and the server's time.
 * This must be loaded after jQuery.
 */

var maestro = {};
$( document ).ready(
    function() {
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

	var offset = maestro.utils.getTimeOffset();
	// TODO: For debugging only. Remove this later
	alert("Your offset from server time is "+offset);
    }
);