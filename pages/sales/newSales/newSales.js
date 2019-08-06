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
    storehouse: {
      list: ["仓库一", "仓库二", "仓库三", "仓库四" ],
      index:null
    },
    infos: {
      orderId: "SPARK20197110001",
      customer: "",
      seller: "",
      storehouse: "",
      receiver: "伊高智能",
      phoneNumber: "18888888888",
      receiveAddress: "【四川省/成都市/成华区】建设路钻石广场3005",
      receiveDate: "2019-07-25",
    }
  },
  onLoad() {
    //验证登录
    app.checkLogin()

    this.store.data.newSales.receiveAddress = this.data.infos.receiveAddress
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      ["infos.receiveDate"]: nowDate
    })
  },
  onShow() {
    if (this.store.data.newSales.customer.length !== 0) {
      this.setData({
        ["infos.customer"]: this.store.data.newSales.customer.primaryContact
      })
    }
    this.setData({
      goodsList: this.store.data.newSales.cartList,
      totalPrice: this.store.data.newSales.totalPrice,
      ["infos.seller"]: this.store.data.newSales.seller,
      ["infos.receiveAddress"]: this.store.data.newSales.receiveAddress
    })
  },
  //跳转选择供应商页面
  selectCustomer() {
    wx.navigateTo({
      url: '/pages/sales/selectCustomer/selectCustomer',
    })
  },
  selectSeller() {
    wx.navigateTo({
      url: '/pages/sales/selectSeller/selectSeller',
    })
  },
   

  //监听购物车组件信息的改变
  getChangedData(e) {
    var store = this.store.data.newSales
    var data = e.detail
    store.cartList = data.goodsList,
      store.totalPrice = data.totalPrice,
      store.totalAmount = data.totalAmount
  },
  dateChange(e) {
    this.setData({
      ["infos.receiveDate"]: e.detail.value
    })
  },
  addAeceiveAddress() {
    wx.navigateTo({
      url: '/pages/common/addReceiveAdress/addReceiveAdress?adress=' + this.data.infos.receiveAddress +"&store=newSales.receiveAddress",
    })
  },
  formSubmit(e) {
    var info = e.detail.value
    info.goods = this.store.data.newSales.cartList
    console.log(info)
  },
  selectStorehouse: function(e) {
    this.setData({
      ["storehouse.index"]: e.detail.value
    })
  },
})