let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    logList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle(options.orderTypes+"订单日志")
    app.http("findLogginByOrder", {
      orderNo: options.orderNo
    }).then(data => {
      var list = data.infoBody
      list.forEach(item => {
        var date = new Date(item.insertDate)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        item.insertDate= [year, month, day].join('-') + ' ' + [hour, minute, second].join(':') 

        item.logExplain = item.logExplain.replace(/\<\/i\>\ ,/g,"</i>,<br/><br/>")
        item.logExplain = item.logExplain.replace(/从\<i\>/g, "从<i class='text-red'>")
        item.logExplain = item.logExplain.replace(/修改为\<i\>/g, "修改为<i class='text-green'>")
        item.logExplain = item.logExplain.replace(/(.*),/, '$1。')
       

      })
      this.setData({
        logList: list
      })
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