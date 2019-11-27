var app= getApp()
Page({
  data: {
    splitData:{},
    params:{},
    isSplit:false
  },
  onLoad: function (options) {
    app.setTitle("订单拆分信息")
    var pages=getCurrentPages()
    var splitData = pages[pages.length - 2].data.splitOrderData
    var params = pages[pages.length - 2].data.splitOrderParams
    this.setData({
      splitData,
      params
    })

  },
  confirmSplit(){
    app.http("allotOrderCommit",this.data.params).then(data=>{
      app.showToast("订单拆分成功，请完善订单信息")
     this.setData({
       isSplit:true
     })
    }).catch(err=>{
      app.showToast(err)
    })
  },
  cancel(){
    wx.navigateBack()
  },
  viewOrder(){
    wx.redirectTo({
      url: '/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=wait'
    })
  } 
})