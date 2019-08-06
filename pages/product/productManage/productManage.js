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
  },
  deleteItem(e){
    this.store.data.productManage.productList.splice(e.currentTarget.dataset.index,1)
   this.setData({
     productList: this.store.data.productManage.productList
   })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    if (Math.abs(e.touches[0].pageX - this.data.ListTouchStart) > 40) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 40 ? 'right' : 'left'
      })
    }

  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
      console.log(this.data.modalName)
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})