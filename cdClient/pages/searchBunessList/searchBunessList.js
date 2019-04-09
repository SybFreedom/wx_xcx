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
    hotsearch: ['大型犬洗澡', '中型犬洗澡', '小型犬美容', '寄养', '狗粮','猫咪洗澡','猫砂','猫罐头'],
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

  refresh: function (isShowToast) {
    wx.showNavigationBarLoading();
    if (isShowToast == true) {
      wx.showToast({
        title: '下拉刷新',
      })
    }
    this.setData({
      pageIndex: 1,
      isLoadMore: false
    })

    this.apiGetBunessList(this.data.pageSize, this.data.pageIndex);
  },
  //上拉加载更多数据
  loadMore: function () {
    console.log("我执行了");
    var that = this;
    // if (!that.data.isLoadMore) { return };
    // that.data.isLoadMore = false;
    that.apiGetBunessList(this.data.pageSize, this.data.pageIndex);
  },

  apiGetBunessList: function (pageSize, pageIndex) {
    console.log(this.data.pageIndex);
    var _this = this;
    wx.showLoading({
      title: '正在加载中'
    });
    let param = {
      currPage: _this.data.pageIndex,
      name: _this.data.name,
      lng: _this.data.userLocationAddress.location.lng,
      lat: _this.data.userLocationAddress.location.lat,
      areaCode: _this.data.userLocationAddress.adcode  //_this.data.userLocationAddress.adcode
    }
    console.log(param);
    clientApi.getShop(param).then(d => {
      console.log("搜索结果",d)
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      if(d.data==null){
        wx.showToast({
          icon:'none',
          title: '没有搜索到您需要的商家',
        })
      }else if(d.data.data!=""){  //数据搜索正常
        _this.setData({
          items: _this.data.items.concat(d.data.data)
        })
        console.log(d.data);
      }else{  //此时已经下拉到底了
        _this.setData({
          isBottom:true
        })
        wx.showToast({
          icon: 'none',
          title: '已经到底了',
        })
      }
    });
  },

  bunessItemClick: function (event) {
    if (event.currentTarget.dataset.item.status==0){
      wx.showToast({
        title: '商家休息中',
        icon:"none"
      })
      return;
    }
    console.log('点击商家item', event.currentTarget.dataset.item);
    let id = JSON.stringify(event.currentTarget.dataset.item.id);
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id
    })
  },
 
  bindKeyInput: function (e) {
    console.log('搜索数据', e.detail.value);
    this.setData({
      name: e.detail.value,
      items:[]
    })
    this.data.isBottom = false;
    if (this.data.name != '' && this.data.name != undefined) {
      this.refresh();
    }
    // clientApi.searchGoods({name:'狗粮',moduleId:1}).then(res=>{
    //   console.log(res);
    // })
    
  },

  goSearch:function(){
    
  },

  //点击热搜的关键词发起搜索
  hotsearch:function(e){
    console.log(e.currentTarget.dataset.txt);
    this.setData({
      name:e.currentTarget.dataset.txt,
      items: []
    })
    this.refresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.isBottom){
      this.setData({
        pageIndex:this.data.pageIndex+=1
      })
    }
    this.loadMore();
  }
})