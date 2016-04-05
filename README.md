# mapzen-slippy-map

![Lisbon](images/mapzen-slippy-map-lisbon.png)

Mapzen maps. In a browser. Full-screen. With the ability to screenshot themselves.

## Caveats

This doesn't do a _bunch_ of things that any normal map does, yet.

## How to use this thing

Put it on a web server. Or:

### On a Mac:

```
./utils/osx/www-server -path www
```

This will launch a tiny little web server on `http://localhost:8080` where you can see the map.

### Not on a Mac

_Support for other operating systems isn't far behind._

## Toggling between map styles

## Shift-B

Load the `bubble-wrap` style.

## Shift-C

Load the `cinnabar` style.

## Shift-R

Load the `refill` style.

## Shift-Z

Load the `zinc` style.

## Screenshots

## Shift-S

This will create a screenshot of the current map view and open it up in another browser tab.

## Ctrl-Shift-S

This will create a screenshot of the current map view and try to save it to the place your browser saves downloads. Filenames are generated as follows:

"slippy-map-" + `MAP STYLE` + "-" + `UNIX TIMESTAMP` + "-" `GEOHASH(SW lat,lon)` + "-" + `GEOHASH(NE lat,lon)` + ".png"

## Updating the map styles

Run the handy `make mapzen` target in the included Makefile to update all map styles (and their assets) from source.

## Things that `mapzen-slippy-map` still needs to learn how to do

* Search
* Geolocation
* Maybe GetLatLon style coordinate display? 
* Screenshot controls for touch devices

## See also

* https://github.com/tangrams/


