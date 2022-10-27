FROM 290246588742.dkr.ecr.eu-west-1.amazonaws.com/node:node-14.20.1

RUN npm i -g @nestjs/cli
WORKDIR /app

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh
     
COPY package.json .
RUN npm install
COPY . .
ENV RUNNING_ENVIRONMENT=PRODUCTION

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