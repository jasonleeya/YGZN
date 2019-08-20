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
    totalAmount: 0,
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
    slectedStoreHouseId: "",
    showEditPop: false,

    popData: {},
    editingIndex: null
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
      goodsList: app.globalData.purchaseCartList,
      totalPrice: app.globalData.purchaseTotalPrice,
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
      url: '/pages/purchase/selectBuyer/selectBuyer?setData=buyer',
    })
  },

  //监听购物车组件信息的改变
  getChangeAmount(e) {
    // app.globalData.purchaseCartList[e.detail.index].goodsCount = e.detail.amount
    var index = e.detail.index
    this.setData({
      ["goodsList[" + index + "].goodsCount"]: e.detail.amount,
      ["goodsList[" + index + "].sttAmount"]: (parseInt(e.detail.amount) * parseFloat(this.data.goodsList[index].discountPrice)).toFixed(2)
    })
  },
  deleteGoods(e) {
    var list = this.data.goodsList
    list.splice(e.detail.index, 1)
    this.setData({
      goodsList: list
    })
    // app.globalData.purchaseCartList.splice(e.detail.index, 1)
  },
  priceAmountChange(e) {
    // app.globalData.purchaseTotalPrice = e.detail.totalPrice,
    //   app.globalData.purchaseTotalAmount = e.detail.totalAmount
    // console.log(app.globalData.purchaseTotalPrice, app.globalData.purchaseTotalAmount)
    this.setData({
      totalPrice: e.detail.totalPrice,
      totalAmount: e.detail.totalAmount
    })

  },
  getEditGoodsId(e) {
    var index = e.detail.index
    this.setData({
      editingIndex: index,
      showEditPop: true,
      popData: this.data.goodsList[index]
    })
  },
  getEditedInfo(e) {
    var totalPrice = 0
    var totalAmount = 0
    var index = this.data.editingIndex 
    var data = e.detail.data
    this.setData({
      showEditPop: false,
      popData: {},
      ["goodsList[" + index + "].goodsCount"]: data.goodsCount,
      ["goodsList[" + index + "].NTPSingle"]: data.NTPSingle,
      ["goodsList[" + index + "].NTP"]: data.NTP,
      ["goodsList[" + index + "].taxRate"]: parseFloat(data.taxRate),
      ["goodsList[" + index + "].discountPrice"]: data.discountPrice,
      ["goodsList[" + index + "].sttAmount"]: data.sttAmount,
    })
    this.data.goodsList.forEach(item => {
      totalPrice = (parseFloat(totalPrice) + parseFloat(item.discountPrice) * parseInt(item.goodsCount)).toFixed(2)
      totalAmount = parseInt(totalAmount) + parseInt(item.goodsCount)
    })
    this.setData({
      totalPrice: totalPrice
    })
    app.globalData.purchaseTotalPrice = totalPrice
    app.globalData.purchaseTotalAmount = totalAmount
  },

  dateChange(e) {
    this.setData({
      ["receiveDate"]: e.detail.value
    })
  },
  addAeceiveAddress() {
    wx.navigateTo({
      url: '/pages/common/selectReceiveAddress/selectReceiveAddress?setData=receiveAddress'
    })
  },
  formSubmit(e) {
    var info = e.detail.value
    info.list = app.globalData.purchaseCartList
    console.log(info)
  },
})