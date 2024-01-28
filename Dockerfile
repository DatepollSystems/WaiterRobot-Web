FROM node:20-slim AS buildbase
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM buildbase AS buildprod
RUN pnpm install --frozen-lockfile
RUN pnpm build:prod

FROM buildbase AS buildlava
ARG version=dev
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN sed -ri 's/"version": "[0-9]+\.[0-9]+\.[0-9]+"/"version": "'"$version"'"/g' package.json
RUN pnpm build:lava

FROM buildbase AS buildlocal
ARG version=dev
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN sed -ri 's/"version": "[0-9]+\.[0-9]+\.[0-9]+"/"version": "'"$version"'"/g' package.json
RUN pnpm build:local

FROM nginx:alpine3.18-slim AS base
LABEL org.opencontainers.image.source=https://github.com/DatepollSystems/WaiterRobot-Web
COPY ./public /var/www/public
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

FROM base AS prod
COPY --from=buildprod /app/dist/WaiterRobot-Web/browser /var/www/kellner-web

FROM base AS lava
COPY --from=buildlava /app/dist/WaiterRobot-Web/browser /var/www/kellner-web

FROM base AS local
COPY --from=buildlocal /app/dist/WaiterRobot-Web/browser /var/www/kellner-web

