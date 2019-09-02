// pages/common/LogisticsInfo/LogisticsInfo.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    expName: "",
    lgtNums: "4300191466177",
    statusStr: "未知"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("物流信息")
    app.http("getLogistics", {
      lgtNums: this.data.lgtNums
    }).then(data => {
      this.setData({
        expName: data.result.expName
      })
      var list = data.result.list
      list.forEach(item => {
        item.dayStr = new Date(item.time).toLocaleDateString().substr(5, 8).replace("/", "-")
        item.timeStr = new Date(item.time).toTimeString().substr(0, 8)
      })
      this.setData({
        list: list
      })
      var status = list[0].status
      if (status.search("签收") > 0) {
        this.setData({
          statusStr: '已签收'
        })
      }
      if (status.search("派件员") > 0) {
        this.setData({
          statusStr: '派送中'
        })
      }
      if (status.search("发往") > 0) {
        this.setData({
          statusStr: '运输中'
        })
      }
      if (status.search("揽收") > 0) {
        this.setData({
          statusStr: '已揽件'
        })
      }
      if (status.search("包裹等待揽收") > 0) {
        this.setData({
          statusStr: '已发货'
        })
      }
     
    })
  },

})