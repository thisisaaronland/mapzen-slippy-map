all: mapzen screenful

mapzen: tangram refill bubble-wrap cinnabar zinc

tangram:
	curl -s -o www/javascript/tangram.js https://mapzen.com/tangram/tangram.debug.js
	curl -s -o www/javascript/tangram.min.js https://mapzen.com/tangram/tangram.min.js

refill:
	curl -s -o www/tangram/refill/refill.yaml https://raw.githubusercontent.com/tangrams/refill-style/gh-pages/refill-style.yaml
	curl -s -o www/tangram/refill/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/refill-style/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/refill/building-grid.gif https://raw.githubusercontent.com/tangrams/refill-style/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/refill/refill.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/refill/refill.yaml

bubble-wrap:
	curl -s -o www/tangram/bubble-wrap/bubble-wrap.yaml https://raw.githubusercontent.com/tangrams/bubble-wrap/gh-pages/bubble-wrap.yaml
	curl -s -o www/tangram/bubble-wrap/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/bubble-wrap/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/bubble-wrap/building-grid.gif https://raw.githubusercontent.com/tangrams/bubble-wrap/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/bubble-wrap/bubble-wrap.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/bubble-wrap/bubble-wrap.yaml

cinnabar:
	curl -s -o www/tangram/cinnabar/cinnabar.yaml https://raw.githubusercontent.com/tangrams/cinnabar-style/gh-pages/cinnabar-style.yaml
	curl -s -o www/tangram/cinnabar/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/cinnabar-style/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/cinnabar/building-grid.gif https://raw.githubusercontent.com/tangrams/cinnabar-style/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/cinnabar/cinnabar.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/cinnabar/cinnabar.yaml

zinc:
	curl -s -o www/tangram/zinc/zinc.yaml https://raw.githubusercontent.com/tangrams/zinc-style/gh-pages/zinc-style.yaml
	curl -s -o www/tangram/zinc/poi_icons_18@2x.png https://raw.githubusercontent.com/tangrams/zinc-style/gh-pages/images/poi_icons_18%402x.png
	curl -s -o www/tangram/zinc/building-grid.gif https://raw.githubusercontent.com/tangrams/zinc-style/gh-pages/images/building-grid.gif
	perl -p -i -e "s/images\/poi_icons_18\@2x.png/poi_icons_18\\@2x.png/" www/tangram/zinc/zinc.yaml
	perl -p -i -e "s/images\/building-grid.gif/building-grid.gif/" www/tangram/zinc/zinc.yaml

geohash:
	curl -s -o www/javascript/geohash.js https://raw.githubusercontent.com/davetroy/geohash-js/master/geohash.js

screenfull:
	if test -e www/javascript/screenfull.js; then cp www/javascript/screenfull.js www/javascript/screenfull.js.bak; fi
	if test -e www/javascript/screenfull.min.js; then cp www/javascript/screenfull.min.js www/javascript/screenfull.min.js.bak; fi
	curl -s -o www/javascript/screenfull.min.js https://raw.githubusercontent.com/sindresorhus/screenfull.js/gh-pages/dist/screenfull.min.js
	curl -s -o www/javascript/screenfull.js https://raw.githubusercontent.com/sindresorhus/screenfull.js/gh-pages/dist/screenfull.js

osx:
	utils/osx/www-server -path www
