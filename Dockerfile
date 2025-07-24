FROM node:20.10.0-alpine as build
WORKDIR /app
COPY . .
COPY yarn.stable.lock yarn.lock
RUN yarn install
RUN yarn build
FROM node:20.10.0-alpine
WORKDIR /app
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json .
COPY --from=build /app/views views
COPY --from=build /app/src ./src
COPY --from=build /app/.sequelizerc .sequelizerc
CMD ["yarn","start-docker"]
