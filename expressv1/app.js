//app.js
var server = require('./utils/server');
const clientApi = require('./utils/clientApi.js').clientApi;
var tools = require('./utils/util.js');
App({
  //urlUse:'https://www.chongdaopet.com/',
  urlUse: 'http://192.168.0.44:8099/',
  //通用发送请求
  apiRequest: function (url, methods, post, cb) {
    var that = this;
    wx.request({
      url: clientApi.URI + url,
      data: post,
      method: methods,
      success: function (res) {
        if (200 === res.statusCode) {
          //请求成功
          'function' === typeof cb && cb(res.data);
        } else {
          wx.showToast({
            title: '系统错误',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '服务器请求异常，请稍后重试！',
          showCancel: false
        });
      }
    })
  },

  onLaunch: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              wx.reLaunch({
                url: '/pages/index/index',
              })
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }
      }
    })
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
            data: {
              code: res.code
            }
          })
          console.log(res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }  
      }
    })


  },
  globalData: {
    //O7XBZ-EAUR6-K36ST-MZ4UD-IW4PQ-MBBZ4
    //ITEBZ-NJTKU-DZJVQ-26ESS-D2RJH-MOBQF
    //REJBZ-F4XWF-W4CJN-NVODD-4K75E-YTFLG
    //LUTBZ-R2LRS-3JZOC-63CIY-T53CS-GGBFN
    txMapak: 'LUTBZ-R2LRS-3JZOC-63CIY-T53CS-GGBFN',
    ak: 's2PaApqZup9AvsQllOYNOuVVAGralwj5',
    header: { 'Cookie': '', 'content-type':'application/json'},
    userLocationAddress: {
      city: '',
      provinces: '',
      district: '',
      name: '',
      location: {},
      adcode: ''
    },

    shippingAddress: {
      userName: '',
      phone: '',
      address: '',
      location: '',
      id: '',
      status: '',
      userId: ''
    },

    temAddress: {
      customAddress: '',
      city: '',
      provinces: '',
      district: '',
      name: '',
      location: {},
      adcode: ''
    },
  },
  openid: null,
  appid: 'wxb689650aa3c84d18',
  secret: '74d91cec97c4787c538c27b68c744663',
  rd_session: null,
  goodsAttrubuteStr: null,
  userId: 1,
  userName: '',
  sdkV: '1.2.2',
  windowHeight: 0,
  windowWidth: 0,
  shareTitle: '宠物上门服务平台',
  hasLocation: false,
  hasUserInfo: false,
  wxPayState: false,
  login: function (callBack) {

    var self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          self.getUserInfo(callBack, res.code);
        }
      }
    });
  }
})
if (wx.canIUse('getUpdateManager')) {
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function () {
        // wx.showModal({
        //   title: '更新提示',
        //   content: '新版本已经准备好，是否重启应用？',
        //   success: function (res) {
        //     if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
        //     }
        //   }
        // })
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
      })
    }
  })
} else {
  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
}