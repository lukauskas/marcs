[![CC-BY-NC-SA badge](https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

# MARCS interactive web interface.

MARCS interactive web interface is split into two (optionally three) parts:

1. `fastapi` powered API, available at `/api`, which handles the data requests
2. `nginx` loadbalancer node which redirects requests to API, caches them,
    and serves a webpack packaged REACT frontend.
3.  (optional) In the development build of the interface,
    the third docker container hot-loads webpack frontend for javascript development.


## Building

### Prerequisites

#### Operating system

This container can be built on Linux and Mac OS X.

#### Docker

Docker daemon has to be installed on the system before starting.

* MAC OS X: [instructions here](https://docs.docker.com/docker-for-mac/install/)
* linux: use your distro's package manager.

#### Docker-compose

See https://docs.docker.com/compose/, install it via your favourite package manager.

#### MARCS data analysis results 

The build steps for interactive interface depend on the pre-built results from the data analysis image.
Please follow instructions on https://github.com/lukauskas/publications-lukauskas-2021-marcs
to build the `snapanalysis` image and make sure to have `marcs.for-web.tar.gz`  file somewhere.

The build scripts will take this file as the first parameter.

####  SSL certificate

MARCS is configured to be `https` only.
Please obtain an appropriate SSL certificate if you want to host it.
Alternatively, especially for the development create a self-signed certificate
and place it in `ssl` directory.
See the accompanying [README](ssl/README.md)

#### MATOMO tracking settings (optional)

The app integrates tracking by [matomo](https://matomo.org/) out of the box.
The tracking is disabled by default, in order to enable it,
copy [`matomo.sourceme.template`](matomo.sourceme.template) to `matomo.sourceme`,
and update the variables specified in this template accordingly.

### Overview of the key configuration files

Docker services configuration files:

1. `docker-compose.yml` - the key docker-compose file, describing the main services and how they operate
2. `docker-compose.override.yml` - the additional  configuration details on each of the services, used for development builds (with realtime change reloading for JS)
3. `docker-compose.prod.yml` - additional configuration details on each of the services, in prod config (compiled javascript, no realtime change reloading)
4. `docker-compose.prod.onserver.yml` - configuration details for each of the services that are specific for the live version of the code which lives on server (e.g. domain name)

Other configuration files

1. `matomo.sourceme` - configuration for matomo tracking services, see [`matomo.sourceme.template`](matomo.sourceme.template)


### Development build

First, add the following entry to your `/etc/hosts` file:

```
127.0.0.1 marcs.local
```

This will redirect https://marcs.local to localhost.
Ensure [your SSL certificate](ssl/README.md) is signed for `marcs.local`

Alternatively, edit the `NGINX_HOST=marcs.local` entry in `docker-compose.override.yml` to match a FQDN of your choice.

The default settings of `docker-compose` files point to development build.
To start the development server use the helper script:

```
./build_run_dev.sh [location of marcs.for-web.tar.gz]
```

Proceed to

```
https://marcs.local
```

Your browser might warn you about insecure SSL certificate, which is to be expected
if you are using a self-signed one.


#### Building API (development mode)

API can be built separately from the rest of interface by the `buildnrun.sh` script in `api` directory.
This is useful for API development purposes. The build script again takes `[location of marcs.for-web.tar.gz]` as a paramer.
Having said that, development build will also build the API so it can be developed this way too.

### Production build

Ensure `NGINX_HOST` is set to the correct FQDN in `docker-compose.prod.prebuilt.yml`
Ensure that you have an appropriate `ssl` key [README](ssl/README.md)

The production pipeline is set up as follows, and can be run with one click in `deploy.py` script.

1. Prebuild (on your local computer): production images are built
2. Transfer of images onto server
3. Loading and running the daemon

#### Prebuild

The production images can be prebuilt from `docker-compose.yml` and `docker-compose.prod.yml` files:

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --force-rm --parallel
```

Convenience script `prebuild_prod.sh` does the job (and should be used as it sets the argumetns correctly):

```
./prebuild_prod.sh [location of marcs.for-web.tar.gz]
```

The prebuilt images can be tested via

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

Convenience script:

```
./test_prebuilt_prod.sh
```

They will still run locally `https://marcs.local`

The images can then be transferred to the server (this is done by `deploy.py` script) in which

```
docker-compose -f docker-compose.yml -f docker-compose.prod.onserver.yml up -d
```

will start the server in daemon mode.

Note that on server, in the directory where `docker-compose.yml` and `docker-compose.prod.onserver.yml`
are, there should be:

1. A `ssl` directory with owner `101:101`
2. A `cache/proxy` directory with owner `101:101`

As these will be mounted non-privileged.

## License

[![CC-BY-NC-SA badge (large)](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
