let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
      wx.showModal({
        title: '请复制链接在浏览器中打开查看帮助文档',
        content: 'http://www.imatchas.com:20000/WebHelp/indexh.htm',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '复制链接',
        confirmColor: 'green',
        success: function(res) {
          if(res.cancel){
            wx.navigateBack()
            return}
          wx.setClipboardData({
            data: 'http://www.imatchas.com:20000/WebHelp/indexh.htm',
            success: function(res) {
                app.showToast("复制成功,请在浏览器中打开")
                setTimeout(()=>{
                  wx.navigateBack()
                },1500)
            }, 
          })
        } 
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})