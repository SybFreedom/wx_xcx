const request = require('../utils/kad.request.js')
const linq = require('../libs/linq.min.js').linq

//const URI = "https://www.chongdaopet.com/";

const URI = "http://192.168.0.44:8099/";

/**
 * 每一个页面对应一个contoller
 */
class ClientApi {
  /**
   * 登录
   */
  toLogin(params) {
    return request.get(`${URI}express/expresslogin`, params).then(res => res.data)
  }
  showLogin(params) {
    return request.get(`${URI}express/expressStatus`, params).then(res => res.data)
  }
  /**
  * 更新坐标
  * courierId  配送员id
  * lat      精度 
  * lng      纬度
  * @return {Promise} 
  */
  updateCourdinate_(param) {
    return request.get(`${URI}mobileDelivery/updateCourdinate.do`, param).then(res => res.data)
  }
  /**
   * 订单列表
   */
  getOrderList(params) {
    return request.get(`${URI}mobile/getOrderList.do`, params).then(res => res.data)
  }
  getMessageList(param, header) {
    return request.get(`${URI}express/getMessageList`, param, header).then(res => res.data)
  }
  getMessageCountByStatus(param, header) {
    return request.get(`${URI}express/getMessageCountByStatus`, param, header).then(res => res.data)
  }
  updateMessageStatus(param, header) {
    return request.get(`${URI}express/updateMessageStatus`, param, header).then(res => res.data)
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
  clientApi: clientApi
}