//index.js
//获取应用实例
var app = getApp()
const clientApi = require('../../utils/clientApi.js').clientApi
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    price:0,  //充值金额
    status:false,
    userMoney:0,
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
    let _this=this;
    app.getUserMonery().then(function (res) {
      _this.setData({
        userMoney: res
      })
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
  //输入充值金额
  updateprice:function(e){
    if (e.detail.value.length>0){
      this.setData({
        status:true
      })
    }else{
      this.setData({
        status: false
      })
    }
    this.setData({
      price:e.detail.value
    });
  },
  //发起支付
  gowxpay:function(e){
    let _this=this;
    if(this.data.price<=0){  //如果输入的金额小于等于0则提示
      wx.showModal({
        showCancel: false,
        confirmText: "确定",
        title: '提示',
        content: '请输入充值金额',
      })
    }else{
      /*
       *整合充值所需信息：
       * userId  用户id
       * money  充值金额 
       */
      let param={
        id:app.userId,
        money:this.data.price
      };
      clientApi.topUp(param).then(d=>{
        if(d.success==1){
          wx.requestPayment({
            timeStamp: d.data.timestamp,
            nonceStr: d.data.noncestr,
            package: 'prepay_id=' + d.data.prepayid,
            signType: d.data.signtype,
            paySign: d.data.sign,
            'success': function (res) {
              /*
              *  获取用户余额接口：
              *  参数：
              *    id -> 用户id
              *  返回数据：
              *    data -> 用户余额
              */
              app.getUserMonery().then(function (res) {
                _this.setData({
                  userMoney: res
                })
              })
              wx.showToast({
                title: '支付成功',
              })
            },
            'fail': function (res) {
              wx.showModal({
                title: '提示！',
                content: '支付失败',
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmText: "确定",
            content: '服务器繁忙，请稍后重试:-(',
            success: function () {
              
            }
          })
        }
       
      })
      // wx.showModal({
      //   title: '充值金额',
      //   content: this.data.price,
      // })
    }
    
  },
  //跳转到充值明细
  gorecord:function(e){
    wx.navigateTo({
      url: '/pages/record/record',
    })
  }
  
})
