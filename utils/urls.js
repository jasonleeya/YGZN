const BASE_URL = "http://192.168.3.101:"
const alias = {
  loginAuthenticate: "26000/netgate-user/loginAuthenticate",
  homeMessage: "14000/imatchOrder/bubble/homeMessage",
  getUserByCustNo: "14000/imatchUser/user/getUserByCustNo",
  queryCompany: "14000/imatchUser/user/queryCompany",
  toggleAccount: "26000/netgate-user/switchLogin",
  getOrderNo: "14000/imatchOrder/order/getOrderNo",
  getDtfAddress:"14000/imatchUser/user/getDtfAddress"
}
export default function(name) {
  return BASE_URL + alias[name]
}