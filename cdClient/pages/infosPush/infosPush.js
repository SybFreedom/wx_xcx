// pages/infosPush/infosPush.js
const clientApi = require('../../utils/clientApi.js').clientApi;
let app = getApp();
let parm={};
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
  onShareAppMessage: function () {

  },
  input1:function(e){
    parm.userName=e.detail.value
  },
  input2: function (e) {
    parm.adoptionCategory = e.detail.value
  },
  input3: function (e) {
    parm.userPhone = e.detail.value
  },
  input4: function (e) {
    parm.region = e.detail.value
  },
  submitInfos:function(){
    
    if (parm.userName == null || parm.adoptionCategory == null || parm.userPhone == null || parm.region == null){
      wx.showToast({
        title: '请填写完整信息',
        icon:'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中',
    })
    parm.userId=app.userId;
    console.log(parm)
    clientApi.addUserIdentify(parm).then(d=>{
      console.log(d)
      wx.hideLoading()
      if(d.status==200){
        wx.showToast({
          title: '领取成功，获得2张优惠券',
          icon:'none'
        })
        setTimeout(function(){
          wx.navigateBack({

          })
        },1500)
      } else if (d.status == 500) {
        wx.showToast({
          title: '请勿重复领取',
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({

          })
        }, 1500)
      }else{
        wx.showToast({
          title: '领取失败',
          icon: 'none'
        })
      }
    })
  }
})