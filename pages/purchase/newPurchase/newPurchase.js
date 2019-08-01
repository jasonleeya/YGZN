import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalPrice: 0,
    infos: {
      orderId: "SPARK20197110001",
      supplier: "",
      buyer: "",
      receiver: "伊高智能",
      phoneNumber: "18888888888",
      receiveAddress: "四川省-成都市-成华区-建设路钻石广场3005",
      receiveDate: "2019-07-25"
    }
  },
  onLoad() {
    //验证登录
    app.checkLogin()
    this.store.data.newPurchase.receiveAddress = this.data.infos.receiveAddress
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      ["infos.receiveDate"]: nowDate
    })
  },
  onShow() {
   
    if (this.store.data.newPurchase.supplier.length !== 0) {
      this.setData({
        ["infos.supplier"]: this.store.data.newPurchase.supplier.company //从store中获取供应商信息
      })
    }
    this.setData({
      goodsList: this.store.data.newPurchase.cartList,
      totalPrice: this.store.data.newPurchase.totalPrice,
      ["infos.buyer"]: this.store.data.newPurchase.buyer,
      ["infos.receiveAddress"]: this.store.data.newPurchase.receiveAddress
    }) 
  },
  //跳转选择供应商页面
  selectSupplier() {
    wx.navigateTo({
      url: '/pages/purchase/selectSupplier/selectSupplier',
      event: {
        chooseSupplier(data) {
          console.log(data.id)
        }
      }
    })
  },
  selectBuyer() {
    wx.navigateTo({
      url: '/pages/purchase/selectBuyer/selectBuyer',
    })
  },

  //监听购物车组件信息的改变
  getChangedData(e) {
    var store = this.store.data.newPurchase
    var data = e.detail
    store.cartList = data.goodsList,
      store.totalPrice = data.totalPrice,
      store.totalAmount = data.totalAmount
  },
  dateChange(e){
  this.setData({
    ["infos.receiveDate"]: e.detail.value
    })
  },
  addAeceiveAddress() {
    wx.navigateTo({
      url: '/pages/purchase/addReceiveAdress/addReceiveAdress?adress=' + this.data.infos.receiveAddress,
    })
  },
  confirmOrder() {
    console.log(this.data.infos)
  },
})