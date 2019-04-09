//index.js
//获取应用实例
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    list:[],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })
    console.log('onLoad')
    var that = this
    
  },
  onShow:function(){
    let _this=this;
    /*
     *  获取充值记录列表：topUpList
     *  参数：id -> 用户id
     */
    let param={
      id:app.userId
    };
    wx.showLoading({
      title: '加载中',
    })
    clientApi.topUpList(param).then(d=>{
      wx.hideLoading();
      console.log(d);
      if(d.success==1){
        for(let i=0;i<d.data.length;i++){
          d.data[i]['createdate'] = this.formatTime(d.data[i]['createdate']);
          if (d.data[i]['type']==1){
            //充值
            d.data[i]['zt']='+';  
          } else if (d.data[i]['type'] == 2){
            //消费
            d.data[i]['zt'] = '-';
          }
        }
        _this.setData({
          list : d.data
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let param = {
      userid: app.userId, //用户id
      couponid: app.shareInfo.id  //分享活动id
    }
    console.log(param);
    console.log(app);
    clientApi.userShare(param).then(res => {
      console.log(res);
      if (res.data == 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "确定",
          content: '分享给3个好友即可获得优惠券哟',
          success: function () {
          }
        })
      } else if (res.data == 1) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "去查看",
          content: '恭喜您获得一张优惠券',
          success: function () {
            wx.navigateTo({
              url: '/pages/cards/cards',
            })
          }
        })
      } else if (res.data == 2) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "我知道了",
          content: '您已经领过优惠券了哟',
          success: function () {
          }
        })
      }
    })
    return {
      title: app.userShare.title,//分享获得10元无门槛宠物寄养优惠券
      path: '/pages/home/home',
      imageUrl: app.userShare.image,
      success: (res) => {
        console.log("分享成功", res);
      },
      fail: (res) => {
        console.log("分享失败", res);
      },
    }


  },

  //将时间戳转换为时间
  formatTime: function (time) {
    let unixtime = time
    let date = new Date(unixtime)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month
    };
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day
    };
    let hour = date.getHours();
    if (hour < 10) {
      hour = '0' + hour
    };
    let minute = date.getMinutes();
    if (minute < 10) {
      minute = '0' + minute
    };
    let second = date.getSeconds();
    if (second < 10) {
      second = '0' + second
    };
    return [year, month, day].join('-') + ' ' + [hour, minute].join(':')
  }
  
})
