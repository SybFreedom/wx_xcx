//index.js
//获取应用实例
const app = getApp()
var amapFile = require('../../libs/map/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({
  key: '1be1fa55d80149bc13a9990d1aec66b8'
});
var uri = getApp().urlUse;  //固定API地址
const clientApi = require('../../utils/clientApi.js').clientApi;
Page({
  data: {
    account: 0,
    name: '',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userType:1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    clearInterval(renewLocation);
    //获取定位 
    let latitude_old = 0;
    let longitude_old = 0;
    let renewLocation = setInterval(function() {
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          if (res.latitude != latitude_old || res.longitude != longitude_old) {
            latitude_old = res.latitude;
            longitude_old = res.longitude;
            let params = { courierId: app.globalData.userId, lat: res.latitude, lng: res.longitude };
            // console.log(params)
            clientApi.updateCourdinate_(params).then(d => {
              console.log("更新");
              console.log(d);
            }).catch(error => {

            })
          }
        }
      })
    },5000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        account: this.data.account,
        name: this.data.name
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    this.showLogin();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //发起退出登陆请求
  exit: function() {
    wx.showLoading({
      title: '正在退出中',
    })
    getApp().globalData.userId = null;
    wx.reLaunch({
      url: '/pages/index/index',
      success: function(res) {
        wx.setStorage({
          key: 'account',
          data: '',
        })
        wx.setStorage({
          key: 'password',
          data: '',
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //跳转到订单页面
  goorder1: function() {
    wx.setStorage({
      key: 'statutype',
      data: '0',
    })
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  goorder2: function () {
    wx.setStorage({
      key: 'statutype',
      data: '1',
    })
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  goorder3: function () {
    wx.setStorage({
      key: 'statutype',
      data: '2',
    })
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  showLogin: function () {
    let _this =this;
    wx.request({
      url: uri+'express/expressStatus',
      header:app.globalData.header,
      success:function(res){
        console.log(res);
        app.globalData.userId=res.data.data.id;
        _this.setData({
          userType: res.data.data.type
        })
        _this.getMessageCountByStatus()
      }
    })
  },
  goManage:()=>{
    wx.navigateTo({
      url: '/pages/manage/manage',
    })
  },
  toMessages: function () {
    wx.navigateTo({
      url: '/pages/messages/messages',
    })
  },
  getMessageCountByStatus: function () {
    let _this = this;
    let parm = {
      receiverid: app.globalData.userId,
      receivertype: 2,
      status: 0
    }
    clientApi.getMessageCountByStatus(parm, app.globalData.header).then(d => {
      console.log(d)
      _this.setData({
        messageNum: d.data
      })
    })
  }
})