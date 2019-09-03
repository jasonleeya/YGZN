let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this
    wx.login({
      success(res) {
        if (res.code) {
          app.http("loginAuthenticate", {
            username: res.code,
            loginType: 2
          }, true, false).then(data => {
            console.log(data)
            if (data.success === false) {
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
            } else {
              wx.setStorageSync("token", data.info)
              app.globalData.token = data.info
              wx.redirectTo({
                url: '/pages/index/index'
              })

              app.http("getUserByCustNo", {
                flag: true
              }).then(data => {
                app.globalData.userInfo = data.list
                wx.setStorageSync("userInfo", data.list)
              })




            }
          })

        } else {
          app.showToast("微信验证失败")
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})