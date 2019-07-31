// pages/purchase/orderDetail/orderDetail.js\
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [{
      amount: 10,
      containTaxPrice: 606.45,
      id: "1",
      name: "三菱/通用型螺纹车刀片1",
      noTaxPrice: "666.00",
      pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
      stock: 1,
      taxRate: 13,
      totalPrice: "752.58",
      type: " MMT22R050APBU VP10MF",
    }, {
      amount: 20,
      containTaxPrice: 606.45,
      id: "2",
      name: "三菱/通用型螺纹车刀片2",
      noTaxPrice: "666.00",
      pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
      stock: 1,
      taxRate: 13,
      totalPrice: "752.58",
      type: " MMT22R050APBU VP10MF",
    }],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function(options) {
    //验证登录
    app.checkLogin()
    var id = options.id

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
 
})