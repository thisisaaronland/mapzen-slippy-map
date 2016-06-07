# www-server

This is a plain vanilla (by design) file server, written in Go, that happens to have the ability to cache tiles. It is a smushing up of the [go-whosonfirst-fileserver](https://github.com/whosonfirst/go-whosonfirst-fileserver) and [go-slippy-tiles](https://github.com/thisisaaronland/go-slippy-tiles) projects.

## Building www-server

The easiest thing is to use the handy `build` target in the included Makefile. As in:

```
make build
```

This will compile a binary verion of `www-server` and save it to the `bin` directory. All the dependencies for `www-server` are included in the `vendor` directory but you will still need to have [Go](http://www.golang.org/) installed on your computer.

## Build www-server for slippy-map

The easiest way is to use the handy `server` target in the included Makefile. As in:

```
make server
```

All this does is runs the included `build-precompiled.sh` script to build operating system specific binaries for `slippy-map`. This will place an operating system specific binary (for OS X, Linux and Darwin) in the corresponding `utils/PLATFORM` directory.

## See also

* https://github.com/whosonfirst/go-whosonfirst-fileserver
* https://github.com/thisisaaronland/go-slippy-tiles
