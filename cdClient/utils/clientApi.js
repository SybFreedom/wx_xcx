const request = require('../utils/kad.request.js')
const linq = require('../libs/linq.min.js').linq
//let URI = 'https://www.chongdaopet.com/mobile/';
//线上测试地址
//let URI = 'https://dev.chongdaopet.com/mobile/';
//测试地址
let URI = 'http://192.168.0.44:8099/mobile/';
/**
 * 每一个页面对应一个contoller
 */
class ClientApi {
  // 领优惠券
  receiveCoupon() {
    return request.get(`${URI}receiveCoupon`).then(res => res.data)
  }
  /**
   * 首页banner图
   */
  addUserIdentify(params) {
    return request.get(`${URI}add/userIdentify`, params).then(res => res.data)
  }
  //传入区域码做区域分离
  getBanner(params) {
    return request.get(`${URI}getBanner.do`, params).then(res => res.data)
  }

  getShopById(params) {
    return request.get(`${URI}getShopById.do`, params).then(res => res.data)
  }

  getOpenCityList() {
    return request.get(`${URI}getOpenCity.do`).then(res => res.data)
  }
  //获取配送员坐标
  getRechargeOrder(param) {
    return request.get(`${URI}getRechargeOrder.do`, param).then(res => res.data)
  }
  /**
   * 宠物分类图标接口
   */
  getModules() {
    return request.get(`${URI}getModule.do`).then(res => res.data)
  }

  getShop(params) {
    return request.get(`${URI}getShop.do`, params).then(res => res.data)
  }

  getShopGoods(params) {
    return request.get(`${URI}getShopGoods.do`, params).then(res => res.data)
  }

  getShopClassAllGoods(params) {
    console.log(params);
    return request.get(`${URI}getShopGoodsType.do`, params).then(res => res.data)
  }

  bindUser(params) {
    return request.get(`${URI}bindUser.do`, params).then(res => res.data)
  }

  updateAreaCodeByUserId(params) {
    return request.get(`${URI}updateAreaCodeByUserId`, params).then(res => res.data)
  }

  editUserAddress(params) {
    return request.get(`${URI}editUserAddress.do`, params).then(res => res.data)
  }

  getUserAddress(params) {
    return request.get(`${URI}getUserAddress.do`, params).then(res => res.data)
  }

  addOrder(params) {
    return request.get(`${URI}addOrder.do`, params).then(res => res.data)
  }
  //追加订单
  reAddOrder(params) {
    return request.get(`${URI}reAddOrder.do`, params).then(res => res.data)
  }
  getOrderList(param) {
    return request.get(`${URI}getOrderList.do`, param).then(res => res.data)
  }
  //退款
  applyRefund(param) {
    return request.get(`${URI}applyRefund.do`, param).then(res => res.data)
  }
  //确认订单
  sureOrder(param) {
    return request.get(`${URI}sureOrder.do`, param).then(res => res.data)
  }

  delOrder(param) {
    return request.get(`${URI}delOrder.do`, param).then(res => res.data)
  }
  //评论订单
  evalOrder(param) {
    return request.get(`${URI}evalOrder.do`, param).then(res => res.data)
  }

  getShopEval(param) {
    return request.get(`${URI}getShopEval.do`, param).then(res => res.data)
  }

  getFooterList(data) {
    var list = linq.From(data)
      .Where(function(x) {
        return x.Sort > 1
      })
      .OrderBy(function(x) {
        return x.Text
      })
      .ToArray();
    return list;
  }

  getIndexGuess(pageIndex, pageSize) {
    return request.get(`${URI}//DataPlatform/GetIndexGuessLikeProducts?siteid=40&pageIndex=${pageIndex}&pageSize=${pageSize}`).then(res => res.data)
  }

  getUserFirstPayInfo(param) {
    return request.get(`${URI}checkIsFirstOrder.do`, param).then(res => res.data)
  }

  //宠物百科列表接口
  getWikiList(param) {
    return request.get(`${URI}getWikiList`).then(res => res.data)
  }
  //宠物百科详情接口
  getWiki(param) {
    return request.get(`${URI}getWiki`).then(res => res.data)
  }
  //获取配送费用接口（单程费用、双程费用、每增加一个宠物加10元）
  getDicInfo(param) {
    return request.get(`${URI}getDicInfo`, param).then(res => res.data)
  }
  //计算配送服务费用
  getOrderServiceFee(retind, address, saddress, shop, petAmount) {
    return request.get(`${URI}getOrderServiceFee`, retind, address, saddress, shop, petAmount).then(res => res.data)
  }
  //计算商品费用
  getOrderGoodsFee(param) {
    return request.get(`${URI}getOrderGoodsFee`, param).then(res => res.data)
  }
  //订单详情
  getOrderDetailByOrderId(param) {
    return request.get(`${URI}getOrderDetailByOrderId`, param).then(res => res.data)
  }
  //获取配送说明
  getServiceFeeStd(param) {
    return request.get(`${URI}getServiceFeeStd`).then(res => res.data)
  }
  //卡券列表
  getMyCardList(param) {
    return request.get(`${URI}getMyCardList`, param).then(res => res.data)
  }
  //优惠金额
  getOrderDiscountFee(param) {
    return request.get(`${URI}getOrderDiscountFee`, param).then(res => res.data)
  }

