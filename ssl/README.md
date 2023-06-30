# SSL configuration

SSL certificate should be placed here in files `marcs.key` and `marcs.crt`.
In addition to this, since MARCS can be reached using helmholtz-muenchen and helmholtz-munich 
domain names, one also needs a SSL certificate for the "alternative" domain.
Place it under `marcs-alternative.key` and `marcs-alternative.ssl`

If you do not have a valid certificate, you can generate a self-signed one:

```
openssl req -newkey rsa:2048 -nodes -keyout marcs.key -x509 -days 365 -out marcs.crt
openssl req -newkey rsa:2048 -nodes -keyout marcs-alternative.key -x509 -days 365 -out marcs-alternative.crt
```

Issue the key for `marcs.local` FQDN for the main domain and `marcs.lol` if you intend to run it in development.
For deployment the `marcs.helmholtz-munich.de` is the primary fqdn, and `marcs.helmholtz-muenchen.de` is the alternative.



