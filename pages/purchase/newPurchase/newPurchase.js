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
    supplyNo: "",

    buyer: "",
    receiver: "",
    phoneNumber: "",
    receiveAddress: "",
    receiveDate: "",
    storehouse: {
      list: [],
      idList: [],
      index: null
    },
    slectedStoreHouseId: ""
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
  toSearch() {
    if (this.data.supplyNo === "") {
      app.showToast("请先选择供应商")
      return
    }
    if (this.data.slectedStoreHouseId === "") {
      app.showToast("请先选择仓库")
      return
    }

    wx.navigateTo({
      url: "/pages/common/addGoods/addGoods?store=newPurchase&supplyNo=" + this.data.supplyNo + "&wareId=" + this.data.slectedStoreHouseId,
    })



  },
  initData() {
    app.http("getOrderNo").then(data => {
      this.setData({
        orderId: data
      })
    })
    app.http("getWarehouse").then(data => {
      var list = []
      var idList = []
      data.list.forEach(item => {
        list.push(item.name)
        idList.push(item.tableKey)
      })
      this.setData({
        ["storehouse.list"]: list,
        ["storehouse.idList"]: idList
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

  selectStorehouse: function(e) {
    this.setData({
      ["storehouse.index"]: e.detail.value,
      slectedStoreHouseId: this.data.storehouse.idList[e.detail.value]
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