<p align="center">
    <img src="documentation/wr-square-rounded.png" style="width:200px; border-radius: 15px;" alt="project logo"/>
</p>
<h1 align="center">WaiterRobot</h1>
<p align="center">Lightning fast and simple gastronomy</p>

# Setup

1. Install [Node](https://nodejs.org/) (consider using [node version manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to manage multiple node versions)
2. Install [pnpm](https://pnpm.io/installation)
3. Run `pnpm install`
4. Login to the GitHub container registry (see [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic))

# Local dev

To pull the docker containers you first have to login to the GitHub container registry.
For instructions see [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic).

## Using ng server

```shell
docker compose -f compose-local-dev.yml up & pnpm start && echo "Press Ctrl+C again to stop the containers" && fg
```

Open [localhost:4200](http://localhost:4200). To stop press <kbd>Ctrl</kbd> + <kbd>C</kbd> twice (first time to stop ng serve and second to stop the containers).

## Using nginx container

```shell
docker compose -f compose-local-dev.yml -f compose-local.yml up --build
```

Open [localhost:3000](http://localhost:3000). To Stop press <kbd>Ctrl</kbd> + <kbd>C</kbd>.

## Using nginx container with auto rebuild on changes

```shell
docker compose -f compose-local-dev.yml -f compose-local.yml watch
```

Open [localhost:3000](http://localhost:3000). To Stop press <kbd>Ctrl</kbd> + <kbd>C</kbd>.
> Browser will not reload automatically, you need to refresh manually after rebuild is completed.

# Release new version

## Lava

Run `bash tools/releaseLava.sh` \
This will create and push a new lava version tag using version specified in [package.json](package.json). It automatically appends `-lava-{timestamp}` to the version.
The CI will then build the new docker container image and push it to the github registry.

## Prod

1. Increase the version in the [package.json](package.json) file.
2. Commit and push [package.json](package.json).
3. Run `bash tools/release.sh`

This Will create a new lava release using version specified in [package.json](package.json) and automatically appending `-lava-{timestamp}`.

# Deploy

For deployment instructions see [WaiterRobot-Infrastructure](https://github.com/DatepollSystems/WaiterRobot-Infrastructure).

# Container version schema

Tags with `_local` suffix are build for api hosted on [localhost](http://localhost/api) \
Tags with `_lava` suffix are build for api hosted on [lava.kellner.team](https://lava.kellner.team/api)\
Tags with neither `_lava` nor `_local` suffix are build for api hosted on [my.kellner.team](https://my.kellner.team/api)

Tags containing `-lava` are pre/beta/lava releases. Those are not available for [my.kellner.team](https://my.kellner.team/api).

Samples:

- `3.4.0`, `latest` -> prod release for [my.kellner.team](https://my.kellner.team/api)
- `3.4.0_lava`, `latest_lava` -> prod release for [lava.kellner.team](https://lava.kellner.team/api)
- `3.4.0-lava-20240118135000_lava`, `3.4.0-lava_lava`, `latest-lava_lava` -> pre/beta/lava release for [lava.kellner.team](https://lava.kellner.team/api)
- `3.4.0_local`, `latest_local` -> prod release for [localhost](http://localhost/api)
- `3.4.0-lava-20240118135000_local`, `3.4.0-lava_local`, `latest-lava_local` -> pre/beta/lava release for [localhost](http://localhost/api)
