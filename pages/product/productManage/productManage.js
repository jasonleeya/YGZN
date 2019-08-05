import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    productList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    // console.log(this.store.data.productManage.productList)
    this.setData({
      productList:this.store.data.productManage.productList
    }) 
  },
  addProduct(){
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate?operateType=add',
    })
  },
  editProductInfo(e){
  wx.navigateTo({
    url: '/pages/product/productOperate/productOperate?operateType=edit&editId='+e.currentTarget.dataset.index,
  })
  }
})