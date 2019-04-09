//index.js
//获取应用实例
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi;
let cardStatus = '';
let shopId;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    item: [
      // { mprice: 50, jprice: 5, starttime: "2018.10.9", endtime: "2018.11.9", note: "满50减5代金券"},
      // { mprice: 30, jprice: 5, starttime: "2018.10.9", endtime: "2018.11.9", note: "满30减5代金券"},
      // { mprice: 20, jprice: 5, starttime: "2018.10.9", endtime: "2018.11.9", note: "满20减5代金券" },

    ],
    status: '',
    isshow: false, //是否显示购买数量框
    isShowCardTitle: [true, true, true], //显示优惠券标题
    userGift: [], //用户礼包
    returned: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(e) {
    //配置分享信息
    let _this = this;
    shopId = e.shopId;
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })
    if (e.cardStatus == 2) {
      cardStatus = true
    } else if (e.cardStatus == 1) {
      cardStatus = false
    }
    this.getPermiss();
    let cardType = e.cardType; //卡券类型: 1表示配送优惠券  2表示商品及服务优惠券
    // if (e.cardType==1){
    //   this.setData({
    //     status: e.cardType
    //   })
    // }

    wx.showLoading({
      title: '正在加载中',
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfoPermissions(function locationS(msg) {
      console.log(msg);
      if (msg == 0) {
        _this.setData({
          hasLocation: true
        })
      } else if (msg == 1) {
        _this.setData({
          hasLocation: false
        })
      } else if (msg == 2) {
        _this.setData({
          hasUserInfo: true
        })
        if (cardType == 1) {
          //此时仅显示配送费优惠券
          _this.setData({
            status: cardType,
            isShowCardTitle: [true, false, false]
          })
          _this.getUserServiceCardList();
        } else if (cardType == 2) {
          //此时仅显示商品及服务优惠券
          _this.setData({
            status: cardType,
            isShowCardTitle: [false, true, false]
          })
          _this.getUserGoodsCardList();
        } else {
          //此时显示所有优惠券
          _this.setData({
            isShowCardTitle: [true, true, true],
          })
          _this.getCardList();
        }


      } else if (msg == 3) {
        _this.setData({
          hasUserInfo: false
        })
      }
    });

    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
  },
  //获取用户商品优惠券
  getUserGoodsCardList: function() {
    wx.showLoading({
      title: '正在加载中',
    })
    var that = this
    console.log('cardstatus')
    console.log(cardStatus);

    //获取优惠券列表
    clientApi.getGoodsCardList({
      userId: app.userId,
      retind: cardStatus,
      shopId: shopId
    }).then(d => {
      wx.hideLoading();
      console.log(d);
      for (let i = 0; i < d.data.length; i++) {
        d.data[i].startDate = this.formatTime(d.data[i].startDate);
        d.data[i].endDate = this.formatTime(d.data[i].endDate);
      }
      that.setData({
        item: d.data
      })

    })
  },
  //获取用户配送优惠券
  getUserServiceCardList: function() {
    wx.showLoading({
      title: '正在加载中',
    })
    var that = this
    console.log('cardstatus')
    console.log(cardStatus);
    //获取优惠券列表
    clientApi.getServiceCardList({
      userId: app.userId,
      retind: cardStatus,
      shopId: shopId
    }).then(d => {
      wx.hideLoading();
      console.log(d);
      for (let i = 0; i < d.data.length; i++) {
        d.data[i].startDate = this.formatTime(d.data[i].startDate);
        d.data[i].endDate = this.formatTime(d.data[i].endDate);
      }
      that.setData({
        item: d.data
      })
      console.log('item')
      console.log(that.data.item)
    })
  },

  getPermiss: function() {
    var _this = this;
    _this.setData({
      hasUserInfo: true
    })
    // app.getUserInfoPermissions(function locationS(msg) {

    //   if (msg == 0) {
    //     _this.setData({
    //       hasLocation: true
    //     })
    //   } else if (msg == 1) {
    //     _this.setData({
    //       hasLocation: false
    //     })
    //   } else if (msg == 2) {
    //     _this.setData({
    //       hasUserInfo: true
    //     })

    //     setTimeout(function () {
    //       _this.getCardList();
    //     }, 100)

    //   } else if (msg == 3) {
    //     _this.setData({
    //       hasUserInfo: false
    //     })
    //   }
    // });
  },
  //获取卡券列表
  getCardList: function() {
    this.getUserGift();
    var that = this
    console.log(app.userId);

    //获取优惠券列表
    clientApi.getMyCardList({
      userId: app.userId
    }).then(d => {
      wx.hideLoading();
      console.log(d);
      for (let i = 0; i < d.data.length; i++) {
        d.data[i].startDate = this.formatTime(d.data[i].startDate);
        d.data[i].endDate = this.formatTime(d.data[i].endDate);
      }
      that.setData({
        item: d.data
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let param = {
      userid: app.userId, //用户id
      couponid: app.shareInfo.id //分享活动id
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
          success: function() {}
        })
      } else if (res.data == 1) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "去查看",
          content: '恭喜您获得一张优惠券',
          success: function() {
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
          success: function() {}
        })
      }
    })
    return {
      title: app.userShare.title, //分享获得10元无门槛宠物寄养优惠券
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

  showmap: function(e) {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: "花园桥肯德基",
          scale: 28
        })
      }
    })
  },
  //跳转到礼包详情页面
  goGiftDetails: function(e) {
    console.log(e.currentTarget.dataset.item);
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/cardDetails/cardDetails?giftItem=' + item,
    })
  },

  //跳转到卡券详情页面
  gocardDetails: function(e) {
    console.log(e.currentTarget.dataset.item);
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/cardDetails/cardDetails?item=' + item,
    })
  },
  //返回上一级页面
  goback: function(e) {
    let _this = this;
    let item = e.currentTarget.dataset.item;
    let item2 = JSON.stringify(e.currentTarget.dataset.item);
    app.globalData.card = item;
    console.log(app.globalData.card);
    if (this.data.status == 1) {
      //1表示配送优惠券
      app.serviceCard = item;
      wx.navigateBack()
    } else if (this.data.status == 2) {
      //2表示商品及服务优惠券
      app.goodsCard = item;
      wx.navigateBack()
    } else {
      // if(item[12]==null){
      app.homeCardId = item.cardId;
      wx.switchTab({
        url: '/pages/home/home'
      })

      // }else{
      //   wx.navigateTo({
      //     url: '/pages/more/more',
      //   })
      // }

    }


  },
  //不使用优惠券
  exit: function() {
    if (this.data.status == 1) {
      app.serviceCard = null;
      wx.navigateBack()
    } else if (this.data.status == 2) {
      app.goodsCard = null;
      wx.navigateBack()
    }
  },
  //将时间戳转为时间
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
    return [year, month, day].join('.')
  },
  //获取用户大礼包
  getUserGift() {
    let param = {
      userId: app.userId
    }
    clientApi.showIndvPackages(param).then(res => {
      console.log(res);
      if (res.success == 1) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]['startdate'] = this.formatTime(res.data[i]['startdate']);
          res.data[i]['enddate'] = this.formatTime(res.data[i]['enddate']);
        }
        this.setData({
          userGift: res.data
        })
      }
    })
  },
  //使用大礼包
  UseGift: function(e) {
    let param = {
      userId: app.userId,
      packageid: e.currentTarget.dataset.item.packageid
    };
    let _this = this;
    clientApi.usePackage(param).then(res => {
      console.log(res);
      if (res.success == 1) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "去查看",
          content: '使用成功，优惠券已分解至您的卡包',
          success: function() {
            //调用应用实例的方法获取全局数据
            let cardType = _this.data.cardType;
            app.getUserInfoPermissions(function locationS(msg) {
              console.log(msg);
              if (msg == 0) {
                _this.setData({
                  hasLocation: true
                })
              } else if (msg == 1) {
                _this.setData({
                  hasLocation: false
                })
              } else if (msg == 2) {
                _this.setData({
                  hasUserInfo: true
                })
                if (cardType == 1) {
                  //此时仅显示配送费优惠券
                  _this.setData({
                    status: cardType,
                    isShowCardTitle: [true, false, false]
                  })
                  _this.getUserServiceCardList();
                } else if (cardType == 2) {
                  //此时仅显示商品及服务优惠券
                  _this.setData({
                    status: cardType,
                    isShowCardTitle: [false, true, false]
                  })
                  _this.getUserGoodsCardList();
                } else {
                  //此时显示所有优惠券
                  _this.setData({
                    isShowCardTitle: [true, true, true],
                  })
                  _this.getCardList();
                }


              } else if (msg == 3) {
                _this.setData({
                  hasUserInfo: false
                })
              }
            });
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "确定",
          content: '服务器繁忙，请稍后重试:-(',
          success: function() {

          }
        })
      }
    })
  }
})