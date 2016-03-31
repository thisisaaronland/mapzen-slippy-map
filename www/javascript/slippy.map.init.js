window.onload = function(e){	
	
	slippy.map.init('bubble-wrap');
	slippy.map.jumpto_latlon(37.755244,-122.453098, 12);

	// please put this in a function or something
	// (20160330/thisisaaronland)
	
	window.onkeydown = function keyEvent(event){
		
		var key = event.keyCode || event.which;
		var keychar = String.fromCharCode(key);

		if (! event.shiftKey){
			return;
		}
		
		// console.log(key);

		// sudo make the key commands a config thing-y in slippy.map.js
		// (20160331/thisisaaronland)
		
		// B is for bubble-wrap
		
		if (key == 66){
			slippy.map.load_style('bubble-wrap');
		}	

		// C is for cinnabar

		if (key == 67){
			slippy.map.load_style('cinnabar');
		}
		
		// R is for refill

		if (key == 82){
			slippy.map.load_style('refill');
		}	
		
		// S is for screenshot
		
		if (key == 83){

			try {
				if (! event.ctrlKey){
					slippy.map.screenshot();
				}

				else {
					slippy.map.screenshot_as_file();
				}

			} catch (e){
				alert("Oh no! There was a problem trying to create your screenshot...");
				console.log(e);
			}
		}

		// Z is for zinc

		if (key == 90){
			slippy.map.load_style('zinc');
		}
	}
	
	
}
