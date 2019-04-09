// pages/commentOrder/commentOrder.js
var app = getApp();
const clientApi = require('../../utils/clientApi.js').clientApi
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    orderItem:{},
    evaluesList:[{starValue:5,starType:0,des:'服务态度',
      stars: ['../../images/starH.png', '../../images/starH.png', '../../images/starH.png', '../../images/starH.png', '../../images/starH.png']
    }],
    uploadlist:[], 
    imglist:[],  //上传图片列表用，分割
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

    let orderItem = JSON.parse(options.item);
    this.data.orderItem = orderItem;

    console.log(this.data.orderItem);

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


  bindinput: function (d){
    this.data.content = d.detail.value;
  },

  starOnlick: function (e){
   var dataIndex = e.target.dataset.index + 1;
   var starType = e.target.dataset.startype;
   var stars = [];
   this.data.evaluesList[starType].stars.forEach(function (value, index, array) {

     if (dataIndex -1 < index) {
       stars.push('../../images/starN.png');
     } else {
       stars.push('../../images/starH.png');
     }
   });
   this.data.evaluesList[starType].stars = stars;
   this.data.evaluesList[starType].starValue = dataIndex;
   this.setData({
     evaluesList: this.data.evaluesList
   })
  },
  commitComment: function (){

    if (this.data.content == ''){
      wx.showModal({
        title: '提示！',
        content: '评价正文不能为空！',
      })
      return;
    }
    console.log(this.data.imglist.toString());
    
    // console.log(this.data.imglist);
    console.log({
      content: this.data.content,  //提交评论接口
      grade: this.data.evaluesList[0].starValue,
      orderId: this.data.orderItem.id, img: this.data.imglist.toString()
    });
    clientApi.evalOrder({ content:this.data.content,  //提交评论接口
      grade: this.data.evaluesList[0].starValue,
      orderId: this.data.orderItem.id, img: this.data.imglist.toString()}).then(d => {
        console.log(d);
          if(d.success == 1){
            wx.showToast({
              title: '评论成功',
            })
            wx.navigateBack({
              
            })
          }
      })
  },
  //选择相册图片
  openimg:function(){
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // console.log(res.tempFilePaths);
        if(this.data.uploadlist.length>0){
          this.setData({
            uploadlist:this.data.uploadlist.concat(res.tempFilePaths)
          });
        }else{
          this.setData({
            uploadlist: res.tempFilePaths
          });
        }
        console.log(res.tempFilePaths);
        let pics = this.data.uploadlist;  //上传图片的地址
        this.uploadimg({  //执行上传图片
          url: "https://www.chongdaopet.com/file/uploadOneFile.do",
          path: pics,  //这里是选取的图片的地址数组
        });
        
      }
    })
    
  },
  //删除图片
  deleteimg:function(e){
    let index=e.currentTarget.dataset.index;
    this.data.uploadlist.splice(index,1);
    this.setData({
      uploadlist:this.data.uploadlist
    });
  },
  //上传图片
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: {
        //此处可以传自定义参数……
      },
      header: {
        "Content-Type": "multipart/form-data",
        //"sessionId": getApp().globalData.sessionId,
      },
      success: (resp) => {
        success++;
      
        let datalist=JSON.parse(resp.data);
        // console.log(datalist.newName);
        // imglist.push(datalist.newName);
        that.setData({
          imglist: that.data.imglist.concat(datalist.newName)
        })
        

       
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {   //当图片传完时，停止调用
          wx.showToast({
            title: '上传成功',
            duration: 1500,
            mask: 'false'
          })
          that.setData({
            tempFilePaths: []
          })
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
})