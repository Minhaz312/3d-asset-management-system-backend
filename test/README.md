# 3D AMS Backend API Test

## Project setup
```
npm install --silent
```

### File Upload & Downlaod (New)
```
$ node testFileUpDown.js d {userId} {userPw} Test 4 512
# testURL : http://220.118.147.52:46120

testUserLogin: 195.713ms
! testUserLogin.r0 : {"result":true,"data":{"id":"6336fb85dfbd0c33a4937abd","username":"bmyi","mail":"{userId}","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRpbiI6dHJ1ZSwiaWQiOiI2MzM2ZmI4NWRmYmQwYzMzYTQ5MzdhYmQiLCJ1c2VybmFtZSI6ImJteWkiLCJpYXQiOjE2NjY2NjcyMzF9.vLMZIk_8JdCDLgq51_QfJ6CBNscEYrRLGhmCEuCHox8"}}

testTypeList: 104.372ms
! testTypeList.r1 : {"result":true,"data":["Test","F1","Building","T-Test-1","T-Test-2"]}

testAssetList: 105.176ms
! testAssetList.r2 : {"result":true,"data":{"success":true,"data":[{"orientation":{"heading":90,"pitch":0,"roll":0},"position":{"longitude":128.3796557,"latitude":36.1174105,"altitude":33},"fileId":"635745367cb3e6c61bff62ae","author":"6336fb85dfbd0c33a4937abd","blockName":"공단동 120","complex":1,"height":10,"modelType":"Test","modelOwners":["(주)보성기전"],"filename":"GongDanDong_120.glb","resolution":512,"scale":1,"unique":true,"firstTime":1666663734325,"lastTime":1666663734325,"createdAt":"2022-10-25T02:08:54.325Z","updatedAt":"2022-10-25T02:08:54.325Z","use":true},{"orientation":{"heading":270,"pitch":0,"roll":0},"position":{"longitude":128.376745,"latitude":36.1186704,"altitude":33},"fileId":"635745522515da3b8a7cf229","author":"6336fb85dfbd0c33a4937abd","blockName":"구포동 621","complex":2,"height":15,"modelType":"Test","modelOwners":["계림요업㈜","케이엘테크"],"filename":"Gupodong_621.glb","resolution":512,"scale":1,"unique":true,"firstTime":1666663762587,"lastTime":1666663762587,"createdAt":"2022-10-25T02:09:22.587Z","updatedAt":"2022-10-25T02:09:22.587Z","use":true},{"orientation":{"heading":90,"pitch":0,"roll":0},"position":{"longitude":128.4113125,"latitude":36.0918291,"altitude":34},"fileId":"6357455d20d867110715884f","author":"6336fb85dfbd0c33a4937abd","blockName":"시미동 165","complex":3,"height":20,"modelType":"Test","modelOwners":["(주)퓨리텍","예찬크리닝","그린산업"],"filename":"ShimiDong_165.glb","resolution":512,"scale":1,"unique":true,"firstTime":1666663773037,"lastTime":1666663773037,"createdAt":"2022-10-25T02:09:33.037Z","updatedAt":"2022-10-25T02:09:33.037Z","use":true},{"orientation":{"heading":90,"pitch":0,"roll":0},"position":{"longitude":128.442633,"latitude":36.149656,"altitude":85},"fileId":"63574560cea25901387fa597","author":"6336fb85dfbd0c33a4937abd","blockName":"신당리 1245","complex":4,"height":11,"modelType":"Test","modelOwners":["(주)건엽","(주)월드티엔에스","랩메이트","메타넷대우정보(주)","세림테크"],"filename":"ShinDangRi_1245.glb","resolution":512,"scale":1,"unique":true,"firstTime":1666663776817,"lastTime":1666663776817,"createdAt":"2022-10-25T02:09:36.817Z","updatedAt":"2022-10-25T02:09:36.817Z","use":true}]}}

testFileUpload.c : ./samples/4/512/ShinDangRi_1250.glb | 91072
testFileUpload: 105.022ms
ShinDangRi_1250.glb | 91072
::::: file upload with multipart/form-data :::::
! testFileUpload.r3 : {"result":true,"data":{"success":true,"message":"Successfully registered","name":"ShinDangRi_1250.glb","size":91072}}

testFileDownload: 42.809ms
! testFileDownload.r4 : {"result":true,"data":{"success":true,"message":"Successfully registered","name":"ShinDangRi_1250.glb","size":91072,"resolution":"512"}}

$ ll download/
total 860
-rw-r--r-- 1 localhost 197121 110436 Oct 25 11:08 GongDanDong_120.glb
-rw-r--r-- 1 localhost 197121  93576 Oct 25 11:09 Gupodong_621.glb
-rw-r--r-- 1 localhost 197121 343252 Oct 25 11:09 ShimiDong_165.glb
-rw-r--r-- 1 localhost 197121 234600 Oct 25 11:09 ShinDangRi_1245.glb
-rw-r--r-- 1 localhost 197121  91072 Oct 25 12:07 ShinDangRi_1250.glb
```
