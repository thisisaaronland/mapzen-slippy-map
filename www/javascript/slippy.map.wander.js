var slippy = slippy || {};
slippy.map = slippy.map || {};

slippy.map.wander = (function(){

	var timeout_move = null;
	var timeout_set_direction = null;

	var _enabled = false;
	var _map = null;

	var _moves = 0;
	
	var self = {

		'init': function(map){
			_map = map;
		},

		'enabled': function(){
			return _enabled;
		},
		
		'toggle': function(){
			
			if (self.enabled()){
				self.stop();
			}

			else {
				self.start();
			}
		},
		
		'start': function(){
			_enabled = true;

			self.move(5, 5);
		},

		'stop': function(){

			_enabled = false;			
		},
		
		'move': function(x, y){

			if (! _enabled){
				return;
			}

			_moves += 1;
			
			if (timeout_move){
				clearTimeout(timeout_move);
			}

			timeout_move = setTimeout(function(){

				// console.log("move " + x + "," + y);
				_map.panBy([x, y], {'animate': true});
				
				var center = _map.getCenter();
				var zoom = _map.getZoom();

				if (center.lng > 180){
					center.lng = -180;
					_map.setView(center);
				}

				if (center.lng < -180){
					center.lng = 180;
					_map.setView(center);
				}

				if ((center.lat >= 80) || (center.lat <= -80)){
					self.set_direction();
					return;
				}

				/*
				if (_moves == 1000){
					_moves = 0;
					self.set_direction();
					return;
				}
				*/
				
				self.move(x, y);	
			}, 50);
		},

		'set_direction': function(){

			console.log("set direction");
			
			if (timeout_set_direction){
				clearTimeout(timeout_set_direction);
			}

			var x = Math.random(0, 1);
			var y = Math.random(0, 1);

			x = (x < .5) ? 0 : 1;
			y = (y < .5) ? 0 : 1;

			if (x == 0 && y == 0){
				/* this is evil syntax... */
				(self.random_boolean()) ? x = 1 : y = 1;
			}
			
			x = (self.random_boolean()) ? x : -x;
			y = (self.random_boolean()) ? -y : y;

			var center = _map.getCenter();

			var max_lat = self.random_int(75, 82);
			var min_lat = self.random_int(-75, -82);

			if (center.lat >= (max_lat - 15)){
				y = -1;
			}
			
			else if (center.lat <= (min_lat + 15)){
				y = 1;
			}
			
			var delay = parseInt(Math.random() * 60000);
			delay = Math.max(1500, delay);

			var zoom_by = Math.random() * 2;
			zoom_by = parseInt(zoom_by);

			zoom_by = (self.random_boolean()) ? zoom_by : - zoom_by;
			// _map.zoomBy(zoom_by);

			// timeout_set_direction = setTimeout(self.set_direction, delay);

			// console.log("move by " + x + "," + y);
			self.move(x, y);
		},

		'get_degrees': function(x, y){

			var deg = 0;

			if ((x == 0) && (y == 1)){
				deg = 0;
			}
			
			else if ((x == -1) && (y == 1)){
				deg = 45;
			}
			
			else if ((x == -1) && (y == 0)){
				deg = 90;
			}
			
			else if ((x == -1) && (y == -1)){
				deg = 135;
			}
			
			else if ((x == 0) && (y == -1)){
				deg = 180;
			}
			
			else if ((x == 1) && (y == -1)){
				deg = 225;
			}
			
			else if ((x == 1) && (y == 0)){
				deg = 270;
			}
			
			else if ((x == 1) && (y == 1)){
				deg = 325;
			}
			
			else {}
			
			var dt = new Date();
			var ts = dt.getTime();
			
			var offset = parseInt(Math.random() * 10);
			offset = (ts % 2) ? offset : - offset;
			
			return deg + offset;
		},
		
		'random_int': function(min, max){
			
			var r = parseInt(Math.random() * max);
			return Math.max(min, r);
		},
		
		'random_latitude': function(){
			return self.random_coordinate(90);
		},	

		'random_longitude': function(){
			return self.random_coordinate(180);
		},	
		
		'random_coordinate': function(max){
			return (Math.random() - 0.5) * max;
		},
		
		'random_boolean': function(){
			var dt = new Date();
			return (dt.getTime() % 2) ? 1 : 0;
		},

	};

	return self;
	
})();
