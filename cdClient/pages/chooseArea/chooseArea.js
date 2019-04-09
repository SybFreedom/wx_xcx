// pages/chooseArea/chooseArea.js
var app = getApp();
var tools = require('../../utils/util.js');
var txmap = require('../../libs/map/qqmap-wx-jssdk.min.js');
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openList:[],
    searchResult:[],
    address: {},
    chooseType:'' 
  },

  /**
   * 根据输入内容检索地址
   */
  bindKeyInput: function (e) {
    var that = this;
    // 引入SDK核心类
    var QQMapWX = txmap;

    // 实例化API核心类
    var demo = new QQMapWX({
      key: app.globalData.txMapak // 必填
    });


    demo.getSuggestion({
      region:'上海市',  //城市
      region_fix:0,  //默认0
      keyword: e.detail.value, //搜索关键字
      success: function (res) {
        console.log(res);
        that.setData({
          searchResult:res.data
        })
      }
    });
  },

  postionUserLocation: function () {
    var that = this;

    var QQMapWX = txmap;

    // 实例化API核心类
    var demo = new QQMapWX({
      key: app.globalData.txMapak // 必填
    });

    // 调用接口
    demo.reverseGeocoder({
      success: function (res) {
        var res = res.result;
          app.globalData.userLocationAddress.city = res.ad_info.city;
          app.globalData.userLocationAddress.provinces = res.ad_info.province;
          app.globalData.userLocationAddress.district = res.ad_info.district;
          app.globalData.userLocationAddress.name = tools.formatNullObj(res.address_component.district) + tools.formatNullObj(res.address_reference.landmark_l2.title) + '(' + tools.formatNullObj(res.address_reference.street.title) + '附近' + tools.formatNullObj(res.address_reference.street._distance) + '米)';
          app.globalData.userLocationAddress.location = res.location;
          app.globalData.userLocationAddress.adcode = res.ad_info.adcode;
          app.globalData.userLocationAddress.customAddress = res.formatted_addresses.recommend;

          that.setData({
            address: app.globalData.userLocationAddress
          });
      },
      fail:function(r){
        console.log(r);
      }
    });
  },

  chooseUserLocation: function () {
    if (this.data.chooseType == 1) {
      this.setData({
        address: app.globalData.userLocationAddress
      });
    } else {
      var customAdress = app.globalData.userLocationAddress.name;
      app.globalData.temAddress.customAddress = customAdress;
      app.globalData.temAddress.location = app.globalData.userLocationAddress.location;
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  //点击不同分区时触发
  openItemClick: function (r){
    
    var openItem = r.currentTarget.dataset.openitem;
    if (this.data.chooseType == 1) {
      app.globalData.userLocationAddress.city = openItem.name;
      app.globalData.userLocationAddress.adcode = openItem.code;
      app.globalData.userLocationAddress.name = openItem.name;
      app.globalData.userLocationAddress.lat = openItem.lat;
      app.globalData.userLocationAddress.lng = openItem.lng;
      app.globalData.userLocationAddress.location.lat = openItem.lat;  //确定当前位置的lat
      app.globalData.userLocationAddress.location.lng = openItem.lng;  //确定当前位置的lng
    }
    
    wx.navigateBack({
      delta: 1,
    })
  },
  //点击搜索出来的数据时触发
  itemClick: function (res){
    var index = res.currentTarget.dataset.id;
    var addressComponent = this.data.searchResult[index];
    var customAddress = addressComponent.province + addressComponent.city + addressComponent.district + addressComponent.title;
    if (this.data.chooseType == 1) {
      app.globalData.userLocationAddress.city = addressComponent.city;
      app.globalData.userLocationAddress.district = addressComponent.district;
      app.globalData.userLocationAddress.name = addressComponent.title;
      app.globalData.userLocationAddress.location = addressComponent.location;
      app.globalData.userLocationAddress.adcode = addressComponent.adcode;
      app.globalData.userLocationAddress.customAddress = customAddress;
      this.setData({
        address: app.globalData.userLocationAddress,
      });
    } else {
      app.globalData.temAddress.city = addressComponent.city;
      app.globalData.temAddress.district = addressComponent.district;
      app.globalData.temAddress.name = addressComponent.title;
      app.globalData.temAddress.location = addressComponent.location;
      app.globalData.temAddress.customAddress = customAddress;
      this.setData({
        address: app.globalData.temAddress,
      });
    }


    
    wx.navigateBack({
      delta: 1,
    })
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
    this.setData({
      address: app.globalData.userLocationAddress,
      chooseType: options.type
    })
    console.log(app.globalData.userLocationAddress);

    if (options.type == 1) {
      var that = this;
      // clientApi.getOpenCityList().then(d => {
      //   console.log(d);
      //   that.setData({
      //     openList:d.data
      //   })
      // });
      //获取分区列表
      clientApi.getOpenDistrict().then(d=>{
        // console.log(d.data);
        let arr=d.data;
        let newArr=[]; //经纬度不为null的区
        for(let i=0;i<arr.length;i++){
          if(arr[i].lat!=null && arr[i].lng!=null){
            newArr.push(arr[i]);
          }
        }
        // console.log(newArr);
        that.setData({
          openList:newArr
        })
        console.log(newArr);
        
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


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})