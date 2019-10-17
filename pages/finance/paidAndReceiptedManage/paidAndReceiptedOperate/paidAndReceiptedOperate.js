let app =getApp()
Page({ 
  data: {
    custNo:"",
    customerName:""
  }, 
  onLoad: function (options) {

  }, 
  onShow: function () {

  } ,
  chooseCustomer(){
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/chooseCustomer/chooseCustomer' 
    })
  }
})