  //删除收货地址
  deleteUserAddress(param) {
    return request.get(`${URI}deleteUserAddress`, param).then(res => res.data)
  }

  //修改收货地址
  updateUserAddress(param) {
    return request.get(`${URI}updateUserAddress`, param).then(res => res.data)
  }

  //搜索商品
  searchGoods(param) {
    return request.get(`${URI}searchGoods`, param).then(res => res.data)
  }
  //分区列表
  getOpenDistrict(param) {
    return request.get(`${URI}getOpenDistrict`, param).then(res => res.data)
  }
  //充值
  topUp(param) {
    return request.get(`${URI}topUp`, param).then(res => res.data)
  }
  //充值记录
  topUpList(param) {
    return request.get(`${URI}topUpList`, param).then(res => res.data)
  }
  //获取用户余额
  queryMoney(param) {
    return request.get(`${URI}queryMoney`, param).then(res => res.data)
  }
  //追加订单
  addAdtOrder(param) {
    return request.get(`${URI}addAdtOrder`, param).then(res => res.data)
  }
  //充值说明
  // topUpStd(param){
  //   return request.get(`${URI}topUpStd`, param).then(res => res.data)
  // }
  //获取积分
  queryPoints(param) {
    return request.get(`${URI}queryPoints`, param).then(res => res.data)
  }
  //获取精选商家与活动列表
  hotShop(param) {
    return request.get(`${URI}hotShop`, param).then(res => res.data)
  }
  //检测是否有活动
  getLoginEvent(param) {
    return request.get(`${URI}getLoginEvent`, param).then(res => res.data)
  }
  //领取活动优惠券
  getEventCard(param) {
    return request.get(`${URI}getEventCard`, param).then(res => res.data)
  }

  //计算订单费用
  getPrepareOrderDetail(param) {
    return request.get(`${URI}getPrepareOrderDetail`, param).then(res => res.data)
  }

  //获取用户商品优惠券
  getGoodsCardList(param) {
    return request.get(`${URI}getGoodsCardList`, param).then(res => res.data)
  }

  //获取用户配送优惠券
  getServiceCardList(param) {
    return request.get(`${URI}getServiceCardList`, param).then(res => res.data)
  }
  //获取大礼包
  showIndvPackages(param) {
    return request.get(`${URI}showIndvPackages`, param).then(res => res.data)
  }
  //使用大礼包
  usePackage(param) {
    return request.get(`${URI}usePackage`, param).then(res => res.data)
  }
  //获取礼包商店信息
  getOfficialShop(param) {
    return request.get(`${URI}getOfficialShop`, param).then(res => res.data)
  }
  //获取用户收藏商品列表
  getFavouriteGoods(param) {
    return request.get(`${URI}getFavouriteGoods`, param).then(res => res.data)
  }
  //获取用户收藏商家列表
  getFavouriteShop(param) {
    return request.get(`${URI}getFavouriteShop`, param).then(res => res.data)
  }
  //加入收藏商品 or 取消收藏商品
  updateFavouriteGoodsStatus(param) {
    return request.get(`${URI}updateFavouriteGoodsStatus`, param).then(res => res.data)
  }
  //加入收藏商家 or 取消收藏商家
  updateFavouriteShopStatus(param) {
    return request.get(`${URI}updateFavouriteShopStatus`, param).then(res => res.data)
  }
  //获取初始商品是否被收藏
  getInvFavouriteGoods(param) {
    return request.get(`${URI}getInvFavouriteGoods`, param).then(res => res.data)
  }
  //获取初始商家是否被收藏
  getInvFavouriteShop(param) {
    return request.get(`${URI}getInvFavouriteShop`, param).then(res => res.data)
  }
  //取消收藏商品
  deleteFavouriteGoods(param) {
    return request.get(`${URI}deleteFavouriteGoods`, param).then(res => res.data)
  }
  //取消收藏商家
  deleteFavouriteShop(param) {
    return request.get(`${URI}deleteFavouriteShop`, param).then(res => res.data)
  }
  //获取分享内容
  //7143509
  getShareInfo(param) {
    return request.get(`${URI}getShareInfo`, param).then(res => res.data)
  }
  //分享领券
  userShare(param) {
    return request.get(`${URI}userShare`, param).then(res => res.data)
  }
  //获取宠物寄养笼子数量
  getInventory(param) {
    return request.get(`${URI}getInventory`, param).then(res => res.data)
  }
  //获取消息列表
  getMessageList(param) {
    return request.get(`${URI}getMessageList`, param).then(res => res.data)
  }
  //修改消息状态
  updateMessageStatus(param) {
    return request.get(`${URI}updateMessageStatus`, param).then(res => res.data)
  }
  //获取消息数量
  getMessageCountByStatus(param) {
    return request.get(`${URI}getMessageCountByStatus`, param).then(res => res.data)
  }

  //根据不同的城市调取不同域名
  setServiceURI(param) {
    URI = param;
    console.log(URI);
  }
}
/**
 * 实例化对象
 */
let clientApi = new ClientApi();
/**
 * 暴露对象，无需每次都加函数名
 */
module.exports = {
  clientApi: clientApi,
}