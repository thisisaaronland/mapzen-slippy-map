package sso

/*

This is still wet-paint and a bit of hot mess in places. It works but it's not pretty and
should porbably be updated to use the handy (Go) Context thingy... I think
(20160630/thisisaaronland)

*/

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/vaughan0/go-ini"
	"github.com/whosonfirst/go-httpony/crypto"
	"github.com/whosonfirst/go-httpony/rewrite"
	"golang.org/x/net/html"
	"golang.org/x/oauth2"
	"io"
	_ "log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

func NewSSORewriter(crypt *crypto.Crypt) (*SSORewriter, error) {
	t := SSORewriter{Crypto: crypt}
	return &t, nil
}

type SSORewriter struct {
	rewrite.HTMLRewriter
	Request *http.Request
	Crypto  *crypto.Crypt
}

func (t *SSORewriter) SetKey(key string, value interface{}) error {

	if key == "request" {
		req := value.(*http.Request)
		t.Request = req
	}

	return nil
}

func (t *SSORewriter) Rewrite(node *html.Node, writer io.Writer) error {

	var f func(node *html.Node, writer io.Writer)

	f = func(n *html.Node, w io.Writer) {

		if n.Type == html.ElementNode && n.Data == "body" {

			t_cookie, err := t.Request.Cookie("t")

			if err == nil {
				cookie, _ := t.Crypto.Decrypt(t_cookie.Value)

				stuff := strings.Split(cookie, "#")

				api_endpoint := stuff[0]
				api_token := stuff[1]

				token_ns := ""
				token_key := "data-api-access-token"
				token_value := api_token

				token_attr := html.Attribute{token_ns, token_key, token_value}
				n.Attr = append(n.Attr, token_attr)

				endpoint_ns := ""
				endpoint_key := "data-api-endpoint"
				endpoint_value := api_endpoint

				endpoint_attr := html.Attribute{endpoint_ns, endpoint_key, endpoint_value}
				n.Attr = append(n.Attr, endpoint_attr)
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c, w)
		}
	}

	f(node, writer)

	html.Render(writer, node)
	return nil
}

type SSOProvider struct {
	Crypto       *crypto.Crypt
	Writer       *SSORewriter
	OAuth        *oauth2.Config
	endpoint     string
	api_endpoint string
	docroot      string
	tls_enable   bool
}

func NewSSOProvider(sso_config string, endpoint string, docroot string, tls_enable bool) (*SSOProvider, error) {

	sso_cfg, err := ini.LoadFile(sso_config)

	if err != nil {
		return nil, err
	}

	oauth_client, ok := sso_cfg.Get("oauth", "client_id")

	if !ok {
		return nil, errors.New("Invalid client_id")
	}

	oauth_secret, ok := sso_cfg.Get("oauth", "client_secret")

	if !ok {
		return nil, errors.New("Invalid client_secret")
	}

	oauth_auth_url, ok := sso_cfg.Get("oauth", "auth_url")

	if !ok {
		return nil, errors.New("Invalid auth_url")
	}

	oauth_token_url, ok := sso_cfg.Get("oauth", "token_url")

	if !ok {
		return nil, errors.New("Invalid token_url")
	}

	oauth_api_url, ok := sso_cfg.Get("oauth", "api_url")

	if !ok {
		return nil, errors.New("Invalid api_url")
	}

	// shrink to 32 characters

	hash := md5.New()
	hash.Write([]byte(oauth_secret))
	crypto_secret := hex.EncodeToString(hash.Sum(nil))

	crypt, err := crypto.NewCrypt(crypto_secret)

	if err != nil {
		return nil, err
	}

	writer, err := NewSSORewriter(crypt)

	if err != nil {
		return nil, err
	}

	redirect_url := fmt.Sprintf("http://%s/auth/", endpoint)

	if tls_enable {
		redirect_url = fmt.Sprintf("https://%s/auth/", endpoint)
	}

	conf := &oauth2.Config{
		ClientID:     oauth_client,
		ClientSecret: oauth_secret,
		Scopes:       []string{},
		Endpoint: oauth2.Endpoint{
			AuthURL:  oauth_auth_url,
			TokenURL: oauth_token_url,
		},
		RedirectURL: redirect_url,
	}

	pr := SSOProvider{
		Crypto:       crypt,
		Writer:       writer,
		OAuth:        conf,
		endpoint:     endpoint,
		api_endpoint: oauth_api_url,
		docroot:      docroot,
		tls_enable:   tls_enable,
	}

	return &pr, nil
}

func (s *SSOProvider) SSOHandler(next http.Handler) http.Handler {

	re_signin, _ := regexp.Compile(`/signin/?$`)
	re_auth, _ := regexp.Compile(`/auth/?$`)
	re_html, _ := regexp.Compile(`/(?:(?:.*).html)?$`)

	rewriter, _ := rewrite.NewHTMLRewriterHandler(s.Writer)

	fn := func(rsp http.ResponseWriter, req *http.Request) {

		url := req.URL
		path := url.Path

		if re_signin.MatchString(path) {
			url := s.OAuth.AuthCodeURL("state", oauth2.AccessTypeOnline)
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

			token, err := s.OAuth.Exchange(oauth2.NoContext, code)

			if err != nil {
				http.Error(rsp, err.Error(), http.StatusBadRequest)
				return
			}

			stuff := []string{s.api_endpoint, token.AccessToken}
			cookie := strings.Join(stuff, "#")

			t, err := s.Crypto.Encrypt(cookie)

			if err != nil {
				http.Error(rsp, err.Error(), http.StatusInternalServerError)
				return
			}

			t_cookie := http.Cookie{Name: "t", Value: t, Expires: token.Expiry, Path: "/", HttpOnly: true, Secure: s.tls_enable}
			http.SetCookie(rsp, &t_cookie)

			http.Redirect(rsp, req, "/", 302) // FIXME - do not simply redirect to /
			return
		}

		/*

			Because there doesn't appear to be anyway to pass a handler func to http.FileServer
			to intercept the _response_ data so we have to mirror the functionality of the file
			server itself here... (20160630/thisisaaronland)

		*/

		if re_html.MatchString(path) {

			abs_path := filepath.Join(s.docroot, path)

			info, err := os.Stat(abs_path)

			if err != nil {
				http.Error(rsp, err.Error(), http.StatusInternalServerError)
				return
			}

			if info.IsDir() {
				abs_path = filepath.Join(abs_path, "index.html")
			}

			reader, err := os.Open(abs_path)

			if err != nil {
				http.Error(rsp, err.Error(), http.StatusInternalServerError)
				return
			}

			handler := rewriter.Handler(reader)

			handler.ServeHTTP(rsp, req)
			return
		}

		next.ServeHTTP(rsp, req)
	}

	return http.HandlerFunc(fn)
}
