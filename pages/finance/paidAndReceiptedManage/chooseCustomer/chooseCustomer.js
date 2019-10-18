let app = getApp()
Page({
  data: {
    searchValue:"",
    customerList:[]
  },
  onLoad: function(options) {
    app.setTitle("选择客户")
    this.getList()
  },
  getList(){
    app.http("queryCustomer", {
      pageSize: 1000,
      keyword: this.data.searchValue
    }).then(data=>{
      this.setData({
        customerList:data.list
      })
    })
  },
  selectCustomer(e){
   var pages=getCurrentPages()
   var prePage=pages[pages.length-2]
   prePage.setData({
     custNo: e.currentTarget.dataset.no,
     customerName: e.currentTarget.dataset.name
   })
   wx.navigateBack()
  },
  add(){
    wx.navigateTo({
      url: '/pages/index/mine/customerOperate/customerOperate?operateType=add',
    })
  },
  searchInput(e){
    this.setData({
      searchValue:e.detail.value
    })
    this.getList()
  }
})