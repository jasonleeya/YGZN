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
    customerType: "",

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
    var cartList = app.globalData.purchaseCartList
    var totalPrice = 0
    cartList.forEach(item => {
      totalPrice = parseFloat(totalPrice) + parseFloat(item.sttAmount)
    })

    this.setData({
      goodsList: app.globalData.purchaseCartList,
      totalPrice: totalPrice
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
      url: "/pages/purchase/addGoods/addGoods?store=newPurchase&supplyNo=" + this.data.supplyNo + "&wareId=" + this.data.slectedStoreHouseId,
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
    app.globalData.purchaseCartList[e.detail.index].goodsCount = e.detail.amount
  },
  deleteGoods(e) {
    var list = this.data.goodsList
    list.splice(e.detail.index, 1)
    this.setData({
      goodsList: list
    })
    app.globalData.purchaseCartList.splice(e.detail.index, 1)
  },
  priceAmountChange(e) {
    app.globalData.purchaseTotalPrice = e.detail.totalPrice
    app.globalData.purchaseTotalAmount = e.detail.totalAmount
    // console.log(app.globalData.purchaseTotalPrice, app.globalData.purchaseTotalAmount)
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
    this.setData({
      showEditPop: false,
      popData: {},
      ["goodsList[" + this.data.editingIndex + "]"]: e.detail.data
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
      url: '/pages/common/selectReceiveAddress/selectReceiveAddress?addressKey=receiveAddress&phoneNumberKey=phoneNumber&receiverKey=receiver'
    })
  },
  formSubmit(e) {
    var info = e.detail.value
    var data = this.data
    var list = app.globalData.purchaseCartList

    if (!info.supplier) {
      app.showToast("请选择供应商")
      return
    }
    if (!info.buyer) {
      app.showToast("请选择采购员")
      return
    }
    if (!info.storehouse) {
      app.showToast("请选择仓库")
      return
    }
    if (!info.receiveAddress) {
      app.showToast("请选择收货地址")
      return
    }
    if (!info.receiver) {
      app.showToast("请填写收货人姓名")
      return
    }
    if (!info.phoneNumber) {
      app.showToast("请填写收货人电话号")
      return
    }
    if (list.length === 0) {
      app.showToast("请先添加商品")
      return
    }

    var paramas = {
      upperpartOrder: JSON.stringify([{
        orderNo: info.orderId,
        supplyNo: data.supplyNo,
        supplyName: info.supplier,  
        buySalesMan: info.buyer,
        insertDate: "", //*
        deliveryDate: null, //*
        billingAmount: "0.00", //*
        orderStatus: "wait",
        sttAmount: data.totalPrice,
        sttMode: "--选择结算方式--", //*
        remark: info.remark,
        adsaleWay: "", //  *           
        adsaleWayAcct: "", //*
        adsalePerson: "", //*
        buyOperator: wx.getStorageSync("userInfo")[0].userName,
        auditor: "", //*
        oando: data.customerType === "1003" ? "up" : "down",
        getGoodsDate: info.receiveDate,
        hdGoods: "", //*
        lgtNums: "", //*
        cpdOrder: "", //*
        purchaseWarehouse: data.storehouse.idList[data.storehouse.list.indexOf(data.storehouse.list.filter(item => {
          return info.storehouse === item
        })[0])],
        invoice: "0003", //*
        orderTypeChoose: "01", //*
        consignee: info.receiver,
        reflect: 0 //
      }]),
      list: JSON.stringify(list),
      tBusAddress: JSON.stringify([{
        orderNo: info.orderId,
        consigneeName: info.receiver,
        address: info.receiveAddress,
        telephone: info.phoneNumber
      }]),
      isIncreaseGoodsNum: "no", //*
      beforeGoodsNum: "", //*
      beforeWareHouse: "" //*
    }
    app.http("savePurchaseOrderUpperAndLower", paramas, true)
  },
})