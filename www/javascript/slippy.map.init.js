window.onload = function(e){	

	// defaults
	
	var style = 'bubble-wrap';

	var lat = 37.755244;
	var lon = -122.453098;
	var zoom = 12;
	
	// custom style?
	
	cookie_raw = document.cookie;
	cookie_pairs = cookie_raw.split(";");
	cookie_count = cookie_pairs.length;

	var cookies = {};
	
	for (var i=0; i < cookie_count; i++){

		var cookie = cookie_pairs[i];
		
		if (! cookie){
			continue;
		}

		cookie = cookie.split("=");

		var k = cookie[0].trim();
		var v = cookie[1].trim();
		
		cookies[k] = v;
	}

	if (cookies['style']){
		style = cookies['style'];
	}

	// custom position?

	var hash = location.hash;
	var match = hash.match(/^#?(\d+)\/(-?\d+\.\d+)\/(-?\d+\.\d+)/);

	if (match){
		zoom = parseInt(match[1]);
		lat = parseFloat(match[2]);
		lon = parseFloat(match[3]);
	}
	
	// go!
	
	slippy.map.init(style);
	window.onkeydown = slippy.map.onkeyboard;
	
	slippy.map.jumpto_latlon(lat, lon, zoom);
	
	
}
