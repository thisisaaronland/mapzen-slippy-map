CWD=$(shell pwd)
GOPATH := $(CWD)/vendor:$(CWD)
GOPATH := $(CWD)

prep:
	if test -d pkg; then rm -rf pkg; fi

self:	prep

rmdeps:
	if test -d src; then rm -rf src; fi 

build:	rmdeps deps bin

deps:
	@GOPATH=$(GOPATH) go get -u "github.com/vaughan0/go-ini"
	@GOPATH=$(GOPATH) go get -u "golang.org/x/net/html"
	@GOPATH=$(GOPATH) go get -u "golang.org/x/oauth2"
	@GOPATH=$(GOPATH) go get -u "github.com/whosonfirst/go-httpony"
	@GOPATH=$(GOPATH) go get -u "github.com/thisisaaronland/go-slippy-tiles"

bin:	self
	@GOPATH=$(GOPATH) go build -o bin/www-server cmd/www-server.go

fmt:
	go fmt cmd/*.go

server: rmdeps deps self
	./build-precompiled.sh
