// pages/submitOrder/submitOrder.js
var app = getApp();
var dateTimePicker = require('../../utils/dateTimePicker.js');
const clientApi = require('../../utils/clientApi.js').clientApi
var tools = require('../../utils/util.js')
let statu = 0;
let orderType = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    disfee:0,  //配送费用
    addnum:0,  //宠物每增加一个所需要增加的配送费用
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
    orderType:0,
    jm:0,
    serviceCard: null,  //配送优惠券
    goodsCard: null,  //商品及服务优惠券
    checked:['111','222'],  //选中状态
    tabStatus:2,  //tab选中状态
    radio:[
      { name: '接宠(家->宠物店)', value: '接宠(家->宠物店)', checked: 'true' },
      { name: '送宠(宠物店->家)', value: '送宠(宠物店->家)' },
    ],
    selectedRadio:"接宠(家->宠物店)",  //用户所选中的接宠或送宠
    isShowBackAddress:false,  //是否显示送回地址
    treaty:false,  //是否选中服务条款
    userMoney:'',  //用户余额
    isUseBalance:false,  //是否使用余额抵扣配送费
    isSelected:true,  //使用余额选择框是否可用 true不可用  false可用
    price: 0,  //输入要使用的金额
    useUserMonery: false,  //是否使用用户余额
    

    goodsdisedfee:0,
    goodsdisfee:0,
    goodsfee:0,
    payoffamount:0,
    purseamount:0,
    servicedisedfee:0,
    servicedisfee:0,
    servicefee:0,
    totaldisedfee:0,
    totaldisfee:0,
    totalfee:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })
    var _this = this;
    wx.getStorage({
      key: 'orderType',
      success: function(res) {
        orderType = res.data;
        _this.setData({
          orderType:orderType
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
    console.log(list);
    console.log(shopItem);
    console.log(shipPrice);
    this.setData({
      shipFeeMoney: shopItem.servicePrice * 1,
      item: shopItem,
      shipPrice: shipPrice * 1,
      selectedGoodList: list,
      userMoney:app.userMoney
    })
    // this.calculateShipPrice();
    this.calculationFee(true);  //计算费用
    console.log(this.data.item);
    let startTime = this.data.startTime;
    let startTimeArr = [...startTime.split(' ')[0].split('-'), ...startTime.split(' ')[1].split(':')];
    console.log(startTimeArr);
    console.log(startTime);
    var iosTime = startTime.replace(/-/g, '/');//解决ios端无法识别 
    let stimeStamp = this.timeStamp(iosTime);  //服务时间的时间戳
    if(startTimeArr[3]<17){
      let endStamp=stimeStamp+3600;
      Date.prototype.format = function (format) {  //向Date对象中追加一个方法：此方法功能是将时间戳转换为时间格式
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
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
              ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
          }
        }
        return format;
      }
      var newDate = new Date();  //创建日期时间对象
      newDate.setTime(endStamp * 1000);  //设置日期对象的时间戳
      let ssj22 = newDate.format('yyyy-MM-dd h:mm');  //获取返回的日期时间
      console.log(ssj22);
      this.setData({
        endTime:ssj22
      })
    }
    
  },
  //计算总金额
  // calculateAllMoeny: function() {
  //   // that.data.selectedGoodList
    
  //   // let param=JSON.stringify(this.data.selectedGoodList);
  //   // console.log(this.data.selectedGoodList);

  //   // clientApi.getOrderGoodsFee({goods:this.data.selectedGoodList}).then(d => {
  //   //   console.log(d);
  //   // })

  //   var totalPrice = 0;
  //   var yj=0;
  //   this.data.selectedGoodList.forEach(function(item, index) {
  //     if(item.discount!=0){
  //       totalPrice += item.price * item.selectCount * (item.discount / 10);
  //       //优惠减免金额
  //       yj += item.price * item.selectCount;
  //     }else{
  //       totalPrice += item.price * item.selectCount;
  //       //优惠减免金额
  //       yj += item.price * item.selectCount;
  //     }

      

  //   });

  //   console.log("宠物数量"+this.data.pet_count);
  //   console.log(this.data.addnum)

  //   totalPrice += this.data.disfee * 1;  //添加配送费用
  //   yj += this.data.disfee * 1;  //添加配送费用
  //   if (this.data.firstInfo.isFirst == 1) {
  //     totalPrice -= this.data.firstInfo.firstMoney * 1;
  //     yj -= this.data.firstInfo.firstMoney * 1;
  //     totalPrice = totalPrice <= 0 ? 0.01 : totalPrice;
  //     yj = yj <= 0 ? 0.01 : yj;
  //   }
  //   totalPrice = totalPrice.toFixed(2);
  //   yj = yj.toFixed(2);
  //   // console.log("我是原价的金额"+yj);
  //   // console.log("我是减免后的金额" + totalPrice);
  //   // var yhjm=yj-totalPrice;
  //   // yhjm=yhjm.toFixed(2);
  //   this.setData({
  //     totalPrice: totalPrice,
  //     totalPriceBasic: totalPrice,
  //     // jm: yhjm
  //   })
  //   //计算用余额抵扣配送费后所需要支付的金额
  //   if (this.data.isUseBalance) {
  //     // let payprice=0;
  //     // if (this.data.userMoney < this.data.disfee){

  //     // }
  //     let payprice = this.data.disfee > this.data.userMoney ? this.data.disfee - this.data.userMoney : 0;
  //     let totalPrice = this.data.totalPrice - (this.data.disfee - payprice);
  //     let stotalPrice = totalPrice.toFixed(2);

  //     this.setData({
  //       isUseBalance: true,
  //       disfee: payprice,
  //       totalPrice: stotalPrice
  //     })
  //   }
  //   // console.log(this.data.disfee);
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
   

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var currentYear = date.getFullYear();
    this.setData({
      currentYear: currentYear,
      addressInfo: app.globalData.shippingAddress,
      saddressInfo: app.globalData.sshippingAddress,
      serviceCard:app.serviceCard,
      goodsCard:app.goodsCard
    })
    console.log(this.data.currentYear);
    //如果接宠、送宠id不为空则说明是双程
    if(this.data.tabStatus==2){
      //双程订单如果送宠地址和接宠不一致就取后来选择的送宠地址，否则取接宠地址
      let sshippingAddress = app.globalData.sshippingAddress.id ? app.globalData.sshippingAddress : app.globalData.shippingAddress;
      this.setData({
        saddressInfo: sshippingAddress,
      })
      if (this.data.saddressInfo.id && this.data.addressInfo.id){
        this.calculationFee(true);
      }
      
    //如果接宠地址id不为空则说明是单程
    } else if (this.data.tabStatus == 1) {
      if (this.data.addressInfo.id){
        this.calculationFee(false);
      }
      
    }

    //判断用户余额是否为0，如果为0则不能使用余额抵扣配送费
    if(this.data.addressInfo.id){
      console.log(1);
      if (this.data.userMoney == 0 || this.data.userMoney == 0.00) {
        this.setData({
          isSelected: true
        })
      }else{
        this.setData({
          isSelected: false
        })
      }
    }
   




    // console.log(this.data.addressInfo);
    // console.log(this.data.saddressInfo);
    // this.calculateShipPrice();
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
        console.log('k:::::::::::::::::::::::::::::', this.data.item.baseCharg)
      }
    }

    var shipPrice = shipServicePrice;
    console.log(shipPrice)
    console.log("d::::::", distance)
    console.log('b:::::', this.data.item.baseDistance)
    if (distance > this.data.item.baseDistance) {
      var remainDistance = (distance - this.data.item.baseDistance) / 1000;
      remainDistance = Math.ceil(remainDistance)
      console.log('r::::::', remainDistance)
      console.log(this.data.item.overCharg)
      shipPrice = shipPrice * 1 + remainDistance * this.data.item.overCharg * 1;
    }

    this.setData({
      shipPrice: shipPrice,
      shipPriceBasic: shipPrice
    })
    console.log('p:::::::::::::::::::::::::::::::', this.data.shipPrice)
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
    console.log(that.data.selectedGoodList)
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
  timeStamp:function(res){
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
    let goodscardid = this.data.goodsCard ? this.data.goodsCard[1] : 0;  //商品优惠券
    let servicecardid = this.data.serviceCard ? this.data.serviceCard[1] : 0;  //配送优惠券

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

    var param ={};  //提交订单支付信息
    //整合订单提交支付信息
    param = {
      userId: app.userId,
      shopId: _this.data.item.id,
      addressId: 0,
      saddressId: '',
      goods: goods,
      note: _this.data.note,
      receiveTime: '',
      deliverTime: '',
      petAmount: 1,
      goodsdiscardId: goodscardid,  //商品优惠券
      servicediscardId: servicecardid,  //配送优惠券

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
      usepurse: this.data.useUserMonery
    };


    // if (!this.data.treaty) {
    //   wx.pageScrollTo({
    //     scrollTop: 1000
    //   })
    //   wx.showModal({
    //     title: '提示',
    //     showCancel: false,
    //     content: '请勾选我已阅读并同意宠物服务条约',
    //   })
    //   return;
    // }
    var paramJsonString = JSON.stringify(param);
    if (wx.canIUse('showLoading')) {
      wx.showLoading({
        title: '生成订单中。。。',
      })
    }
    console.log(paramJsonString);
    clientApi.addOrder({
      orderStr: paramJsonString
    }).then(d => {
      console.log(d)
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
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
            })
            app.wxPayState = true;
            wx.redirectTo({
              url: '/pages/msg/mgs_success'
            })
          },
          'fail': function (res) {
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





    /*if(this.data.tabStatus==1){ //此时用户选择了单程，判断用户是否选择服务地址
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
      var iosTime = this.data.startTime.replace(/-/g, '/');//解决ios端无法识别 
      let stimeStamp = this.timeStamp(iosTime);  //服务时间的时间戳
    
      var currenttimestamp = Date.parse(new Date());
      currenttimestamp = currenttimestamp / 1000+1800;  //当前时间戳
      if (stimeStamp <= currenttimestamp) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请重新选择服务时间，服务时间必须大于当前时间30分钟',
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
        goodsdiscardId: goodscardid,  //商品优惠券
        servicediscardId: servicecardid,  //配送优惠券

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
        usepurse: this.data.useUserMonery
      };

    } else if (this.data.tabStatus == 2) {  //此时用户选择了双程，判断用户是否选择接宠地址、送宠地址
      //判断接宠地址、送宠地址
      // if (tools.isEmpty(this.data.addressInfo.phone)) {
      //   wx.showModal({
      //     title: '提示',
      //     showCancel: false,
      //     content: '请添加接宠地址'
      //   })
      //   return;
      // }else if (this.data.isShowBackAddress) {
      //   if (tools.isEmpty(this.data.saddressInfo.phone)){
      //     wx.showModal({
      //       title: '提示',
      //       showCancel: false,
      //       content: '请添加送宠地址'
      //     })
      //     return;
      //   }
        
      // }

      //判断接宠时间必须大于当前时间
      // var iosTime = this.data.startTime.replace(/-/g, '/');//解决ios端无法识别 
      // let stimeStamp = this.timeStamp(iosTime);  //服务时间的时间戳
      // var currenttimestamp = Date.parse(new Date());
      // currenttimestamp = currenttimestamp / 1000+1800;  //当前时间戳
      // if (stimeStamp <= currenttimestamp) {
      //   wx.showModal({
      //     title: '提示',
      //     showCancel: false,
      //     content: '请重新选择接宠时间，接宠时间必须大于当前时间30分钟',
      //   })
      //   return;
      // }

      //判断送宠时间是否大于接宠时间1小时
      // var endiosTime = this.data.endTime.replace(/-/g, '/');//解决ios端无法识别 
      // let etimeStamp = this.timeStamp(endiosTime);
      // let sjc = etimeStamp - stimeStamp;  //接宠时间、送宠时间间隔
      // if (sjc < 3600) {  //提示用户送宠时间必须大于接宠时间1小时才可以下单
      //   wx.showModal({
      //     title: '提示',
      //     showCancel: false,
      //     content: '请重新选择送宠时间，送宠时间必须大于接宠时间1小时',
      //   })
      //   return;
      // }

      let saddressId = _this.data.saddressInfo.id ? _this.data.saddressInfo.id : _this.data.addressInfo.id;  //地址信息

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
        goodsdiscardId: goodscardid,  //商品优惠券
        servicediscardId: servicecardid,  //配送优惠券
        
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
        usepurse: this.data.useUserMonery
      };

    }
    //判断宠物数量
    // if (this.data.pet_count==0){
    //   wx.pageScrollTo({
    //     scrollTop: 1000
    //   })
    //   wx.showModal({
    //     title: '提示',
    //     showCancel:false,
    //     content: '请选择宠物数量，如果仅购买商品宠物数量请选择为1',
    //   })
    //   return;
    // }

    //判断服务条约是否被勾选
    

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
    */
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

  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    });
  },
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  //滑动接宠日期时间时执行
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    var arr1=this.data.dateTime;
      

    var currentYear = this.data.currentYear;
    arr[e.detail.column] = e.detail.value;
    console.log(e.detail.value);

    let dateTime = this.formatTime();  //当前日期时间
    // console.log(arr);
    // console.log("我执行了");
    console.log(dateArr[2][arr[2]]);
    console.log(dateTime);
    if(dateArr[0][arr[0]] > dateTime[1]){  //当用户选择的月份大于当前月份时将日、时、分重置初始状态
      // console.log(dateTimePicker.f());
      // dateArr[2] = dateTimePicker.getMonthDay(currentYear, dateArr[0][arr[0]]);  //将日重置
      dateArr[4] = dateTimePicker.getLoopArray(9, 17);  //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50);  //将分重置
    } else if (dateArr[2][arr[2]] > dateTime[2]) {  //当用户选择的日大于当前日时将时、分重置初始状态
      
      dateArr[4] = dateTimePicker.getLoopArray(9, 17);  //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50);  //将分重置
    } else if (dateArr[4][arr[4]] > dateTime[3]) {//当用户选择的时大于当前时时将分重置初始状态
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50);  //将分重置
    }
    // else{
    //   // console.log(dateTime);

    //   // dateArr[2] = dateTimePicker.getLoopArray(dateTime[2], dateTimePicker.getMonthDaynum(dateTime[0].toString(), dateTime[1].toString()));  //将日重置
    //   if(dateTime[3]>17){
    //     dateTime[3]=17;
    //   }
    //   console.log("我执行了else")
    //   dateArr[4] = dateTimePicker.getLoopArray(dateTime[3], 17);  //将时重置
    //   dateArr[6] = dateTimePicker.getLoopArray2(dateTimePicker.min(dateTime[4]), 50);  //将分重置
    // }
  



    // dateArr[2] = dateTimePicker.getMonthDay(currentYear, dateArr[0][arr[0]]);
    
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      dateTimeArray1: dateArr,
      // dateTime1: arr
    });
    Date.prototype.format = function (format) {  //向Date对象中追加一个方法：此方法功能是将时间戳转换为时间格式
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
          format = format.replace(RegExp.$1, RegExp.$1.length == 1
            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
      }
      return format;
    }
    let sj = currentYear + "-" + dateArr[0][arr[0]] + "-" + dateArr[2][arr[2]] + " " + dateArr[4][arr[4]] + ":" + dateArr[6][arr[6]];
    // console.log(sj);
    var iosTime = sj.replace(/-/g, '/');//解决ios端无法识别 
    let sjtimeStamp = this.timeStamp(iosTime)+3600;
    console.log("我是时间转为的时间戳"+sjtimeStamp);

    // var timestamp3 = 1403058804;
    var newDate = new Date();  //创建日期时间对象
    newDate.setTime(sjtimeStamp * 1000);  //设置日期对象的时间戳
    let ssj22 = newDate.format('yyyy-MM-dd h:mm');  //获取返回的日期时间
    // console.log(ssj22);
    // console.log(arr);
    // let indexArr=[];
    var selectDateTime=[];
    var defaultDate = [...ssj22.split(' ')[0].split('-'), ...ssj22.split(' ')[1].split(':')];  //将时间分隔为数组
    dateArr.unshift([currentYear.toString()]);
    dateArr.splice(2,1);
    dateArr.splice(3,1);
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
    let arr2=arr;
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
    let dateTime = this.formatTime();  //当前日期时间
    if (dateArr[0][arr[0]] > dateTime[1]) {  //当用户选择的月份大于当前月份时将日、时、分重置初始状态
      // console.log(dateTimePicker.f());
      // dateArr[2] = dateTimePicker.getMonthDay(currentYear, dateArr[0][arr[0]]);  //将日重置
      dateArr[4] = dateTimePicker.getLoopArray(9, 17);  //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50);  //将分重置
    } else if (dateArr[2][arr[2]] > dateTime[2]) {  //当用户选择的日大于当前日时将时、分重置初始状态

      dateArr[4] = dateTimePicker.getLoopArray(9, 17);  //将时重置
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50);  //将分重置
    } else if (dateArr[4][arr[4]] > dateTime[3]) {//当用户选择的时大于当前时时将分重置初始状态
      dateArr[6] = dateTimePicker.getLoopArray2(0, 50);  //将分重置
    }
    // } else {
    //   // console.log(dateTime);
    //   // dateArr[2] = dateTimePicker.getLoopArray(dateTime[2], dateTimePicker.getMonthDaynum(dateTime[0].toString(), dateTime[1].toString()));  //将日重置
    //   if(dateTime[3]>17){
    //     dateTime[3]=17;
    //   }
    //   dateArr[4] = dateTimePicker.getLoopArray(dateTime[3], 17);  //将时重置
    //   dateArr[6] = dateTimePicker.getLoopArray2(dateTimePicker.min(dateTime[4]), 50);  //将分重置
    // }
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
    console.log(obj.dateTime);
    console.log(obj.dateTimeArray);
    console.log(obj1.dateTimeArray);
    console.log(obj1.dateTime);
    let sj = obj1.dateTimeArray[0][obj1.dateTime[0]] + obj1.dateTimeArray[2][obj1.dateTime[2]] + obj1.dateTimeArray[4][obj1.dateTime[4]] + obj1.dateTimeArray[6][obj1.dateTime[6]];
    // console.log(sj);
  
    this.calculateStartDateAndEndDate();
  },

  //当滑动时间时触发
  calculateStartDateAndEndDate() {
    let m = this.formatTime();  //当前时间（小时）
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
    console.log(endTime);
    // console.log(m);
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
    console.log(this.data.selectedGoodList);
  },
  checkboxChange: function(e) {
    
    let that = this;
    this.setData({
      checked:e.detail.value
    })
    
    



    if (e.detail.value.length == 2) {
      this.setData({
        jdisplay: 'flex',
        sdisplay: 'flex',
        canCheck1: true,
        canCheck2: false
      })
      statu = 0
      
      
      if (!tools.isEmpty(this.data.addressInfo.phone) && !tools.isEmpty(this.data.saddressInfo.phone)){
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
    console.log(this.data.checked);
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
    let that=this;
    //每点击一次宠物数量+1
    if(this.data.addressInfo.id==""){
      wx.showToast({
        icon:'none',
        title: '请至少选择一个接宠地址',
      })
    }else{
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
  calculationFee:function(retind){
    // let data={
    //   goods: this.data.selectedGoodList
    // }
    // clientApi.getOrderGoodsFee(data).then(res=>{
    //   console.log(res);

    // })


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
    let _this=this;
    wx.showLoading({
      title: '计算费用中',
    })
    let selectedGoodListStr = JSON.stringify(this.data.selectedGoodList);
    //优惠券id：cardId  用户id：userId
    let goodscardid = this.data.goodsCard ? this.data.goodsCard[1] : 0;  //商品优惠券
    let servicecardid = this.data.serviceCard ? this.data.serviceCard[1] : 0;  //配送优惠券
    let saddressInfoId = retind?this.data.saddressInfo.id:'';
    let purseamout = this.data.price ? this.data.price:0;
    let param={
      retind: retind, 
      address: 0, 
      saddress: saddressInfoId, 
      shopId: this.data.item.id,
      petAmount: this.data.pet_count,
      goodscardid: goodscardid,   //商品优惠券
      servicecardid: servicecardid,   //服务费优惠券
      userId: app.userId,
      orderStr: selectedGoodListStr,
      usepurse: this.data.useUserMonery
    };
    console.log(param);
    
    // let paramStr=JSON.stringify(param);
    // console.log(paramStr);
    // console.log(param);
    clientApi.getPrepareOrderDetail(param).then(d => {
      wx.hideLoading();
      console.log(d);
      if(d.success==1){
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


        })
      }else{
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络繁忙，请稍后重试'
        })
      }
      // if(d.data==null){
      //   d.data=0;
      // }
      // _this.setData({
      //   disfee:d.data
      // })
      // _this.calculateAllMoeny();
      
    })
    
    // this.data.saddressInfo.id ? this.data.saddressInfo.id:0;
    
    // console.log({ retind: retind, address: this.data.addressInfo.id, saddress: this.data.saddressInfo.id, shop: this.data.item.id, petAmount: this.data.pet_count, cardId: cardId, userId: app.userId, goods: this.data.selectedGoodList})

    // let DisParam = { 
    //   retind: retind, 
    //   address: this.data.addressInfo.id, 
    //   saddress: this.data.saddressInfo.id, 
    //   shop: this.data.item.id, 
    //   petAmount: this.data.pet_count, 
    //   cardId: cardId, 
    //   userId: app.userId, 
    //   orderStr: JSON.stringify(this.data.selectedGoodList) 
    // }
    // let DisParamStr = JSON.stringify(DisParam);
    // console.log(DisParamStr)

    // clientApi.getOrderDiscountFee(DisParam).then(res=>{
    //   console.log(res);
    //   let jm=res.data ? res.data:0;  //如果减免为null则默认为0
    //   _this.setData({
    //     jm:jm
    //   })
    // })
  },
  //跳转到卡券页面
  gocards:function(e){
    let cardType=e.currentTarget.dataset.cardtype;
    wx.navigateTo({
      url: '/pages/cards/cards?cardType=' + cardType,
    })
  },
  //将时间戳转为时间

    
  


  //获取当前时间
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

    var H = date.getHours();
    //分钟
    var m = date.getMinutes();
    
    return [Y, M, D, H, m];
   
    

  },
  //点击切换tab
  tabSwitch:function(res){
    let status=res.currentTarget.dataset.status;  //当前点击元素的status值
   
    // if (tools.isEmpty(this.data.saddressInfo.phone) && !tools.isEmpty(this.data.addressInfo.phone)){
    //   //送宠地址为空 && 接宠地址不为空：单程配送费
    //   this.calculationFee(false);
    // } else if (status==1 && !tools.isEmpty(this.data.addressInfo.phone)) {
    //   //选择为单程 && 接宠地址不为空：单程配送费
    //   this.calculationFee(false);
    // }else if (!tools.isEmpty(this.data.addressInfo.phone && !tools.isEmpty(this.data.saddressInfo.phone))){
    //   //接宠地址不为空 && 送宠地址不为空：双程配送费
    //   //双程订单如果送宠地址和接宠不一致就取后来选择的送宠地址，否则取接宠地址
    //   let sshippingAddress = app.globalData.sshippingAddress.id ? app.globalData.sshippingAddress : app.globalData.shippingAddress;
    //   console.log(123123);
    //   this.setData({
    //     saddressInfo: sshippingAddress,
    //   })
    //   this.calculationFee(true);
    // }
    if (status==1){  //此时订单为单程
      if (tools.isEmpty(this.data.saddressInfo.phone) && !tools.isEmpty(this.data.addressInfo.phone)) {
        //送宠地址为空 && 接宠地址不为空：单程配送费
        this.calculationFee(false);
        
      } else if (!tools.isEmpty(this.data.saddressInfo.phone) && !tools.isEmpty(this.data.addressInfo.phone)){
        this.calculationFee(false);
      }
      // console.log("我执行了单程");
    } else if (status==2){  //此时订单为双程
      if (!tools.isEmpty(this.data.addressInfo.phone) && tools.isEmpty(this.data.saddressInfo.phone)){
        //双程订单如果送宠地址和接宠不一致就取后来选择的送宠地址，否则取接宠地址
        let sshippingAddress = app.globalData.sshippingAddress.id ? app.globalData.sshippingAddress : app.globalData.shippingAddress;
        this.setData({
          saddressInfo: sshippingAddress,
        })
        this.calculationFee(true);
       
      } else if (!tools.isEmpty(this.data.addressInfo.phone) && !tools.isEmpty(this.data.saddressInfo.phone)){
        this.calculationFee(true);
      }
      // console.log("我执行了双程")

    }

    this.setData({
      tabStatus:status
    })
  },
  //单选某一个
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      selectedRadio:e.detail.value
    })
  },
  //勾选服务条款
  treatyChange:function(e){
    this.setData({
      treaty:e.detail.value
    })
  },
  //显示送回地址
  showBackAddress:function(){
    this.setData({
      isShowBackAddress:true,
    })
  },
  //跳转到服务条约页面
  goTreaty:function(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '宠物服务条约页面正在开发中:-)',
    })
    return;
    wx.navigateTo({
      url: '',
    })
  },
  //是否使用余额抵扣配送费
  BalancecheckboxChange:function(e){
    //当选中checkbox时，用户使用余额抵扣配送费
    if(e.detail.value[0]=="true"){
      console.log("我被选中了");
      this.setData({
        useUserMonery: true
      })
    }else{
      console.log("我被取消选中");
      this.setData({
        useUserMonery: false
      })
    }
    let tabStatus = this.data.tabStatus;
    if (tabStatus == 1) {
      this.calculationFee(false);
    } else if (tabStatus == 2) {
      this.calculationFee(true);
    }
  },
  //输入使用金额
  updateprice: function (e) {
    // if (e.detail.value.length > 0) {
    //   this.setData({
    //     status: true
    //   })
    // } else {
    //   this.setData({
    //     status: false
    //   })
    // }
    console.log(e.detail.value);
    
    let tabStatus = this.data.tabStatus;
    if (e.detail.value < 0){
      this.setData({
        price: 0
      });
      wx.showToast({
        icon: 'none',
        title: '使用金额不能小于0',
      })
    }else if(e.detail.value>this.data.userMoney){
      this.setData({
        price: 0
      });
      wx.showToast({
        icon: 'none',
        title: '可用余额不足',
      })
    } else if (e.detail.value>this.data.totalPrice){
      this.setData({
        price: 0
      });
      wx.showToast({
        icon: 'none',
        title: '使用金额不能大于总金额',
      })
    }else{
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
  //使用余额抵扣
  // goSubmit:function(){
  //   console.log(this.data.price);
  //   let tabStatus = this.data.tabStatus;
  //   if(tabStatus==1){
  //     this.calculationFee(false);
  //   }else if(tabStatus==2){
  //     this.calculationFee(true);
  //   }
  // }

})