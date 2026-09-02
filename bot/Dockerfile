FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends firefox-esr \
	&& rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json .
RUN npm install --force

COPY main.js flag.txt ./

USER node

CMD ["npm", "start"]
