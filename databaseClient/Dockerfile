FROM node:16
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
ENV NODE_ENV production
CMD ["tsc", "src/index.ts"]
