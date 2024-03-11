<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Done in the [Nest](https://github.com/nestjs/nest) framework.

#### Project structure
The app has 4 modules
    - Aggregation module,  (exposes the API resource which can be used to fetch aggregated data)
    - ExternalData module, (used to fetch data from the Transactions API)
    - Data module,         (used to write data to the service's own permanent storage)
    - App module,          (bootstraps the service and sync data from the transactions API)
It also contains a "commons" directory used to hold commonly used globally available functions & a

#### Endpoint available (after starting the app)
- http://localhost:3000/aggregation/074092 
- http://localhost:3000/aggregation/payouts
May take up to 1 minute before you start seeing any data on these endpoints

#### Process & Architecture
When the service starts, it begins a CRON that run every minute. 
This CRON performs the job of fetching data from eternal transaction API and aggregates it.
Once aggregated, it adds those aggregations to the services own data store (SQLITE).
Since these aggregations are simple additions, newly found data can simply be added on top existing data.
This CRON also does some filtering to ensure idempotency. Even when faced with duplicate data, it is able to filter out transaction it has already processed before.

#### Improvements & Assumptions
The cron runs every minute and is done executing by the next minute.
Given the service runs in a cluster, there can only one instance of the service fetching from the transaction API, I would have done this by using a shared key
Once data is synced, it is store in a data source, accessible to all instances of the service
I would not have used SQLite, I only used it due to the time constraint. I would have likely used an in-memory store such as redis, given the low-latency requirement.
I might have experimented with a share RDS instance first, as those tend to be extremely low latency
I would have added role based authentication to all the publicly exposed endpoints
I would have added filtering and sorting to the API resources


#### Testing Strategy
Given additional time, I would have invested it in adding unit & integrations test at the least, and possibly e2e tests too if time permits
I'd have added unit tests for all critical functionalities of the logic, testing individual services, and utility functions.
I'd have tested how the different modules of the application interact with each other. This would also involve testing interactions between the services and the database.
Give we are exposing publicly available API resources, I'd have also tested the authentication, DoS & other common attacks, perhaps even added a rate limiter.

TDD would be possible, especially when the business goals and requirements are clearly defined. 
From the overall business goal, we'd have to write down some user stories. 
We break these down into small digestible tasks, where a success criteria is defined
Once we have our tasks, we can begin to write test cases that assert the happy path of our feature as well as edge cases we can identify


## Instal dependancies before attempting to start the app

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
