// pages/submitOrder/submitOrder.js
var app = getApp();
var dateTimePicker = require('../../utils/dateTimePicker.js');
const clientApi = require('../../utils/clientApi.js').clientApi
var tools = require('../../utils/util.js')
let statu = 0;
let orderType = 0;
let shopId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pet_count_display: true,
    firstIn: 0,
    item: {},
    addressInfo: {
      userName: '',
      phone: '',
      address: '',
      location: '',
      id: '',
      status: '',
      userId: ''
    },
    saddressInfo: {
      userName: '',
      phone: '',
      address: '',
      location: '',
      id: '',
      status: '',
      userId: ''
    },
    currentYear: 2018,
    firstInfo: {
      firstMoney: '0',
      isFirst: 0
    },
    selectedGoodList: [],
    shipFeeMoney: 0,
    totalPrice: 0,
    totalPriceBasic: 0,
    note: '',
    shipPrice: 0,
    disfee: 0, //配送费用
    addnum: 0, //宠物每增加一个所需要增加的配送费用
    shipPriceBasic: 0,
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2018,
    endYear: 2018,
    startime: "",
    endtime: "",
    jdisplay: 'flex',
    sdisplay: 'flex',
    canCheck1: true,
    canCheck2: false,
    pet_count: 0,
    orderType: 0,
    jm: 0,
    serviceCard: null, //配送优惠券
    goodsCard: null, //商品及服务优惠券
    checked: ['111', '222'], //选中状态
    tabStatus: 2, //tab选中状态
    isShowTab: true, //是否显示顶部单双程选项
    radio: [{
        name: '接宠(家->宠物店)',
        value: '接宠(家->宠物店)',
        id: 1
      },
      {
        name: '送宠(宠物店->家)',
        value: '送宠(宠物店->家)',
        id: 2
      },
    ],
    radioselected: 1, //接送服务选中状态
    selectedRadio: "接宠(家->宠物店)", //用户所选中的接宠或送宠
    isShowBackAddress: false, //是否显示送回地址
    treaty: true, //是否选中服务条款
    userMoney: '', //用户余额
    isUseBalance: false, //是否使用余额抵扣配送费
    isSelected: true, //使用余额选择框是否可用 true不可用  false可用
    price: 0, //输入要使用的金额
    useUserMonery: true, //是否使用用户余额
    back: 0, //后退几页 1代表1页
    isCarFollowing: false, //主人是否需要跟车
    goodsdisedfee: 0,
    goodsdisfee: 0,
    goodsfee: 0,
    payoffamount: 0,
    purseamount: 0,
    servicedisedfee: 0,
    servicedisfee: 0,
    servicefee: 0,
    totaldisedfee: 0,
    totaldisfee: 0,
    totalfee: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    // console.log('tabStatus')
    // console.log(_this.data.tabStatus)
    //配置分享信息
    app.getShareInfo(1).then(res => {
      //console.log(res);
      app.userShare = res;
    })

    //存储后退页数
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
    //获取当前时间:将初始年份设置为当前年份
    let currentDateTime = _this.formatTime();
    _this.setData({
      currentYear: currentDateTime[0],
      startYear: currentDateTime[0],
      endYear: currentDateTime[0]
    })

    wx.getStorage({
      key: 'orderType',
      success: function(res) {
        orderType = res.data;
        _this.setData({
          orderType: orderType
        })
      },
    })
    this.initDates();
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })

    //订单数据
    let list = JSON.parse(decodeURIComponent(options.datas));
    let shopItem = JSON.parse(decodeURIComponent(options.item));
    let shipPrice = options.shipPrice;
    // console.log(list);
    console.log('shopItem', shopItem);
    shopId = shopItem.id;
    // console.log(shipPrice);
    //遍历list查看是否有服务，如果有服务则默认双程，如果仅购买商品则默认单程
    for (let i = 0; i < list.length; i++) {
      if (list[i].goodsType == 2) {
        this.setData({
          tabStatus: 2,
          isShowTab: true,
          isService: 0,
        });
        break;
      } else {
        this.setData({
          tabStatus: 1,
          isShowTab: false,
          isService: 1,
          selectedRadio: "送货(宠物店->家)",
          pet_count: 1,
          pet_count_display: false
        });
      }
    }
    this.getUserAddress();
    this.setData({
      shipFeeMoney: shopItem.servicePrice * 1,
      item: shopItem,
      shipPrice: shipPrice * 1,
      selectedGoodList: list,
      userMoney: app.userMoney
    })
    // this.calculateShipPrice();
    this.calculationFee(true); //计算费用

    let startTime = this.data.startTime;
    //let startTime = _this.formatTime(Date.parse(new Date()));
    let startTimeArr = [...startTime.split(' ')[0].split('-'), ...startTime.split(' ')[1].split(':')];

    var iosTime = startTime.replace(/-/g, '/'); //解决ios端无法识别 
    let stimeStamp = this.timeStamp(iosTime); //服务时间的时间戳
    // stimeStamp += 1800;

    if (startTimeArr[3] < 17 & startTimeArr[3] > 8) {
      let endStamp = stimeStamp + 3600;
      Date.prototype.format = function(format) { //向Date对象中追加一个方法：此方法功能是将时间戳转换为时间格式
        var date = {
          "M+": this.getMonth() + 1,
          "d+": this.getDate(),
          "h+": this.getHours(),
          "m+": this.getMinutes(),
          "s+": this.getSeconds(),
          "q+": Math.floor((this.getMonth() + 3) / 3),
          "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
          if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
              date[k] : ("00" + date[k]).substr(("" + date[k]).length));
          }
        }
        return format;
      }
      var newDate = new Date(); //创建日期时间对象
      newDate.setTime(endStamp * 1000); //设置日期对象的时间戳
      let ssj22 = newDate.format('yyyy-MM-dd h:mm'); //获取返回的日期时间

      var newDate2 = new Date();
      newDate2.setTime(stimeStamp * 1000);
      let ssj33 = newDate2.format('yyyy-MM-dd h:mm');

      this.setData({
        endTime: ssj22,
        startTime: ssj33
      })
    } else {
      stimeStamp += 86400;
      let endStamp = stimeStamp + 3600;
      Date.prototype.format = function(format) { //向Date对象中追加一个方法：此方法功能是将时间戳转换为时间格式
        var date = {
          "M+": this.getMonth() + 1,
          "d+": this.getDate(),
          "h+": this.getHours(),
          "m+": this.getMinutes(),
          "s+": this.getSeconds(),
          "q+": Math.floor((this.getMonth() + 3) / 3),
          "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
          if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
              date[k] : ("00" + date[k]).substr(("" + date[k]).length));
          }
        }
        return format;
      }
      var newDate = new Date(); //创建日期时间对象
      newDate.setTime(endStamp * 1000); //设置日期对象的时间戳
      let ssj22 = newDate.format('yyyy-MM-dd h:mm'); //获取返回的日期时间

      var newDate2 = new Date();
      newDate2.setTime(stimeStamp * 1000);
      let ssj33 = newDate2.format('yyyy-MM-dd h:mm');

      this.setData({
        endTime: ssj22,
        startTime: ssj33
      })
    }



  },

  onReady: function() {

  },

  onShow: function() {

    // console.log(app.serviceCard)
    // console.log(app.goodsCard)
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var currentYear = date.getFullYear();
    this.setData({
      currentYear: currentYear,
      addressInfo: app.globalData.shippingAddress,
      saddressInfo: app.globalData.sshippingAddress,
      serviceCard: app.serviceCard,
      goodsCard: app.goodsCard
    })

    //如果接宠、送宠id不为空则说明是双程
    if (this.data.tabStatus == 2) {
      //双程订单如果送宠地址和接宠不一致就取后来选择的送宠地址，否则取接宠地址
      let sshippingAddress = app.globalData.sshippingAddress.id ? app.globalData.sshippingAddress : app.globalData.shippingAddress;
      this.setData({
        saddressInfo: sshippingAddress,
      })
      if (this.data.saddressInfo.id && this.data.addressInfo.id) {
        this.calculationFee(true);
      }

      //如果接宠地址id不为空则说明是单程
    } else if (this.data.tabStatus == 1) {
      if (this.data.addressInfo.id) {
        this.calculationFee(false);
      }

    }

    //判断用户余额是否为0，如果为0则不能使用余额抵扣配送费
    if (this.data.addressInfo.id) {

      if (this.data.userMoney == 0 || this.data.userMoney == 0.00) {
        this.setData({
          isSelected: true
        })
      } else {
        this.setData({
          isSelected: false
        })
      }
    }
  },
  calculateShipPrice: function() {
    if (!app.globalData.shippingAddress) {
      return
    }
    if (!this.data.item) {
      return
    }
    var shipAddress = app.globalData.shippingAddress
    var userLocation = app.globalData.userLocationAddress
    var distance = tools.getGreatCircleDistance(shipAddress.lat, shipAddress.lng, this.data.item.lat, this.data.item.lng);

    var total = 0,
      shipServicePrice = 0,
      shipGoodsPriveTep = false,
      shipServicePriveTep = false;
    this.data.selectedGoodList.forEach(function(item, index) {
      total += item.price * item.selectCount;
      if (item.goodsType == 1) {
        shipGoodsPriveTep = true;
      } else {
        shipServicePriveTep = true;
      }
    });

    if (total > 0) {
      if (shipGoodsPriveTep && shipServicePriveTep) {
        shipServicePrice = this.data.item.goodsPrice > this.data.item.baseCharg ? this.data.item.goodsPrice : this.data.item.baseCharg;

      } else {
        shipServicePrice = shipGoodsPriveTep ? this.data.item.goodsPrice : this.data.item.baseCharg;
      }
    }

    var shipPrice = shipServicePrice;

    if (distance > this.data.item.baseDistance) {
      var remainDistance = (distance - this.data.item.baseDistance) / 1000;
      remainDistance = Math.ceil(remainDistance)

      shipPrice = shipPrice * 1 + remainDistance * this.data.item.overCharg * 1;
    }

    this.setData({
      shipPrice: shipPrice,
      shipPriceBasic: shipPrice
    })
    var that = this;
    that.calculateAllMoeny();
    clientApi.getUserFirstPayInfo({
      'userId': app.userId
    }).then(d => {
      if (d.success == 1 && d.data) {
        that.setData({
          firstInfo: d.data
        })
        that.calculateAllMoeny();
      }
    })
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

    clientApi.userShare(param).then(res => {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  input: function(e) {
    this.data.note = e.detail.value;
  },
  //将时间转换为时间戳
  timeStamp: function(res) {
    var timestamp2 = Date.parse(new Date(res));
    timestamp2 = timestamp2 / 1000;
    return timestamp2;
  },

  //提交订单
  commitBtClick: function() {
    let goods = this.data.selectedGoodList.map(d => {
      var item = {};
      item.goodsId = d.id;
      item.amount = d.selectCount;
      return item;
    });
    var _this = this;
    let goodscardid = this.data.goodsCard ? this.data.goodsCard.cardId : 0; //商品优惠券
    let servicecardid = this.data.serviceCard ? this.data.serviceCard.cardId : 0; //配送优惠券

    let goodsdisedfee = this.data.goodsdisedfee ? this.data.goodsdisedfee : 0;
    let goodsdisfee = this.data.goodsdisfee ? this.data.goodsdisfee : 0;
    let goodsfee = this.data.goodsfee ? this.data.goodsfee : 0;
    let payoffamount = this.data.payoffamount ? this.data.payoffamount : 0;
    let purseamount = this.data.purseamount ? this.data.purseamount : 0;
    let servicedisedfee = this.data.servicedisedfee ? this.data.servicedisedfee : 0;
    let servicedisfee = this.data.servicedisfee ? this.data.servicedisfee : 0;
    let servicefee = this.data.servicefee ? this.data.servicefee : 0;
    let totaldisedfee = this.data.totaldisedfee ? this.data.totaldisedfee : 0;
    let totaldisfee = this.data.totaldisfee ? this.data.totaldisfee : 0;
    let totalfee = this.data.totalfee ? this.data.totalfee : 0;
    let follow = this.data.isCarFollowing ? 1 : 0;


    var param = {}; //提交订单支付信息

    if (this.data.tabStatus == 1) { //此时用户选择了单程，判断用户是否选择服务地址
      //判断用户是否选择服务地址
      if (tools.isEmpty(this.data.addressInfo.phone)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请添加服务地址'
        })
        return;
      }

      //判断服务时间必须大于当前时间
      var iosTime = this.data.startTime.replace(/-/g, '/'); //解决ios端无法识别 
      let stimeStamp = this.timeStamp(iosTime); //服务时间的时间戳

      var currenttimestamp = Date.parse(new Date());
      currenttimestamp = currenttimestamp / 1000; //当前时间戳
      //判断是否是春节时间如果是春节时间禁止下单，仅能预约春节后的订单
      if (stimeStamp > 1549209600 && stimeStamp < 1549814400) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '春节期间2月4日——2月10日暂停服务，2月10日以后的时间都可正常预约',
        })
        return;
      }

      if (stimeStamp < (currenttimestamp - 300)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请重新选择服务时间，服务时间必须大于等于当前时间',
        })
        return;
      }
      let dcStartTime = this.data.startTime; //单程时间
      var arrDcStartTime = [...dcStartTime.split(' ')[0].split('-'), ...dcStartTime.split(' ')[1].split(':')]; //将时间分隔为数组
      if (arrDcStartTime[3] >= 17) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '配送员已下班，请在17点之前下单',
        })
        return;
      }

      //整合订单提交支付信息
      param = {
        userId: app.userId,
        shopId: _this.data.item.id,
        addressId: _this.data.addressInfo.id,
        saddressId: '',
        goods: goods,
        note: _this.data.note + "单程备注：" + _this.data.selectedRadio,
        receiveTime: _this.data.startTime,
        deliverTime: '',
        petAmount: _this.data.pet_count,
        goodsdiscardId: goodscardid, //商品优惠券
        servicediscardId: servicecardid, //配送优惠券
        follow: follow, //主人是否跟车

        goodsdisedfee: goodsdisedfee,
        goodsdisfee: goodsdisfee,
        goodsfee: goodsfee,
        payoffamount: payoffamount,
        purseamount: purseamount,
        servicedisedfee: servicedisedfee,
        servicedisfee: servicedisfee,
        servicefee: servicefee,
        totaldisedfee: totaldisedfee,
        totaldisfee: totaldisfee,
        totalfee: totalfee,
        usepurse: this.data.useUserMonery,
        is_service: _this.data.isService
      };

    } else if (this.data.tabStatus == 2) { //此时用户选择了双程，判断用户是否选择接宠地址、送宠地址
      //判断接宠地址、送宠地址
      if (tools.isEmpty(this.data.addressInfo.phone)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请添加接宠地址'
        })
        return;
      } else if (this.data.isShowBackAddress) {
        if (tools.isEmpty(this.data.saddressInfo.phone)) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请添加送宠地址'
          })
          return;
        }

      }

      //判断接宠时间必须大于当前时间
      var iosTime = this.data.startTime.replace(/-/g, '/'); //解决ios端无法识别 
      let stimeStamp = this.timeStamp(iosTime); //服务时间的时间戳
      var currenttimestamp = Date.parse(new Date());
      currenttimestamp = currenttimestamp / 1000; //当前时间戳

      //判断是否是春节时间如果是春节时间禁止下单，仅能预约春节后的订单
      if (stimeStamp > 1549209600 && stimeStamp < 1549814400) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '春节期间2月4日——2月10日暂停服务，2月10日以后的时间都可正常预约',
        })
        return;
      }

      if (stimeStamp < (currenttimestamp - 300)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请重新选择接宠时间，接宠时间必须大于等于当前时间',
        })
        return;
      }

      //判断送宠时间是否大于接宠时间1小时
      var endiosTime = this.data.endTime.replace(/-/g, '/'); //解决ios端无法识别 
      let etimeStamp = this.timeStamp(endiosTime);
      let sjc = etimeStamp - stimeStamp; //接宠时间、送宠时间间隔
      if (sjc < 3600) { //提示用户送宠时间必须大于接宠时间1小时才可以下单
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请重新选择送宠时间，送宠时间必须大于接宠时间1小时',
        })
        return;
      }

      let saddressId = _this.data.saddressInfo.id ? _this.data.saddressInfo.id : _this.data.addressInfo.id; //地址信息

      //整合订单提交支付信息
      param = {
        userId: app.userId,
        shopId: _this.data.item.id,
        addressId: _this.data.addressInfo.id,
        saddressId: saddressId,
        goods: goods,
        note: _this.data.note,
        receiveTime: _this.data.startTime,
        deliverTime: _this.data.endTime,
        petAmount: _this.data.pet_count,
        goodsdiscardId: goodscardid, //商品优惠券
        servicediscardId: servicecardid, //配送优惠券
        follow: follow, //主人是否跟车

        goodsdisedfee: goodsdisedfee,
        goodsdisfee: goodsdisfee,
        goodsfee: goodsfee,
        payoffamount: payoffamount,
        purseamount: purseamount,
        servicedisedfee: servicedisedfee,
        servicedisfee: servicedisfee,
        servicefee: servicefee,
        totaldisedfee: totaldisedfee,
        totaldisfee: totaldisfee,
        totalfee: totalfee,
        usepurse: this.data.useUserMonery,
        is_service: _this.data.isService
      };

    }
    //判断宠物数量
    if (this.data.pet_count == 0) {
      wx.pageScrollTo({
        scrollTop: 1000
      })
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择宠物数量，如果仅购买商品宠物数量请选择为1',
      })
      return;
    }

    //判断服务条约是否被勾选
    if (!this.data.treaty) {
      wx.pageScrollTo({
        scrollTop: 1000
      })
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请勾选我已阅读并同意宠物服务条约',
      })
      return;
    }
    var paramJsonString = JSON.stringify(param);
    if (wx.canIUse('showLoading')) {
      wx.showLoading({
        title: '生成订单中。。。',
      })
    }
    clientApi.addOrder({
      orderStr: paramJsonString,
      on: _this.data.tabStatus,
      isService: _this.data.isService
    }).then(d => {
      if (d.success == -1) {
        //此时抛出错误处理
        wx.hideLoading();
        wx.showToast({
          title: '服务器繁忙，请稍后重试',
          icon: 'none'
        })
      } else if (d.success == 1) {
        //此时发起支付
        if (wx.canIUse('hideLoading')) {
          wx.hideLoading();
        }

        wx.requestPayment({
          timeStamp: d.data.timestamp,
          nonceStr: d.data.noncestr,
          package: 'prepay_id=' + d.data.prepayid,
          signType: d.data.signtype,
          paySign: d.data.sign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
            })
            app.wxPayState = true;
            wx.redirectTo({
              url: '/pages/msg/mgs_success'
            })
          },
          'fail': function(res) {
            wx.showModal({
              title: '提示！',
              content: '支付失败',
            })
          }
        })
      } else if (d.success == 0) {
        //此时用户用余额支付不用发起微信支付直接跳转到支付成功页面
        wx.hideLoading();
        app.wxPayState = true;
        wx.redirectTo({
          url: '/pages/msg/mgs_success'
        })
      }
    });

  },
  //接宠地址
  chooseAddress: function() {
    wx.navigateTo({
      url: '../../pages/myShippingAddress/myShippingAddress?chooseType=1',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //送宠地址
  schooseAddress: function() {
    wx.navigateTo({
      url: '../../pages/myShippingAddress/myShippingAddress?chooseType=10',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  changeDateTime(e) {
    if (this.data.tabStatus == 1) {
      this.calculationFee(false);
    } else if (this.data.tabStatus == 2) {
      this.calculationFee(true);
    }
    this.setData({
      dateTime: e.detail.value
    });
  },
  changeDateTime1(e) {
    if (this.data.tabStatus == 1) {
      this.calculationFee(false);
    } else if (this.data.tabStatus == 2) {
      this.calculationFee(true);
    }
    this.setData({
      dateTime1: e.detail.value
    });
  },
  //滑动接宠日期时间时执行
  changeDateTimeColumn(e) {

    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    var arr1 = this.data.dateTime;


    var currentYear = this.data.currentYear;
    arr[e.detail.column] = e.detail.value;

    let dateTime = this.formatTime(); //当前日期时间
    // console.log(arr);
    // console.log("我执行了");

    if (dateArr[0][arr[0]] > dateTime[1]) { //当用户选择的月份大于当前月份时将日、时、分重置初始状态
      // console.log(dateTimePicker.f());
      // dateArr[2] = dateTimePicker.getMonthDay(currentYear, dateArr[0][arr[0]]);  //将日重置
      dateArr[4] = dateTimePicker.getLoopArray(9, 17); //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50); //将分重置
    } else if (dateArr[2][arr[2]] > dateTime[2]) { //当用户选择的日大于当前日时将时、分重置初始状态

      dateArr[4] = dateTimePicker.getLoopArray(9, 17); //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50); //将分重置
    } else if (dateArr[4][arr[4]] > dateTime[3]) { //当用户选择的时大于当前时时将分重置初始状态
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50); //将分重置
    }


    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      dateTimeArray1: dateArr,
      // dateTime1: arr
    });
    Date.prototype.format = function(format) { //向Date对象中追加一个方法：此方法功能是将时间戳转换为时间格式
      var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
            date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
      }
      return format;
    }
    let sj = currentYear + "-" + dateArr[0][arr[0]] + "-" + dateArr[2][arr[2]] + " " + dateArr[4][arr[4]] + ":" + dateArr[6][arr[6]];
    // console.log(sj);
    var iosTime = sj.replace(/-/g, '/'); //解决ios端无法识别 
    let sjtimeStamp = this.timeStamp(iosTime) + 3600;
    //console.log("我是时间转为的时间戳" + sjtimeStamp);

    // var timestamp3 = 1403058804;
    var newDate = new Date(); //创建日期时间对象
    newDate.setTime(sjtimeStamp * 1000); //设置日期对象的时间戳
    let ssj22 = newDate.format('yyyy-MM-dd h:mm'); //获取返回的日期时间

    var selectDateTime = [];
    var defaultDate = [...ssj22.split(' ')[0].split('-'), ...ssj22.split(' ')[1].split(':')]; //将时间分隔为数组
    dateArr.unshift([currentYear.toString()]);
    dateArr.splice(2, 1);
    dateArr.splice(3, 1);
    dateArr.splice(4, 1);
    dateArr.splice(5, 1);
    // dateArr.push([]);
    dateArr.forEach((current, index) => {
      selectDateTime.push(current.indexOf(defaultDate[index]));

    });
    for (let i = 0; i < selectDateTime.length; i++) {
      if (selectDateTime[i] < 0) {
        selectDateTime[i] = 0;
      }
    }
    let arr2 = arr;
    arr2[0] = selectDateTime[1];
    arr2[2] = selectDateTime[2];
    arr2[4] = selectDateTime[3];
    arr2[6] = selectDateTime[4];
    this.setData({
      dateTime1: arr2
    })
    this.calculateStartDateAndEndDate();
  },


  //滑动送宠日期时间时执行
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    var currentYear = this.data.currentYear;
    arr[e.detail.column] = e.detail.value;
    // console.log(this.data.endTime);
    // dateArr[2] = dateTimePicker.getMonthDay(currentYear, dateArr[0][arr[0]]);
    let dateTime = this.formatTime(); //当前日期时间
    if (dateArr[0][arr[0]] > dateTime[1]) { //当用户选择的月份大于当前月份时将日、时、分重置初始状态
      // console.log(dateTimePicker.f());
      // dateArr[2] = dateTimePicker.getMonthDay(currentYear, dateArr[0][arr[0]]);  //将日重置
      dateArr[4] = dateTimePicker.getLoopArray(9, 17); //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50); //将分重置
    } else if (dateArr[2][arr[2]] > dateTime[2]) { //当用户选择的日大于当前日时将时、分重置初始状态

      dateArr[4] = dateTimePicker.getLoopArray(9, 17); //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50); //将分重置
    } else if (dateArr[4][arr[4]] > dateTime[3]) { //当用户选择的时大于当前时时将分重置初始状态
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50); //将分重置
    }

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });

    this.calculateStartDateAndEndDate();
  },
  //页面加载完成时执行：初始化日期
  initDates() {
    var currentYear = this.data.currentYear;
    var obj = dateTimePicker.dateTimePicker(currentYear, currentYear);
    obj.dateTimeArray.splice(0, 1);
    obj.dateTime.splice(0, 1);
    obj.dateTimeArray.splice(4, 1);
    obj.dateTime.splice(4, 1);

    obj.dateTime.splice(1, 0, 0);
    obj.dateTimeArray.splice(1, 0, ["月"]);
    obj.dateTime.splice(3, 0, 0);
    obj.dateTimeArray.splice(3, 0, ["日"]);
    obj.dateTime.splice(5, 0, 0);
    obj.dateTimeArray.splice(5, 0, ["时"]);
    obj.dateTime.splice(7, 0, 0);
    obj.dateTimeArray.splice(7, 0, ["分"]);
    var obj1 = dateTimePicker.dateTimePicker(currentYear, currentYear);
    obj1.dateTimeArray.splice(0, 1);
    obj1.dateTime.splice(0, 1);
    obj1.dateTimeArray.splice(4, 1);
    obj1.dateTime.splice(4, 1);

    obj1.dateTime.splice(1, 0, 0);
    obj1.dateTimeArray.splice(1, 0, ["月"]);
    obj1.dateTime.splice(3, 0, 0);
    obj1.dateTimeArray.splice(3, 0, ["日"]);
    obj1.dateTime.splice(5, 0, 0);
    obj1.dateTimeArray.splice(5, 0, ["时"]);
    obj1.dateTime.splice(7, 0, 0);
    obj1.dateTimeArray.splice(7, 0, ["分"]);
    // obj1.dateTime[4]=2;
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });

    let sj = obj1.dateTimeArray[0][obj1.dateTime[0]] + obj1.dateTimeArray[2][obj1.dateTime[2]] + obj1.dateTimeArray[4][obj1.dateTime[4]] + obj1.dateTimeArray[6][obj1.dateTime[6]];

    this.calculateStartDateAndEndDate();
  },

  //当滑动时间时触发
  calculateStartDateAndEndDate() {
    let m = this.formatTime(); //当前时间（小时）
    var dateTime = this.data.dateTime;
    var dateTime1 = this.data.dateTime1;
    var dateTimeArray = this.data.dateTimeArray;
    var dateTimeArray1 = this.data.dateTimeArray1;
    var currentYear = this.data.currentYear;
    var startTime = currentYear + "-" + dateTimeArray[0][dateTime[0]] + "-" + dateTimeArray[2][dateTime[2]] + " " + dateTimeArray[4][dateTime[4]] + ":" + dateTimeArray[6][dateTime[6]]
    // console.log(startTime);
    var endTime = currentYear + "-" + dateTimeArray1[0][dateTime1[0]] + "-" + dateTimeArray1[2][dateTime1[2]] + " " + dateTimeArray1[4][dateTime1[4]] + ":" + dateTimeArray1[6][dateTime1[6]]

    this.setData({
      startTime: startTime,
      endTime: endTime
    })
  },
  //跳转到goodsDetail
  gogoodsDetail: function(e) {
    let objItem = e.currentTarget.dataset.item;
    let item = JSON.stringify(objItem);
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?item=' + item,
    })
  },

  showitem: function() {
    //console.log(this.data.selectedGoodList);
  },
  checkboxChange: function(e) {

    let that = this;
    this.setData({
      checked: e.detail.value
    })

    if (e.detail.value.length == 2) {
      this.setData({
        jdisplay: 'flex',
        sdisplay: 'flex',
        canCheck1: true,
        canCheck2: false
      })
      statu = 0


      if (!tools.isEmpty(this.data.addressInfo.phone) && !tools.isEmpty(this.data.saddressInfo.phone)) {
        //获取双程配送费用
        this.calculationFee(true);
      }


    } else if (e.detail.value.length == 1) {
      if (e.detail.value[0] == '111') {
        this.setData({
          jdisplay: 'flex',
          sdisplay: 'none',
          canCheck1: true,
          canCheck2: false
        })
        statu = 1
      } else {
        this.setData({
          jdisplay: 'none',
          sdisplay: 'flex',
          canCheck1: false,
          canCheck2: true
        })
        statu = 2
      }

      if (!tools.isEmpty(this.data.addressInfo.phone)) {
        //获取单程配送费用
        this.calculationFee(false);
      }
    }
    //console.log(this.data.checked);
  },
  //减少宠物数量
  minuscount: function() {
    let that = this;
    //每点击一次宠物数量-1
    if (this.data.addressInfo.id == "") {
      wx.showToast({
        icon: 'none',
        title: '请至少选择一个接宠地址',
      })
    } else {
      if (this.data.pet_count > 0) {
        this.setData({
          pet_count: this.data.pet_count - 1
        })
        //如果接宠、送宠id不为空则说明是双程
        if (this.data.addressInfo.id != "" && this.data.saddressInfo.id != "") {
          this.calculationFee(true);
          //如果接宠地址id不为空则说明是单程
        } else if (this.data.addressInfo.id != "") {
          this.calculationFee(false);
        }
      }

    }

  },
  //增加宠物数量
  addcount: function() {
    let that = this;
    //每点击一次宠物数量+1
    if (this.data.addressInfo.id == "") {
      wx.showToast({
        icon: 'none',
        title: '请至少选择一个接宠地址',
      })
    } else {
      this.setData({
        pet_count: this.data.pet_count + 1
      })
      //如果接宠、送宠id不为空则说明是双程
      if (this.data.addressInfo.id != "" && this.data.saddressInfo.id != "") {
        this.calculationFee(true);
        //如果接宠地址id不为空则说明是单程
      } else if (this.data.addressInfo.id != "") {
        this.calculationFee(false);
      }
    }



  },
  //计算总费用
  calculationFee: function(retind) {

    /*
     *  getPrepareOrder接口说明
     *  retind:true or false //单、双程
     *  address:  //接宠地址id
     *  saddress:  //送宠地址id
     *  shop:  //商家id
     *  petAmount:  //宠物数量
     *  userId: //用户id
     *  orderStr:  //商品列表
     */
    let _this = this;
    wx.showLoading({
      title: '计算费用中',
    })
    let selectedGoodListStr = JSON.stringify(this.data.selectedGoodList);
    //优惠券id：cardId  用户id：userId
    let goodscardid = this.data.goodsCard ? this.data.goodsCard.cardId : 0; //商品优惠券
    let servicecardid = this.data.serviceCard ? this.data.serviceCard.cardId : 0; //配送优惠券
    let saddressInfoId = retind ? this.data.saddressInfo.id : '';
    let purseamout = this.data.price ? this.data.price : 0;
    let param = {
      retind: retind,
      address: this.data.addressInfo.id,
      saddress: saddressInfoId,
      shopId: this.data.item.id,
      petAmount: this.data.pet_count,
      goodscardid: goodscardid, //商品优惠券
      servicecardid: servicecardid, //服务费优惠券
      userId: app.userId,
      orderStr: selectedGoodListStr,
      usepurse: this.data.useUserMonery,
      receiveTime: this.data.startTime, //接宠时间
      deliverTime: this.data.endTime, //送宠时间
      is_service: _this.data.isService
    };
    console.log('parm', param);
    clientApi.getPrepareOrderDetail(param).then(d => {
      wx.hideLoading();
      if (d.success == 1) {
        this.setData({
          totalPrice: d.data.payoffamount,
          disfee: d.data.servicedisedfee,
          jm: d.data.totaldisfee,
          goodsdisedfee: d.data.goodsdisedfee,
          goodsdisfee: d.data.goodsdisfee,
          goodsfee: d.data.goodsfee,
          payoffamount: d.data.payoffamount,
          purseamount: d.data.purseamount,
          servicedisedfee: d.data.servicedisedfee,
          servicedisfee: d.data.servicedisfee,
          servicefee: d.data.servicefee,
          totaldisedfee: d.data.totaldisedfee,
          totaldisfee: d.data.totaldisfee,
          totalfee: d.data.totalfee,
          distriCouponCount: d.data.distriCouponCount,
          merchCouponsCount: d.data.merchCouponsCount
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络繁忙，请稍后重试'
        })
      }
    })
  },
  //跳转到卡券页面
  gocards: function(e) {
    let cardType = e.currentTarget.dataset.cardtype;

    let _this = this;
    wx.navigateTo({
      url: '/pages/cards/cards?cardType=' + cardType + '&cardStatus=' + _this.data.tabStatus + '&shopId=' + shopId,
    })
  },
  //将时间戳转为时间





  //获取当前时间
  formatTime: function(date) {
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

    var M = (date.getMonth() +
      1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

    //日

    var D = date.getDate() <
      10 ? '0' + date.getDate() :
      date.getDate();

    //时

    var H = date.getHours();
    //分钟
    var m = date.getMinutes();

    return [Y, M, D, H, m];



  },
  //点击切换tab
  tabSwitch: function(res) {
    let status = res.currentTarget.dataset.status; //当前点击元素的status值
    this.setData({
      tabStatus: status
    })

    this.getUserAddress();
    app.serviceCard = null;
    app.goodsCard = null;

    this.setData({
      serviceCard: app.serviceCard,
      goodsCard: app.goodsCard
    })
    if (status == 1) { //此时订单为单程
      if (tools.isEmpty(this.data.saddressInfo.phone) && !tools.isEmpty(this.data.addressInfo.phone)) {
        //送宠地址为空 && 接宠地址不为空：单程配送费
        this.calculationFee(false);

      } else if (!tools.isEmpty(this.data.saddressInfo.phone) && !tools.isEmpty(this.data.addressInfo.phone)) {
        this.calculationFee(false);
      } else {
        wx.showToast({
          title: '请选择地址',
          icon: 'none'
        })
      }
      // console.log("我执行了单程");
    } else if (status == 2) { //此时订单为双程
      this.data.saddressInfo = this.data.addressInfo;
      if (!tools.isEmpty(this.data.addressInfo.phone) && tools.isEmpty(this.data.saddressInfo.phone)) {
        //双程订单如果送宠地址和接宠不一致就取后来选择的送宠地址，否则取接宠地址
        let sshippingAddress = app.globalData.sshippingAddress.id ? app.globalData.sshippingAddress : app.globalData.shippingAddress;
        this.setData({
          saddressInfo: sshippingAddress,
        })
        this.calculationFee(true);

      } else if (!tools.isEmpty(this.data.addressInfo.phone) && !tools.isEmpty(this.data.saddressInfo.phone)) {
        this.calculationFee(true);
      } else {
        wx.showToast({
          title: '请选择地址',
          icon: 'none'
        })
      }
      // console.log("我执行了双程")

    }


  },
  //单选某一个
  radioChange: function(e) {
    let item = e.currentTarget.dataset.value;
    this.setData({
      selectedRadio: item.name,
      radioselected: item.id
    })
  },
  //勾选服务条款
  treatyChange: function(e) {
    this.setData({
      treaty: e.detail.value
    })
  },
  //显示送回地址
  showBackAddress: function() {
    this.setData({
      isShowBackAddress: true,
    })
  },
  //跳转到服务条约页面
  goTreaty: function() {
    wx.navigateTo({
      url: '/pages/clause/clause',
    })
  },

  //输入使用金额
  updateprice: function(e) {


    let tabStatus = this.data.tabStatus;
    if (e.detail.value < 0) {
      this.setData({
        price: 0
      });
      wx.showToast({
        icon: 'none',
        title: '使用金额不能小于0',
      })
    } else if (e.detail.value > this.data.userMoney) {
      this.setData({
        price: 0
      });
      wx.showToast({
        icon: 'none',
        title: '可用余额不足',
      })
    } else if (e.detail.value > this.data.totalPrice) {
      this.setData({
        price: 0
      });
      wx.showToast({
        icon: 'none',
        title: '使用金额不能大于总金额',
      })
    } else {
      this.setData({
        price: e.detail.value
      });
      if (tabStatus == 1) {
        this.calculationFee(false);
      } else if (tabStatus == 2) {
        this.calculationFee(true);
      }

    }

  },

  //跳转到商家页面
  goShop: function(e) {
    wx.navigateBack({
      delta: parseInt(this.data.back)
    })
  },
  //更改主人是否需要跟车状态
  changeIsCarFollowing: function(e) {
    this.setData({
      isCarFollowing: e.currentTarget.dataset.selected
    })
  },
  getUserAddress: function() {
    let _this = this;
    clientApi.getUserAddress({
      userId: app.userId
    }).then(d => {
      for (let i = 0; i < d.data.length; i++) {
        if (d.data[i].defaultAddress == 1) {
          if (app.globalData.shippingAddress.id == '') {
            app.globalData.shippingAddress = d.data[i];
            // console.log(111111)
            // console.log(app.globalData.shippingAddress)
            _this.data.addressInfo.address = d.data[i].address;
            _this.data.addressInfo.id = d.data[i].id;
            _this.data.addressInfo.location = d.data[i].location;
            _this.data.addressInfo.phone = d.data[i].phone;
            _this.data.addressInfo.status = d.data[i].status;
            _this.data.addressInfo.userId = d.data[i].userId;
            _this.data.addressInfo.userName = d.data[i].userName;
          }
          if (_this.data.tabStatus == 2 && app.globalData.sshippingAddress.id == '') {
            _this.data.saddressInfo = _this.data.addressInfo;
          } else {
            _this.data.saddressInfo = {
              userName: '',
              phone: '',
              address: '',
              location: '',
              id: '',
              status: '',
              userId: ''
            }
          }
        }
      }
      _this.setData({
        addressInfo: _this.data.addressInfo,
        saddressInfo: _this.data.saddressInfo
      })
      if (_this.data.firstIn == 0) {
        if (_this.data.tabStatus == 2) {
          _this.calculationFee(true)
        } else {
          _this.calculationFee(false)
        }
        _this.data.firstIn = 1
      }

    })
  }

})