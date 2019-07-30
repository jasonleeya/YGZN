import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    date: '2019-07-25',
    region: ['北京市', '北京市', '东城区'],
    goodsList: [],
    totalPrice: 0,
    infoList: {
      orderId:"SPARK20197110001",
      supplier:"",
      buyer:"",
      receiver:"伊高智能",
      phoneNumber:"18888888888",
      receiveAddress:"北京/东城区/建设路100号",
      receiveDate:"2019-07-25"
    }
  },
  onLoad() {
    app.checkLogin()
  },
  onShow: function() {
    this.setData({
      goodsList: this.store.data.newPurchase.cartList,
      totalPrice: this.store.data.newPurchase.totalPrice
    })
  },
  selectSupplier() {
    wx.navigateTo({
      url: '/pages/purchase/selectSupplier/selectSupplier',
    })
  },
  confirmOrder() {
    console.log(this.store.data.newPurchase.cartList)
  },
  getChangedData(e) {
    var store = this.store.data.newPurchase
    var data = e.detail
    store.cartList = data.goodsList,
      store.totalPrice = data.totalPrice,
      store.totalAmount = data.totalAmount
  }
})