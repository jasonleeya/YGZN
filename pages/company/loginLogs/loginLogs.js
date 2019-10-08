let app = getApp()
Page({

  data: {
    logList: [],
    isLoad: false,
    pageNo: 1,
    pageSize: 10,
    totalPages: null
  },

  onLoad: function(options) {
    app.setTitle("登录日志")
    this.getList()
  },
  getList() {
    this.setData({
      isLoad:true
    })
    app.http("queryLoginLog", {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }).then(data => {
      data.list.forEach(item => {
        item.insertTime = item.insertTime.match(/\d+-\d+-\d+/)[0] + " " + item.insertTime.match(/\d+:\d+:\d+/)[0]
      })
      this.setData({
        logList: this.data.logList.concat(data.list),
        totalPages: data.totalPages,
        isLoad: false
      })
    })
  },
  onReachBottom: function() {
    if (this.data.pageNo > this.data.pageSize) {
      return
    }
    this.setData({
        pageNo:this.data.pageNo+1
    })
    this.getList()
  },

})