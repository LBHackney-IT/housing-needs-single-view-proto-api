# Housing Needs Single View API

## Getting Local Dev Environment Started

Run npm install in the following directories:
- / (root)
- api/
- authorizer/

Set up the environment variables listed in [.env.sample](https://github.com/LBHackney-IT/housing-needs-single-view-proto-api/blob/master/.env.sample) and save them in a `.env` file, the relevant values could be found in the AWS param store

Add the following to the hosts file
```
127.0.0.1 localdev.hackney.gov.uk
```

Set up the DB by running
```
$ docker-compose up db
```

Start the API by running
```
$ npm run start
```

Play with the API by visiting http://localdev.hackney.gov.uk:3000/customers?firstName=john&lastName=smith
