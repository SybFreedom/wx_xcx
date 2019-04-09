// pages/mine/mine.js
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {

   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
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
  //查看二维码
  showBigImg: function(){
    wx.previewImage({
      current: 'http://www.chongdaopet.com:20081/images/erweima.png', // 当前显示图片的http链接
      urls: ['http://www.chongdaopet.com:20081/images/erweima.png'] // 需要预览的图片http链接列表
    })
  },
  //领取礼包
  receiveGift:function(){
    let param = {
      userid: app.userId,
      eventid: 1
    }
    let _this = this;
    clientApi.getEventCard(param).then(res => {
      console.log(res);
      if (res.success == 1) {
        wx.showModal({
          title: '恭喜您',
          showCancel: false,
          confirmText: "去查看",
          content: '恭喜您获得豪华大礼包',
          success: function () {
            wx.navigateTo({
              url: '/pages/cards/cards',
            })
          }
        })
      }else if(res.success == 2){
        wx.showModal({
          title: '恭喜您',
          showCancel: false,
          confirmText: "去查看",
          content: '您已经领取过了，不能重复领取哟',
          success: function () {
            wx.navigateTo({
              url: '/pages/cards/cards',
            })
          }
        })
      }else{
        //此时接口错误：抛出繁忙异常
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

  }
})