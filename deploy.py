#!/usr/bin/env python
import click
import tempfile
import shutil
import os
import yaml

from sh import docker, ssh, gzip, scp, docker_compose, Command
import tarfile

here = os.path.dirname(os.path.abspath(__file__))

build_images = Command("./prebuild_prod.sh")

def create_images(server_key, server_uri):
    print('Building prod images')
    build_images()

    with open(os.path.join(here, 'docker-compose.prod.yml')) as f:
        compose = yaml.load(f)
        services = compose['services']

    images = [service['image'] for service in services.values()]
    print('Stopping server')
    ssh('-i', server_key, server_uri, 'docker-compose -f docker-compose.yml -f docker-compose.prod.onserver.yml down')

    print('Cleaning up')
    ssh('-i', server_key, server_uri, 'docker rmi $(docker images -a -q)')

    print('Saving images and transferring to {}'.format(server_uri))

    # Save images locally and pipe them through ssh
    ssh(docker('save', *images, _piped=True),
        '-C', '-i', server_key, server_uri, 'docker load')
    print('Starting the server again')
    ssh('-i', server_key, server_uri, 'docker-compose -f docker-compose.yml -f docker-compose.prod.onserver.yml up -d')
    print('Done')

    print(f"Note that you might want to reset cache on {server_uri}. To do this, SSH to the server and `rm -rf cache/proxy/*`. You will need sudo access for that.")


@click.command()
@click.argument('server_url')
@click.argument('server_key')
def main(server_key, server_url):
    create_images(server_key, server_url)


if __name__ == '__main__':
    main()
