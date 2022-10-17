FROM node:14-alpine3.12

RUN npm i -g @nestjs/cli
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV RUNNING_ENVIRONMENT=DEVELOPMENT

CMD ["npm","run","start:dev"]

# FROM node:14-alpine3.12 AS builder
# WORKDIR /app
# COPY ./package.json ./
# RUN npm install
# COPY . .
# RUN npm run build


# FROM node:14-alpine3.12
# WORKDIR /app
# COPY --from=builder /app ./
# CMD ["npm", "run", "start:prod"]