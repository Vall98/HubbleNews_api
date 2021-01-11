FROM node:14-slim

COPY . /home/files

WORKDIR /home/files

CMD rm -rf dist/index.js && rm -rf back/* && npm i && cp -R node_modules back/ && cp -R package* back/ && npm run build && cp -R dist/* back/