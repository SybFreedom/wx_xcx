// pages/cancelOrder/cancelOrder.js
const clientApi = require('../../utils/clientApi.js').clientApi
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    orderId:''
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

    this.data.orderId = options.orderId;
    // console.log(app.userId);
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

  input: function (e) {
    this.data.content = e.detail.value;
  },

  commitClick: function(){

    if (this.data.content == '') {
      wx.showModal({
        title: '提示！',
        content: '请填写退订理由！',
      })
      return;
    }
    console.log({ orderId: this.data.orderId, note: this.data.content, userId: app.userId });
    clientApi.applyRefund({ orderId: this.data.orderId, note: this.data.content, userId: app.userId}).then(d => {
      console.log(d);
      if (d.success == 1) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '申请退订成功,请耐心等候'
        })
        wx.navigateBack({
          
        })
      }else{
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: d.msg
        })
      }
    })
  }
})