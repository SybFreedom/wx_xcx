//index.js
//获取应用实例
var app = getApp()
const clientApi = require('../../utils/clientApi.js').clientApi
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    shopmsg:{}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })
    let shopmsg=JSON.parse(e.item);
    console.log(shopmsg);
    this.setData({
      hasUserInfo: true,
      shopmsg:shopmsg
    });
    
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

  //拨打电话
  gotel:function(e){
    let tel=e.currentTarget.dataset.tel;
    wx.makePhoneCall({ 
      phoneNumber: tel, //此号码并非真实电话号码，仅用于测试      
      success:function(){
        console.log("拨打电话成功！")      
      },
      fail:function(){  
        console.log("拨打电话失败！")
      }
    })  
  } 

})
