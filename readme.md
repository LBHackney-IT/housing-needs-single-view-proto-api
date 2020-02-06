# Housing Needs Single View API

## Getting Local Dev Environment Started

Run npm install in the following directories:
- / (root)
- api/
- authorizer/

Set up the environment variables listed bellow in a `.env` file, the relevant values could be found in the AWS param store
```
/common/hackney-jwt-secret=
/hn-single-view-api/production/UHW_DB=
/hn-single-view-api/production/UHT_DB=
/hn-single-view-api/production/ACADEMY_DB=
/hn-single-view-api/staging/SINGLEVIEW_DB=
/hn-single-view-api/production/SINGLEVIEW_DB=
/hn-single-view-api/production/HN_COMINO_URL=
/hn-single-view-api/production/Jigsaw_email=
/hn-single-view-api/production/Jigsaw_password=
COLLAB_CASEWORK_API=
ENV=
ENABLE_CACHING=
```

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
