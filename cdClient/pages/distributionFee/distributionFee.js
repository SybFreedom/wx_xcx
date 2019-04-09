var app = getApp();
// pages/serviceDes/serviceDes.js
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ Q: 'Q1:无法进行下单？', content: ['输入地址后商户列表没有跳转，且点击地址没反应，是因为该地区尚未开通。'] },
    { Q: 'Q2:我需要注册才能下单吗？？', content: ['无需注册，我平台是跟微信绑定在一起，只需要输入姓名、手机号码、详细地址后即可下单。'] },
    { Q: 'Q3:下单后怎么知道自己下单成功了？', content: ['下单后页面会显示下单成功，同时用户会收到下单确认信息，便是商户已接单。'] },
    { Q: 'Q4:在线支付订单，应该如何申请退款？', content: ['您下单后如果想取消订单，您要“申请退款”您可以在申请退款页面里写上您要退款的理由，如商家同意退款，订单金额会原路返回您的支付账号里头；如有问题，可致电养宠有道客服0851-84129173，我们会协助您解决。'] },
    { Q: 'Q5:在线支付订单取消后，钱怎么返还？', content: ['使用微信账户余额支付的订单无效后，所有款项将退到您的微信账户余额里；', '使用第三方支付（银行卡）的订单无效后，所有款项将在2各工作日内返还到您的第三方支付账号内。'] },
    { Q: 'Q6:在线支付的过程中，订单显示未支付成功，款项却被扣了，怎么办？', content: ['该问题属于数据传输延迟问题。您可以再稍等一下，如果超过15分钟，订单还是未支付状态，请致电养宠有道客服0851-84129173，我们会协助您解决。'] },
    { Q: 'Q7:在线支付的订单，如果取消订单，商家拒绝取消该如何处理？', content: ['在线支付订单申请退款后，如果商家拒绝，可先查看商家拒绝订单的留言，如不满意该拒绝理由，请致电养宠有道客服0851-84129173，我们会协助您解决。'] },
    { Q: 'Q8:流浪狗领养要求', content: ['考虑狗狗生活稳定、便于志愿者回访，有以下要求：', '1.居住在贵阳主城区，成年。', '2.家庭稳定、收入稳定、居所稳定，其他家庭成员同意，接受领养前家访和领养后回访。', '3.出门牵绳、生病治病、定期免疫。不得遗弃，不得转送，不得散养。', '4.本人来简爱两次以上与狗狗培养感情。', '5.在校学生，租房，未成年人不领养。'] },
    { Q: 'Q9:人工沟通渠道有哪些？', content: ['1、客服电话：0851-84129173', '2、发邮箱至：44405864@qq.com', '3、发送微信至养宠有道公众号'] },
    { Q: 'Q10:商户入住的联系方式有哪些？', content: ['客服电话：0851-84129173'] }],
    details:[],
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

    let _this=this;
    clientApi.getServiceFeeStd().then(d=>{
      console.log(d.data);
      _this.setData({
        details:d.data
      })
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

})