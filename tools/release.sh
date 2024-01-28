#!/bin/bash

version=$(sed -nr 's/.*\"version\": \"([0-9]+\.[0-9]+\.[0-9]+)\".*/\1/p' package.json)

git tag "$version"
git tag push origin "$version"
