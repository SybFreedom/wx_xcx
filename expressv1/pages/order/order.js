// pages/order/order.js
var app = getApp();
var txmap = require('../../libs/map/qqmap-wx-jssdk.min.js');
var tools = require('../../utils/util.js');
var uri = getApp().urlUse;  //固定API地址
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gc:1,
    statutype: 0,
    selected: true,
    selected1: false,
    selected2: false,
    orderlist: [],
    orderlist2: [],
    orderlist3: []
  },
  selected: function(e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected: true
    })
  },
  selected1: function(e) {
    this.setData({
      selected: false,
      selected2: false,
      selected1: true
    })
  },
  selected2: function(e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      orderlist: [],
      orderlist2: [],
      orderlist3: []
    })
    wx.getStorage({
      key: 'statutype',
      success: function(res) {
        _this.data.statutype = res.data
        _this.setData({
          statutype: _this.data.statutype
        })
        if (_this.data.statutype==0){
          _this.getOrderList();
        } else if (_this.data.statutype == 1){
          _this.getOrderList2();
        } else {
          _this.getOrderList3();
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //跳转到订单详情页面
  godetails: function(e) {
    console.log(e)
    wx.setStorage({
      key: 'dataid',
      data: e.currentTarget.dataset.id,
    })
    wx.navigateTo({
      url: '/pages/details/details',
    })
  },
  acceptOrder: function(e) {
    let _this = this;
    let orderid = this.data.orderlist[e.currentTarget.dataset.index][0];
    let userid = app.globalData.userId;
    wx.showModal({
      title: '提示',
      content: '是否确认接受订单',
      success:(e)=>{
        console.log(e)
        if(e.confirm==true){
          wx.request({
            url: uri+'express/assignOrder',
            data: {
              id: userid,
              orderId: orderid
            },
            method: 'GET',
            header: app.globalData.header,
            success: function (res) {
              console.log(res)
              if (res.data.success == 0) {
                wx.showToast({
                  title: '登录失效，请重新登录',
                  icon: 'none',
                  success: function () {
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                  }
                })
              } else {
                if(res.data.status==5003){
                  wx.showToast({
                    title: res.data.msg,
                    icon:'none'
                  })
                }
                
              }
              _this.onLoad();
              wx.setStorage({
                key: 'dataid',
                data: orderid,
              })
              
              wx.navigateTo({
                url: '/pages/details/details',
              })
            }
          })
        }
      }
    })
  },
  getOrderList: function() {
    let _this = this;
    wx.request({
      url: uri+'express/availableOrderList',
      header: app.globalData.header,
      success: function(res) {
        console.log(res);
        if(res.data.success==0){
          wx.showToast({
            title: '登录失效，请重新登录',
            icon:'none',
            success:function(){
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              },1000)
            }
          })
        };
        _this.data.orderlist = res.data.data;
        for (let i = 0; i < _this.data.orderlist.length; i++) {
          _this.data.orderlist[i][4] = _this.formatTime(_this.data.orderlist[i][4])
          _this.data.orderlist[i][5] = _this.formatTime(_this.data.orderlist[i][5])
          _this.setData({
            orderlist: _this.data.orderlist
          })
        }
        console.log(_this.data.orderlist)
      }
    })
 },
  getOrderList2: function () {
    let _this = this;
    console.log(app.globalData.userId)
    wx.request({
      url: uri+'express/myOrderList',
      header: app.globalData.header,
      data:{
        id:app.globalData.userId
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == 0) {
          wx.showToast({
            title: '登录失效，请重新登录',
            icon: 'none',
            success: function () {
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }, 1000)
            }
          })
        };
        _this.data.orderlist2 = res.data.data;
        for (let i = 0; i < _this.data.orderlist2.length; i++) {
          _this.data.orderlist2[i][5] = _this.formatTime(_this.data.orderlist2[i][5])
          _this.data.orderlist2[i][6] = _this.formatTime(_this.data.orderlist2[i][6])
        }
        _this.setData({
          orderlist2: res.data.data
        })
      }
    })
  },
  getOrderList3: function () {
    let _this = this;
    wx.request({
      url: uri+'express/getMyCompleteOrderList',
      header: app.globalData.header,
      data: {
        id: app.globalData.userId
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == 0) {
          wx.showToast({
            title: '登录失效，请重新登录',
            icon: 'none',
            success: function () {
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }, 1000)
            }
          })
        };
        _this.data.orderlist3 = res.data.data;
        for (let i = 0; i < _this.data.orderlist3.length; i++) {
          _this.data.orderlist3[i][5] = _this.formatTime(_this.data.orderlist3[i][5])
          _this.data.orderlist3[i][6] = _this.formatTime(_this.data.orderlist3[i][6])
        }
        _this.setData({
          orderlist3: res.data.data
        })
      }
    })
  },
  formatTime: function(time) {
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
    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
  }
})