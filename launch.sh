#!/bin/bash
git status
git pull
git log -5

npm i --silent
#npm run build

APP="api-ams"
PORT=8080
PID=`sudo netstat -anltp | grep LISTEN | grep ${PORT} | awk '{ print $7 }' | cut -d '/' -f 1`

if [ ! -z ${PID} ]; then
  echo "[${APP}] alive on ${PID}!"
  sudo kill -9 ${PID}
  echo "[${APP}] process (${PID}) killed!"
fi

nohup node index.js &
echo "[${APP}] nohup service up and running on port ${PORT}"
echo "[${APP}] check log /w tail -f nohup.out"
