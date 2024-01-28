#!/bin/bash

version=$(sed -nr 's/.*\"version\": \"([0-9]+\.[0-9]+\.[0-9]+)\".*/\1/p' package.json)-lava-$(date +'%Y%m%d%H%M%S')

git tag "$version"
git tag push origin "$version"
