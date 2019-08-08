const BASE_URL = "http://192.168.3.101:" 
const alias = {
  loginAuthenticate: "26000/netgate-user/loginAuthenticate",
  homeMessage: "14000/imatchOrder/bubble/homeMessage",

}
export default function(name) {
  return BASE_URL + alias[name]
}