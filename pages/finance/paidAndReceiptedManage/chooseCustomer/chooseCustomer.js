let app = getApp()
Page({
  data: {
    searchValue:"",
    customerList:[],
    type:""
  },
  onLoad: function(options) {
    app.setTitle("选择客户")
    this.setData({
      type:options.type
    })
    this.getList()
  },
  getList(){
    app.http(this.data.type === 'payer' ? 'queryCustomer' :'getPurchasingSupplyNew', {
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
   if(this.data.type==='payer'){
     prePage.setData({
       payerNo: e.currentTarget.dataset.no,
       payerName: e.currentTarget.dataset.name
     })
   }else{
     prePage.setData({
       receiverNo: e.currentTarget.dataset.no,
       receiverName: e.currentTarget.dataset.name
     })
   }
 
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