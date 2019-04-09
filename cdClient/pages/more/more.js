var app = getApp();
var txmap = require('../../libs/map/qqmap-wx-jssdk.min.js');
const clientApi = require('../../utils/clientApi.js').clientApi

var wxMarkerData = [];  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLocationAddress: {},
    isLoadMore: true,
    shopType: 0,
    pageIndex: 1,  //当前页码
    isBottom:false, //是否到底
    pageSize: 10,
    title: '',
    name:'',
    totalPage: 100,
    windowHeight: 0,
    windowWidth: 0,
    items: [],
    hotShopList: [],  //活动商家列表
    hotShopIsRight: false,  //是否没有数据了
    hotShopPageIndex: 1,  //活动商家当前页

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })
    console.log(options);
    this.setData({
      // shopType: options.id,
      // title: options.title,
      userLocationAddress: app.globalData.userLocationAddress,
      windowHeight: app.windowHeight,
      windowWidth: app.windowWidth
    })
    // console.log(this.data);
    this.loadMore();

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let param = {
      userid: app.userId, //用户id
      couponid: app.shareInfo.id  //分享活动id
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
          success: function () {
          }
        })
      } else if (res.data == 1) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "去查看",
          content: '恭喜您获得一张优惠券',
          success: function () {
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
          success: function () {
          }
        })
      }
    })
    return {
      title: app.userShare.title,//分享获得10元无门槛宠物寄养优惠券
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
  //加载数据
  loadMore:function(){
    let _this = this;
    let param={
      lng: app.globalData.userLocationAddress.location.lng,
      lat: app.globalData.userLocationAddress.location.lat,
      currPage: this.data.hotShopPageIndex 
    };
    clientApi.hotShop(param).then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.success == 1) {
        if (res.data.data != "") {
          // let imgUrI = "http://www.chongdaopet.com:20081/images/";  //图片路径
          // for (let i = 0; i < res.data.data.length; i++) {
          //   res.data.data[i]['logo'] = imgUrI + res.data.data[i]['logo'];
          // }
          if (res.data.currPage == 1) {
            _this.setData({
              hotShopList: res.data.data
            })
          } else {
            _this.setData({
              hotShopList: _this.data.hotShopList.concat(res.data.data)
            })
          }
        } else {
          //此时已经拉到最右侧
          _this.setData({
            hotShopIsRight: true,
          })
          wx.showToast({
            icon: 'none',
            title: '没有更多商家了哟',
          })
        }
      } else {
        //此时接口错误：抛出繁忙异常
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: "确定",
          content: '服务器繁忙，请稍后重试:-(',
          success: function () {
          }
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.hotShopIsRight == false) {
      this.setData({
        hotShopPageIndex: this.data.hotShopPageIndex + 1
      })
    }
    this.loadMore();
  },
  bunessItemClick: function (event) {
    console.log('点击商家item', event.currentTarget.dataset.item);
    let id = JSON.stringify(event.currentTarget.dataset.item.id);
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id
    })
  },
})