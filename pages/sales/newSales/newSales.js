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
    customerName: null,
    customerNo: null,
    custNo: null,
    storehouse: {
      list: [],
      idList: [],
      index: 0
    },
    slectedStoreHouseId: "",
    orderId: "",
    customer: "",
    seller: "",
    receiver: "",
    phoneNumber: "",
    receiveAddress: "",
    receiveDate: "",
    address: "",
    region: '',
    addressDetail: "",
    operateType:""
  },

  onLoad() {
    //验证登录
    app.checkLogin()
    this.initData()

    var date = new Date()
    var receiveDate = null
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var monthLength = new Date(year, month, 0).getDate()
    if (day + 4 <= monthLength) {
      day = day + 4
    } else {
      day = 4 - (monthLength - day)
      if (month === 12) {
        month = 1
        year = year + 1
      } else {
        month = month + 1
      }
    }
    receiveDate = year + "-" + month + "-" + day
    this.setData({
      receiveDate: receiveDate
    })
  },
  onShow() {
    var cartList = app.globalData.salesCartList
    var totalPrice = 0
    cartList.forEach(item => {
      totalPrice = parseFloat(totalPrice) + parseFloat(item.sttAmount)
    })

    this.setData({
      goodsList: cartList,
      totalPrice: totalPrice
    })


    if (this.data.customerNo) {
      app.http("getDftAddress", {
        customerNo: this.data.customerNo
      }).then(data => {
        if (data.list.length === 0) {
          return
        }
        var address = data.list[0]
        this.setData({
          region: [address.province, address.city, address.area],
          addressDetail: address.address
        })
      })
    }
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
        ["storehouse.idList"]: idList,
      })
      this.setData({
        slectedStoreHouseId: this.data.storehouse.idList[0]
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
  toAddGoods() {
    if (this.data.customerNo === null) {
      app.showToast("请先选择客户")
      return
    }

    wx.navigateTo({
      url: "/pages/sales/addGoods/addGoods?custNo=" + this.data.custNo
    })

  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  //监听购物车组件信息的改变
  getChangeAmount(e) {
    var goods = app.globalData.salesCartList[e.detail.index]
    var amount = e.detail.amount
    goods.goodsCount = amount
    goods.sttAmount = (parseInt(amount) * parseFloat(goods.discountPrice)).toFixed(2)
    goods.NTP = (parseInt(amount) * parseFloat(goods.NTPSingle)).toFixed(2)
  },
  deleteGoods(e) {
    app.globalData.salesCartList.splice(e.detail.index, 1)
    this.setData({
      goodsList: app.globalData.salesCartList
    })
  },
  priceAmountChange(e) {
    app.globalData.salesTotalPrice = e.detail.totalPrice
    app.globalData.salesTotalAmount = e.detail.totalAmount
    // console.log(app.globalData.salesTotalPrice, app.globalData.salesTotalAmount)
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
    var data = e.detail.data
    data.billingAmount = parseFloat(data.facePrice) * parseInt(data.goodsCount)

    var goodsDiscount = (parseFloat(data.NTPSingle) / parseFloat(data.facePrice)).toFixed(2)
    if (goodsDiscount > 1 || String(goodsDiscount) === 'Infinity' || isNaN(goodsDiscount)) {
      goodsDiscount = 1
    }
    data.goodsDiscount = goodsDiscount


    this.setData({
      showEditPop: false,
      popData: {},
      ["goodsList[" + this.data.editingIndex + "]"]: data
    })


    this.data.goodsList.forEach(item => {
      totalPrice = (parseFloat(totalPrice) + parseFloat(item.discountPrice) * parseInt(item.goodsCount)).toFixed(2)
      totalAmount = parseInt(totalAmount) + parseInt(item.goodsCount)
    })
    this.setData({
      totalPrice: totalPrice
    })
    app.globalData.salesTotalPrice = totalPrice
    app.globalData.salesTotalAmount = totalAmount
  },






  dateChange(e) {
    this.setData({
      receiveDate: e.detail.value
    })
  },
  addAeceiveAddress() {
    wx.navigateTo({
      url: '/pages/common/addReceiveAdress/addReceiveAdress?adress=' + this.data.receiveAddress + "&store=newSales.receiveAddress",
    })
  },
  obtianOperateType(e) {
    this.setData({
      operateType: e.target.dataset.type
    })
  },
  formSubmit(e) { 
    var info = e.detail.value
    var data = this.data
    var list = app.globalData.salesCartList
    var billingAmount = 0
    list.forEach(item => {
      billingAmount += parseFloat(item.billingAmount)
    })

    if (!data.custNo) {
      app.showToast("请选择客户")
      return
    }
    if (!data.seller) {
      app.showToast("请选择销售员")
      return
    }
    // if (!info.storehouse) {
    //   app.showToast("请选择仓库")
    //   return
    // }
    if (!info.region||!info.addressDetail) {
      app.showToast("请填写收货地址")
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
        custNo: data.custNo,
        custName: info.custName,
        sellSalesMan: data.seller,
        insertDate: new Date().toISOString(), //
        deliveryDate: new Date(info.receiveDate).toISOString(), //
        billingAmount: billingAmount, //
        orderStatus: operateType === 'save' ?'090001':'090003', //
        sttAmount: app.globalData.salesTotalPrice, //
        sttMode: '', //
        remark: info.remark,
        buyOperator: wx.getStorageSync("userInfo")[0].userName,
        auditor: '', //
        oando: 'down', //---
        getGoodsDate: info.receiveDate,
        hdGoods: '0', //
        lgtNums: info.lgtNums, //
        cpdOrder: '', //
        saleWarehouse: data.slectedStoreHouseId, //---
        invoice: '0003', //
        orderTypeChoose: '01', //
        logisticsCost: parseFloat(info.logisticsCost).toFixed(2), //
        consignor: '', //
        reflect: '0' //
      }]),
      list: JSON.stringify(list),
      tBusAddress: JSON.stringify([{
        orderNo: info.orderId,
        consigneeName: info.receiver,
        address: "【" +info.region+ "】" + info.addressDetail,
        telephone: info.phoneNumber
      }]),
      isOrNotReduceGoodsNum: 'no',
      beforeGoodsNum: "",
      beforeWareHouse: "",
    }
    app.http("saveSaleOrderUpperAndLower",paramas,true)
  },

})