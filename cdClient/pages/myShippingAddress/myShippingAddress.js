const clientApi = require('../../utils/clientApi.js').clientApi
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseType:'',
    windowHeight: 0,
    windowWidth: 0,
    list: [],
    hasDefault:false
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
    if(options.chooseType){
      this.setData({
        chooseType: options.chooseType
      })
    }
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
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight - 50,
          windowWidth: res.windowWidth
        })
      }
    })
    var _this = this;
    _this.data.hasDefault=false;
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
        wx.showLoading({
          title: '正在加载中',
        })
        clientApi.getUserAddress({ userId: app.userId }).then(d => {
          wx.hideLoading();
          console.log(d);
          _this.setData({
            list: d.data
          });
          for (let i = 0; i < d.data.length; i++) {
            if (d.data[i].defaultAddress == 1) {
              _this.data.hasDefault=true
            }
          }
        })
      } else if (msg == 3) {
        _this.setData({
          hasUserInfo: false
        })
      }
    });
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

  addNewOrEditorAddress: function(){
    let _this=this;
    wx.navigateTo({
      url: '../../pages/addNewOrEditorAddress/addNewOrEditorAddress?id=1&hasDefault=' + _this.data.hasDefault,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  editor: function (e){
    let _this=this;
    console.log(e);
    let dataItem = this.data.list[e.currentTarget.dataset.index];
    let jsonObject = dataItem;
    let str = JSON.stringify(jsonObject);
    wx.navigateTo({
      url: '../../pages/addNewOrEditorAddress/addNewOrEditorAddress?data=' + str + '&hasDefault=' + _this.data.hasDefault + '&isDefault=' + e.currentTarget.dataset.defaultstatu,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  chooseItem: function (e){
    if (this.data.chooseType == 1) {
      let dataItem = this.data.list[e.currentTarget.dataset.index];
      app.globalData.shippingAddress = dataItem;
      console.log('dataItem')
      console.log(dataItem)
      wx.navigateBack({
        delta: 1,
      })
    }else if(this.data.chooseType == 10){
      //此时选择的是送宠地址
      let dataItem = this.data.list[e.currentTarget.dataset.index];
      app.globalData.sshippingAddress = dataItem;
      wx.navigateBack({
        delta: 1,
      })

    }
  }
})