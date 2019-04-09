// pages/orderDetail/orderDetail.js
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},  //订单详细数据
    

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
    // let orderItem = JSON.parse(options.item);
    let _this=this;
    console.log(options.orderid);
    clientApi.getOrderDetailByOrderId({OrderId:options.orderid}).then(d=>{
      console.log(d);
      if(d.success==1){
        let item = d.data;
        for (let j = 0; j < item['goodsList'].length; j++) {
          item['goodsList'][j]['icon'] = "https://www.chongdaopet.com/images/" + item['goodsList'][j]['icon'];
        }
        
        if (d.data.ordereval!=null){
          if (d.data.ordereval.img != null && d.data.ordereval.img !=""){
            let imgList = d.data.ordereval.img.split(',');
            item.ordereval['imgList']=[];
            for (let k = 0; k < imgList.length; k++) {
              item.ordereval['imgList'].push("https://www.chongdaopet.com/images/" + imgList[k]);
            }
          }
        }
        

        item['createdate'] = this.formatTime(item['createdate']);
        if (item['deliverTime'] != null) {
          item['deliverTime'] = this.formatTime(item['deliverTime']);
        }
        item['receiveTime'] = this.formatTime(item['receiveTime']);

        _this.setData({
          item: item
        })
      }else{
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

  callTel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.item.tel //仅为示例，并非真实的电话号码
    })
  },
  //跳转到配送详情页面
  gopsdetails:function(){
    let item=JSON.stringify(this.data.item);
    wx.navigateTo({
      url: '/pages/psdetails/psdetails?item='+item,
    })
  },
  //跳转到联系卖家页面
  gocontact:function(){
    // console.log(this.data.item.shopName);
    // console.log(this.data.item.tel);
    // console.log(this.data.item.logo);
    let shopmsg=JSON.stringify({name:this.data.item.shopName,tel:this.data.item.tel,icon:this.data.item.logo});
    wx.navigateTo({
      url: '/pages/contact/contact?item='+shopmsg,
    })
  },
  //跳转到商家页面
  goshop:function(){
    let id = this.data.item.shopId;
    let orderId=this.data.item.id;
    // console.log(id);
    // let str = JSON.stringify(event.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id+'&isAdd=true&orderId='+orderId
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
  pushDeliveryInfo: function (e) {
    let id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../../pages/deliveryInfo/deliveryInfo?orderId=' + id
    })
  }
})