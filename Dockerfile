FROM node:20-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY challenge/package.json .
RUN npm install --force --include=dev

COPY challenge .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

USER node

CMD ["npm", "start"]
