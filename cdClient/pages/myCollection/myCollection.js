// pages/mine/mine.js
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabStatus: 2,  //tab选中状态  1表示商品  2表示商家
    items: [],
    startX: 0, //开始坐标
    startY: 0
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
    var that = this;
    let param={
      userid:app.userId
    };
    this.getShopListOrGoodsList();



    // for (var i = 0; i < 10; i++) {
    //   this.data.items.push({
    //     content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
    //     isTouchMove: false //默认隐藏删除
    //   })
    // }
    
    // this.setData({
    //   items:this.data.items
    // })
    // console.log(this.data.items);
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

  //点击切换tab
  tabSwitch: function (res) {
    let status = res.currentTarget.dataset.status;  //当前点击元素的status值
    this.setData({
      tabStatus: status
    })
    this.getShopListOrGoodsList();
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    let id = e.currentTarget.dataset.id;  //商家id or 商品id
    let param={
      id:id
    };
    console.log(param);
    if(this.data.tabStatus==1){
      clientApi.deleteFavouriteGoods(param).then(res => {
        console.log(res);
        if(res.success==1){
          this.data.items.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            items: this.data.items
          })
          wx.showToast({
            title: '删除成功',
          })
        }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmText: "确定",
            content: res.msg,
            success: function () {
            }
          })
        }
      })
    }else if(this.data.tabStatus==2){
      clientApi.deleteFavouriteShop(param).then(res => {
        console.log(res);
        if (res.success == 1) {
          this.data.items.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            items: this.data.items
          })
          wx.showToast({
            title: '删除成功',
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmText: "确定",
            content: res.msg,
            success: function () {
            }
          })
        }
      })
    }
    

    
  },
  //获取用户收藏的商家列表  or  商品列表
  getShopListOrGoodsList:function(){
    wx.showLoading({
      title: '加载数据中',
    })
    let imgUrl ="https://www.chongdaopet.com/images/";
    let tabStatus = this.data.tabStatus;  //标识用户选中的是商品还是商家
    console.log(tabStatus);
    let param={
      userid:app.userId
    };
    if(tabStatus==1){
      /*获取用户已收藏的商品列表
      *@param {int} userid 用户id
      * 
      */
      clientApi.getFavouriteGoods(param).then(res => {
        wx.hideLoading();
        console.log(res);
        if(res.success==1){
          let obj=[];
          for (var i = 0; i < res.data.length; i++) {
            obj.push({
              id: res.data[i][4],
              imgUrl: imgUrl + res.data[i][1],
              title: res.data[i][2],
              price: res.data[i][3],
              isTouchMove: false
            })
          }
          this.setData({
            items:obj
          })
        }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmText: "确定",
            content: res.msg,
            success: function () {
            }
          })
        }
      })
    }else if(tabStatus==2){
      /*获取用户已收藏的商家列表
      *@param {int} userid 用户id
      * 
      */
      clientApi.getFavouriteShop(param).then(res => {
        wx.hideLoading();
        if (res.success == 1) {
          console.log(res);
          let obj = [];
          for (var i = 0; i < res.data.length; i++) {
            obj.push({
              id: res.data[i][8],
              imgUrl: imgUrl + res.data[i][2],
              title: res.data[i][1],
              address: res.data[i][4],
              tel: res.data[i][5],
              isTouchMove: false,
              shopId: res.data[i][0]
            })
          }
          this.setData({
            items: obj
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmText: "确定",
            content: res.msg,
            success: function () {
            }
          })
        }
      })
    }

  },
  //跳转到商品详情
  goGoodsDetails:function(e){
    let goodsId=e.currentTarget.dataset.id;
    /************此处由于没有详细商品数据和商家数据，暂时无法跳转，即使跳转过去也是没数据***********/
    // wx.navigateTo({
    //   url: '/pages/goodsDetail/goodsDetail?id=' + goodsId,
    // })

  },
  //跳转到商家
  goShop:function(e){
    let shopId=e.currentTarget.dataset.id;
    console.log(shopId);
    wx.navigateTo({
      url: '/pages/shop/shop?id='+shopId,
    })
  }
})