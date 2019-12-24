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
  fetchOrderAggregate: BASE_URL + "/imatchOrder/reOrder/fetchOrderAggregate",
  getCustCreditList: BASE_URL + "/imatchUser/credit/getCustCreditList",
  creditEdit: BASE_URL + "/imatchUser/credit/edit",
  creditStop: BASE_URL + "/imatchUser/credit/stop",
  creditAuth: BASE_URL + "/imatchUser/credit/auth",
  creditDel: BASE_URL + "/imatchUser/credit/del",
  viewOrder: BASE_URL +"/imatchOrder/bubble/viewOrder",
  getCustomerList: BASE_URL + "/imatchUser/user/getCustomerList",
  getCustomerByCustomerNo: BASE_URL +"/imatchUser/agency/getCustomerByCustomerNo",
  updateReminderMessageTypeById: BASE_URL_WX +"/netgate-article/updateReminderMessageTypeById",
  updateCustomer: BASE_URL +"/imatchUser/user/updateCustomer",
  deleteCustomer: BASE_URL +"/imatchUser/agency/deleteCustomer",
  searchApproveAgent: BASE_URL +"/imatchUser/user/searchApproveAgent", 
  findLabelId: BASE_URL +"/imatchPower/findLabelId", 
  updateCustomerStatus: BASE_URL +"/imatchUser/agency/updateCustomerStatus",
  updateProvderNew: BASE_URL +"/imatchUser/agency/updateProvderNew",
  isExistOrderProvider: BASE_URL + "/imatchOrder/reOrder/isExistOrderProvider", 
  getUserAddress: BASE_URL +"/imatchUser/user/getUserAddress",
  getAllInvoice: BASE_URL +"/imatchUser/user/getAllInvoice",
  updateInvoice: BASE_URL + "/imatchUser/user/updateInvoice",
  updateInvoiceDft: BASE_URL +"/imatchUser/user/updateInvoiceDft",
  deleteInvoice: BASE_URL +"/imatchUser/user/deleteInvoice",
  deleteAddress: BASE_URL +"/imatchUser/user/deleteAddress",
  findDataByUserId: BASE_URL +"/imatchUser/EnterpriseCertificationController/findDataByUserId", 
  saveAccount: BASE_URL +"/imatchUser/agency/saveAccount",
  updateAcctStatus: BASE_URL + "/imatchUser/agency/updateAcctStatus",
  deleteAcct: BASE_URL +"/imatchUser/agency/deleteAcct",
  queryAllSalesman: BASE_URL +"/imatchUser/user/queryAllSalesman", 
  take: BASE_URL + "/imatchOrder/taskSheet/take",
  notTake: BASE_URL +"/imatchOrder/taskSheet/notTake", 
  delSalesman: BASE_URL + "/imatchUser/user/delSalesman",
  updateSalesman: BASE_URL +"/imatchUser/user/updateSalesman",
  addOrUpdateRole: BASE_URL +"/imatchPower/addOrUpdateRole",
  deleteRole: BASE_URL +"/imatchPower/deleteRole",
  queryAllGrade: BASE_URL +"/imatchUser/user/queryAllGrade",
  insertGrade: BASE_URL +"/imatchUser/user/insertGrade",
  updateGrade: BASE_URL +"/imatchUser/user/updateGrade",
  updateDftGrade: BASE_URL +"/imatchUser/user/updateDftGrade",
  delGrade: BASE_URL +"/imatchUser/user/delGrade",
  queryLoginLog: BASE_URL +"/imatchUser/loginLog/queryLoginLog",
  saveWarehouse: BASE_URL +"/imatchUser/agency/saveWarehouse",
  setDftWarehouse: BASE_URL +"/imatchUser/agency/setDftWarehouse",
  delWarehouse: BASE_URL +'/imatchUser/agency/delWarehouse',
  updateUser: BASE_URL +"/imatchUser/user/updateUser",
  selectData: BASE_URL +"/imatchOrder/tStockInMain/selectData",
  saveData: BASE_URL +"/imatchOrder/tStockInMain/saveData",
  findAllDataById: BASE_URL +"/imatchOrder/tStockInMain/findAllDataById",
  updateStatus: BASE_URL +"/imatchOrder/tStockInMain/updateStatus",
  getAcceptBillList: BASE_URL +"/imatchOrder/acceptbill/getAcceptBillList",
  getSupplyAccount: BASE_URL +"/imatchUser/agency/getSupplyAccount",
  acceptbillEdit: BASE_URL +"/imatchOrder/acceptbill/edit",
  registered: BASE_URL + "/imatchUser/user/registered",
  delOpenid: BASE_URL + "/imatchUser/user/delOpenid",
  updateDftCompany: BASE_URL + "/imatchUser/user/updateDftCompany",
  updateSalesmanPwd: BASE_URL +"/imatchUser/user/updateSalesmanPwd",
  allotOrderPrev: BASE_URL +"/imatchOrder/reOrder/allotOrderPrev",
  allotOrderCommit: BASE_URL +"/imatchOrder/reOrder/allotOrderCommit",
  getAcceptBillListByCust: BASE_URL +"/imatchOrder/acceptbill/getAcceptBillListByCust", 
  creditPayment: BASE_URL +"/imatchOrder/reOrder/creditPayment",
  deliver: BASE_URL +"/imatchOrder/reOrder/deliver",
  reOrderTake: BASE_URL +"/imatchOrder/reOrder/take",
  custOrderPay: BASE_URL +"/imatchOrder/acceptbill/custOrderPay",
  updateCustomerStatus: BASE_URL +"/imatchUser/user/updateCustomerStatus",
  findLogginByOrder: BASE_URL +"/imatchOrder/loggin/findLogginByOrder",
  updateAllReminderMessageType: BASE_URL_WX +"/netgate-article/updateAllReminderMessageType",
  queryOriginalByOrderNo: BASE_URL +"/imatchOrder/traceOrder/queryOriginalByOrderNo",
  cancelApply: BASE_URL +"/imatchOrder/reOrder/cancelApply", 
  delByCust: BASE_URL +"/imatchOrder/acceptbill/delByCust",
  commitByCust: BASE_URL +"/imatchOrder/acceptbill/commitByCust",
  authByCust: BASE_URL +"/imatchOrder/acceptbill/authByCust",
  fetchCautionStock: BASE_URL +"/imatchProduct/stockCurrent/fetchCautionStock",
  updateDftCompany: BASE_URL +"/imatchUser/user/updateDftCompany",
  findApplys: BASE_URL +"/imatchUser/salesmanApply/findApplys"

}
export default function(name) {
  return alias[name]
}