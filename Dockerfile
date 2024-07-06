FROM node:22-alpine

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npx prisma migrate deploy
EXPOSE 3000
CMD ["npm", "run", "start"]

