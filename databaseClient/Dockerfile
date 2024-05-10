FROM node:16
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5004
ENV NODE_ENV production
CMD ["npm", "run", "prod"]
