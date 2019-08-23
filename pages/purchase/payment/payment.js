Page({
  data: {
    paymentMethods: {
      list: ["预存款支付", "信用额度支付", "转账支付","现金支付"],
      index:null
    }
  },
  onLoad: function(options) {},
  onReady: function() {},
  onShow: function() {},
  selectPaymentMethod(e){
    this.setData({
      ["paymentMethods.index"]: e.detail.value
    })
  }
})