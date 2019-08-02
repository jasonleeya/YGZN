// pages/product/productManage/productManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [{
      pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
      name: "三菱/通用型螺纹车刀片1",
      type: "MMT22R050APBU VP10MF",
      negotiablePrice: "79.00",
      sellingPrice: "99.00",
      stock: 10,
      quantifier:"片"
    }, {
        pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
        name: "三菱/通用型螺纹车刀片2",
        type: "MMT22R050APBU VP10MF",
        negotiablePrice: "79.00",
        sellingPrice: "99.00",
        stock: 120,
        quantifier: "片"
      }, {
        pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
        name: "三菱/通用型螺纹车刀片3",
        type: "MMT22R050APBU VP10MF",
        negotiablePrice: "79.00",
        sellingPrice: "99.00",
        stock: 20,
        quantifier: "片"
      }, {
        pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
        name: "三菱/通用型螺纹车刀片4",
        type: "MMT22R050APBU VP10MF",
        negotiablePrice: "79.00",
        sellingPrice: "99.00",
        stock: 100,
        quantifier: "片"
      }, {
        pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
        name: "三菱/通用型螺纹车刀片5",
        type: "MMT22R050APBU VP10MF",
        negotiablePrice: "79.00",
        sellingPrice: "99.00",
        stock: 10,
        quantifier: "片"
      }, {
        pic: "http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg",
        name: "三菱/通用型螺纹车刀片6",
        type: "MMT22R050APBU VP10MF",
        negotiablePrice: "79.00",
        sellingPrice: "99.00",
        stock: 10,
        quantifier: "片"
      }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  addProduct(){
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate',
    })
  },
})