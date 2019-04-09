function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isEmpty(obj){
  return (obj == null || obj == '' || obj == 'undefined' || typeof (obj) == "undefined");
}


function compareV(app,alertTitle) {
  var that = this;
  
  wx.getSystemInfo({
    success: function (res) {
      if (that.isEmpty(res.SDKVersion)) {
        wx.showModal({
          title: '提示！',
          content: alertTitle ? alertTitle : '当前微信版本过低，可能会影响小程序的使用，请升级微信为最新版本',
        })
      }
      // console.log(res.SDKVersion);
      // console.log(res.SDKVersion.replace(/\./g, '') * 1);
      // console.log(app.sdkV.replace(/\./g, '') * 1);
      var sysSdkV = res.SDKVersion.replace(/\./g, '') * 1;
      var currentUseSdkV = app.sdkV.replace(/\./g, '') * 1;

      if (sysSdkV < currentUseSdkV) {
        wx.showModal({
          title: '提示！',
          content: alertTitle ? alertTitle : '当前微信版本过低，可能会影响小程序的使用，请升级微信为最新版本',
        })
      }
    }

  })
}

function formatNullObj(obj) {
 if (obj == null || obj == 'undefined') {
    return '';
 } else {
   return obj;
 }
}


var EARTH_RADIUS = 6378137.0;    

var PI = Math.PI;



function getRad(d) {

  return d * PI / 180.0;

}

function getGreatCircleDistance(lat1, lng1, lat2, lng2) {

  var radLat1 = getRad(lat1);

  var radLat2 = getRad(lat2);



  var a = radLat1 - radLat2;

  var b = getRad(lng1) - getRad(lng2);



  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));

  s = s * EARTH_RADIUS;

  s = Math.round(s * 10000) / 10000.0;



  return s;

}


//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function toData(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}


module.exports = {
  toData: toData,
  formatTime: formatTime,
  isEmpty: isEmpty,
  formatNullObj: formatNullObj,
  compareV: compareV,
  getGreatCircleDistance: getGreatCircleDistance
}
