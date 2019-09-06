// const BASE_URL = "http://192.168.3.101:"
// const BASE_URL = "http://47.104.86.230:"

// const BASE_URL = "http://192.168.3.101:14000"
// const BASE_URL_WX = "http://192.168.3.101:26000"

const BASE_URL = "https://gateway.imatchas.com"
const BASE_URL_WX = "https://wx.imatchas.com"

const alias = {
  loginAuthenticate: BASE_URL_WX + "/netgate-user/loginAuthenticate",
  homeMessage: BASE_URL + "/imatchOrder/bubble/homeMessage",
  getUserByCustNo: BASE_URL + "/imatchUser/user/getUserByCustNo",
  queryCompany: BASE_URL + "/imatchUser/user/queryCompany",
  toggleAccount: BASE_URL_WX + "/netgate-user/switchLogin",
  getOrderNo: BASE_URL + "/imatchOrder/order/getOrderNo",
  getDtfAddress: BASE_URL + "/imatchUser/user/getDtfAddress",
  updateUserAddress: BASE_URL + "/imatchUser/user/updateUserAddress",
  updateUserDftAddress: BASE_URL + "/imatchUser/user/updateUserDftAddress",
  getPurchasingSupplyNew: BASE_URL + "/imatchUser/agency/getPurchasingSupplyNew",
  getSupplyList: BASE_URL + "/imatchUser/agency/getSupplyList",
  addProvider: BASE_URL + "/imatchUser/agency/addProvider",
  queryAllUsingSalesman: BASE_URL + "/imatchUser/user/queryAllUsingSalesman",
  findRoles: BASE_URL + "/imatchPower/findRoles",
  queryAllGrade: BASE_URL + "/imatchUser/user/queryAllGrade",
  insertSalesman: BASE_URL + "/imatchUser/user/insertSalesman",
  searchStockProduct: BASE_URL + "/imatchProduct/stockCurrent/searchStockProduct",
  searchProductNew: BASE_URL + "/imatchProduct/product/searchProductNew",
  getWarehouse: BASE_URL + "/imatchUser/agency/getWarehouse",
  purchaseDiscount: BASE_URL + "/imatchProduct/product/discount/purchaseDiscount",
  queryPurchaseUpp: BASE_URL + "/imatchOrder/reOrder/queryPurchaseUpp",
  queryPurchaseBackUpp: BASE_URL + "/imatchOrder/reOrder/queryPurchaseBackUpp",
  queryByOrderNo: BASE_URL + "/imatchOrder/reOrder/queryByOrderNo",
  savePurchaseOrderUpperAndLower: BASE_URL + "/imatchOrder/reOrder/savePurchaseOrderUpperAndLower",
  queryCustomer: BASE_URL + "/imatchUser/user/queryCustomer",
  addCustomer: BASE_URL + "/imatchUser/user/addCustomer",
  getDftAddress: BASE_URL + "/imatchUser/agency/getDftAddress",
  cancelOrder: BASE_URL + "/imatchOrder/reOrder/cancelOrder",
  getOrderPayByOrderNoCost: BASE_URL + "/imatchOrder/acceptbill/getOrderPayByOrderNoCost",
  getSupplyAccount: BASE_URL + "/imatchUser/agency/getSupplyAccount",
  orderPayByOrderNo: BASE_URL + "/imatchOrder/acceptbill/orderPayByOrderNo",
  custOrderPay: BASE_URL + "/imatchOrder/acceptbill/custOrderPay",
  homeMessage: BASE_URL + "/imatchOrder/bubble/homeMessage",
  fetchSaleProductInfo: BASE_URL + "/imatchProduct/stockCurrent/fetchSaleProductInfo",
  getStockInBatch: BASE_URL + "/imatchProduct/stockCurrent/getStockInBatch",
  saleDiscount: BASE_URL + "/imatchProduct/product/discount/saleDiscount",
  selectReminderMessageByEnterpriseId: BASE_URL_WX + "/netgate-article/selectReminderMessageByEnterpriseId",
  saveSaleOrderUpperAndLower: BASE_URL + "/imatchOrder/reOrder/saveSaleOrderUpperAndLower",
  querySaleUpp: BASE_URL + "/imatchOrder/reOrder/querySaleUpp",
  queryBackUpp: BASE_URL + "/imatchOrder/reOrder/queryBackUpp",
  againOrder: BASE_URL + "/imatchOrder/reOrder/againOrder",
  getIdentify: BASE_URL + "/imatchUser/agency/getIdentify",
  bindingAccount: BASE_URL_WX + "/netgate-user/bindingAccount",
  getLogistics: BASE_URL + "/imatchUser/agency/getLogistics",
  queryStock: BASE_URL + "/imatchProduct/stockCurrent/queryStock",
  fetchSaleRecord: BASE_URL + "/imatchOrder/reOrder/fetchSaleRecord",
  fetchPurchaseRecord: BASE_URL + "/imatchOrder/reOrder/fetchPurchaseRecord",
  queryStockDetail: BASE_URL + "/imatchProduct/stockCurrent/queryStockDetail",
  updateWareItem: BASE_URL + "/imatchProduct/stockCurrent/updateWareItem",
  addWareItem: BASE_URL + "/imatchProduct/stockCurrent/addWareItem",
}
export default function(name) {
  return alias[name]
}