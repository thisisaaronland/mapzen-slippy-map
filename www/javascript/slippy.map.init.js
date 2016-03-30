window.onload = function(e){	
	
	slippy.map.init('tangram/bubble-wrap/bubble-wrap.yaml');
	slippy.map.jumpto_latlon(37.755244,-122.453098, 12);

	window.onkeydown = function keyEvent(event){
		
		var key = event.keyCode || event.which;
		var keychar = String.fromCharCode(key);

		if (! event.shiftKey){
			return;
		}

		if (key != 83){	// s
			return;
		}

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
	
}
