# Housing Needs Single View API :mag_right:

Provides aggregated data from multiple systems for the Single View of a Hackney Customer

Currently pulls data from:

- UHW
- UHT
- Academy
- Jigsaw
- Comino

## Installation

1\. Run the following in the root directory to install dependencies:

```
$ npm i && pushd api && npm i && popd && pushd authorizer && npm i && popd
```

2\. Add a .env file in the root directory (see .env.sample for file structure).

3\. Set the following value in .env (The production values can be found in the AWS param store):

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

## Usage

### Search:

- Route: `/customers`
- Method: `GET`
- Parameters:
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

## Run the tests

1\. yoloyolo

## Invoke the authorizer

1\. yolobolo

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

## Deployment

## Troubleshooting
