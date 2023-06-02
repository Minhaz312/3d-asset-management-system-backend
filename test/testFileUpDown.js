'use strict';

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
if (args.length != 6) {
  console.log('usage) node testFileUpDown.js {env} {id} {pw} {complex} {resolution} {type}');
  console.log('       - env : runtime mode (d | s | o)');
  console.log('       - id : login id (email)');
  console.log('       - pw : login password');
  console.log('       - complex : 1 ~ 4');
  console.log('       - resolution : 256 | 512 | 1024');
  console.log('       - type : asset group');
  process.exit();
}

const randIdx = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomAsset = (_complex) => {
  let data = [];
  switch (_complex){
    case "1":
      data = require("./samples/c1.json");
      break;
    case "2":
      data = require("./samples/c2.json");
      break;
    case "3":
      data = require("./samples/c3.json");
      break;
    case "4":
      data = require("./samples/c4.json");
      break;
  }
  return data[randIdx(data.length)];
};

const testUserLogin = (_id, _pw) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = {
        "mail": _id,
        "password": _pw
      }
      // console.log(`testUserLogin.i : ${JSON.stringify(payload)}`);
      console.time('testUserLogin');

      axios
        .post(`${_URL}/api/user/login`, payload, {
          headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          console.timeEnd('testUserLogin');
          console.log('');
          // console.log(`testUserLogin.o : ${JSON.stringify(res.data)}`);
          const body = res.data.data;
          body.token = res.data.token;
          resolve({ result: true, data: body });
        })
        .catch((err) => {
          console.warn(`testUserLogin.w : ${err.stack.toString()}`);
          resolve({ result: false, data: err.stack });
        });
    } catch (ex) {
      console.warn(`testUserLogin.w : ${new String(ex)}`);
      reject();
    }
  });
};

const testTypeList = (_user) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log(`testTypeList.i : ${_user.token.length}`);
      console.time('testTypeList');

      axios
        .get(`${_URL}/api/type/get/all`, {
          headers: {
            Authorization: _user.token,
            Accept: 'application/json',
          }
        })
        .then((res) => {
          console.timeEnd('testTypeList');
          console.log('');
          // console.log(`testTypeList.o : ${JSON.stringify(res.data)}`);
          const types = res.data.data.map((item) => {
            return item.name;
          })
          resolve({ result: true, data: types });
        })
        .catch((err) => {
          console.warn(`testTypeList.w : ${err.stack.toString()}`);
          resolve({ result: false, data: err.stack });
        });
    } catch (ex) {
      console.warn(new String(ex));
      reject();
    }
  });
};

const testAssetList = (_user, _resolution, _type) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log(`testAssetList.i : ${_user.token.length} | ${_type}`);
      console.time('testAssetList');

      axios
        .get(`${_URL}/api/asset/modelsMetadata?from=0&to=10&modelType=${_type}&resolution=${_resolution}`, {
          headers: {
            Authorization: _user.token,
            Accept: 'application/json',
          }
        })
        .then((res) => {
          console.timeEnd('testAssetList');
          console.log('');
          // console.log(`testAssetList.o : ${JSON.stringify(res.data)}`);
          resolve({ result: true, data: res.data });
        })
        .catch((err) => {
          console.warn(`testAssetList.w : ${err.stack.toString()}`);
          resolve({ result: false, data: err.stack });
        });
    } catch (ex) {
      console.warn(new String(ex));
      reject();
    }
  });
};

const testFileUpload = (_user, _complex, _resolution, _type) => {
  return new Promise((resolve, reject) => {
    try {
      let assetInfo = getRandomAsset(_complex);
      assetInfo.meta.resolution = parseInt(_resolution);
      assetInfo.meta.type = _type;
      assetInfo.meta.user = _user.id;
      const filePath = `./samples/${_complex}/${_resolution}/${assetInfo.file}`;

      if (!fs.existsSync(filePath)){
        console.log('');
        console.log(`${filePath} not available!`);
        return;
      }
      const fileData = fs.createReadStream(filePath);
      const fileName = filePath.split('/')[filePath.split('/').length - 1];
      const fileSize = fs.statSync(filePath)['size'];
      console.log(`testFileUpload.c : ${filePath} | ${fileSize}`);

      const payload = new FormData();
      payload.append("data", JSON.stringify(assetInfo.meta));
      payload.append("singleModel", fileData);
      console.log(`testFileUpload.i : ${JSON.stringify(assetInfo.meta)}`);
      console.time('testFileUpload');

      axios
        .post(`${_URL}/api/asset/register/single`, payload, {
          headers: {
            Authorization: _user.token,
            ...payload.getHeaders(),
            Accept: 'application/json',
          },
        })
        .then((res) => {
          console.timeEnd('testFileUpload');
          console.log('');
          console.log(`${fileName} | ${fileSize}`);
          console.log('::::: file upload with multipart/form-data :::::');
          res.data.name = fileName;
          res.data.size = fileSize;
          // console.log(`testFileUpload.o : ${JSON.stringify(res.data)}`);
          resolve({ result: true, data: res.data });
        })
        .catch((err) => {
          console.log(err.stack);
          resolve({ result: false, data: err.stack });
        });
    } catch (ex) {
      console.warn(new String(ex));
      reject();
    }
  });
};

