#!/usr/bin/ksh

#Loading modules
echo "0"
autoload module
echo "1"
module list 2>/dev/null >/dev/null
echo "2"
module load msde/artifactory-eng-tools/prod
echo "3"
module load ossjs/node/8.9.4
echo "4"
npm install --no-optional
echo "5"
npm i -g @socialgorithm/uabc

echo "Starting test"

START_TIME=$(date "+%H%M%S%N")

uabc -p -f "node player.js"

END_TIME=$(date "+%H%M%S%N")

echo "Time taken: $((($END_TIME-$START_TIME)/100000)) Milliseconds"