//index.js
//获取应用实例
var app = getApp()
const clientApi = require('../../utils/clientApi.js').clientApi
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    item: { price:120},
    isshow: false,  //是否显示购买数量框
    num: 1,  //购买数量
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (opt) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })
    if(opt.item){
      let item = JSON.parse(opt.item);
      console.log(item);
      this.setData({
        item: item
      })
    }
    
   
    
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

  //点击立即购买显示购买数量框
  goshow: function () {
    console.log(this.data.item);
    this.setData({
      isshow: true
    });
  },
  //点击+或-计算数量
  gonum: function (e) {
    let f = e.currentTarget.dataset.f;
    if (f == "+") {
      this.setData({
        num: this.data.num + 1
      });
    } else if (f == "-") {
      if (this.data.num >= 2) {
        this.setData({
          num: this.data.num - 1
        });
      }
    }
  },
  //点击隐藏购买数量框
  gohide: function () {
    this.setData({
      isshow: false
    });
  },
  //去支付
  goorder:function(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmText: "我知道了",
      content: '去支付正在开发中，请客官耐心等待:-)',
      success: function () {
        
      }
    })
  }
})