const testFileDownload = (_user, _file, _resolution) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log(`testFileDownload.i : ${_user.token.length} | ${_resolution} | ${_file.name}`);
      console.time('testFileDownload');

      axios
        .get(`${_URL}/api/asset/download/${_resolution}/${_file.name}`, {
          headers: {
            Authorization: _user.token,
            Accept: 'application/octet-stream',
          },
          responseType: 'stream',
        })
        .then((res) => {
          console.timeEnd('testFileDownload');
          console.log('');
          if (!fs.existsSync("./download")) fs.mkdirSync("./download");
          res.data.pipe(
            fs.createWriteStream(`./download/${_file.name}`),
          );
          _file.resolution = _resolution;
          // console.log(`testFileDownload.o : ${JSON.stringify(_file)}`);
          resolve({ result: true, data: _file });
        })
        .catch((err) => {
          console.warn(`testFileDownload.w : ${err.stack.toString()}`);
          resolve({ result: false, data: err.stack });
        });
    } catch (ex) {
      console.warn(new String(ex));
      reject();
    }
  });
};

if (['d', 's', 'o'].find((i) => args[0].toLowerCase() == i) == undefined){
  console.log('select runtime mode from d(dev) | s(stg) | o(ops)');
  process.exit();
}

if ([1, 2, 3, 4].find((i) => parseInt(args[3]) == i) == undefined){
  console.log('select complex number from 1 | 2 | 3 | 4');
  process.exit();
}

if ([256, 512, 1024].find((i) => parseInt(args[4]) == i) == undefined){
  console.log('select file resolution from 256 | 512 | 1024');
  process.exit();
}

let _URL;
switch(args[0]){
  case 'd':
    _URL = `http://220.118.147.52:46120`;
    break;
  case 's':
    _URL = `http://220.118.147.52:41200`;
    break;
  case 'o':
    _URL = `http://220.118.147.52:51200`;
    break; 
  default:
    console.log(`invalid runtime mode : ${args[0]}`);
    process.exit();
}
console.log(`# testURL : ${_URL}`);

testUserLogin(args[1], args[2])
  .then((r0) => {
    console.log(`! testUserLogin.r0 : ${JSON.stringify(r0)}`);
    if (!r0.result || !r0.data.token){
      console.log('$ testUserLogin.w0 : user not available!');
      process.exit();
    }

    testTypeList(r0.data)
      .then((r1) => {
        console.log(`! testTypeList.r1 : ${JSON.stringify(r1)}`);
        if (!r1.result || r1.data.length == 0 || r1.data.find((i) => args[5] == i) == undefined){
          console.log('$ testAssetList.w1 : asset groups not available or no matching!');
          process.exit();
        }

        testAssetList(r0.data, args[4], args[5])
          .then((r2) => {
            console.log(`! testAssetList.r2 : ${JSON.stringify(r2)}`);
            if (!r2.result || r2.data.length == 0){
              console.log('$ testAssetList.w2 : asset files not available!');
              process.exit();
            }

            testFileUpload(r0.data, args[3], args[4], args[5])
              .then((r3) => {
                console.log(`! testFileUpload.r3 : ${JSON.stringify(r3)}`);
                if (!r3.result || !r3.data.success){
                  console.log('$ testUserLogin.w3 : file not uploaded or already exists!');
                  process.exit();
                }
    
                testFileDownload(r0.data, r3.data, args[4])
                  .then((r4) => {
                    console.log(`! testFileDownload.r4 : ${JSON.stringify(r4)}`);
                  })
                  .catch((e4) => {
                    console.warn(`@ testFileDownload.e4 : ${new String(e4)}`);
                  });
              })
              .catch((e3) => {
                console.warn(`@ testFileUpload.e3 : ${new String(e3)}`);
              });
          })
          .catch((e2) => {
            console.warn(`@ testAssetList.e2 : ${new String(e2)}`);
          })  
      })
      .catch((e1) => {
        console.warn(`@ testTypeList.e1 : ${new String(e1)}`);
      });
  })
  .catch((e0) => {
    console.warn(`@ testUserLogin.e0 : ${new String(e0)}`);
  });
