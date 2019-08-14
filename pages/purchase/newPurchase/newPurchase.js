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

    orderId: "",
    supplier: "",
    supplyNo:"",

    buyer: "",
    receiver: "",
    phoneNumber: "",
    receiveAddress: "",
    receiveDate: ""

  },
  onLoad() {
    //验证登录
    app.checkLogin()
    this.initData()
    // this.store.data.newPurchase.receiveAddress = this.data.receiveAddress
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      receiveDate: nowDate
    })
  },
  onShow() {


    this.setData({
      goodsList: this.store.data.newPurchase.cartList,
      totalPrice: this.store.data.newPurchase.totalPrice,
    })
  },
  initData() {
    app.http("getOrderNo").then(data => {
      this.setData({
        orderId: data
      })
    })
    app.http("getDtfAddress", {}).then(data => {
      data.list.forEach(item => {
        if (item.dftStatus === "1") {
          this.setData({
           receiveAddress: "【" + item.province + "/" + item.city + "/" + item.area + "】" + item.address,
            receiver: item.consignee,
            phoneNumber: item.telephone,
          })
        }
      })
    })




  },
  //跳转选择供应商页面
  selectSupplier() {
    wx.navigateTo({
      url: '/pages/purchase/selectSupplier/selectSupplier',
      event: {
        someEvent(data) {
          console.log(data)
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
  dateChange(e) {
    this.setData({
      ["receiveDate"]: e.detail.value
    })
  },
  addAeceiveAddress() {
    wx.navigateTo({
      // url: '/pages/common/addReceiveAdress/addReceiveAdress?adress=' + this.data.receiveAddress +'&store=newPurchase.receiveAddress',
      url: '/pages/common/selectReceiveAddress/selectReceiveAddress'
    })
  },
  formSubmit(e) {
    var info = e.detail.value
    info.goods = this.store.data.newPurchase.cartList
    console.log(info)
  },
})