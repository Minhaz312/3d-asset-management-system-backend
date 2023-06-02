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
  echo "[${APP}] alive on ${PID} at $(date +'%Y-%m-%d %H:%M:%S')"
else
  echo "[${APP}] dead at $(date +'%Y-%m-%d %H:%M:%S')"
  sudo netstat -anltp | grep LISTEN | grep ${PORT}
  echo ""
fi

if [ `pm2 ls | grep ${APP} | grep 'online' | wc -l` -ne 0 ]; then
  echo "[${APP}] alive on pm2 at $(date +'%Y-%m-%d %H:%M:%S')"
  pm2 stop ${APP}
fi

echo ""
pm2 start pm2.yml
pm2 save

echo ""
PID=`sudo netstat -anltp | grep LISTEN | grep ${PORT} | awk '{ print $7 }' | cut -d '/' -f 1`
echo "[${APP}] alive on ${PID} at $(date +'%Y-%m-%d %H:%M:%S') after deployment."
