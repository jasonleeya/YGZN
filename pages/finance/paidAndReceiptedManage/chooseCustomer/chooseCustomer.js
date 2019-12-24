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
      
      if (this.data.type==='payer'){
        var list = []
          data.list.forEach(item=>{
            list.push(item.customer)
        })
        this.setData({
          customerList: list
        })
      }else{
        this.setData({
          customerList: data.list
        })
      }
    
    })
  },
  selectCustomer(e){
   var pages=getCurrentPages()
   var prePage=pages[pages.length-2]
   if(this.data.type==='payer'){
     prePage.setData({
       ["infos.billCustNo"]: e.currentTarget.dataset.no,
       ["infos.billusername"]: e.currentTarget.dataset.name
     })
   }else{
     prePage.setData({
       ["infos.supplyNo"]: e.currentTarget.dataset.no,
       ["infos.supplyName"]: e.currentTarget.dataset.name
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