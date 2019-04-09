var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
// pages/serviceDes/serviceDes.js
let pageIndex = 1;  //当前第几页数据
let isbottom = false;  //是否已经到底
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList:[
      // { title: "通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知", dateTime: "2019-1-10", content:"通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知", status: 1},
      // { title: "通知通知通知", dateTime: "2019-1-10", content: "通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知", status: 2 },
      // { title: "通知通知通知", dateTime: "2019-1-10", content: "通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知通知", status: 1 }
    ]
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
    this.getMessageList();
  },

  //获取消息列表
  getMessageList: function () {
    wx.showLoading({
      title: '正在加载中',
    })
    console.log(app.userId)
    var _this = this;
    let param = {
      receiverid: app.userId,
      receivertype: 1,
      currpage: pageIndex,
      pagesize: 10
    };
    console.log(param);  //0未读  1已读
    clientApi.getMessageList(param).then(d => {
      wx.hideLoading();
      console.log(d);
      //当success为1时说明接口没出现错误，否则接口报错
      if (d.success == 1) {
        //当数据不为空时则说明没下拉到底继续加载更多，否则已经下拉到底了
        if (d.data.data != "") {
          //执行将时间戳转为时间和拼接图片路径操作
          let msgList = d.data.data;
          for (let i = 0; i < msgList.length; i++) {
            msgList[i]['createdate'] = this.formatTime(msgList[i]['createdate']);
          }
          //当currPage为1时说明是第一页则将数据重置为接口返回得数据，否则是下拉加载出来得数据将现有数据和请求返回的数据相连接
          if (d.data.currPage == 1) {
            _this.setData({
              msgList: d.data.data
            })
          } else {
            _this.setData({
              msgList: _this.data.msgList.concat(d.data.data)
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
          success: function () {
          }
        })
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
    console.log(pageIndex);
    if (isbottom == false) {  //当isbottom等于false时才加载下一页
      pageIndex++;
    }
    this.getMessageList();
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

  //跳转到消息详情页面
  goMsgDetails:function(e){
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/msgDetails/msgDetails?item='+item,
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
  }
})