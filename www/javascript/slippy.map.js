var slippy = slippy || {};

slippy.map = (function(){

	var _cache = {}

	var _mapid = 'map';

	var _current_style = 'bubble-wrap';
	var _labels = true;
	
	var _styles = {
		'bubble-wrap': 'tangram/bubble-wrap/bubble-wrap.yaml',
		'cinnabar': 'tangram/cinnabar/cinnabar.yaml',
		'outdoor': 'tangram/outdoor/outdoor.yaml',		
		'refill': 'tangram/refill/refill.yaml',
		'zinc': 'tangram/zinc/zinc.yaml',
	};

	var _proxy_tiles = true;
	var _proxy_host = location.protocol + "//" + location.host;
	
	var self = {

		'init': function(style){

			_current_style = style;
			
			window.onresize = self.resize;
			self.resize();
			
			return self.map();
		},

		'resize': function(){
			
			var wh = window.innerHeight;
			
			var el = document.getElementById(_mapid);
			el.style = "height: " + wh + "px;";
			
		},
		
		'jumpto_bbox': function(swlat, swlon, nelat, nelon){
			
			if ((swlat == nelat) && (swlon == nelon)){
				return self.map_with_latlon(id, swlat, swlon, 14);
			}
			
			var map = self.map();
			map.fitBounds([[swlat, swlon], [ nelat, nelon ]]);
			
			return map;
		},
		
		'jumpto_latlon': function(lat, lon, zoom){
			
			var map = self.map();
			map.setView([ lat , lon ], zoom);
			
			return map;
		},
		
		'map': function(){
			
			var id = _mapid;
			
			if (! _cache[id]){
				
				var map = L.map(id);
				// map.scrollWheelZoom.disable();

				var hash = new L.Hash(map);
				
				var tangram = self.tangram();
				tangram.addTo(map);
				
				_cache[id] = map;
			}
			
			return _cache[id];
		},

		// https://mapzen.com/documentation/tangram/
		
		'tangram': function(scene){
			
			var scene = self.scenefile(_current_style);
			
			var tangram = Tangram.leafletLayer({
				scene: scene,
				numWorkers: 2,
				unloadInvisibleTiles: false,
				updateWhenIdle: false,
				// attribution: attribution,
			});

			var scene = tangram.scene;
			
			scene.subscribe({
				
				load: function (scene){

					if (_proxy_tiles == true){
						slippy.map.setup_proxy(scene);
					}
				}
			});
			
			return tangram;
		},
		
		'load_style': function(style){

			document.cookie = "style=" + style;
			document.cookie = "labels=" + _labels;
			
			var scene = slippy.map.scene();
			var sfile = self.scenefile(style, _labels)
			scene.load(sfile);

			_current_style = style;
		},

		'setup_proxy': function(scene){

			if (! scene){
				scene = slippy.map.scene();
			}
			
			for (var src in scene.config.sources){
				var cfg = scene.config.sources[src]
				var url = cfg.url.replace('https://vector.mapzen.com', _proxy_host)

				cfg['url'] = url				
				scene.config.sources[src] = cfg
			}
			
		},
		
		'scenefile': function(style, labels){

			// dirty... but it works...

			var file = _styles[style];

			if (! labels){

				if (style == 'bubble-wrap'){
					// pass
				}

				else if (style == 'outdoor'){
					// pass
				}

				else {
					file = file.replace(".yaml", "-no-labels.yaml");
				}
			}

			return file;
		},
		
		'scene': function(){
			
			var m = self.map();
			var s = undefined;
			
			m.eachLayer(function(l){
				
				if (s){
					return;
				}
				
				if (! l.scene){
					return;
				}
				
				if (l.scene.gl) {
					s = l.scene;
				}
			});
			
			return s;
		},
		
		// requires https://github.com/eligrey/FileSaver.js
		
		'screenshot_as_file': function(){
			
			if (typeof(saveAs) == "undefined"){
				console.log("missing 'saveAs' controls");
				return false
			}

			var map = self.map();
			var bounds = map.getBounds();

			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();			
			
			sw_geohash = encodeGeoHash(sw['lat'], sw['lng']);
			ne_geohash = encodeGeoHash(ne['lat'], ne['lng']);			

			var geohash = sw_geohash + '-' + ne_geohash;

			// var ts = (+new Date());
			// ts = parseInt(ts / 1000);

			var dt = new Date();
			var iso = dt.toISOString();
			var iso = iso.split('T');
			var ymd = iso[0];
			ymd = ymd.replace("-", "", "g")
			
			var style = _current_style;
			
			var fname = ['slippy-map', ymd, style, geohash];
			fname = fname.join('-');
			
			fname += '.png';
			
			var callback = function(sh){					
				saveAs(sh.blob, fname);
			};
			
			return self.screenshot(callback);
		},
		
		'screenshot': function(on_screenshot){
			
			if (! on_screenshot){
				
				on_screenshot = function(sh) {
					window.open(sh.url);
					return false;
				};
			}
			
			var scene = self.scene();
			
			if (! scene){
				return false;
			}
			
			scene.screenshot().then(on_screenshot);
			return false;
		},

		'onkeyboard': function(event){
			var key = event.keyCode || event.which;
			var keychar = String.fromCharCode(key);

			// console.log(event);

			// https://en.wikipedia.org/wiki/Arrow_keys
			
			if (! event.shiftKey){			

				var map = self.map();
				var pixels = 75;

				var opts = {
					animate: true,
						
				}
				// left – A; left-arrow
				
				if ((key == 65) || (key == 37)) {
					pixels = -pixels
					map.panBy([pixels, 0], opts)
				}

				// right – D; right-arrow
				
				if ((key == 68) || (key == 39)) {
					map.panBy([pixels, 0], opts)
				}

				// up – W; up-arrow

				if ((key == 87) || (key == 38)){
					pixels = -pixels
					map.panBy([0, pixels], opts)
				}

				// down - S; down-arrow
				
				if ((key == 83) || (key == 40)){
					map.panBy([0, pixels], opts)
				}

				return;
			}
		
			if (! event.shiftKey){
				return;
			}
			
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

			// F is for fullscreen - which won't work because it needs the user
			// to click an element... (20160404/thisisaaronland)

			if (key == 'F'){

			}

			// L is for toggle between labels and no labels

			if (key == 76){
				_labels = (_labels) ? false : true;
				slippy.map.load_style(_current_style);
			}

			// O is for outdoor

			if (key == 79){
				slippy.map.load_style('outdoor');
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
		},
		
	};
	
	return self
}());
