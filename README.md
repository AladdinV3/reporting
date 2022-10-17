## Description

This service is for storing data for searching purposes and stores data in Elastic Search in a different format from the original one. This service is listening to several services in order to create and update all search records.

## Technology

- Nodejs v14 - Nestjs as framework
- Elastic Search
- RabbitMQ
- Redis
- AWS S3

## Installation

```bash
$ npm install
```

## Running the app

In order to be able to run this app, all the environmental variables should be provided, including: `REDIS_URI`, `RABBITMQ_URI`, `ELASTICSEARCH_NODE`, `ELASTICSEARCH_USERNAME`, `ELASTICSEARCH_PASSWORD`, `AWS_REGION`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
