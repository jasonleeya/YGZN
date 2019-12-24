let app=getApp()
Page({ 
  data: {
    list:[],
    curPage:1,
    totalPages:0,
    isLoading:false
  }, 
  onLoad: function (options) {
    app.setTitle("库存预警")
   this.getList()
  }, 
  getList(){
    this.setData({
      isLoading:true
    })
    app.http("fetchCautionStock", {
      pageSize: 10,
      pageNo: this.data.curPage
    }).then(data => {
      this.setData({
        isLoading:false,
        list: this.data.list.concat(data.list),
        totalPages: data.totalPages
      })
    })
  },
  onReachBottom() {
    if (this.data.isLoading || this.data.curPage >= parseInt(this.data.totalPages)){
      app.showToast("没有更多了")
      return
    }
    this.setData({
        curPage:this.data.curPage+1
    })
    this.getList()
  },
})
