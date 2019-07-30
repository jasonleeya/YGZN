//app.js
App({
  globalData: {
    token: "",
    userInfo: null,
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

    if (!wx.getStorageSync("token") && !this.globalData.token) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  }
})