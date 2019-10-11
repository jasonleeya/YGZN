let app = getApp()
Page({
  data: {
    goodList:[]
  },
  onLoad: function(options) {
    app.showToast("该功能尚未完善")
  },
  onShow: function() {

  },
  addGoods() {
    wx.navigateTo({
      url: '/pages/common/addGoods/addGoods'
    })
  }
})