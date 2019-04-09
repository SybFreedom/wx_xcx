// pages/order/order.js
import QQMapWX from '../../libs/map/qqmap-wx-jssdk.min.js';
var amapFile = require('../../libs/map/amap-wx.js');
var uri = getApp().urlUse; //固定API地址
let app = getApp();
let qqMap = new QQMapWX({
  key: getApp().globalData.txMapak // 必填
});
let orderid = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    statu:true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    wx.getStorage({
      key: 'dataid',
      success: function(res) {
        orderid = res.data;
        console.log(orderid);
        wx.request({
          url: uri + 'express/getOrderDetail',
          header: app.globalData.header,
          data: {
            orderId: orderid
          },
          success: function(res) {
            console.log(res);
            if (res.data.success == 0) {
              wx.showToast({
                title: '登录失效，请重新登录',
                icon: 'none',
                success: function() {
                  setTimeout(function() {
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                  }, 1000)
                }
              })
            };
            _this.data.list = res.data.data;
            _this.data.list.createDate = _this.formatTime(_this.data.list.createDate);
            _this.data.list.deliverTime = _this.formatTime(_this.data.list.deliverTime);
            _this.data.list.receiveTime = _this.formatTime(_this.data.list.receiveTime);
            _this.setData({
              list: _this.data.list
            })
          }
        })
      },
    })
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
    let _this = this;
    _this.setData({
      list: _this.data.list
    })
    if (list.deliver_Add.address == null){
      _this.data.statu=false
    }
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
  //拨打电话
  gotel: function(e) {
    let tel = e.currentTarget.dataset.tel;
    console.log(tel);
    wx.makePhoneCall({
      phoneNumber: tel, //此号码并非真实电话号码，仅用于测试
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  //点击跳转到地图
  gomap1: function(e) {
    let _this = this;
    qqMap.geocoder({
      address: _this.data.list.address,
      complete: res => {
        console.log(res)
        if (res.message == '地址搜索无结果' || res.message == "查询无结果") {
          wx.showToast({
            title: '地址搜索无结果',
            icon: 'none'
          })
        } else {
          wx.openLocation({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            name: _this.data.list.address,
            scale: 28
          })
        }
      }
    })
  },
  gomap2: function(e) {
    wx.openLocation({
      latitude: this.data.list.receive_add.lat,
      longitude: this.data.list.receive_add.lng,
      name: this.data.list.receive_add.address,
      scale: 28
    })
  },
  gomap3: function(e) {
    wx.openLocation({
      latitude: this.data.list.deliver_Add.lat,
      longitude: this.data.list.deliver_Add.lng,
      name: this.data.list.deliver_Add.address,
      scale: 28
    })
  },
  confirm_statu1: function() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否确认',
      success: (e) => {
        if (e.confirm == true) {
          _this.data.list.orderStatus = 10;
          let date = new Date;
          _this.data.list.time1 = _this.formatTime(date);
          _this.setData({
            list: _this.data.list
          })
          console.log(orderid)
          wx.request({
            url: uri + 'express/expressUpdateOrderStatus',
            header: app.globalData.header,
            data: {
              id: orderid,
              status: 10,
              on: _this.data.statu
            },
            success: function(res) {
              console.log(res)
            }
          })
        }
      }
    })

  },
  confirm_statu2: function() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否确认',
      success: (e) => {
        if (e.confirm == true) {
          _this.data.list.orderStatus = 13;
          let date = new Date;
          _this.data.list.time2 = _this.formatTime(date);
          _this.setData({
            list: _this.data.list
          })
          wx.request({
            url: uri + 'express/expressUpdateOrderStatus',
            header: app.globalData.header,
            data: {
              id: orderid,
              status: 13,
              on: _this.data.statu
            },
            success: function(res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  confirm_statu3: function() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否确认',
      success: (e) => {
        if (e.confirm == true) {
          _this.data.list.orderStatus = 3;
          let date = new Date;
          _this.data.list.time3 = _this.formatTime(date);
          _this.setData({
            list: _this.data.list
          })
          wx.request({
            url: uri + 'express/expressUpdateOrderStatus',
            header: app.globalData.header,
            data: {
              id: orderid,
              status: 3,
              on: _this.data.statu
            },
            success: function(res) {
              console.log(res)
            }
          })
        }
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