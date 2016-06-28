package main

import (
	"flag"
	"fmt"
	"github.com/thisisaaronland/go-slippy-tiles"
	slippy "github.com/thisisaaronland/go-slippy-tiles/provider"
	"github.com/whosonfirst/go-httpony/cors"
	"github.com/whosonfirst/go-httpony/rewrite"
	"github.com/whosonfirst/go-httpony/tls"
	"golang.org/x/net/html"
	"golang.org/x/oauth2"
	"io"
	"net/http"
	"net/http/cookiejar"
	"os"
	"path/filepath"
	"regexp"
)

func NewTestRewriter() (*TestRewriter, error) {
	t := TestRewriter{}
	return &t, nil
}

type TestRewriter struct {
	rewrite.HTMLRewriter
	Request *http.Request
}

func (t *TestRewriter) SetKey(key string, value interface{}) error {

	if key == "request" {
		req := value.(*http.Request)
		t.Request = req
	}

	return nil
}

func (t *TestRewriter) Rewrite(node *html.Node, writer io.Writer) error {

	jar, err := cookiejar.New(nil)

	if err != nil {
		return err
	}

	cookies := jar.Cookies(t.Request.URL)

	if len(cookies) == 0 {

	}

	var f func(node *html.Node, writer io.Writer)

	f = func(n *html.Node, w io.Writer) {

		if n.Type == html.ElementNode && n.Data == "body" {

			ns := ""
			key := "data-x-foo"
			value := "bar"

			a := html.Attribute{ns, key, value}
			n.Attr = append(n.Attr, a)
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c, w)
		}
	}

	f(node, writer)

	html.Render(writer, node)
	return nil
}

func main() {

	var host = flag.String("host", "localhost", "Hostname to listen on")
	var port = flag.Int("port", 8080, "Port to listen on")
	var path = flag.String("path", "./", "Path served as document root.")
	var cors_enable = flag.Bool("cors", false, "Enable CORS headers")
	var cors_allow = flag.String("allow", "*", "Enable CORS headers from these origins")
	var tls_enable = flag.Bool("tls", false, "Serve requests over TLS") // because CA warnings in browsers...
	var tls_cert = flag.String("tls-cert", "", "Path to an existing TLS certificate. If absent a self-signed certificate will be generated.")
	var tls_key = flag.String("tls-key", "", "Path to an existing TLS key. If absent a self-signed key will be generated.")
	var proxy_tiles = flag.Bool("proxy", false, "Proxy and cache tiles locally.")
	var proxy_config = flag.String("proxy-config", "", "Path to a valid config file for slippy tiles.")
	var rewrite_html = flag.Bool("rewrite-html", false, "...")

	var oauth_enable = flag.Bool("oauth", false, "...")

	// sudo read from a config file or env variable or something
	var oauth_client = flag.String("oauth-client-id", "", "...")
	var oauth_secret = flag.String("oauth-client-secret", "", "...")

	flag.Parse()

	docroot, err := filepath.Abs(*path)

	if err != nil {
		panic(err)
	}

	endpoint := fmt.Sprintf("%s:%d", *host, *port)

	root := http.Dir(docroot)
	fs := http.FileServer(root)

	handler := cors.EnsureCORSHandler(fs, *cors_enable, *cors_allow)

	var re_tile *regexp.Regexp
	var re_html *regexp.Regexp

	var provider slippytiles.Provider
	var rewriter *rewrite.HTMLRewriteHandler

	re_signin, _ := regexp.Compile(`/signin/?$`)
	re_auth, _ := regexp.Compile(`/auth/?$`)

	if *proxy_tiles {

		config, err := slippytiles.NewConfigFromFile(*proxy_config)

		if err != nil {
			panic(err)
		}

		provider, err = slippy.NewProviderFromConfig(config)

		if err != nil {
			panic(err)
		}

		re_tile, _ = regexp.Compile(`/(.*)/(\d+)/(\d+)/(\d+).(\w+)$`)
	}

	if *rewrite_html {

		writer, _ := NewTestRewriter()
		rewriter, _ = rewrite.NewHTMLRewriterHandler(writer)

		re_html, _ = regexp.Compile(`/(?:.*).html$`)
	}

	juggler := func(rsp http.ResponseWriter, req *http.Request) {

		url := req.URL
		path := url.Path

		// https://godoc.org/golang.org/x/oauth2#example-Config

		if *oauth_enable {

			// please do not hardcode me...

			auth_url := "https://mapzen.com/oauth/authorize/"
			token_url := "https://mapzen.com/oauth/request_token/"

			conf := &oauth2.Config{
				ClientID:     *oauth_client,
				ClientSecret: *oauth_secret,
				Scopes:       []string{},
				Endpoint: oauth2.Endpoint{
					AuthURL:  auth_url,
					TokenURL: token_url,
				},
			}

			if re_signin.MatchString(path) {

				scheme := "http"

				if *tls_enable {
					scheme = "https"
				}

				redir_uri := fmt.Sprintf("%s://%s/auth/", scheme, endpoint)

				redir := oauth2.SetAuthURLParam("redirect_uri", redir_uri)

				url := conf.AuthCodeURL("state", oauth2.AccessTypeOnline, redir)
				http.Redirect(rsp, req, url, 302)
				return
			}

			if re_auth.MatchString(path) {

				query := req.URL.Query()
				code := query.Get("code")

				if code == "" {
					http.Error(rsp, "Missing code parameter", http.StatusBadRequest)
					return
				}

				fmt.Println(code)
				token, err := conf.Exchange(oauth2.NoContext, code)

				if err != nil {
					http.Error(rsp, err.Error(), http.StatusBadRequest)
					return
				}

				fmt.Println(token)
			}

		}

		if *proxy_tiles && re_tile.MatchString(path) {
			handler := provider.Handler()
			handler.ServeHTTP(rsp, req)
			return
		}

		if *rewrite_html && re_html.MatchString(path) {

			abs_path := filepath.Join(docroot, path)
			reader, err := os.Open(abs_path)

			if err != nil {
				http.Error(rsp, err.Error(), http.StatusInternalServerError)
				return
			}

			handler := rewriter.Handler(reader)

			handler.ServeHTTP(rsp, req)
			return
		}

		fs.ServeHTTP(rsp, req)
	}

	proxy := http.HandlerFunc(juggler)

	handler = cors.EnsureCORSHandler(proxy, *cors_enable, *cors_allow)

	if *tls_enable {

		var cert string
		var key string

		if *tls_cert == "" && *tls_key == "" {

			root, err := tls.EnsureTLSRoot()

			if err != nil {
				panic(err)
			}

			cert, key, err = tls.GenerateTLSCert(*host, root)

			if err != nil {
				panic(err)
			}

		} else {
			cert = *tls_cert
			key = *tls_key
		}

		fmt.Printf("start and listen for requests at https://%s\n", endpoint)
		err = http.ListenAndServeTLS(endpoint, cert, key, handler)

	} else {

		fmt.Printf("start and listen for requests at http://%s\n", endpoint)
		err = http.ListenAndServe(endpoint, handler)
	}

	if err != nil {
		panic(err)
	}

	os.Exit(0)
}
