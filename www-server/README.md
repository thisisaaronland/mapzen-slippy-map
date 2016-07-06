# www-server

This is a plain vanilla (by design) file server, written in Go, that happens to have the ability to cache tiles. It is a smushing up of the [go-whosonfirst-fileserver](https://github.com/whosonfirst/go-whosonfirst-fileserver) and [go-slippy-tiles](https://github.com/thisisaaronland/go-slippy-tiles) projects.

## Building www-server

The easiest thing is to use the handy `build` target in the included Makefile. As in:

```
make build
```

This will compile a binary verion of `www-server` and save it to the `bin` directory.

_See note below about installing [dependencies](#dependencies)._

## Build www-server for slippy-map

The easiest way is to use the handy `server` target in the included Makefile. As in:

```
make server
```

All this does is runs the included `build-precompiled.sh` script to build operating system specific binaries for `slippy-map`. This will place an operating system specific binary (for OS X, Linux and Darwin) in the corresponding `utils/PLATFORM` directory.

## Usage

```
$> ./bin/www-server -h
Usage of ./bin/www-server:
  -allow string
    	Enable CORS headers from these origins (default "*")
  -cors
    	Enable CORS headers
  -host string
    	Hostname to listen on (default "localhost")
  -inject
    	Enable HTML rewriting by injecting custom content (experimental)
  -inject-scripts string
    	A comma-separated list of scripts to inject in to HTML pages
  -path string
    	Path served as document root. (default "./")
  -port int
    	Port to listen on (default 8080)
  -proxy
    	Proxy and cache tiles locally.
  -proxy-config string
    	Path to a valid config file for slippy tiles.
  -sso
    	Enable OAuth2 single-sign-on (SSO) provider hooks
  -sso-config string
    	The path to a valid SSO provider config file
  -tls
    	Serve requests over TLS
  -tls-cert string
    	Path to an existing TLS certificate. If absent a self-signed certificate will be generated.
  -tls-key string
    	Path to an existing TLS key. If absent a self-signed key will be generated.
```

### Proxy config files

_Example:_

```
{
	"cache": { "name": "Disk", "path": "tiles/cache" },
	"layers": {
		"osm/all": { "url": "https://vector.mapzen.com/osm/all/{z}/{x}/{y}.{fmt}", "formats": ["mvt", "topojson"] },
		"osm/raster": { "url": "https://vector.mapzen.com/osm/all/{z}/{x}/{y}.{fmt}", "formats": ["png"] }
	}
}
```

Proxy config files are modeled after those used by [TileStache](http://www.tilestache.org).

### SSO config files

_Example:_

```
[oauth]
client_id=OAUTH2_CLIENT_ID
client_secret=OAUTH2_CLIENT_SECRET
auth_url=https://example.com/oauth2/request/
token_url=https://example.com/oauth2/token/
api_url=https://example.com/api/
scopes=write

[www]
cookie_name=sso
cookie_secret=SSO_COOKIE_SECRET
```

SSO config files are standard `ini` style config files.

## Dependencies

### Vendoring

Vendoring has been disabled for the time being because when trying to fetch some vendored dependencies goes pear-shape with errors like this:

```
make deps
# cd /Users/local/mapzen/mapzen-slippy-map/www-server/vendor/src/github.com/whosonfirst/go-httpony; git submodule update --init --recursive
fatal: no submodule mapping found in .gitmodules for path 'vendor/src/golang.org/x/net'
package github.com/whosonfirst/go-httpony: exit status 128
make: *** [deps] Error 1
```

I have no idea and would welcome suggestions...

## See also

* https://github.com/whosonfirst/go-whosonfirst-fileserver
* https://github.com/thisisaaronland/go-slippy-tiles
