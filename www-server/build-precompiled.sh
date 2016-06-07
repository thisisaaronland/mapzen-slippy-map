#!/bin/sh

# Really, just because I can't figure out how to define/export multiple
# variables in a Makefile. Cluebats are welcome...

PWD=`pwd`
export GOPATH="${PWD}:${PWD}/vendor"
export GOARCH=386

for OS in darwin windows linux
do
    export GOOS=${OS}
    echo "build ${GOOS} (${GOARCH})"
    go build -o ../utils/${OS}/www-server cmd/www-server.go
done

exit 0
