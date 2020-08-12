# SSL configuration

SSL certificate should be placed here in files `marcs.key` and `marcs.crt`

If you do not have a valid certificate, you can generate a self-signed one:

```
openssl req -newkey rsa:2048 -nodes -keyout marcs.key -x509 -days 365 -out marcs.crt
```

Issue the key for `marcs.local` FQDN if you intend to run it in development.
Alternatively use appropriate FQDN.

