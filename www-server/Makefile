CWD=$(shell pwd)
GOPATH := $(CWD)/vendor:$(CWD)

prep:
	if test -d pkg; then rm -rf pkg; fi

self:	prep

rmdeps:
	if test -d src; then rm -rf src; fi 

build:	rmdeps bin

deps:
	@GOPATH=$(shell pwd) go get -u "github.com/whosonfirst/go-httpony"
	@GOPATH=$(shell pwd) go get -u "github.com/thisisaaronland/go-slippy-tiles"
	@GOPATH=$(shell pwd) go get -u "golang.org/x/net/html"
	@GOPATH=$(shell pwd) go get -u "golang.org/x/oauth2"
	@GOPATH=$(shell pwd) go get -u "github.com/vaughan0/go-ini"

vendor: rmdeps deps
	if test -d vendor/src; then rm -rf vendor/src; fi
	cp -r src vendor/src

bin:	self
	@GOPATH=$(GOPATH) go build -o bin/www-server cmd/www-server.go

fmt:
	go fmt cmd/*.go

server: self
	./build-precompiled.sh
