window.onload = function(e){	
	
	slippy.map.init('bubble-wrap');
	window.onkeydown = slippy.map.onkeyboard;
	
	slippy.map.jumpto_latlon(37.755244,-122.453098, 12);
	
	
}
