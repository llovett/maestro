$(document).ready(
    function() {
	$("#button_create").click(
	    function() {
		$("#sessions_form").attr('action', '/session/new/');
		$("#sessions_form").submit();
	    }
	);
	$("#button_join").click(
	    function() {
		$("#sessions_form").attr('action', '/session/join/');
		$("#sessions_form").submit();
	    }
	);
    }
);
