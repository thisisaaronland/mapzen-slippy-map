window.onload = function(e){	
	
	slippy.map.init('tangram/bubble-wrap/bubble-wrap.yaml');
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
		
		// R is for refill

		if (key == 82){

			// this does not work (20160330/thisisaaronland)
			
			var scene = slippy.map.scene();
			scene.config_source = "tangram/refill/refill.yaml";
			scene.updateConfig({ rebuild: true }).then(function() {  });
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
	}
	
	
}
