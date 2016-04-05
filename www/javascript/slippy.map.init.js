window.onload = function(e){	

	cookie_raw = document.cookie;
	cookie_pairs = cookie_raw.split(";");
	cookie_count = cookie_pairs.length;

	var cookies = {};
	
	for (var i=0; i < cookie_count; i++){

		var cookie = cookie_pairs[i]
		cookie = cookie.split("=");

		var k = cookie[0].trim();
		var v = cookie[1].trim();
		
		cookies[k] = v;
	}

	var style = 'bubble-wrap';

	if (cookies['style']){
		style = cookies['style'];
	}
	
	slippy.map.init(style);
	window.onkeydown = slippy.map.onkeyboard;
	
	slippy.map.jumpto_latlon(37.755244,-122.453098, 12);
	
	
}
