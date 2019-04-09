// pages/deliveryInfo/deliveryInfo.js

var app = getApp();
var tools = require('../../utils/util.js');
const clientApi = require('../../utils/clientApi.js').clientApi

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:0,
    mapHeight: 0,
    scale: 13,
    // controls: [{ clickable: true, iconPath: "../../images/switch.png", id: 1, position: { height: 40, left: 325, top: 10, width: 40}}],
    controls: [],
    markers: [{
      iconPath: "../../images/timg.jpeg", id: 1, latitude: "26.556996",
      longitude: "106.688844", width: 60, height: 60, callout: { content: "乐天配送", display: "ALWAYS",padding:10}}],
    orderId:{},
    orderItem:null,
    isKeepLoad:true,
    isFinish:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          mapHeight: res.windowHeight - 230,
          setpsHeight: (res.windowHeight - 80) / 3,
          orderId: options.orderId,
          isFinish: options.isFinish *1
        })
      },
    })

    //获取当前经纬度
    wx.getLocation({
      type:'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })

      },
    })
    
    this.getRechargeOrder();
  },

  getRechargeOrder() {

    if (!this.data.isKeepLoad || this.data.isFinish) { return }

    var params = { orderId: this.data.orderId}
    clientApi.getRechargeOrder(params).then(d => {
      console.log("成功" + JSON.stringify(d));
      if (d.success == 1) {
        
        var markers = [{
          iconPath: "../../images/ic_express_car.png", id: d.data.courier.id, latitude: d.data.courier.lastLat,
          longitude: d.data.courier.lastLng, width: 20, height: 20, callout: { content: "配送努力中", display: "ALWAYS", padding: 10 }
        }]
        this.setData({
          orderItem: d.data,
          markers: markers
        })

        setTimeout(() => {
          this.getRechargeOrder();
        }, 5000);
      } else {
        wx.showModal({
          title: '提示!',
          content: d.msg,
          success: res => {
            wx.navigateBack({
              
            })
          }
        })
      }
    }).catch(error => {
      console.log("错误" + JSON.stringify(error));
    })
  },

  callTel(tel) {
    wx.makePhoneCall({
      phoneNumber: tel.currentTarget.dataset.tel,
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
    this.setData({
      isKeepLoad:false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isKeepLoad: false
    })
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
  
  }
})