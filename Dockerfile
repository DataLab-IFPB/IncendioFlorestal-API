FROM node:16.15 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:1.22
COPY --from=node /app/dist/combate-incendios /usr/share/nginx/html

EXPOSE 80
