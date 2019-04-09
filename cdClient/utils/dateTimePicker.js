function withData(param){
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start,end){
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function getLoopArray2(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i+=1) {
    array.push(withData(i));
    //console.log("arrayPush", withData(i))
  }
  return array;
}

function getMonthDay(year,month){
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}

function getMonthDaynum(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = 31
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = 30
      break;
    case '02':
      array = flag ? 29 :  28
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}

function getNewDateArry(){

  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
      mont = withData(newDate.getMonth() + 1),
      date = withData(newDate.getDate()),
      hour = withData(newDate.getHours()),
      minu = withData(newDate.getMinutes()),
      seco = withData(newDate.getSeconds());

  return [year, mont, date, hour, minu, seco];
}
function dateTimePicker(startYear,endYear,date) {
  var dateTime = [], dateTimeArray = [[],[],[],[],[],[]];
  var start = startYear || 1978;
  var end = endYear || 2100;
  
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  // dateTimeArray[0] = getLoopArray(start, end);
  // dateTimeArray[1] = getLoopArray(1, 12);
  // dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  // dateTimeArray[3] = getLoopArray(0, 23);
  // dateTimeArray[4] = getLoopArray2(0, 50);
  // dateTimeArray[5] = getLoopArray(0, 59);
 
  // console.log(defaultDate);
  // console.log(min(defaultDate[4]));
  dateTimeArray[0] = getLoopArray(defaultDate[0],end);  //年
  dateTimeArray[1] = getLoopArray(1, 12);  //月
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);  //日
  //console.log(defaultDate[3]);
  if(defaultDate[3]>17){
    defaultDate[3]=17;
  }
  dateTimeArray[3] = getLoopArray(9, 17);  //时：最晚限制到4点50分
  dateTimeArray[4] = getLoopArray2(min(defaultDate[4]), 59);  //分
  //dateTimeArray[4] = getLoopArray2(defaultDate[4], 59);  //分
  dateTimeArray[5] = getLoopArray(defaultDate[5], 59);  //秒
  // console.log(dateTimeArray.length);
  // console.log(dateTimeArray);
  
  dateTimeArray.forEach((current,index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });
  
  for(let i=0;i<dateTime.length;i++){
    if(dateTime[i]<0){
      dateTime[i]=0;
    }
  }
  // console.log(dateTime);
  // console.log(defaultDate);
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
//分钟
function min(min) {
  // if (min >= 0 && min < 10) {
  //   return 10;
  // } else if (min >= 10 && min < 20) {
  //   return 20;
  // } else if (min >= 20 && min < 30) {
  //   return 30;
  // } else if (min >= 30 && min < 40) {
  //   return 40;
  // } else if (min >= 40 && min < 50) {
  //   return 50;
  // }else{
    return 0;
  // }
}
module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  getLoopArray: getLoopArray,
  getMonthDaynum: getMonthDaynum,
  getLoopArray2: getLoopArray2,
  min: min,
}