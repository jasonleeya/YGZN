//app.js
import urls from "./utils/urls.js"
App({
  globalData: {
    token: "",
    userInfo: null 
  },
  showToast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  checkLogin(){
    // wx.checkSession({
    //   success: function () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //   },
    //   fail: function () {

    //     wx.redirectTo({
    //       url: '/pages/login/login',
    //     })
    //   }
    // })

    if (!wx.getStorageSync("token")) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },
 
  http(alias, data={},isShowLogs=false){
    var token = wx.getStorageSync("token")
    data.token=token
    
    if (isShowLogs){
      console.log("%c请求接口:" + alias, "font-weight:bold;font-size:1rem", data)
    }
    
    return new Promise(function (resolve, reject) {
      wx.request({
        url: urls(alias),
        method: 'POST',
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          // 'token': token
        },
        success: function (res) {
          if (res.statusCode != 200) {
            reject('服务器忙，请稍后重试');
            return;
          } 
          if (res.data.success===false){
            reject(res.data.info);
            return;
          }
          if (isShowLogs) {
            console.log("%c" + alias, "font-weight:bold;font-size:1rem", res.data)
          }
          resolve(res.data);
        },
        fail: function (res) {
          reject('网络错误');
        },
        complete: function (res) {
        }
      })
    })
  }
 

})