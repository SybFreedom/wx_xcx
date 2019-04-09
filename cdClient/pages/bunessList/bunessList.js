var app = getApp();
var txmap = require('../../libs/map/qqmap-wx-jssdk.min.js');
const clientApi = require('../../utils/clientApi.js').clientApi

let pageIndex = 1; //分页第几页
let isBottom = false; //是否到底

var wxMarkerData = []; //定位成功回调对象  

let leftHeight = 0;
let rightHeight = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items1: [],
    items2: [],
    userLocationAddress: {},
    isLoadMore: true,
    shopType: 0,
    pageIndex: 1,
    name: '', //搜索关键字
    title: '',
    totalPage: 100,
    windowHeight: 0,
    windowWidth: 0,
    items: [],
    num: 7, //关键字显示数量
    hotsearch: [{
        title: '大型犬狗粮',
      },
      {
        title: '中型犬狗粮',
      },
      {
        title: '小型犬狗粮',
      },
      {
        title: '宠物毛刷',
      },
      {
        title: '猫粮',
      },
      {
        title: '狗罐头',
      },
      {
        title: '宠物窝垫',
      },
      {
        title: '羊奶粉',
      },
      {
        title: '除臭剂',
      },
      {
        title: '磨牙棒',
      },
      {
        title: '狗骨头',
      },
      {
        title: '营养膏',
      },
      {
        title: '指甲剪',
      },
      {
        title: '大棒肉',
      },
      {
        title: '鸡胸肉',
      },
      {
        title: '幼犬粮',
      },
      {
        title: '幼猫粮',
      },
      {
        title: '猫砂',
      },
      {
        title: '指甲剪',
      },
    ],
    sortText: [{
        text: "销量",
        sort: 'desc',
        status: false,
        pic: '/images/black_down.png',
        sortName: 'sellcount'
      },
      {
        text: "价格",
        sort: 'desc',
        status: false,
        pic: '/images/black_down.png',
        sortName: 'price'
      },
      // { text: "评价", code: 2 },
    ],
    idx: null, //变色的那一个
    sortidx: null, //排序变色的那个
    shopMessage: '', //商家信息
    scrollTop: 0, //距离顶部位置
    floorstatus: false, //是否显示返回顶部按钮
    sort: false, //是否排序
    sortcolumn1: '', //排序字段
    sortcolumntype1: '', //正序 or 倒叙
  },
  // 获取滚动条当前位置
  onPageScroll: function(e) {
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
  goTop: function(e) { // 一键回到顶部
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
  onLoad: function(options) {
    leftHeight=0;
    rightHeight=0;
    this.setData({
      items1:[],
      items2:[]
    })
    //配置分享信息
    app.getShareInfo(1).then(res => {
      console.log(res);
      app.userShare = res;
    })
    console.log(options.id);
    this.setData({
      shopType: 1,
      title: '宠物百货',
      userLocationAddress: app.globalData.userLocationAddress,
    })
    wx.setNavigationBarTitle({
      title: '宠物百货',
    })
    // this.refresh();
    let keywords = '';
    options.id == 1 ? keywords = "狗粮" : keywords = "洗澡"; //id=1：百货 id=2：服务
    this.searchGoods(keywords);
  },
  //显示隐藏所有关键字
  showKeyWord: function() {
    if (this.data.num == 7) {
      this.setData({
        num: 20
      })
    } else {
      this.setData({
        num: 7
      })
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

  },

  ///下拉刷新
  refresh: function(isShowToast) {
    wx.showNavigationBarLoading();
    if (isShowToast == true) {
      wx.showToast({
        title: '下拉刷新',
      })
    }
    //初始pageIndex
    this.setData({
      pageIndex: 1,
      isLoadMore: false
    })

    //获取商家列表
    this.apiGetBunessList(this.data.pageSize, this.data.pageIndex);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _this = this;
    if (isBottom == false) { //当isbottom等于false时才加载下一页
      pageIndex++;
    }


    wx.showLoading({
      title: '加载中',
    })
    /**
     * sort  true or false
     * sortcolumn1   sellcount(销量) or price(价格)
     * sortcolumntype1 asc or desc
     * currPage  分页
     *   
     */
    console.log({
      name: this.data.name,
      moduleId: this.data.shopType,
      currPage: pageIndex
    });
    let param = {
      name: this.data.name,
      moduleId: this.data.shopType,
      currPage: pageIndex,
      sort: this.data.sort, //是否排序
      sortcolumn1: this.data.sortcolumn1,
      sortcolumntype1: this.data.sortcolumntype1,
    }
    clientApi.searchGoods(param).then(res => {
      console.log(res);
      if (res.success == 0) {
        if (res.data.data != "") {
          let datas = res.data.data;
          for (let i = 0; i < datas.length; i++) {
            if (leftHeight <= rightHeight) {
              _this.data.items1.push(datas[i]);
              leftHeight += 1;
            } else {
              _this.data.items2.push(datas[i]);
              rightHeight += 1;
            }
          }
          _this.setData({
            items1: _this.data.items1,
            items2: _this.data.items2
          })
          // this.setData({
          //   items: _this.data.items.concat(res.data.data)
          // })
        } else {
          isbottom = true;
          wx.showToast({
            icon: 'none',
            title: '已经到底了',
          })
        }

      } else {
        wx.showToast({
          title: '出错啦~~~',
        })
      }
      wx.hideLoading();
    })


  },

  //搜索商品
  searchGoods: function() {
    /**
     * sort  true or false
     * sortcolumn1   sellcount(销量) or price(价格)
     * sortcolumntype1 asc or desc
     * currPage  分页
     *   
     */
    let _this=this;
    clientApi.searchGoods({
      name: this.data.name,
      moduleId: this.data.shopType,
      currPage: pageIndex
    }).then(res => {
      console.log(res);
      if (res.success == 0) {
        if (res.data == null) {
          wx.showToast({
            icon: "none",
            title: '没有搜索到您输入的内容',
          })
        }
        let datas=res.data.data;
        for (let i = 0; i < datas.length; i++) {
          if (leftHeight <= rightHeight) {
            _this.data.items1.push(datas[i]);
            leftHeight += 1;
          } else {
            _this.data.items2.push(datas[i]);
            rightHeight += 1;
          }
        }
        console.log('leftHeight', leftHeight)
        console.log('rightHeight', rightHeight)
        _this.setData({
          items1: _this.data.items1,
          items2: _this.data.items2
        })
      }
    })
  },


  //加载更多
  loadMore: function() {
    var that = this;
    if (!that.data.isLoadMore) {
      return
    };
    that.data.isLoadMore = false;
    that.apiGetBunessList(this.data.pageSize, this.data.pageIndex);
  },

  apiGetBunessList: function(pageSize, pageIndex) {
    if (pageIndex > this.data.totalPage) {
      return
    };

    if (pageIndex != 1) {
      wx.showLoading({
        title: '加载更多数据中。。。'
      });
    }
    var _this = this;

    console.log(this.data.name);

    clientApi.getShop({
      currPage: pageIndex,
      name: this.data.name,
      moduleIds: _this.data.shopType,
      lng: _this.data.userLocationAddress.location.lng,
      lat: _this.data.userLocationAddress.location.lat,
      areaCode: 200000 //_this.data.userLocationAddress.adcode
    }).then(d => {
      var datas = _this.data.items;


      if (d.data.data != null) {
        if (pageIndex == 1) {
          _this.setData({
            totalPage: d.data.totalPage
          })
          datas = d.data.data;
        } else {

          datas = datas.concat(d.data.data);
        }

        if (d.data.data.count < pageSize) {
          _this.setData({
            isLoadMore: false
          })
        } else {
          _this.setData({
            isLoadMore: true,
            pageIndex: _this.data.pageIndex += 1,
          })
        }
        for(let i=0;i<datas.length;i++){
          if(leftHeight<=rightHeight){
            _this.data.items1.push(datas[i]);
            leftHeight += 1;
          }else{
            _this.data.items2.push(datas[i]);
            rightHeight += 1;
          }
        }
        _this.setData({
          items1: _this.data.items1,
          items2: _this.data.items2
        })
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }

    });
  },

  //商家item
  bunessItemClick: function(event) {
    let shopId = event.currentTarget.dataset.item.shopId; //商家id
    app.goodsAttrubuteStr = event.currentTarget.dataset.item.des;
    event.currentTarget.dataset.item.des = null;
    let item = JSON.stringify(event.currentTarget.dataset.item); //商品信息

    let that = this;
    clientApi.getShopById({
      id: shopId,
      lng: app.globalData.userLocationAddress.location.lng,
      lat: app.globalData.userLocationAddress.location.lat,
    }).then(d => {
      that.setData({
        shopMessage: d.data
      })
      let items = JSON.stringify(that.data.shopMessage); //商家信息
      // console.log(item);
      //console.log(items);
      // return;
      wx.navigateTo({
        url: "/pages/goodsDetail/goodsDetail?item=" + encodeURIComponent(item) + "&items=" + encodeURIComponent(items) + "&shipPrice=0" + "&status=1",
      })
    })


    // wx.navigateTo({
    //   url: '/pages/shop/shop?id=' + id
    // })
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
  //点击热搜的关键词发起搜索
  hotsearch: function(e) {
    pageIndex = 1;
    console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    this.setData({
      idx: index,
      name: e.currentTarget.dataset.txt,
      items: [],
      sortText: [{
          text: "销量",
          sort: 'desc',
          status: false,
          pic: '/images/black_down.png',
          sortName: 'sellcount'
        },
        {
          text: "价格",
          sort: 'desc',
          status: false,
          pic: '/images/black_down.png',
          sortName: 'price'
        },
        // { text: "评价", code: 2 },
      ]
    })
    this.searchGoods(this.data.name);
  },
  //实时搜索数据
  bindKeyInput: function(e) {
    pageIndex = 1;
    console.log('搜索数据', e.detail.value);
    this.setData({
      name: e.detail.value,
      items1: [],
      items2: [],
      sortText: [{
          text: "销量",
          sort: 'desc',
          status: false,
          pic: '/images/black_down.png',
          sortName: 'sellcount'
        },
        {
          text: "价格",
          sort: 'desc',
          status: false,
          pic: '/images/black_down.png',
          sortName: 'price'
        },
        // { text: "评价", code: 2 },
      ]
    })

    this.searchGoods(this.data.name);

  },
  //排序
  sort: function(res) {
    let _this=this;
    pageIndex = 1;
    let index = res.currentTarget.dataset.index; //当前点击的第几个
    let current = 'sortText[' + index + '].status';
    for (let i = 0; i < this.data.sortText.length; i++) {
      this.data.sortText[i].status = false;
      this.data.sortText[i].pic = "/images/black_down.png";
    }
    if (this.data.sortText[index].sort == 'desc') {
      this.data.sortText[index].sort = 'asc';
      this.data.sortText[index].pic = "/images/red_down.png";
    } else if (this.data.sortText[index].sort == 'asc') {
      this.data.sortText[index].sort = 'desc';
      this.data.sortText[index].pic = "/images/red_up.png";
    }
    this.data.sortText[index].status = true;

    let sort = res.currentTarget.dataset.sort; //排序  asc or desc
    let sortName = res.currentTarget.dataset.sortname; //排序字段
    this.setData({
      items1:[],
      items2:[],
      sortText: this.data.sortText,
      sort: true,
      sortcolumn1: sortName,
      sortcolumntype1: sort,
    })
    /**
     * sort  true or false
     * sortcolumn1   sellcount(销量) or price(价格)
     * sortcolumntype1 asc or desc
     * currPage  分页
     *   
     */

    let param = { //参数集
      name: this.data.name, //搜索内容
      moduleId: this.data.shopType, //服务  or  百货
      currPage: pageIndex, //当前页
      sort: true, //是否排序
      sortcolumn1: sortName,
      sortcolumntype1: sort,
    };
    console.log(param);
    wx.showLoading({
      title: '加载中',
    })
    clientApi.searchGoods(param).then(res => {
      console.log(res);
      
      if (res.success == 0) {
        if (res.data == null) {
          wx.showToast({
            icon: "none",
            title: '没有搜索到您输入的内容',
          })
        }       
        let datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          if (leftHeight <= rightHeight) {
            _this.data.items1.push(datas[i]);
            leftHeight += 1;
          } else {
            _this.data.items2.push(datas[i]);
            rightHeight += 1;
          }
        }
        _this.setData({
          items1: _this.data.items1,
          items2: _this.data.items2
        })
      }
      wx.hideLoading();
    })
   
  }

})