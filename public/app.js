var $me, $playpen, $status;

var firebase_root, auth;

$(function() {
	firebase_root = new Firebase('https://playpen.firebaseio.com');

	FastClick.attach(document.body);

	$playpen = $('#playpen');
	$status = $('#status');

	auth = new FirebaseSimpleLogin(firebase_root, function(error, user) {
		console.log(user);
		if(user) {
			// get color and call setup
			var uid = user.id;
			firebase_root.child(uid).once('value', function(snapshot) {
				var u = snapshot.val();

				var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
				if(u && u.color) color = u.color;

				$status.css('color', color);

				var offset = $playpen.offset();
				$playpen.click(function(e) {
					var x = e.clientX - offset.left - 8;
					var y = e.clientY - offset.top - 8;

					if(x < 0) x = 0;
					if(x > 500) x = 500;

					if(y < 0) y = 0;
					if(y > 500) y = 500;

					firebase_root.child(uid).set({
						color: color,
						x: x,
						y: y
					});
				});

				$('body').on('touchmove', function() {
					return false;
				});

				firebase_root.on('child_added', function(snapshot) {
					var val = snapshot.val();

					var player = $('<div class="player" />').attr('id', 'player_' + snapshot.name());
					player.css('background-color', val.color);
					$playpen.append(player);

					player.transition({
						x: val.x,
						y: val.y
					});
				});

				firebase_root.on('child_removed', function(snapshot) {
					// remove an element
					$('#player_' + snapshot.name()).remove();
				});

				firebase_root.on('child_changed', function(snapshot) {
					// update an element
					var val = snapshot.val();

					$('#player_' + snapshot.name()).transition({
						x: val.x,
						y: val.y
					});
				});
			});
		} else {
			// login
			auth.login('anonymous');
		}
	});
});
