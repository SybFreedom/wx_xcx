// pages/manage/manage.js
let num = 0;
let length = 0;
let num2 = 0;
let length2 = 0;
var uri = getApp().urlUse
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    list2: {},
    navbar: ['商家已接单', '商家未接单'],
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    num = 0;
    num2 = 0;
    let _this = this;
    _this.setData({
      list: {},
      list2: {}
    })
    _this.getList(num);
    _this.getList2(num2);
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _this=this;
    if (_this.data.currentTab==0){
      num++;
      this.getList(num);
    }else if (_this.data.currentTab == 1) {
      num2++;
      this.getList2(num2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  godetails: function(e) {
    console.log(e)
    wx.setStorage({
      key: 'dataid',
      data: e.currentTarget.dataset.id,
    })
    wx.navigateTo({
      url: '/pages/details/details',
    })
  },
  getList: function(e) {
    let _this = this;
    wx.request({
      url: getApp().urlUse+'express/expressAdminAllActiveOrder',
      header: getApp().globalData.header,
      data: {
        currentPage: e,
        pageSize: 10
      },
      success: function(res) {
        console.log(res);
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '已经到底了',
            icon: 'none'
          })
        }
        if (res.data.success != 1) {
          wx.showToast({
            title: '请重新登陆',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 1000)
        }
        for (let i = 0; i < res.data.data.length; i++) {
          _this.data.list[length + i] = res.data.data[i]
        }
        _this.setData({
          list: _this.data.list
        })
        length += 10;
      }
    })
  },
  getList2: function (e) {
    let _this = this;
    console.log(e);
    wx.request({
      url: getApp().urlUse+'express/expressAdminAllNewOrder',
      header: getApp().globalData.header,
      data: {
        currentPage: e,
        pageSize: 10
      },
      success: function (res) {
        console.log(res);
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '已经到底了',
            icon: 'none'
          })
        }
        if (res.data.success != 1) {
          wx.showToast({
            title: '请重新登陆',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 1000)
        }
        for (let i = 0; i < res.data.data.length; i++) {
          _this.data.list2[length2 + i] = res.data.data[i]
        }
        _this.setData({
          list2: _this.data.list2
        })
        length2 += 10;
      }
    })
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  goDelete:function(event){
    let _this=this;
    wx.showModal({
      title: '提示',
      content: '是否确认取消订单',
      success:function(e){
        if(e.confirm==true){
          console.log(event.currentTarget.dataset.id)
          wx.request({
            url: uri + 'express/expressUpdateOrderStatus',
            header: getApp().globalData.header,
            data: {
              id: event.currentTarget.dataset.id,
              status: -1
            },
            success: function (res) {
              console.log(res);
              _this.onLoad()
            }
          })
        }else{
          console.log("取消")
        }
      }
    })
  }
})