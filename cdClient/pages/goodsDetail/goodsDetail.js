// pages/goodsDetail/goodsDetail.js
var tools = require('../../utils/util.js');
var app = getApp();
var WxParse= require('../../libs/wxParse/wxParse.js');
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    items:"",
    // imgUrls:[
    //   { img: '/images/baike_02.jpg' },
    //   { img: '/images/testImg_03.png' },
    //   { img: '/images/Back_02.png' },
    // ], //轮播图片地址
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    indicatorColor: 'ececec',
    indicatorActiveColor: 'ffd33a',
    num:1,  //购买数量
    shipPrice: 0, 
    isshow:false,  //是否显示购买数量框
    status:'',  //区分跳转到商铺
    scrollTop: 0,  //距离顶部位置
    floorstatus: false,  //是否显示返回顶部按钮
    isCollection: false,  //是否收藏：默认未收藏
    gift: 0,  //是否是从礼包购买跳转过来的
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      //console.log(res);
      app.userShare = res;
    })

    //console.log(options);
    let item = JSON.parse(decodeURIComponent(options.item));
    let items = JSON.parse(decodeURIComponent(options.items));
    item.des = app.goodsAttrubuteStr ? app.goodsAttrubuteStr:'';
    //console.log(item);
    // console.log(items);
   // console.log(app.goodsAttrubuteStr);
    // return;
    this.setData({
      item:item,
      items:items,
      shipPrice:options.shipPrice,
      status:options.status
    })
    if(options.gift){
      this.setData({
        gift:options.gift
      })
    }

    // console.log(item);
    var article = item.des ? item.des : "<p>暂无产品描述</p>";
    var that = this;
    WxParse.wxParse('article', 'html', article, that, 0);

    /*检测用户是否收藏该商品
     *@param {int} goodsid 商品id
     *@param {int} userid 用户id
     * 
     */
    let param = {
      goodsid: this.data.item.id,
      userid: app.userId
    };
    //console.log(param);
    clientApi.getInvFavouriteGoods(param).then(res => {
      //console.log(res);
      if (res.data == 1) {
        that.setData({
          isCollection: true
        })
      } else {
        that.setData({
          isCollection: false
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
    app.goodsAttrubuteStr = null;
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
    //console.log(param);
    //console.log(app);
    clientApi.userShare(param).then(res => {
      //console.log(res);
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

  //点击返回店铺页面
  goback:function(){
    let id=this.data.item.shopId;  //商家id

    if(this.data.status==1){
      wx.navigateTo({
        url: '/pages/shop/shop?id=' +id 
      })
    }else{
      wx.navigateBack({

      })
    }

    
  },
  //点击+或-计算数量
  gonum:function(e){
    let f=e.currentTarget.dataset.f;
    if(f=="+"){
      this.setData({
        num: this.data.num + 1
      });
    }else if(f=="-"){
      if(this.data.num>=2){
        this.setData({
          num: this.data.num - 1
        });
      }
    }
  },
  //点击隐藏购买数量框
  gohide:function(){
    this.setData({
      isshow: false
    });
  },
  //点击立即购买显示购买数量框
  goshow:function(){
    console.log(this.data.item);
    this.setData({
      isshow:true
    });
  },
  //点击提交订单
  goorder:function(){
    // wx.showLoading({
    //   title: '订单提交中',
    // })
    // console.log(this.data.num);
    // console.log(this.data.item);
    // console.log(this.data.items);
    // console.log(this.data.shipPrice);
    let _this=this;
    if (tools.isEmpty(app.userId)) {
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
          _this.change();
        } else if (msg == 3) {
          _this.setData({
            hasUserInfo: false
          })
        }
      });    
    } else {
      _this.change();
    }

  },
  //执行提交订单跳转操作
  change:function(){
    // var goodsDatas = e.currentTarget.dataset.goodslist;
    // goodsDatas.forEach(function (obj, index) {
    //   obj.des = "";
    // });
    this.setData({
      ["item.selectCount"]: this.data.num
    });
    let datas = JSON.stringify([this.data.item]);
    let item = JSON.stringify(this.data.items);
    wx.setStorage({
      key: 'orderType',
      data: '0',
    })
    // console.log(datas);
    // console.log(item);
    // console.log(this.data.shipPrice);
    let hours = this.formatTime();  //当前时间（小时）
    //判断当前时间是否是商家营业时间，如果不在商家营业时间则提示用户不可下单
    // if (hours > this.data.item.endtime || hours < this.data.item.starttime) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '当前商家没有营业，请在商家营业时间下单',
    //   })
    // } else if (hours > 18 || hours < 8) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '当前配送员已下班，请在配送员上班时间下单',
    //   })
    // } else {
    // console.log(datas);
    // console.log(item);
    // console.log(this.data.shipPrice);
    // return;
    if (this.data.gift == 1) {
      //此时跳转到礼包提交订单页面
      wx.navigateTo({
        url: '../../pages/giftSubmitOrder/giftSubmitOrder?datas=' + encodeURIComponent(datas) + '&item=' + encodeURIComponent(item) + '&shipPrice=' + this.data.shipPrice
      })
    } else {
      //此时跳转到提交订单页面
      wx.navigateTo({
        url: '../../pages/submitOrder/submitOrder?datas=' + encodeURIComponent(datas) + '&item=' + encodeURIComponent(item) + '&shipPrice=' + this.data.shipPrice + '&back=2'
      })
    }


      // }

      // wx.navigateTo({
      //   url: '../../pages/submitOrder/submitOrder?datas=' + datas + '&item=' + item + '&shipPrice=' + this.data.shipPrice
      // })
  },
  //获取时间
  formatTime: function (date) {
    var timestamp =
      Date.parse(new Date());

    timestamp = timestamp / 1000;

    //获取当前时间

    var n = timestamp *
      1000;

    var date = new Date(n);

    //年

    var Y =
      date.getFullYear();

    //月

    var M = (date.getMonth()
      + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

    //日

    var D = date.getDate()
      < 10 ? '0' + date.getDate() :
      date.getDate();

    //时

    var h = date.getHours();

    return h;

  },
  //加入收藏或取消收藏
  addCollection: function () {
    this.setData({
      isCollection: !this.data.isCollection
    })
    /*加入收藏 or 取消收藏
     *@param {int} goodsid 商品id
     *@param {int} userid 用户id
     *  
     */
    let param = {
      userid: app.userId,
      goodsid: this.data.item.id
    };
    console.log(param);
    clientApi.updateFavouriteGoodsStatus(param).then(res => {
      console.log(res);
      if (res.data == 1) {
        wx.showToast({
          title: '收藏成功',
        })
      } else {
        wx.showToast({
          title: '取消收藏成功',
        })
      }
    })
  }

})