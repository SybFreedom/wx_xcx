// pages/messages/messages.js
let app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi;
let num;
let size;
let length;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    num = 1;
    size = 10;
    length = 0;
    let _this = this;
    _this.getMessageList();
  },
  getMessageList: function() {
    let _this = this;
    let parm = {
      receiverid: app.globalData.userId,
      receivertype: 2,
      currpage: num,
      pagesize: size
    }
    clientApi.getMessageList(parm, app.globalData.header).then(d => {
      console.log(d);
      if (num > d.data.totalPage) {
        wx.showToast({
          title: '已经到底了',
          icon: 'none'
        })
      } else if (d.success == 1) {
        for (let i = 0; i < d.data.data.length; i++) {
          d.data.data[i].createdate = _this.formatTime(d.data.data[i].createdate)
        }
        console.log(d.data.data.length)
        for (let i = length; i < length + d.data.data.length; i++) {
          _this.data.messageList[i] = d.data.data[i - length]
        }
        console.log(_this.data.messageList)
        _this.setData({
          messageList: _this.data.messageList
        })
        num++;
        length += 10;
      } else if (d.success == 0){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }

    })
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
    let _this = this;
    _this.getMessageList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toDetail: function(e) {
    console.log(e.currentTarget.dataset.content)
    console.log(e.currentTarget.dataset.index)
    this.data.messageList[e.currentTarget.dataset.index].status=1;
    this.setData({
      messageList: this.data.messageList
    })
    let parm = {
      messageid: e.currentTarget.dataset.id,
      status: 1
    }
    clientApi.updateMessageStatus(parm, app.globalData.header).then(d => {
      console.log(d)
      wx.navigateTo({
        url: '/pages/messageDetail/messageDetail?content='+e.currentTarget.dataset.content
      })
    })

  },
  formatTime: function(time) {
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
    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
  }
})