# Backend Stucture Homework

### :bangbang: Attention  :bangbang:
**The code is written by professionals for educational purposes. Don't repeat at home.**

## How to run server:

### First time:
1. `npm install`
2.  create `.env` file, copy values from `.example.env`
3. `npm run docker:dev:db` (runs database in docker container)
4. `npm run migrate:latest && npm run seed` 
5. `npm run dev` (runs server)  

Then just use `npm run docker:dev:db` and `npm run dev`.

## How to run tests:
1. `npm run docker:test:db` (runs separate database for tests)
2. `npm run docker:test`
