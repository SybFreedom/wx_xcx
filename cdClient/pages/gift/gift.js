var tools = require('../../utils/util.js');
var app = getApp();
var server = require('../../utils/server');
const clientApi = require('../../utils/clientApi.js').clientApi;
let st;
//倒计时截止时间
let goodsList = [
  { actEndTime: '2019-09-01 00:00:00' },
];
Page({
	data: {
    item:{},
    headerHeight:176,
    scrollHeight:0,
    windowHeight: 0,
    currentIndex:0,
    currentClassIndex:0,
    isServiceColor: false,
    isGoodsColor: true,
    isEvalueColor: false,
    newGoodsList: [],
		cart: {
			count: 0,
			total: 0,
			list: []
		},
		showCartDetail: false,
    evalueList:[
      // { icon: '/images/testImg_03.png', userName: "测试评论", createTime: "2018-08-26", grade: '5', content:"测试评论测试评论"}
    ],
    serviceList: [],
    goodsList: [],
    shipPrice: 0,
    shopimg: ['http://192.168.0.11:8081/images/1536507023995.jpg', 'http://192.168.0.11:8081/images/1536507023995.jpg', 'http://192.168.0.11:8081/images/1536507023995.jpg',],
    isshowshopimg:false, //是否显示商家图片
    imglist: ['http://192.168.0.11:8081/images/1536507023995.jpg', 'http://192.168.0.11:8081/images/1536507023995.jpg', 'http://192.168.0.11:8081/images/1536507023995.jpg','http://192.168.0.11:8081/images/1536507023995.jpg'],
    disfee:0,
    isAdd:'',  //区分是否是追加商品
    orderId:'',//主订单id
    isCollection: false,  //是否收藏：默认未收藏
    countDownList: [],
    actEndTimeList: []
	},
	onLoad: function (options) {
    //配置分享信息
    app.getShareInfo(1).then(res => {
      app.userShare = res;
    })

    let endTimeList = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    goodsList.forEach(o => { endTimeList.push(o.actEndTime) })
    this.setData({ actEndTimeList: endTimeList });
    // 执行倒计时函数
    // this.countDown();


    console.log(options);
    var that = this;
    if(options.isAdd){
      this.setData({
        isAdd: options.isAdd,
        orderId: options.orderId
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollHeight: res.windowHeight - 50 - 50 - that.data.headerHeight,
          windowHeight: res.windowHeight - 50 - that.data.headerHeight - 40 - 20
        });
      }
    })
    
    // if (options.item == null) {
      // let shopId = opt.id;
  
    // console.log(that.data.userLocationAddress.location.lng);
    // console.log(that.data.userLocationAddress.location.lat);

      let param = {
        lng: app.globalData.userLocationAddress.location.lng,
        lat: app.globalData.userLocationAddress.location.lat,
        areaCode: app.globalData.userLocationAddress.location.adcode,
      };
      //获取礼包商家
      clientApi.getOfficialShop(param).then(res => {
        console.log(res);
        that.setData({
          item: res.data
        })
        that.loadDatas(1);
        that.getEvalueList();
        /*检测用户是否收藏该商家
        *@param {int} shopid 商家id
        *@param {int} userid 用户id
        * 
        */
        let Shopparam = {
          shopid: this.data.item.id,
          userid: app.userId
        };
        console.log(param);
        clientApi.getInvFavouriteShop(Shopparam).then(res => {
          console.log(res);
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
      })


      // this.getOfficialShop().then(res=>{
      //   console.log(res.data);
      //   console.log({
      //     id: res.data,
      //     lng: app.globalData.userLocationAddress.location.lng,
      //     lat: app.globalData.userLocationAddress.location.lat,
      //   });
      //   clientApi.getShopById({
      //     id: res.data,
      //     lng: app.globalData.userLocationAddress.location.lng,
      //     lat: app.globalData.userLocationAddress.location.lat,
      //   }).then(d => {
      //     console.log(d.data)
      //     that.setData({
      //       item: d.data
      //     })
      //     that.loadDatas(2);
      //     that.getEvalueList();
      //   })
      // })
      
      //获取最低配送费用
      // clientApi.getDicInfo({ code: 'petunit_baserate' }).then(d => {
      //   // console.log(d.data.val);
      //   that.setData({
      //     disfee:d.data.val
      //   })
      // })

    

    // } else {
    //   let item = JSON.parse(options.item);
    //   this.setData({
    //     item: item
    //   })
    //   this.loadDatas(2);
    //   this.getEvalueList();
    // }

    
    
	},

  //获取礼包商家id
  getOfficialShopId:function(){
    return new Promise(function (resolve, reject) {
      clientApi.getOfficialShopId().then(res => {
        resolve(res);
      })
    })  
  },
	onShow: function () {
    if (app.wxPayState) {
      this.clearStates();
      app.wxPayState = false;
    }
	},
	tapAddCart: function (e) {
		this.addCart(e.target.dataset.id);
	},
	tapReduceCart: function (e) {
    this.reduceCart(e.currentTarget.dataset.id, e.currentTarget.dataset.reducetype);
	},
	addCart: function (id) {

    var listSearchDatas = this.data.cart.list.filter(function (obj) {
      return id == obj.id;
    });

    var goods;

    var currentClassIndex = this.data.currentClassIndex;
    if (listSearchDatas.length>0) {
      goods = listSearchDatas[0]; 
    } else {
      var currentClassItem = this.data.newGoodsList[currentClassIndex];
      var result = currentClassItem.childList.filter(function (obj) {
        return id == obj.id;
      });
      goods = result[0];
    }

    this.data.newGoodsList[currentClassIndex].childList.forEach(function (item, index) {
      if (id == item.id) {
        item.selectCount += 1;
      }
    });

    var listDatas = this.data.cart.list.filter(function (obj) {
      return id == obj.id;
    });

    if (listDatas.length == 0) {
      goods['selectCount'] = 1;
      this.data.cart.list.push(goods);
    } else {
      this.data.cart.list.forEach(function (item, index) {
        if (goods.id == item.id) {
          item.selectCount += 1;
        }
      });
    }

		this.countCart();
	},
  reduceCart: function (id, reducetype) {
    
    var datas = this.data.cart.list;

    this.data.cart.list.forEach(function (item, index) {
      if (id == item.id) {
        if (item.selectCount <= 1) {
          datas.splice(index, 1);
        } else {
          item.selectCount -= 1;
        }
      }
    });

    var currentClassIndex = this.data.currentClassIndex;

    this.data.newGoodsList.forEach(function (item, index) {
      item.childList.forEach(function (childItem, index){
        if (id == childItem.id) {
          childItem.selectCount -= 1;
        }
      })
    });

      this.data.serviceList.forEach(function (item, index) {
        item.childList.forEach(function (childItem, index) {
          if (id == childItem.id) {
            childItem.selectCount -= 1;
          }
        })
      });
      this.data.goodsList.forEach(function (item, index) {
        item.childList.forEach(function (childItem, index) {
          if (id == childItem.id) {
            childItem.selectCount -= 1;
          }
        })
      });

    this.data.cart.list = datas;
		this.countCart();
    if (reducetype == 1) {
      this.setData({
        newGoodsList: this.data.newGoodsList
      });
    } else {
      this.setData({
        showCartDetail: this.data.cart.count != 0,
        newGoodsList: this.data.newGoodsList
      });
    }

    
	},

	countCart: function () {
		var count = 0,
			  total = 0,
        shipServicePrice = 0,
        shipGoodsPriveTep = false,
        shipServicePriveTep = false;   
    this.data.cart.list.forEach(function (item, index) {
      count += item.selectCount;
      if(item.discount==0){
        total += item.price * item.selectCount;
      }else{
        total += item.price * item.selectCount * item.discount / 10;
      }
      
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

		this.data.cart.count = count;
    this.data.cart.total = total.toFixed(2);
    
		this.setData({
			cart: this.data.cart,
      shipPrice: shipServicePrice,
      newGoodsList: this.data.newGoodsList
		});

	},

	follow: function () {
		this.setData({
			followed: !this.data.followed
		});
	},
	onGoodsScroll: function (e) {
	
	},
	tapClassify: function (e,index) {
    var item = e.currentTarget.dataset.id;
    var dataSource = this.data.newGoodsList;
    var _this = this;
    dataSource.forEach (function (obj,i){
      if (item.id == obj.id) {
        obj.selected = true;
        _this.data.currentClassIndex = i;
      } else {
        obj.selected = false;
      }
    })

    if (this.currentIndex == 0) {
      this.setData({
        serviceList: _this.data.serviceList,
      })
    } else {
      this.setData({
        goodsList: _this.data.goodsList,
      })
    }

    this.setData({
      newGoodsList: dataSource,
      currentClassIndex: _this.data.currentClassIndex
    })
	},
	showCartDetail: function () {
		this.setData({
			showCartDetail: this.data.cart.count == 0 ? false : !this.data.showCartDetail
		});
	},
	hideCartDetail: function () {
		this.setData({
			showCartDetail: false
		});
	},
	submit: function (e) {
    let _this=this;
    let hours=this.formatTime();  //当前时间（小时）
    if (tools.isEmpty(app.userId)){
      console.log('3:::::::::::::::::::::::::::::::',app.userId)
      wx.showModal({
        title: '提示！',
        content: '请检查您的权限是否全部开启,然后尝试删除小程序后，重新授权所有权限',
      })
    } else {
      var goodsDatas = e.currentTarget.dataset.goodslist;
      goodsDatas.forEach(function(obj,index){
        obj.des = "";
      });
      let datas = JSON.stringify(goodsDatas);
      let item = JSON.stringify(this.data.item);
      console.log(datas);
      console.log(item);
      console.log(this.data.shipPrice);
      // console.log(this.data.isAdd);
      // return;
      if(this.data.isAdd){
        console.log(this.data);
        //商品列表
        let goods = this.data.cart.list.map(d => {
          var item = {};
          item.goodsId = d.id;  //商品id
          item.goodsamount = d.selectCount;  //商品数量
          item.goodsprice = d.price;  //商品价格
          item.discount = d.discount;  //商品折扣
          return item;
        }); 
        //参数集
        let param={
          userid : app.userId,  //用户id
          shopid : this.data.item.id,  //商家id
          orderid : this.data.orderId,  //订单id
          goods: goods,  //商品列表
        };
        console.log(param);
        //追加订单接口
        clientApi.addAdtOrder(param).then(d=>{
          console.log(d);
          
          //发起支付
          // wx.requestPayment({
          //   timeStamp: d.data.timestamp,
          //   nonceStr: d.data.noncestr,
          //   package: 'prepay_id=' + d.data.prepayid,
          //   signType: d.data.signtype,
          //   paySign: d.data.sign,
          //   'success': function (res) {
          //     wx.showToast({
          //       title: '支付成功',
          //     })
          //     wx.redirectTo({
          //       url: '/pages/orderDetail/orderDetail?orderid=_this.data.orderId'
          //     })
          //   },
          //   'fail': function (res) {
          //     wx.showModal({
          //       title: '提示！',
          //       content: '支付失败',
          //     })
          //   }
          // })


        })
      }else{
        wx.navigateTo({
          url: '../../pages/giftSubmitOrder/giftSubmitOrder?datas=' + encodeURIComponent(datas) + '&item=' + encodeURIComponent(item) + '&shipPrice=' + this.data.shipPrice
        })
      }  
    }
	},

  chooseClick: function (e) {
    var classId = e.currentTarget.id;
    this.data.currentIndex = classId;
    var that = this;
      this.setData({
        newGoodsList:[],
        currentClassIndex:0,
        isServiceColor: e.currentTarget.id == 0,
        isGoodsColor: e.currentTarget.id == 1,
        isEvalueColor: e.currentTarget.id == 2,
      })

      var datas = classId == 0 ? this.data.serviceList : this.data.goodsList;

      if (datas.length > 0) {
        var _this = this;
        datas.forEach(function (item, index) {
          item.childList.forEach(function (childItem, index) {
            _this.data.cart.list.forEach(function (carItem, index) {
              if (carItem.id == childItem.id) {
                childItem.selectCount = carItem.selectCount;
              }
            });
          })
        });
        this.setData({
          newGoodsList: datas
        });
      } else {
        this.loadDatas(classId == 0 ? 2 : 1);
      }
  },

  loadDatas: function (goodsType) {
    var _this = this;
    var areaCode = app.globalData.userLocationAddress.adcode;
    clientApi.getShopClassAllGoods({ shopId: _this.data.item.id, goodsType: goodsType, pageSize: 300, areaCode: areaCode }).then(d => {
      console.log(d);
      if (d.data.length>0) {
        d.data.forEach(function(obj,index){
          if (index == 0) {
            obj.selected = true;
          }
          obj.childList.forEach(function (childItem, childIndex){
            childItem.goodsType = goodsType;
          })
        })
      } else {
        return;
      }

      if (goodsType == 2) {
        _this.data.serviceList = d.data;
      } else {
        _this.data.goodsList = d.data;
      }
      var newGoodsList = goodsType == 2 ? _this.data.serviceList : _this.data.goodsList;
      _this.setData({
        newGoodsList: newGoodsList
      })
    }).catch(d => {
      var datas = [];
      if (goodsType == 2) {
        _this.data.serviceList = datas;
      } else {
        _this.data.goodsList = datas;
      }
      _this.setData({
        newGoodsList: datas
      })
    })
  },
  //获取评论列表
  getEvalueList:function (){
    var _this = this;
    clientApi.getShopEval({ shopId: _this.data.item.id,pageSize:300}).then(d =>{
        console.log(d);
        _this.setData({
          evalueList:d.data.data
        })
    })
    
  },
  callTel: function (){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.item.tel
    })
  },

  clearStates:function(){
    var that = this;
    that.data.newGoodsList.forEach(function (item, index) {
      item.childList.forEach(function(childItem){
        childItem.selectCount = 0;
      })
    });
    that.data.serviceList.forEach(function (item, index) {
      item.childList.forEach(function (childItem) {
        childItem.selectCount = 0;
      })
    });
    that.data.goodsList.forEach(function (item, index) {
      item.childList.forEach(function (childItem) {
        childItem.selectCount = 0;
      })
    });
    that.data.cart.total = 0;
    that.data.shipPrice = 0;
    that.data.cart.count = 0;
    that.data.cart.list = [];
    that.setData({
      cart: that.data.cart,
      newGoodsList: that.data.newGoodsList,
      serviceList: that.data.serviceList,
      goodsList: that.data.goodsList
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(app.shareInfo);
    let param = {
      userid: app.userId, //用户id
      couponid: app.shareInfo.id  //分享活动id
    }
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
      title: app.shareInfo.title,
      imageUrl: app.shareInfo.image,
      success: (res) => {
        console.log("分享成功", res);
      },
      fail: (res) => {
        console.log("分享失败", res);
      },
    }
  },
  itemClick: function (target) {
    
    let objItem = target.currentTarget.dataset.item;

    app.goodsAttrubuteStr = objItem.des;
    objItem.des = null;
    let item = JSON.stringify(objItem);

    let items = JSON.stringify(this.data.item);

    // console.log(item);  //商品信息
    // console.log(items);  //商家信息
    // console.log(this.data.shipPrice);
    // return;
    let pushUrl = "../../pages/goodsDetail/goodsDetail?gift=1&item=" + encodeURIComponent(item) + "&items=" + encodeURIComponent(items) + "&shipPrice=" + this.data.shipPrice;
    console.log(pushUrl);
    // return;
      wx.navigateTo({
        url: pushUrl
      })
  },
  //点击图片放大预览
  previewImg: function (e) {
    console.log(this.data.item);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.item.shumImgList;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击拨打电话
  calling: function (e) {
    let tel=e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //点击显示商家图片或者隐藏商家图片
  showshopimg:function(){
    this.setData({
      isshowshopimg:!this.data.isshowshopimg
    })
  },
  //点击跳转到地图
  gomap:function(e){
    let _this=this;
    wx.openLocation({
      latitude:_this.data.item.lat,
      longitude: _this.data.item.lng,
      name: _this.data.item.name,
      scale: 28
    })
  },
  //点击查看大图
  showimg:function(e){
    var index=e.currentTarget.dataset.index;
    var imgArr = this.data.evalueList[index].shumImgList;
    // console.log(this.data.evalueList[index]);
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //获取时间
  formatTime:function(date) {
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
  //跳转到配送费用说明页面
  godisFee:function(){
    wx.navigateTo({
      url: '/pages/distributionFee/distributionFee',
    })
  },
  //加入收藏或取消收藏
  addCollection:function(){
    this.setData({
      isCollection: !this.data.isCollection
    })
    /*加入收藏 or 取消收藏
     *@param {int} shopid 商家id
     *@param {int} userid 用户id
     * 
     */
    let param = {
      userid: app.userId,
      shopid: this.data.item.id
    };
    console.log(param);
    clientApi.updateFavouriteShopStatus(param).then(res => {
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
  },


  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      var iosTime = o.replace(/-/g, '/');//解决ios端无法识别 
      let endTime = new Date(iosTime).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        console.log(time)
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
      console.log("00000")
        this.setData({
          endStatus: true
        })
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
        }
        
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr })
    st = setTimeout(this.countDown, 1000);
  },
  onUnload:function(){
    clearTimeout(st)
  }
});

