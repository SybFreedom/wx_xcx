// pages/order/order.js
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
var tools = require('../../utils/util.js');
let pageIndex=1;  //当前第几页数据
let tabType=1;
let isbottom=false;  //是否已经到底
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    windowWidth: 0,
    hasLocation: true,
    hasUserInfo: true,
    orderList:[],
    tabItems:[
      {
        title:'未接单',
        isActive: 1
      },
      {
        title: '已接单',
        isActive: 0
      },
      {
        title: '已完成',
        isActive: 0
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      app.userShare = res;
    })

    this.setData({
      windowHeight: app.windowHeight,
      windowWidth: app.windowWidth
    })
    
   
    // let _this=this;
    // app.getUserInfoPermissions(function(){
    //   _this.getOrderList()
    // })
    // var sjc = 1488481383;
    // console.log(tools.toData(sjc, 'Y-M-D h:m:s'));
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
    isbottom = false;
    pageIndex = 1;
    this.getPermiss();
  },

  getPermiss: function () {
    // console.log(app.userId);
    var _this = this;
    _this.setData({
      hasUserInfo: true
    })
    app.getUserInfoPermissions(function locationS(msg) {
      // console.log(msg);
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
        _this.getOrderList();       
      } else if (msg == 3) {
        _this.setData({
          hasUserInfo: false
        })
      }
    });
  },
  //获取订单列表
  getOrderList: function (){
    wx.showLoading({
      title: '正在加载中',
    })
    // console.log(app.userId)
    var _this = this;
    clientApi.getOrderList({ userId: app.userId, currPage: pageIndex, type: tabType}).then(d => {
      wx.hideLoading();
      console.log('orderList',d);
      //当success为1时说明接口没出现错误，否则接口报错
      if(d.success==1){
        //当数据不为空时则说明没下拉到底继续加载更多，否则已经下拉到底了
        if(d.data.data!=""){
          //执行将时间戳转为时间和拼接图片路径操作
          let orderList = d.data.data;
          for (let i = 0; i < orderList.length; i++) {
            for (let j = 0; j < orderList[i]['goodsList'].length; j++) {
              orderList[i]['goodsList'][j]['icon'] = "https://www.chongdaopet.com/images/" + orderList[i]['goodsList'][j]['icon'];
            }
            orderList[i]['createdate'] = this.formatTime(orderList[i]['createdate']);
            // orderList[i]['deliverTime'] = this.formatTime(orderList[i]['deliverTime']);
            if (orderList[i]['deliverTime'] != null) {
              orderList[i]['deliverTime'] = this.formatTime(orderList[i]['deliverTime']);
            }
            orderList[i]['receiveTime'] = this.formatTime(orderList[i]['receiveTime']);
          }
          //当currPage为1时说明是第一页则将数据重置为接口返回得数据，否则是下拉加载出来得数据将现有数据和请求返回的数据相连接
          if(d.data.currPage==1){
            _this.setData({
              orderList: d.data.data
            })
          }else{
            _this.setData({
              orderList: _this.data.orderList.concat(d.data.data)
            })
          }
        }else{
          //此时已经到底了：提示到底了
          isbottom = true;
          wx.showToast({
            icon: 'none',
            title: '已经到底了',
          })
        }
      }else{
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

  getUserInfoPermissions: function() {
    var _this = this;
    wx.getSetting({
      success(res) {
        if (!res['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              _this.getOrderList();
            },
            fail() {
              wx.showModal({
                title: '提示！！！',
                content: '【宠物之家】程序获取您公开的个人信息将更好的为您服务,如果不小心拒绝授权之后,请点击右上角选择关于宠物之家,进入之后再点击右上角，点击设置，并且授权',
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    // console.log(pageIndex);
    if (isbottom==false){  //当isbottom等于false时才加载下一页
      pageIndex++;
    }
    this.getOrderList();
    // var _this = this;
    // clientApi.getOrderList({ userId: app.userId, currPage: pageIndex }).then(d => {
    //   wx.hideLoading();
    //   console.log(d);
    //   if(d.data.data!=""){
    //     let orderList = d.data.data;
    //     for (let i = 0; i < orderList.length; i++) {
    //       for (let j = 0; j < orderList[i]['goodsList'].length; j++) {
    //         orderList[i]['goodsList'][j]['icon'] = "http://www.chongdaopet.com:20081/images/" + orderList[i]['goodsList'][j]['icon'];
    //       }
    //       orderList[i]['createdate'] = this.formatTime(orderList[i]['createdate']);
    //       // orderList[i]['deliverTime'] = this.formatTime(orderList[i]['deliverTime']);
    //       if (orderList[i]['deliverTime'] != null) {
    //         orderList[i]['deliverTime'] = this.formatTime(orderList[i]['deliverTime']);
    //       }
    //       orderList[i]['receiveTime'] = this.formatTime(orderList[i]['receiveTime']);
    //     }


    //     _this.setData({
    //       orderList: _this.data.orderList.concat(d.data.data)
    //     })
    //   }else{
    //     isbottom=true;
    //     wx.showToast({
    //       icon:'none',
    //       title: '已经到底了',
    //     })
    //   }
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    // console.log(app.shareInfo);
    let param = {
      userid: app.userId, //用户id
      couponid: app.shareInfo.id  //分享活动id
    }
    clientApi.userShare(param).then(res => {
      // console.log(res);
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
      title: app.shareInfo.title,
      path: '/pages/home/home',
      imageUrl: app.shareInfo.image,
      success: (res) => {
        console.log("分享成功", res);
      },
      fail: (res) => {
        console.log("分享失败", res);
      },
    }
  },

  //确认订单
  conOrder:function(e){
    var _this = this;
    clientApi.sureOrder({ id: orderitem.id}).then(d => {
      if (d.success) {
        _this.onShow();
        wx.showToast({
          title: '确认订单成功',  
        })
      } else {
        wx.showToast({
          title: d.msg,
        })
      }
    })
  },
  //去评价




  orderAction: function (e){

    // console.log(e);
    // console.log(e.target.dataset.orderitem);

    let orderitem = e.target.dataset.orderitem;
    
    var _this = this;
    // if (orderitem.orderStatus == 3) {
      wx.navigateTo({
        url: '../../pages/cancelOrder/cancelOrder?orderId=' + orderitem.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    // } else if (orderitem.orderStatus == 10 || orderitem.orderStatus == 13) {
    //   var _this = this;
    //   clientApi.sureOrder({ id: orderitem.id}).then(d => {
    //     if (d.success) {
    //       _this.onShow();
    //       wx.showToast({
    //         title: '确认订单成功',  
    //       })
    //     } else {
    //       wx.showToast({
    //         title: d.msg,
    //       })
    //     }
    //   })
    // } else if (orderitem.orderStatus == 6) {
    //   this.commentOrder(orderitem);
    // } else if (orderitem.orderStatus == 5 || orderitem.orderStatus == 6) {
    //   var _this = this;
    //   clientApi.delOrder({ id: orderitem.id }).then(d => {
    //     if (d.success) {
    //       _this.onShow();
    //       wx.showToast({
    //         title: '删除订单成功',
    //       })
    //     }
    //   })
    // }

   
  },
  //评价订单
  commentOrder: function (orderitem){
    orderitem.des = ""
    let item = JSON.stringify(orderitem.currentTarget.dataset.orderitem);
    wx.navigateTo({
      url: '../../pages/commentOrder/commentOrder?item=' + item,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  reminder: function (){
      wx.showToast({
        icon:'none',
        title: '催单成功,已成功提醒卖家',
      })
  },
  orderDeitailClick: function (e){
    
    let orderid = e.currentTarget.dataset.orderitem.id;
    // console.log(orderid);
    wx.navigateTo({
      url: '../../pages/orderDetail/orderDetail?orderid=' + orderid,
    })
  },
  //将时间戳转换为时间
  formatTime: function (time) {
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
    return [year, month, day].join('-') + ' ' + [hour, minute].join(':')
  },
  //追加订单跳转
  toReAddOrder:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + e.currentTarget.dataset.shopid + '&orderId=' + e.currentTarget.dataset.orderid+'&isAdd=true',
    })
  },
  pushDeliveryInfo: function (e) {
    let id = e.currentTarget.dataset.orderitem.id;
    wx.navigateTo({
      url: '../../pages/deliveryInfo/deliveryInfo?orderId=' + id
    })
  },
  topBarTap:function(e){
    console.log(e.currentTarget.dataset.index)
    for(let i=0;i<this.data.tabItems.length;i++){
      if (i == e.currentTarget.dataset.index){
        this.data.tabItems[i].isActive = 1
      }else{
        this.data.tabItems[i].isActive = 0
      }
    }
    tabType = e.currentTarget.dataset.index+1;
    pageIndex = 1;
    isbottom = false;
    this.setData({
      tabItems:this.data.tabItems,
      orderList: []
    })
    this.getOrderList()
  }
})