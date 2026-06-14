FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD npx prisma generate && npm run start:prod
EXPOSE 3000