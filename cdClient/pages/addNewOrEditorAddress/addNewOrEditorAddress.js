// pages/addNewOrEditorAddress/addNewOrEditorAddress.js
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi;
let switchStatuNum = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "name": '',
    "tel": '',
    "address": '',
    "detailAddress": '',
    "addressId": '',
    location: '',
    lat: '',
    lng: '',
    switchStatu: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let _this=this;
    _this.setData({
      "address": ''
    })
    console.log(options)
    if(options.hasDefault=="false"||options.isDefault==1){
      _this.setData({
        switchStatu:true
      });
      switchStatuNum=1
    }
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })

    if (options.data) {
      let jsonData = JSON.parse(options.data);
      console.log(jsonData);
      var address = '';
      if (jsonData.phone.length > 0) {
        address = jsonData.location;
        app.globalData.temAddress.customAddress = address;
      }
      console.log(jsonData.address)
      this.setData({
        address: location,
        name: jsonData.userName,
        tel: jsonData.phone,
        detailAddress: jsonData.address,
        addressId: jsonData.id,
        lat: jsonData.lat,
        lng: jsonData.lng,
      })
      // console.log(this.data.lat);
      // console.log(this.data.lng);
    }


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
    this.setData({
      address: app.globalData.temAddress.customAddress,
      location: app.globalData.temAddress.location,


    })
    if (app.globalData.temAddress.location.lat && app.globalData.temAddress.location.lng) {
      this.setData({
        lat: app.globalData.temAddress.location.lat,
        lng: app.globalData.temAddress.location.lng,
      })
    }
    // console.log(this.data.location);
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

  pushChooseAddress: function() {
    wx.navigateTo({
      url: "../../pages/chooseArea/chooseArea?type=0",
      success: function(res) {

      },
      complete: function(res) {

      }
    })
  },

  telName: function(d) {
    this.data.name = d.detail.value;
  },

  tel: function(d) {
    this.data.tel = d.detail.value;
  },

  address: function(d) {
    this.data.address = d.detail.value;
  },

  detailAddress: function(d) {
    this.data.detailAddress = d.detail.value;
  },
  //删除地址
  deleteAddress: function(res) {
    console.log(this.data.addressId);
    //删除地址接口
    clientApi.deleteUserAddress({
      id: this.data.addressId
    }).then(res => {
      console.log(res);
      if (res.success == 1) {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1000)
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1000)
      }
    })
  },

  //修改地址
  updateAddress: function(res) {
    let status = 1;
    let param = {
      id: this.data.addressId,
      address: this.data.detailAddress,
      location: this.data.address,
      userName: this.data.name,
      phone: this.data.tel,
      status: status,
      userId: app.userId,
      lat: this.data.lat,
      lng: this.data.lng,
      defaultAddress: switchStatuNum
    }
    // console.log(param);
    // return;
    //修改地址接口
    clientApi.updateUserAddress(param).then(res => {
      console.log(res);
      if (res.success == 1) {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1000)
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1000)
      }
    })
  },

  //提交
  commit: function(e) {
    let actionType = e.target.dataset.actiontype;
    var _this = this;
    var status = 0;
    let phoneTest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (actionType == 0 || actionType == 1) {
      if (this.data.name == '') {
        wx.showModal({
          title: '请填写收货人姓名',
        })
        return;
      }

      if (this.data.tel == '') {
        wx.showModal({
          title: '请填写手机号',
        })
        return;
      }
      if (!phoneTest.test(this.data.tel)){
        wx.showModal({
          title: '请填写正确的手机号',
        })
        return;
      }
      if (this.data.address == '') {
        wx.showModal({
          title: '请选择定位地址',
        })
        return;
      }

      if (this.data.detailAddress == '') {
        wx.showModal({
          title: '请填写详细收货地址',
        })
        return;
      }

      status = 1;
    } else {
      status = -1;
    }

    var parama = {};

    if (this.data.addressId != '') {
      parama = {
        id: this.data.addressId,
        address: this.data.detailAddress,
        location: this.data.address,
        userName: this.data.name,
        phone: this.data.tel,
        status: status,
        userId: app.userId,
        lat: this.data.location.lat,
        lng: this.data.location.lng,
        defaultAddress: switchStatuNum
      };
    } else {
      parama = {
        address: this.data.detailAddress,
        location: this.data.address,
        userName: this.data.name,
        phone: this.data.tel,
        status: status,
        userId: app.userId,
        lat: this.data.location.lat,
        lng: this.data.location.lng,
        defaultAddress: switchStatuNum
      };
    }

    console.log(parama);
    // return;

    clientApi.editUserAddress(parama).then(d => {
      console.log(d)
      if (d.success == 1) {
        app.globalData.shippingAddress = d.data;
        wx.showToast({
          icon: 'none',
          title: '添加成功',
        })
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1000)

      }
    })
  },
  switchTap: function(e) {
    this.switchStatu = e.detail.value;
    if (this.switchStatu == true) {
      switchStatuNum = 1;
    } else {
      switchStatuNum = 0;
    }
    console.log(switchStatuNum)
  }
})