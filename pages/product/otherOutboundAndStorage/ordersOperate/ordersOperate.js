let app = getApp()
Page({
  data: {
    cartList:[],
    totalAmount:0,
    totalPrice:0
  },
  onLoad: function(options) {
    app.showToast("该功能尚未完善")
  },
  onShow: function() {
   
  },
  addGoods() {
    wx.navigateTo({
      url: '/pages/product/otherOutboundAndStorage/addGoods/addGoods?needTypes=false'
    })
  },
  editGoodsInfo(e){
    console.log(e.detail.index)
  },
  goodsCountChange(e){  
    this.setData({
      ["cartList[" + e.detail.index + "].qty"]: e.detail.amount
    })
  }
})