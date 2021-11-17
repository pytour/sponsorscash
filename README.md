<h1 align="center">SponsorsCash</h1>

<div align="center">
<a href="https://github.com/pytour/fundmecash">
    <img src="public/images/logo.png" alt="Logo" width="80" height="80">
</a>

Fundraising with bitcoin cash

[![Website](https://img.shields.io/badge/Platform-SponsorsCash-00aced.svg?style=flat-square)](https://sponsors.cash)
[![Community](https://img.shields.io/badge/Chat-Telegram%20Group-blue.svg?style=flat-square&logo=telegram)](https://telegram.me/sponsorschat)

</div>

## Install


Add .env file

Edit package.json

`pm2 start "npm run start-fundme" --time --name "website"`

## ESLint

Basic eslint setup [guide](https://dev.to/onygami/eslint-and-prettier-for-react-apps-bonus-next-js-and-typescript-3e46)


## Intallation issues

Bcrypt error

`sudo apt-get install -y build-essential python`

`npm i bcrypt@3.0.8`

## NGINX setup (optional)

We need to setup domains for `sponsors.cash` and sub domain `ads.sponsors.cash`

```
/etc/nginx/sites-available/sponsors.cash
/etc/nginx/sites-available/ads.sponsors.cash
```

Edit proxy_params

`sudo vi /etc/nginx/proxy_params`

```
proxy_buffers 16 32k;
proxy_buffer_size 64k;
proxy_busy_buffers_size 128k;
proxy_cache_bypass $http_pragma $http_authorization;
proxy_connect_timeout 59s;
proxy_hide_header X-Powered-By;
proxy_http_version 1.1;
proxy_ignore_headers Cache-Control Expires;
proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_404;
proxy_no_cache $http_pragma $http_authorization;
proxy_pass_header Set-Cookie;
proxy_read_timeout 600;
proxy_redirect off;
proxy_send_timeout 600;
proxy_temp_file_write_size 64k;
proxy_set_header Accept-Encoding '';
proxy_set_header Cookie $http_cookie;
proxy_set_header Host $host;
proxy_set_header Proxy '';
proxy_set_header Referer $http_referer;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Server $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Original-Request $request_uri;
```

In

`/etc/nginx/nginx.conf`

change 

`include /etc/nginx/sites-enabled/*;`

to

`include /etc/nginx/sites-available/*;`


### Main website will be running on port 3000

`/etc/nginx/sites-available/sponsors.cash`

```
server {
        listen 80;
        listen [::]:80;

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name sponsors.cash www.sponsors.cash;

        location / {
                proxy_pass http://localhost:3000;
                include /etc/nginx/proxy_params;
        }
}
```

`/etc/nginx/sites-available/ads.sponsors.cash`

```
server {
        listen 80;
        listen [::]:80;

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name ads.sponsors.cash www.ads.sponsors.cash;

        location / {
                proxy_pass http://localhost:3001;
                include /etc/nginx/proxy_params;
        }
}
```
Restart nginx

`sudo service nginx restart`