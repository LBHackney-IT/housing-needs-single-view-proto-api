# Housing Needs Single View API

## Getting Local Dev Environment Started

Run npm install in the following directories:
- / (root)
- api/
- authorizer/

Find the environment variables which are stored in the AWS param store and set them up in `.env`

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
