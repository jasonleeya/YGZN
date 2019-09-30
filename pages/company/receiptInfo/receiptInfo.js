let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
receiptList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle("收款信息")
  }, 
  onShow: function () {
    app.http("getSupplyAccount").then(data=>{
      this.setData({
        receiptList:data.list
      })
    })
  },
add(){
  wx.navigateTo({
    url: "/pages/company/receiptInfo/receiptInfoOperate/receiptInfoOperate?operateType=add"
  })
},
edit(e){
  wx.navigateTo({
    url: "/pages/company/receiptInfo/receiptInfoOperate/receiptInfoOperate?operateType=edit&editIndex="+e.currentTarget.dataset.index
  })
}   
})