var app = getApp();
var txmap = require('../../libs/map/qqmap-wx-jssdk.min.js');
var tools = require('../../utils/util.js');
const clientApi = require('../../utils/clientApi.js').clientApi
let pageIndex = 1; //当前第几页数据
let isbottom = false; //是否已经到底
var wxMarkerData = []; //定位成功回调对象  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaSwitch: '',
    maxAddressCount: 4,
    hasLocation: true,
    hasUserInfo: true,
    ak: app.globalData.txMapak,
    userLocationAddress: {},
    isLoadMore: true,
    pageIndex: 1, //当前第几页数据
    pageSize: 6,
    totalPage: 100,
    windowHeight: 0,
    windowWidth: 0,
    // 功能菜单
    funcmenulist: [
      // {
      //   id: 5,
      //   name: '宠物接送',
      //   icon: '/images/icon_11.png'
      // },
      {
        id: 1,
        name: '宠物百货',
        icon: '/images/icon_03.png',
        url: '/pages/bunessList/bunessList?id=1&title=宠物百货'
      },
      {
        id: 2,
        name: '宠物服务',
        icon: '/images/icon_05.png',
        url: '/pages/bunessList/bunessList?id=2&title=宠物服务'
      },
      {
        id: 3,
        name: '宠物保健',
        icon: '/images/icon_09.png',
        url: '/pages/build/build?title=宠物保健'
      },
      {
        id: 4,
        name: '宠物活体',
        icon: '/images/icon_07.png',
        url: '/pages/build/build?title=宠物活体'
      },
      {
        id: 5,
        name: '宠物驯养',
        icon: '/images/icon_15.png',
        url: '/pages/build/build?title=宠物驯养'
      },

    ],
    items: [],
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    indicatorColor: 'ececec',
    indicatorActiveColor: 'ffd33a',
    scrollTop: 0, //距离顶部位置
    floorstatus: false, //是否显示返回顶部按钮
    list: [{
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
      {
        text: "活动商家1"
      },
    ],
    hotShopList: [], //活动商家列表
    hotShopIsRight: false, //是否没有数据了
    hotShopPageIndex: 1, //活动商家当前页
    isCardShow: 'none', //是否显示领券广告 
    isguideShow: 'none', //是否显示指引用户弹框
    isShareShow: 'none', //是否显示分享提示
    isShopShow: 'none', //是否显示店铺礼包提示

  },



  // 获取滚动条当前位置
  onPageScroll: function(e) {
    if (e.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    //配置分享信息
    app.getShareInfo(1).then(res => {
      app.userShare = res;
    })

    var _this = this;
    //调用应用实例的方法获取全局数据


    app.getUserInfoPermissions(function locationS(msg) {

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
        _this.isShowGift();
      } else if (msg == 3) {
        _this.setData({
          hasUserInfo: false
        })
      }
    });
    this.setData({
      windowHeight: app.windowHeight,
      windowWidth: app.windowWidth
    })

    if (_this.urlSearch(decodeURIComponent(options.q)).id) {
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/shop/shop?id=' + _this.urlSearch(decodeURIComponent(options.q)).id
        })
      }, 2000)
    }
    // wx.showModal({
    //   title: '11',
    //   content: _this.urlSearch(decodeURIComponent(options.q)).gy,
    // })
    if (_this.urlSearch(decodeURIComponent(options.q)).gy == 1) {
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/infosPush/infosPush'
        })
      }, 3000)
    }

    //if (_this.urlSearch(decodeURIComponent(options.q)).bw == 1) {
     // setTimeout(function () {
     //   wx.showModal({
      //    title: '提示',
      //    showCancel: false,
      //    confirmText: "立即使用",
      //    content: '恭喜您获得一张免费洗优惠券',
       //   success: function () {
       //     wx.navigateTo({
       //       url: '/pages/cards/cards',
       //     })
      //    }
      //  })
     // }, 3000)
   // }
  },
  //判断是否显示礼包和优惠券等
  isShowGift: function() {
    //判断是否显示豪华大礼包弹出框
    let _this = this;
    if (app.isShowCards) {
      _this.setData({
        isCardShow: 'flex'
      })
    } else {
      _this.setData({
        isCardShow: 'none'
      })
    }
    this.isShowguide();
    //判断是获取15元优惠券还是1元下单优惠券
    if (app.activity == 'activity2') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: "立即使用",
        content: '恭喜您获得一张立减15元优惠券',
        success: function() {
          wx.navigateTo({
            url: '/pages/cards/cards',
          })
        }
      })
    } else if (app.activity == 'activity1') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: "立即使用",
        content: '恭喜您获得一张一元下单优惠券',
        success: function() {
          wx.navigateTo({
            url: '/pages/cards/cards',
          })
        }
      })
    }

  },

  //获取轮播图片地址
  //加入区域码
  getBanner: function (areaCode) {
    clientApi.getBanner({ "areaCode": areaCode }).then(d => {
      console.log(d)
      this.setData({
        imgUrls: d.data
      })
    })
  },

  //页面初始化时执行
  getPermiss: function() {
    var _this = this;
    _this.setData({
      hasUserInfo: true
    })

    if (_this.data.items.length == 0) { //当第一次进入该页面时执行
      //根据当前位置调取距离最近的商家
      _this.getHomeData();
    } else { //当选择地址后跳转到首页时执行
      if (app.globalData.userLocationAddress.name != _this.data.userLocationAddress.name) {
        //执行设置地址操作
        _this.setAddress();
        if (_this.data.userLocationAddress.adcode != '' && _this.data.userLocationAddress.adcode != undefined) {
          //执行刷新页面操作：根据不同经纬度信息调取不同商家数据                         
          _this.refresh();
        };
      }
    }

  },


  //设置地址
  setAddress: function() {
    var address = app.globalData.userLocationAddress;
    var maxCount = this.data.maxAddressCount;
    if (address.name.length > maxCount) {
      address.temName = address.name.substring(0, maxCount) + "...";
    } else {
      address.temName = address.name;
    }
    this.setData({
      userLocationAddress: address
    });
  },
  //获取首页数据
  getHomeData: function() {
    var _this = this;
    if (app.globalData.userLocationAddress.city != '') { //当城市不为空的时候执行
      //设置不同地址
      _this.setAddress();
      //刷新当前页面：根据不同条件调取不同数据
      _this.refresh();
    } else {
      //获取用户当前位置并调取距离该位置最近的商家
      this.postionUserLocation();
    }
  },

  getModules: function() {
    // var _this = this;
    //   clientApi.getModules().then(d => {
    //     _this.setData({
    //       funcmenulist: d.data
    //     })
    //     console.log(_this.data.funcmenulist);
    //   });


  },

  /**
   * 定位&获取商家商家列表
   */
  postionUserLocation: function() {
    var that = this;

    var QQMapWX = txmap;

    var demo = new QQMapWX({
      key: that.data.ak
    });
    demo.reverseGeocoder({
      success: function(res) {
        var res = res.result;

        app.globalData.userLocationAddress.city = res.ad_info.city;
        app.globalData.userLocationAddress.provinces = res.ad_info.province;
        app.globalData.userLocationAddress.district = res.ad_info.district;
        app.globalData.userLocationAddress.name = tools.formatNullObj(res.address_component.district) + tools.formatNullObj(res.address_reference.landmark_l2.title) + '(' + tools.formatNullObj(res.address_reference.street.title) + '附近' + tools.formatNullObj(res.address_reference.street._distance) + '米)';
        app.globalData.userLocationAddress.location = res.location;
        app.globalData.userLocationAddress.adcode = res.ad_info.adcode;
        //此处根据腾讯地图获得到不同城市请求响应服务器
        // if (res.ad_info.city=="贵阳市"){
        //   clientApi.setServiceURI("https://gy.chongdaopet.com/mobile/");
        // }
        that.setAddress();
        that.refresh();
        //定位完成后, 重新取一次轮播图, 并传入区域码
        that.getBanner(res.ad_info.adcode);
      }
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
    
    let _this = this;
    _this.setData({
      items: [],
      homeCardId:0
    })
    if (app.homeCardId != 0) {
      _this.data.homeCardId = app.homeCardId;
      app.homeCardId = 0;
    }
    
    //检测用户是否允许地理位置授权
    app.getUserLocationStatus().then(res => {
      _this.setData({
        hasLocation: true
      })
    }).catch(err => {
      _this.setData({
        hasLocation: false
      })
    })

    //获取商家数据等等
    this.getPermiss();
    //获取模块
    this.getModules();
    //传入区域码做区域分离
    this.getBanner(this.data.userLocationAddress.adcode);

    
  },
  //刷新页面根据不同条件重新调取数据
  refresh: function(isShowToast) {
    if (isShowToast == true) {
      wx.showToast({
        title: '下拉刷新'
      })
    }
    // this.setData({
    //   pageIndex: 1,
    //   isLoadMore: false
    // })
    pageIndex = 1;
    isbottom = false;
    //获取商家列表
    this.apiGetBunessList();
    // this.getHotShop();  //获取精选商家与活动数据
  },
  //上拉加载更多时执行
  loadMore: function() {
    var that = this;
    if (!that.data.isLoadMore) {
      return
    };
    that.data.isLoadMore = false;
    that.apiGetBunessList(this.data.pageSize, this.data.pageIndex);
  },
  //获取商家列表
  apiGetBunessList: function() {
    // if (pageIndex > this.data.totalPage) {
    //   return
    // };

    // if (pageIndex != 1) {
    //   if (wx.canIUse('showLoading')) {
    //     wx.showLoading({
    //       title: '加载更多数据中。。。'
    //     });
    //   }
    // }
    wx.showLoading({
      title: '加载更多数据中。。。'
    })
    var _this = this;
    // console.log("l::::::::::::::::::::::::::::::", _this.data.userLocationAddress.location.lng)  //lng
    // console.log("l::::::::::::::::::::::::::::::", _this.data.userLocationAddress.location.lat)
    // console.log("l::::::::::::::::::::::::::::::", _this.data.userLocationAddress.adcode)

    //首页参数集
    let param = {
      currPage: pageIndex, //当前请求第几页数据
      isRecom: 1,
      pageSize: _this.data.pageSize, //每页请求得数据数量
      lng: _this.data.userLocationAddress.location.lng, //经度
      lat: _this.data.userLocationAddress.location.lat, //纬度
      areaCode: _this.data.userLocationAddress.adcode //此处暂定200000代表上海市  _this.data.userLocationAddress.adcode  
    }
    if (_this.data.homeCardId!=0){
      param.cardId = _this.data.homeCardId
    }

    console.log('param', param)
    clientApi.getShop(param).then(d => {
      console.log('getshop', d)


      wx.hideLoading();
      //当success为1时说明接口没出现错误，否则接口报错
      if (d.status == 5004) {
        wx.showToast({
          title: d.msg,
          icon: 'none'
        })
        _this.data.areaSwitch = false;
        _this.setData({
          items: []
        })
        return;
      }
      if (d.success == 1) {
        _this.data.areaSwitch = true;
        //当数据不为空时则说明没下拉到底继续加载更多，否则已经下拉到底了
        if (d.data.data != "") {
          for (let i = 0; i < d.data.data.length; i++) {
            d.data.data[i].couponUserVOList = d.data.data[i].couponUserVOList.slice(0, 3)
          }
          //当currPage为1时说明是第一页则将数据重置为接口返回得数据，否则是下拉加载出来得数据将现有数据和请求返回的数据相连接
          if (d.data.currPage == 1) {
            _this.setData({
              items: d.data.data
            })
          } else {
            _this.setData({
              items: _this.data.items.concat(d.data.data)
            })
          }
        } else {
          //此时已经到底了：提示到底了
          isbottom = true;
          wx.showToast({
            icon: 'none',
            title: '已经到底了',
          })
        }
      } else {
        //此时接口错误：抛出繁忙异常
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "确定",
          content: '服务器繁忙，请稍后重试:-(',
          success: function() {}
        })
      }
      // var datas = _this.data.items;
      // console.log(d.data.data);

      // if (d.data != null) {
      //   if (pageIndex == 1) {
      //     _this.setData({
      //       totalPage: d.data.totalPage
      //     })
      //     datas = d.data.data;
      //   } else {
      //     datas = datas.concat(d.data.data);
      //   }
      //   // console.log(pageSize);
      //   if (d.data.data.count < pageSize) {
      //     _this.setData({
      //       isLoadMore: false
      //     })
      //   } else {
      //     _this.setData({
      //       isLoadMore: true,
      //       pageIndex: _this.data.pageIndex += 1,
      //     })
      //     // console.log("我是当前页码"+_this.data.pageIndex);
      //   }

      //   _this.setData({
      //     items: datas
      //   })
      // } else {
      //   _this.setData({
      //     items: []
      //   })

      // }
      // wx.hideNavigationBarLoading();
      // if (wx.canIUse('hideLoading')) {
      //   wx.hideLoading();
      // }
      // console.log(this.data.items);
    });
  },

  //切换定位
  addressclick: function(event) {
    wx.navigateTo({
      url: "../../pages/chooseArea/chooseArea?type=1",
      success: function(res) {

      }
    })
  },

  //搜索商家列表
  bindButtonTap: function() {
    wx.navigateTo({
      url: '../../pages/searchBunessList/searchBunessList',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 商家类别
  funcmenuClick: function(event) {
    console.log(this.data.areaSwitch)
    if (this.data.areaSwitch == false) {
      return;
    }
    if (event.currentTarget.dataset.itemid == 2) {
      wx.navigateTo({
        url: '/pages/ency/ency',
      })
    } else if (event.currentTarget.dataset.itemid == 5) {
      wx.setStorage({
        key: 'orderType',
        data: '4',
      })
      wx.navigateTo({
        url: '../../pages/submitOrder/submitOrder',
      })
    } else {
      wx.navigateTo({
        url: event.currentTarget.dataset.url,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }


  },

  //商家item
  bunessItemClick: function(event) {
    if (event.currentTarget.dataset.status == 0) {
      wx.showToast({
        title: '商家休息中',
        icon: "none"
      })
      return;
    }
    let id = event.currentTarget.dataset.item;
    console.log('id', id)
    // console.log(id);
    // let str = JSON.stringify(event.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id
    })
  },

  //banner点击
  bannerClick: function(e) {
    let banneritem = e.currentTarget.dataset.index;
    if (banneritem == 0) {
      wx.navigateTo({
        url: '/pages/gift/gift',
      })
    }
    if (banneritem == 1) {
      wx.navigateTo({
        url: '/pages/eventDetail/eventDetail',
      })
    }

    // console.log(banneritem);
    // if(banneritem==0){
    //   wx.navigateTo({
    //     url: '/pages/gift/gift',
    //   })
    // }else if(banneritem==1){
    //   wx.showToast({
    //     title: '活动已结束',
    //     icon:'none'
    //   })
    //   // wx.navigateTo({
    //   //   url: '/pages/activityDetails/activityDetails',
    //   // })
    // }else if(banneritem==2){
    //   wx.navigateTo({
    //     url: '/pages/balance/balance',
    //   })
    // }
    // if (banneritem.actionType == 2 && banneritem.actionVal != null && banneritem.actionVal != '') {
    //   wx.navigateTo({
    //     url: '/pages/shop/shop?shopId=' + banneritem.actionVal
    //   })
    // }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let param = {
      userid: app.userId, //用户id
      couponid: app.shareInfo.id //分享活动id
    }

 


    // console.log(param);
    // console.log(app);
    clientApi.userShare(param).then(res => {
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // console.log(pageIndex);
    if (isbottom == false) { //当isbottom等于false时才加载下一页
      pageIndex++;
    }
    this.apiGetBunessList();
  },
  //跳转到更多精选商家与活动页面
  goMore: function() {
    wx.navigateTo({
      url: '/pages/more/more',
    })
  },

  //获取精选商家于活动
  // getHotShop:function(){
  //   let _this=this;
  //   let param={
  //     lng: _this.data.userLocationAddress.location.lng,
  //     lat: _this.data.userLocationAddress.location.lat,
  //     currPage: this.data.hotShopPageIndex
  //   }
  //   clientApi.hotShop(param).then(res=>{
  //     wx.hideLoading();
  //     if(res.success==1){

  //       if(res.data.data!=""){
  //         // let imgUrI = "http://www.chongdaopet.com:20081/images/";  //图片路径
  //         // for (let i = 0; i < res.data.data.length; i++) {
  //         //   res.data.data[i]['logo'] = imgUrI + res.data.data[i]['logo'];
  //         // }
  //         if (res.data.currPage == 1) {
  //           _this.setData({
  //             hotShopList: res.data.data
  //           })
  //         } else {
  //           _this.setData({
  //             hotShopList: _this.data.hotShopList.concat(res.data.data)
  //           })
  //         }
  //       }else{
  //         //此时已经拉到最右侧
  //         _this.setData({
  //           hotShopIsRight:true,
  //         })
  //         wx.showToast({
  //           icon: 'none',
  //           title: '没有更多商家了哟',
  //         })
  //       }
  //     } else {
  //       //此时接口错误：抛出繁忙异常
  //       wx.showModal({
  //         title: '提示',
  //         showCancel: false,
  //         confirmText: "确定",
  //         content: '服务器繁忙，请稍后重试:-(',
  //         success: function () {
  //         }
  //       })
  //     } 
  //   })
  // },
  //当拉到最右侧时执行
  loadList: function() {
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.hotShopIsRight == false) {
      this.setData({
        hotShopPageIndex: this.data.hotShopPageIndex + 1
      })
    }
    // this.getHotShop();
  },
  //隐藏领券框
  cardHide: function() {
    this.setData({
      isCardShow: 'none'
    })
    this.isShowguide();
  },
  //点击领取
  getEventCards: function() {
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails',
    })
  },
  //点击下一步执行隐藏分享提示框显示礼包提示框操作
  next: function() {
    this.setData({
      isShopShow: 'block',
      isShareShow: 'none'
    })
  },
  //点击我知道了隐藏指引操作提示框
  know: function() {
    wx.setStorage({
      key: 'isShowGuide',
      data: true,
      success: function() {
        console.log('保存成功');
      }
    })
    this.setData({
      isShopShow: 'none',
      isShareShow: 'none',
      isguideShow: 'none',
    })
  },

  //判断展示弹框
  isShowguide: function() {
    // wx.clearStorage();
    let _this = this;
    wx.getStorage({
      key: 'isShowGuide',
      success(e) {
        console.log(e);
        _this.setData({
          isguideShow: 'none',
          isShareShow: 'none',
        })
      },
      fail(e) {
        if (_this.data.isCardShow == 'none') {
          _this.setData({
            isguideShow: 'block',
            isShareShow: 'block',
          })
        }
      }
    })
  },
  jumpMini: function() {
    wx.navigateToMiniProgram({
      appId: 'wx0e8a4699fdc1f09d',
      path: 'pages/index/index',
      success(res) {
        // 打开成功
      }
    })
  },
  urlSearch: function(input) {
    var theRequest = new Object();
    let arr1 = input.split('?')[1].split('&');
    for (var i = 0; i < arr1.length; i++) {
      theRequest[arr1[i].split("=")[0]] = unescape(arr1[i].split("=")[1]);
    };
    return theRequest;
  }

})