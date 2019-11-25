let app = getApp()
Page({
  data: {

  },
  onLoad: function(options) {
    this.login()

  },
  startNow() {
    this.login()
  },
  login() {
    let that = this
    wx.login({
      success(res) {
        if (res.code) {
          app.http2("loginAuthenticate", {
            username: res.code,
            loginType: 2
          }, true, false).then(data => {
            wx.setStorageSync("token", data.info)
            app.globalData.token = data.info

            app.http("getUserByCustNo", {
              flag: true
            }).then(data => {
              app.globalData.userInfo = data.list
              wx.setStorageSync("userInfo", data.list)
            }).catch(err => {
              app.showToast(err)
            })

            wx.redirectTo({
              url: '/pages/index/index'
            })


          }).catch(data => {
            wx.showModal({
              title: '',
              content: '请先绑定/注册账号',
              showCancel: false,
              success: function(res) {
                wx.navigateTo({
                  url: '/pages/login/login?openId=' + data.info,
                })
              }
            })
          })

        }
      },
      fail() {
        app.showToast("微信验证失败")
      }
    })
  }

})