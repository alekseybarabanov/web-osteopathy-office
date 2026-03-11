# use a node image as the base image and name it 'build' for
# later reference
FROM node:21.7.3-alpine3.19 as build

# set the working directory to /app
WORKDIR /app
# copy the current directory contents into the container at /app
COPY . .
# install dependencies, matching package-lock.json
RUN npm ci --force
# build the app
RUN npm run build


# Use the latest version of the official Nginx image as the base image
FROM nginx:latest
# copy the custom nginx configuration file to the container in the default
# location
COPY nginx.conf /etc/nginx/nginx.conf
# copy the built application from the build stage to the nginx html
# directory
COPY --from=build /app/dist/browser /usr/share/nginx/html
COPY src/privacy-policy.html /usr/share/nginx/about/privacy-policy.html
COPY docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

