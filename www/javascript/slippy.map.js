var slippy = slippy || {};

slippy.map = (function(){

		var _cache = {}

		var _mapid = 'map';
		var _scenefile = 'tangram/refill.yaml'
	
		var self = {


			'init': function(scene){

				window.onresize = self.resize;
				self.resize();
				
				_scenefile = scene;
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

					var tangram = self.tangram();
					tangram.addTo(map);

					_cache[id] = map;
				}
				
				return _cache[id];
			},

			'tangram': function(scene){

				var scene = self.scenefile();
				console.log("HI " + scene);
				
				var tangram = Tangram.leafletLayer({
						scene: scene,
						numWorkers: 2,
						unloadInvisibleTiles: false,
						updateWhenIdle: false,
						// attribution: attribution,
					});
				
				console.log(tangram);
				return tangram;
			},

			'scenefile': function(url){

				if (url){
					_scenefile = url;
				}

				return _scenefile;
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
					mapzen.whosonfirst.log.error("missing 'saveAs' controls");
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
