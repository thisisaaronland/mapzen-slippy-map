UNAME := $(shell sh -c 'uname -s  | awk "{print tolower($0)}" 2>/dev/null || echo not')

all: mapzen screenful

mapzen: tangram refill bubble-wrap cinnabar zinc walkabout

tangram:
	curl -s -o www/javascript/tangram.js https://mapzen.com/tangram/tangram.debug.js
	curl -s -o www/javascript/tangram.min.js https://mapzen.com/tangram/tangram.min.js

refill:
	curl -s -o www/tangram/refill/refill.yaml https://raw.githubusercontent.com/tangrams/refill-style/gh-pages/refill-style.yaml
	curl -s -o www/tangram/refill/refill-no-labels.yaml https://raw.githubusercontent.com/tangrams/refill-style-no-labels/gh-pages/refill-style-no-labels.yaml
	curl -s -o www/tangram/refill/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/refill-style/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/refill/building-grid.gif https://raw.githubusercontent.com/tangrams/refill-style/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/refill/refill.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/refill/refill.yaml
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/refill/refill-no-labels.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/refill/refill-no-labels.yaml

walkabout:
	curl -s -o www/tangram/walkabout/walkabout.yaml https://raw.githubusercontent.com/tangrams/walkabout-style/gh-pages/walkabout-style.yaml
	curl -s -o www/tangram/walkabout/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/walkabout-style/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/walkabout/draw-test9.jpg https://raw.githubusercontent.com/tangrams/walkabout-style/gh-pages/images/draw-test9.jpg
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/walkabout/walkabout.yaml
	perl -p -i -e "s/images\/draw-test9.jpg/draw-test9.jpg/" www/tangram/walkabout/walkabout.yaml

bubble-wrap:
	curl -s -o www/tangram/bubble-wrap/bubble-wrap.yaml https://raw.githubusercontent.com/tangrams/bubble-wrap/gh-pages/bubble-wrap.yaml
	curl -s -o www/tangram/bubble-wrap/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/bubble-wrap/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/bubble-wrap/building-grid.gif https://raw.githubusercontent.com/tangrams/bubble-wrap/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/bubble-wrap/bubble-wrap.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/bubble-wrap/bubble-wrap.yaml

cinnabar:
	curl -s -o www/tangram/cinnabar/cinnabar.yaml https://raw.githubusercontent.com/tangrams/cinnabar-style/gh-pages/cinnabar-style.yaml
	curl -s -o www/tangram/cinnabar/cinnabar-no-labels.yaml https://raw.githubusercontent.com/tangrams/cinnabar-style-no-labels/gh-pages/cinnabar-style-no-labels.yaml
	curl -s -o www/tangram/cinnabar/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/cinnabar-style/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/cinnabar/building-grid.gif https://raw.githubusercontent.com/tangrams/cinnabar-style/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/cinnabar/cinnabar.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/cinnabar/cinnabar.yaml
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/cinnabar/cinnabar-no-labels.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/cinnabar/cinnabar-no-labels.yaml

zinc:
	curl -s -o www/tangram/zinc/zinc.yaml https://raw.githubusercontent.com/tangrams/zinc-style/gh-pages/zinc-style.yaml
	curl -s -o www/tangram/zinc/zinc-no-labels.yaml https://raw.githubusercontent.com/tangrams/zinc-style-no-labels/gh-pages/zinc-style-no-labels.yaml
	curl -s -o www/tangram/zinc/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/zinc-style/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/zinc/building-grid.gif https://raw.githubusercontent.com/tangrams/zinc-style/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/zinc/zinc.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/zinc/zinc.yaml
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/zinc/zinc-no-labels.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/zinc/zinc-no-labels.yaml

geohash:
	curl -s -o www/javascript/geohash.js https://raw.githubusercontent.com/davetroy/geohash-js/master/geohash.js

screenfull:
	if test -e www/javascript/screenfull.js; then cp www/javascript/screenfull.js www/javascript/screenfull.js.bak; fi
	if test -e www/javascript/screenfull.min.js; then cp www/javascript/screenfull.min.js www/javascript/screenfull.min.js.bak; fi
	curl -s -o www/javascript/screenfull.min.js https://raw.githubusercontent.com/sindresorhus/screenfull.js/gh-pages/dist/screenfull.min.js
	curl -s -o www/javascript/screenfull.js https://raw.githubusercontent.com/sindresorhus/screenfull.js/gh-pages/dist/screenfull.js

server:
	$(MAKE) -C www-server server

proxy:
	$(MAKE) slippy PROXY=1

slippy:
	if test ! -e www/javascript/slippy.map.config.js; then cp www/javascript/slippy.map.config.js.example www/javascript/slippy.map.config.js; fi
	perl -p -i -e "s/var\s+_proxy\s+=\s+true;/var _proxy = false;/" www/javascript/slippy.map.config.js
	if test ! -e utils/$(UNAME)/www-server; then echo "missing build for $(UNAME)"; exit 1; fi
	if test -z "$$PROXY"; then if test -z "$$TLS"; then utils/$(UNAME)/www-server -path www; else utils/$(UNAME)/www-server -path www -tls; fi; exit 0; fi
	if test ! -d tiles/cache; then mkdir -p tiles/cache; fi
	if test ! -e tiles/config.json; then cp tiles/config.json.example tiles/config.json; fi
	perl -p -i -e "s/var\s+_proxy\s+=\s+false;/var _proxy = true;/" www/javascript/slippy.map.config.js
	if test -z "$$TLS"; then utils/$(UNAME)/www-server -path www -proxy -proxy-config tiles/config.json; else utils/$(UNAME)/www-server -path www -tls -proxy -proxy-config tiles/config.json; fi
