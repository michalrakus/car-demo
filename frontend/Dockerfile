FROM node:22-alpine AS node-pnpm

RUN npm i -g pnpm

# Stage 1
FROM node-pnpm AS build-stage

WORKDIR /frontend-app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .

#ARG REACT_APP_API_BASE_URL
#ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

ARG REACT_APP_AUTH
ENV REACT_APP_AUTH=${REACT_APP_AUTH}

ARG REACT_APP_AUTH_OFF_USERNAME
ENV REACT_APP_AUTH_OFF_USERNAME=${REACT_APP_AUTH_OFF_USERNAME}

ARG REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_DOMAIN=${REACT_APP_AUTH0_DOMAIN}

ARG REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_CLIENT_ID=${REACT_APP_AUTH0_CLIENT_ID}

ARG REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_AUTH0_AUDIENCE=${REACT_APP_AUTH0_AUDIENCE}

RUN pnpm run build

# Stage 2
FROM nginx:1.23.4-alpine

COPY --from=build-stage /frontend-app/build /usr/share/nginx/html
# ak mame aplikaciu, netreba nam pridavat test-page.html takto separatne
#COPY public/test-page.html /usr/share/nginx/html/

# port na ktorom bezi nginx
EXPOSE ${NGINX_DOCKER_PORT} ${NGINX_DOCKER_PORT_HTTPS}

CMD nginx -g 'daemon off;'
