# mapzen-slippy-map

Mapzen maps. In a browser. Full-screen. With the ability to screenshot themselves.

## Caveats

This does do a _bunch_ of things that any normal map does, yet.

## How to use this thing

Put it on a web server. Or:

### On a Mac:

```
./utils/osx/www-server -path www
```

This will launch a tiny little web server on `http://localhost:8080` where you can see the map.

### Not on a Mac

_Support for other operating systems isn't far behind._

## Screenshots

## Shift-S

This will create a screenshot of the current map view and open it up in another browser tab.

## Ctrl-Shift-S

This will create a screenshot of the current map view and try to save it to the place your browser saves downloads.

## Things that `mapzen-slippy-map` still needs to learn how to do

* Toggle map styles
* Search
* Geolocation
* Maybe GetLatLon style coordinate display? 

## See also

* https://github.com/tangrams/


