var server = require('./utils/server');
const clientApi = require('./utils/clientApi.js').clientApi;
var tools = require('./utils/util.js');
App({
  newUrl : 'http://192.168.0.44:8099/',
  //newUrl : 'https://dev.chongdaopet.com/',
  //newUrl: 'https://www.chongdaopet.com/',
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



	onLaunch: function (opt) {
    // wx.getLocation({
    //   success: function(res) {
    //     console.log(res);
    //   },
    // })
    // 获取小程序更新机制兼容
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
              //   }
              // }
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


  //临时登陆凭证
    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx601e284d89b5ad6b&secret=95bc30c8e25484485b53b998bace1d1c&js_code='+res.code+'&grant_type=authorization_code',
    //         data: {
    //           code: res.code
    //         },
    //         success:function(e){
    //           console.log(e);
    //         }
    //       })
    //       console.log(res)
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // });

   //临时登陆凭证完结



    tools.compareV(this);
		var self = this;
		var rd_session = wx.getStorageSync('rd_session');

    wx.getSystemInfo({
      success: (res) => {
          self.windowHeight = res.windowHeight,
          self.windowWidth  = res.windowWidth
      }
    })

    //小程序初始化执行登陆操作
    //let activity = opt.activity ? opt.activity:0;
    //wx.clearStorage();
    //从本地存储中获取用户信息，如果有用户信息则跳过登陆流程，如果没有则发起登陆操作
    // wx.getStorage({
    //   key: 'userMsg',
    //   success(e) {
    //     //此时本都存储中有用户信息跳过登陆流程
    //     console.log(e.data)
    //     self.activity = e.data.activity;
    //     self.userId = e.data.id;
    //     self.openid = e.data.openId;
    //     self.userMoney = e.data.money;
    //     self.userPoints = e.data.points;
    //     self.isShowCards = e.data.loginevent;
    //     self.userInfo = e.data.userInfo;
    //   },
    //   fail(e) {
    //     //此时本地存储中没有用户信息，发起登陆操作
    //     self.login(activity);
    //   }
    // })
    

    //让用户允许地理位置授权
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success(res) {
    //           // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //           // wx.startRecord()
    //           console.log(res);
    //         },
    //         fail:function(err){
    //           console.log(err);
    //         }
    //       })
    //     }
    //   }
    // })

    
    //判断用户是否授权，如果没有授权则跳转到授权页面
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log("我跳转到授权页面了");
          wx.reLaunch({
            url: '../../pages/authorization/authorization',
          })
        }
        // if (!res.authSetting['scope.writePhotosAlbum']) {
        //   console.log("我跳转到授权页面了");
        //   wx.reLaunch({
        //     url: '../../pages/authorization/authorization',
        //   })
        // }
      }
    })

    // self.getUserInfoPermissions();
		// if (!rd_session) {
			
		// } else {
    //   console.log(123);
		// 	wx.checkSession({
		// 		success: function () {
		// 			// 登录态未过期
		// 			console.log('登录态未过期')
		// 			self.rd_session = rd_session;
		// 			self.getUserInfo();
		// 		},
		// 		fail: function () {
		// 			//登录态过期
		// 			self.login();
		// 		}
		// 	})
		// }
	},
	onShow: function () {

	},
  onHide: function () {

  },

  //获取用户余额
  getUserMonery:function(){
    let _this=this;
    return new Promise(function (resolve, reject) {
      clientApi.queryMoney({ id: _this.userId }).then(d => {
        _this.userMoney = d.data;
        resolve(d.data);
      })
    })
  },
  //获取用户积分
  getUserPoints: function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
      clientApi.queryPoints({ id: _this.userId }).then(d => {
        _this.userPoints = d.data;
        resolve(d.data);
      })
    })
  },
  //获取分享信息
  getShareInfo: function (couponid) {
    let _this = this;
    return new Promise(function (resolve, reject) {
      clientApi.getShareInfo({ couponid: couponid }).then(d => {
        _this.shareInfo = d.data;
        resolve(d.data);
      })
    })
  },
  //检测用户地理位置是否授权
  getUserLocationStatus:function(){
    let _this=this;
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation']) {
            resolve('success');
          }else{
            reject('error');
          }
        }
      })
    })  
  },


  //检测用户登陆状态: 查看本地存储是否有用户信息，如果有则把本地存储中的用户信息赋值到app.js中，如果没有则发起登陆操作
  getUserInfoPermissions: function (callBack) {
    var _this = this; 
    if (_this.userId == '' || _this.userId == null){
      wx.getStorage({
        key: 'userMsg',
        success(e) {
          //此时本都存储中有用户信息跳过登陆流程
          console.log(e.data)
          _this.activity = e.data.activity;
          _this.userId = e.data.id;
          _this.openid = e.data.openId;
          _this.userMoney = e.data.money;
          _this.userPoints = e.data.points;
          _this.isShowCards = e.data.loginevent;
          _this.userInfo = e.data.userInfo;
          callBack(2);
        },
        fail(e) {
          //此时本地存储中没有用户信息，发起登陆操作
          _this.login().then(res => {
            console.log(res);
            callBack(2);
          })
        }
      })
    }else{
      // console.log(111);
      callBack(2);
    }


    // wx.getSetting({
    //   success(res) {
    //     if (!res['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success() {
    //           _this.hasLocation = true
    //           callBack(0);
    //           wx.getSetting({
    //             success(res) {
    //               if (!res['scope.userInfo']) {
    //                 wx.authorize({
    //                   scope: 'scope.userInfo',
    //                   success() {
    //                     _this.hasUserInfo = true
    //                     if (_this.userId == '' || _this.userId == null){
    //                       _this.login(callBack(2));
    //                       //从本地存储中获取用户信息，如果有用户信息则跳过登陆流程，如果没有则发起登陆操作
    //                       wx.getStorage({
    //                         key: 'userMsg',
    //                         success(e) {
    //                           //此时本都存储中有用户信息跳过登陆流程
    //                           console.log(e.data)
    //                           _this.activity = e.data.activity;
    //                           _this.userId = e.data.id;
    //                           _this.openid = e.data.openId;
    //                           _this.userMoney = e.data.money;
    //                           _this.userPoints = e.data.points;
    //                           _this.isShowCards = e.data.loginevent;
    //                           _this.userInfo = e.data.userInfo;
    //                           callBack(2);
    //                         },
    //                         fail(e) {
    //                           //此时本地存储中没有用户信息，发起登陆操作
    //                           _this.login(callBack(2));
    //                         }
    //                       })
    //                     } else {
    //                       callBack(2);                           
    //                     }
    //                   },
    //                   fail() {
    //                     callBack(3);
    //                     _this.hasUserInfo = false
                      
    //                   }
    //                 })
    //               }
    //             }
    //           })
    //         },
    //         fail() {
    //           callBack(1);
    //           _this.hasLocation = false
    //         }
    //       })
    //     }
    //   }
    // })
  },

	globalData: {
    // txMapak:'ITEBZ-NJTKU-DZJVQ-26ESS-D2RJH-MOBQF',
    txMapak: 'O7XBZ-EAUR6-K36ST-MZ4UD-IW4PQ-MBBZ4',
    ak: 's2PaApqZup9AvsQllOYNOuVVAGralwj5',

    userLocationAddress:{city:'',
                  provinces:'',
                  district:'',
                  name:'',
                  location:{},
                  adcode:''
                  },

    shippingAddress: {
      userName:'',
      phone: '',
      address: '',
      location: '',
      id:'',
      status:'',
      userId:''
    },
    sshippingAddress: {
      userName: '',
      phone: '',
      address: '',
      location: '',
      id: '',
      status: '',
      userId: ''
    },
    
    temAddress: {
      customAddress:'',
      city: '',
      provinces: '',
      district: '',
      name: '',
      location: {},
      adcode: ''
    },
	},
  
  homeCardId:0,
  openid:null,
  appid:'wx601e284d89b5ad6b',  
  secret: '95bc30c8e25484485b53b998bace1d1c',
  activity: '',  //卡券类型
  // 74d91cec97c4787c538c27b68c744663
	rd_session: null,
  goodsAttrubuteStr:null,
  userInfo:null,  //微信用户信息
  userId:null,  //用户id
  userMoney:0,  //用户余额
  userPoints:0,  //用户积分
  isShowCards:false,  //是否显示领券弹出框
  serviceCard: null,  //配送优惠券信息
  goodsCard: null, //商品优惠券信息
  code:null,  //用户code
  sdkV:'1.2.2',
  windowHeight:0,
  windowWidth:0,
  shareTitle:'宠物上门服务平台',
  shareInfo:null,  //分享信息
  hasLocation:false,
  hasUserInfo:false,
  wxPayState: false,
  //执行登陆操作
  login: function (activity,callBack) {
		var self = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (loginRes) {
          if (loginRes.code) {
            // self.getUserInfo(callBack,res.code, activity) 
            wx.getUserInfo({
              success: function (res) {
                self.userInfo = res.userInfo;
                let act = activity ? activity : 0;  //防止activity为undefinde情况出现
                /*
                  *  绑定用户接口：
                  *  参数：
                  *    icon -> 用户头像
                  *    name -> 用户昵称
                  *    code -> 微信服务器返回的code
                  *    activity -> 优惠券类型
                  *  返回数据：
                  *    activity -> 获得的优惠券类型
                  *    id -> 用户id
                  *    openid -> 用户openid 
                  */
                // for(let i=0;i<20;i++){
                clientApi.bindUser({ 'icon': res.userInfo.avatarUrl, 'name': res.userInfo.nickName, 'code': loginRes.code, 'activity': 0
                }).then(e => {
                  
                  // console.log(self.activity);
                  self.activity = e.data.activity;
                  self.userId = e.data.id;
                  self.openid = e.data.openId;
                  self.userMoney = e.data.money;
                  self.userPoints = e.data.points;
                  self.isShowCards = e.data.loginevent != null ? true : false;
                  e.data.loginevent = e.data.loginevent != null ? true : false;
                  e.data.userInfo = res.userInfo;
                 
                  resolve(e);
                  //将用户信息存入本地存储
                  wx.setStorage({
                    key: 'userMsg',
                    data: e.data,
                    success: function () {
                      console.log('保存成功');                
                    }
                  })
                })
              },
              fail: function (err) {

              }
              
            })             
          }
        }
      });
    });  
	},
  // getUserInfo: function (callBack,code,activity) {
    
	// 	var self = this;
      
	// }
})