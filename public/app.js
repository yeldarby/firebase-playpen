var $me, $playpen, $status;

var firebase_root;

$(function() {
	FastClick.attach(document.body);

	firebase_root = new Firebase('https://playpen.firebaseio.com');

	var auth = new FirebaseSimpleLogin(firebase_root, function(err, user) {
		if(user) {
			var uid = user.id;

			$playpen = $('#playpen');
			$status = $('#status');

			var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
			$status.css('color', color);

			var offset = $playpen.offset();
			$playpen.click(function(e) {
				var x = e.clientX - offset.left - 8;
				var y = e.clientY - offset.top - 8;

				if(x < 0) x = 0;
				if(x > 500) x = 500;

				if(y < 0) y = 0;
				if(y > 500) y = 500;

				/*
				$me.transition({
					x: x,
					y: y
				});
				*/

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

				var player = $('<div class="player" />');
				player.css('background-color', val.color);

				player.attr('id', 'player_' + snapshot.name());

				$playpen.append(player);

				player.transition({
					x: val.x,
					y: val.y
				});
		});

		firebase_root.on('child_changed', function(snapshot) {
			var val = snapshot.val();

			var player = $('#player_' + snapshot.name()).transition({
				x: val.x,
				y: val.y
			});
		});

		firebase_root.on('child_removed', function(snapshot) {
			var val = snapshot.val();

			var player = $('#player_' + snapshot.name()).remove();
		});

		firebase_root.child(uid).onDisconnect().remove();
	} else {
			auth.login('anonymous');
		}
	});
});
