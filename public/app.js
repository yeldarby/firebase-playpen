var $me, $playpen, $status;

$(function() {
	FastClick.attach(document.body);

	$playpen = $('#playpen');
	$status = $('#status');
	$me = $('<div class="player" />');

	var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	$me.css('background-color', color);
	$status.css('color', color);

	$playpen.append($me);

	var offset = $playpen.offset();
	$playpen.click(function(e) {
		var x = e.clientX - offset.left - 8;
		var y = e.clientY - offset.top - 8;

		if(x < 0) x = 0;
		if(x > 500) x = 500;

		if(y < 0) y = 0;
		if(y > 500) y = 500;

		$me.transition({
			x: x,
			y: y
		});
	});

	$('body').on('touchmove', function() {
		return false;
	});
});
