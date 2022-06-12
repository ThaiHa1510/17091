export const environment = {
  maxAudioFileSize:1024*1024*10,//10 mb
  production: true,
  appTitle:'xchat-beurettes',
  apiUrl:'https://api.www.xchat-beurettes.com',
  socketUrl:'https://api.www.xchat-beurettes.com',
  ccbill_mode:'TEST',
  baseUrl:"https://www.xchat-beurettes.com",
  ccbill_endpoint:'https://sandbox-api.ccbill.com/wap-frontflex/flexforms/',
  reCaptchaSiteKey:'6LcLttwZAAAAAICmib7hADkrk43jhSeSYIvbj_8O',
  reCaptchaSecretKey:'6LcLttwZAAAAANO0K_hwDtP8rRZCfUJDoHsBuAMP',
  maxLenghtText:255,
  maxLenghtPhone:15,
  minLengthPass:8,
  uploadUrl:'https://api.www.xchat-beurettes.com/api/v1/upload/',
  imageSize:{
    thumbnail:{
      width:200,
      height:250,
    },
    medium:{
      width:250,
      height:350,
    },
    big:{
      width:350,
      height:450,
    },
  }
};
