#!/bin/bash
until [ "`$(which docker) inspect -f {{.State.Running}} housing-needs-single-view-proto-api_test_db_1`" == "true" ]; do
    echo 'Test container not yet running, waiting...';
    sleep 1;
done;
echo 'Test container running, starting tests';
exit 0;