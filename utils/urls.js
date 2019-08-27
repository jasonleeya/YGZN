// const BASE_URL = "http://192.168.3.101:"
const BASE_URL = "http://47.104.86.230:"

const alias = {
  loginAuthenticate: "26000/netgate-user/loginAuthenticate",
  homeMessage: "14000/imatchOrder/bubble/homeMessage",
  getUserByCustNo: "14000/imatchUser/user/getUserByCustNo",
  queryCompany: "14000/imatchUser/user/queryCompany",
  toggleAccount: "26000/netgate-user/switchLogin",
  getOrderNo: "14000/imatchOrder/order/getOrderNo",
  getDtfAddress: "14000/imatchUser/user/getDtfAddress",
  updateUserAddress: "14000/imatchUser/user/updateUserAddress",
  updateUserDftAddress: "14000/imatchUser/user/updateUserDftAddress",
  getPurchasingSupplyNew: "14000/imatchUser/agency/getPurchasingSupplyNew",
  getSupplyList: "14000/imatchUser/agency/getSupplyList",
  addProvider: "14000/imatchUser/agency/addProvider",
  queryAllUsingSalesman: "14000/imatchUser/user/queryAllUsingSalesman",
  findRoles: "14000/imatchPower/findRoles",
  queryAllGrade: "14000/imatchUser/user/queryAllGrade",
  insertSalesman: "14000/imatchUser/user/insertSalesman",
  searchStockProduct: "14000/imatchProduct/stockCurrent/searchStockProduct",
  searchProductNew:"14000/imatchProduct/product/searchProductNew",
  getWarehouse: "14000/imatchUser/agency/getWarehouse", 
  purchaseDiscount: "14000/imatchProduct/product/discount/purchaseDiscount",
  queryPurchaseUpp: "14000/imatchOrder/reOrder/queryPurchaseUpp",
  queryPurchaseBackUpp: "14000/imatchOrder/reOrder/queryPurchaseBackUpp",
  queryByOrderNo: "14000/imatchOrder/reOrder/queryByOrderNo",
  savePurchaseOrderUpperAndLower:"14000/imatchOrder/reOrder/savePurchaseOrderUpperAndLower",
  queryCustomer: "14000/imatchUser/user/queryCustomer", 
  addCustomer: "14000/imatchUser/user/addCustomer",
  getDftAddress: "14000/imatchUser/agency/getDftAddress",
  cancelOrder: "14000/imatchOrder/reOrder/cancelOrder",
  getOrderPayByOrderNoCost:"14000/imatchOrder/acceptbill/getOrderPayByOrderNoCost",
  getSupplyAccount:"14000/imatchUser/agency/getSupplyAccount",
  orderPayByOrderNo: "14000/imatchOrder/acceptbill/orderPayByOrderNo",
  custOrderPay:"14000/imatchOrder/acceptbill/custOrderPay",
  homeMessage:"14000/imatchOrder/bubble/homeMessage",
  fetchSaleProductInfo: "14000/imatchProduct/stockCurrent/fetchSaleProductInfo",
  getStockInBatch:"14000/imatchProduct/stockCurrent/getStockInBatch", 
  saleDiscount:"14000/imatchProduct/product/discount/saleDiscount",
  selectReminderMessageByEnterpriseId:"26000/netgate-article/selectReminderMessageByEnterpriseId"
}
export default function(name) {
  return BASE_URL + alias[name]
}