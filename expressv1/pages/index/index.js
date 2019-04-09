//index.js
//获取应用实例
import QQMapWX from '../../libs/map/qqmap-wx-jssdk.min.js';
var txmap = require('../../libs/map/qqmap-wx-jssdk.min.js');
var tools = require('../../utils/util.js');
const clientApi = require('../../utils/clientApi.js').clientApi;
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    account: '', //账号
    password: '', //密码
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toLogin: function(e) {
    clientApi.toLogin(e).then(d => {
      console.log(d);
      if (d.success == 1) {
        getApp().globalData.header.Cookie = 'JSESSIONID=' + d.sessionId;
        if (this.data.account != '') {
          wx.setStorage({
            key: 'account',
            data: this.data.account,
          })
          wx.setStorage({
            key: 'password',
            data: this.data.password,
          })
        }
        wx.reLaunch({
          url: '/pages/home/home',
        })
      } else if (d.success == 2) {
        wx.showToast({
          title: '请输入正确的账号密码',
          icon: 'none'
        })
      }
    }).catch(d => {
      wx.showToast({
        title: '登录请求失败',
        icon: 'none'
      })
    })
  },
  onLoad: function() {
    let _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          _this.postionUserLocation()
          console.log(getApp().globalData.userId);
          let account = '';
          let password = '';
          wx.getStorage({
            key: 'account',
            success: function(res) {
              account = res.data
              wx.getStorage({
                key: 'password',
                success: function(res) {
                  password = res.data;
                  if (password != '') {
                    let logininfo = new Object;
                    logininfo.username = account;
                    logininfo.pwd = password;
                    console.log(logininfo);
                    _this.toLogin(logininfo);
                  }
                },
              });
            },
          });
        }
      }
    })
  },
  postionUserLocation: function() {
    var that = this;
    var demo = new QQMapWX({
      key: 'LUTBZ-R2LRS-3JZOC-63CIY-T53CS-GGBFN'
    });
    demo.reverseGeocoder({
      success: function(res) {
        var res = res.result;
        console.log(res);
        //此处根据腾讯地图获得到不同城市请求响应服务器
        // if (res.ad_info.city == "贵阳市") {
        //   app.urlUse = "https://gy.chongdaopet.com/";
        //   clientApi.URI = "https://gy.chongdaopet.com/";
        // }
      }
    });
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  //记录用户输入的账号
  updateaccount: function(e) {
    this.setData({
      account: e.detail.value
    });
  },
  //记录用户输入的密码
  updatepassword: function(e) {
    this.setData({
      password: e.detail.value
    });
  },
  //点击确定执行登陆操作
  gologin: function() {
    if (this.data.account == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入账号'
      })
    } else if (this.data.password == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入密码'
      })
    } else {
      //发起登陆请求
      wx.showLoading({
        title: '正在登陆中',
      })
      let logininfo = new Object;
      logininfo.username = this.data.account;
      logininfo.pwd = this.data.password;
      console.log(logininfo);
      this.toLogin(logininfo);
    }
  },
  //跳转到注册页面
  // register:function(){
  //   wx.navigateTo({
  //     url: '/pages/register/register',
  //   })
  // }
})