var slippy = slippy || {};

slippy.map = (function(){

		var _cache = {}

	var _mapid = 'map';

	var _current_style = 'bubble-wrap';
	
	var _styles = {
		'bubble-wrap': 'tangram/bubble-wrap/bubble-wrap.yaml',
		'cinnabar': 'tangram/cinnabar/cinnabar.yaml',
		'refill': 'tangram/refill/refill.yaml',
		'zinc': 'tangram/zinc/zinc.yaml',
	};
	
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
		
		'tangram': function(scene){
			
			var scene = self.scenefile(_current_style);
			
			var tangram = Tangram.leafletLayer({
				scene: scene,
				numWorkers: 2,
				unloadInvisibleTiles: false,
				updateWhenIdle: false,
				// attribution: attribution,
			});
			
			return tangram;
		},
		
		'load_style': function(style){

			if (style == _current_style){
				return;
			}
			
			var scene = slippy.map.scene();
			var sfile = self.scenefile(style)
			scene.load(sfile);

			_current_style = style;
		},
			
		'scenefile': function(style){
			return _styles[style];
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
			
			// TODO - get bounding box and make geohashes out of SW/NE
			// and append to name (20160330/thisisaaronland)
				
			var fname = 'slippy-map-' + (+new Date()) + '.png';
			
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
		}
	};
	
	return self
}());
