## COPY .env.example TO .env

sudo cp .env.example .env

## INSTALL PACKAGES

npm install

## CREATE DB and SEED USER

node db.js

## UNIT TEST API

npm test

## RUN API

node main.js