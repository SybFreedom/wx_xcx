var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLocation: true,
    hasUserInfo: true,
    userInfo:{},
    windowHeight: 0,
    windowWidth: 0,
    userMoney:0,   //用户余额
    userPoints:0,  //用户积分
    msgCount: 0,  //消息数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.userId);
    //配置分享信息
    app.getShareInfo(1).then(res => {
      app.userShare = res;
    })

    this.setData({
      windowHeight: app.windowHeight,
      windowWidth: app.windowWidth
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    let param={
      receiverid: app.userId,
      receivertype: 1,
      status: 0,
    };
    //获取未读消息数量
    clientApi.getMessageCountByStatus(param).then(res => {
      console.log(res);
      this.setData({
        msgCount:res.data
      })
    })

    console.log(app.userInfo)
    this.setData({
      userInfo: app.userInfo,
    })
    this.getPermiss();
    let _this=this;
    app.getUserMonery().then(function (res) {
      _this.setData({
        userMoney:res
      })
    })
    app.getUserPoints().then(function (res) {
      _this.setData({
        userPoints: res
      })
    })
  },
  getPermiss: function () {
    var _this = this;
    _this.setData({
      hasUserInfo: true
    })
    
    // app.getUserInfoPermissions(function locationS(msg) {

    //   if (msg == 0) {
    //     _this.setData({
    //       hasLocation: true
    //     })
    //   } else if (msg == 1) {
    //     _this.setData({
    //       hasLocation: false
    //     })
    //   } else if (msg == 2) {
    //     _this.setData({
    //       hasUserInfo: true
    //     })
    //   } else if (msg == 3) {
    //     _this.setData({
    //       hasUserInfo: false
    //     })
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(app.shareInfo);
    let param = {
      userid: app.userId, //用户id
      couponid: app.shareInfo.id  //分享活动id
    }
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
      title: app.shareInfo.title,
      path: '/pages/home/home',
      imageUrl: app.shareInfo.image,
      success: (res) => {
        console.log("分享成功", res);
      },
      fail: (res) => {
        console.log("分享失败", res);
      },
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  myAddressClick: function (){
    wx.navigateTo({
      url: '../../pages/myShippingAddress/myShippingAddress',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  serviceClick: function (){
    wx.navigateTo({
      url: '../../pages/serviceDes/serviceDes',
    })
  },
  //跳转到余额
  goprice:function(){
    wx.navigateTo({
      url: '/pages/balance/balance',
    })
  },
  //跳转到卡包
  mycardClick:function(){
    wx.navigateTo({
      url: '/pages/cards/cards?status=2',
    })
  },
  //跳转到我的收藏
  myCollectionClick:function(){
    wx.navigateTo({
      url: '/pages/myCollection/myCollection'
    })
  },
  //跳转到礼包购买页面
  giftClick:function(){
    wx.navigateTo({
      url: '/pages/gift/gift',
    })
  },
  //跳转到消息页面
  goMsgList:function(){
    wx.navigateTo({
      url: '/pages/msgList/msgList',
    })
  }
})