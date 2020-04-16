# Housing Needs Single View API :mag_right:

Provides aggregated data from multiple systems for the Single View of a Hackney Customer.

Currently pulls data from:

- UHW
- UHT
- Academy
- Jigsaw
- Comino

## Installation

1\. Run the following in the root directory to install dependencies:

```
$ npm i
```

2\. Add a .env file in the root directory (see .env.sample for file structure).

3\. Set the following value in .env (the production values can be found in the AWS param store):

```
/hn-single-view-api/dev/SINGLEVIEW_DB=postgresql://singleview_user:@localhost:10101/hnsingleview
```

3\. Run the following to install the Single View db locally:

```
$ docker-compose up
```

## Run the API

```
$ npm run start
```

## Running integration tests locally

1. Start the test dbs

```
$ docker-compose up -d external_test_dbs test_db
```

2. Check that your .env file contains the TEST ENV section from .env.sample

3. Run the integration tests

```
npm run ci
```

## Usage

### Customer Search:

- Route: `/customers`
- Method: `GET`
- Query Parameters:
  - firstName=`[string]`
  - lastName=`[string]`

### Save Customer Record:

- Route: `/customers`
- Method: `POST`
- Body:

```
{
  source: 'system name',
  id: 'system id',
  firstName: 'forename',
  lastName: 'surname',
  address: 'address',
  dob: 'date of birth',
  nino: 'national insurance number',
}
```

### Delete Customer Record:

- Route: `/customers/:id`
- Method: `DELETE`
- Url Parameters:
  - id=`[string]`

### Fetch Customer Record:

- Route: `/customers/:id/record`
- Method: `GET`
- Url Parameters:
  - id=`[string]`

### Fetch Customer Notes:

- Route: `/customers/:id/notes`
- Method: `GET`
- Url Parameters:
  - id=`[string]`

### Fetch Customer Documents:

- Route: `/customers/:id/notes`
- Method: `GET`
- Url Parameters:
  - id=`[string]`

## Run the tests

```
$ npm run unit-test
```

## Invoke the authorizer

1\. Add a .env file in the authorizer directory (see authorizer/.env.sample for file structure).

2\. Add a event.json file in the authorizer directory (see authorizer/event.json for file structure).

3\. Run the following from the root directory:

```
$ npm run auth
```

## Debug the API (VS Code)

Create a new file at .vscode/launch.json and add the following:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "name": "Serverless Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "debug"],
      "port": 9229
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/api/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    }
  ]
}

```

## Linting

```
$ npm run lint
```

## Prettier

We recommend installing the Prettier extension in your editor to keep formatting consistent.
