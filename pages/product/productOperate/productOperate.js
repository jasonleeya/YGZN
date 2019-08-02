// pages/product/productOperate/productOperate.js
let app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quantifier: {
      list: ['个', '只','条'],
      picked: null,
    },
    uploadPicUrl: "",
    barCode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  pinkQuantifier: function(e) {
    this.setData({
      ["quantifier.picked"]: e.detail.value
    })
  },
  uploadPic() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          uploadPicUrl: res.tempFilePaths
        })
      }
    })
  },
  removePic() {
    this.setData({
      uploadPicUrl: ""
    })
  },
  scan() {
    let that = this
    wx.scanCode({
      success(res) {
        that.setData({
          barCode: res.result
        })
      },
      fail(res) {
        app.showToast("没有发现条形码")
      }
    })
  },
  formSubmit(e){
    console.log(e.detail.value)
  }
})