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
    approveStatus:"",
    buyer: "",
    receiver: "",
    phoneNumber: "",
    receiveAddress: "",
    receiveDate: "",
    storehouse: {
      list: [],
      idList: [],
      index: 0
    },
    slectedStoreHouseId: "",
    showEditPop: false,

    popData: {},
    editingIndex: null,
    isLoad: false,
    operateType: null,
  },
  onLoad() {
    app.setTitle("新增采购")
 
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
    var cartList = app.globalData.purchaseCartList
    var totalPrice = 0
    cartList.forEach(item => {
      totalPrice = parseFloat(totalPrice) + parseFloat(item.sttAmount)
    })

    this.setData({
      goodsList: app.globalData.purchaseCartList,
      totalPrice: totalPrice.toFixed(2)
    })
  },
  toAddGoods() {
    if (this.data.supplyNo === "") {
      app.showToast("请先选择供应商")
      return
    }

    wx.navigateTo({
      url: "/pages/purchase/addGoods/addGoods?store=newPurchase&supplyNo=" + this.data.supplyNo + "&wareId=" + this.data.slectedStoreHouseId,
    })



  },
  initData() {
    app.globalData.purchaseCartList = []
    app.globalData.purchaseTotalPrice = 0
    app.globalData.purchaseTotalAmount = 0
    
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
        slectedStoreHouseId: idList[0]
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
    var goods = app.globalData.purchaseCartList[e.detail.index]
    var amount = e.detail.amount
    goods.goodsCount = amount
    goods.sttAmount = (parseInt(amount) * parseFloat(goods.discountPrice)).toFixed(2)
    goods.NTP = parseInt(amount) * parseFloat(goods.NTPSingle)
    goods.billingAmount = (parseInt(amount) * parseFloat(goods.facePrice)).toFixed(2)


  },
  deleteGoods(e) {
 
   
    app.globalData.purchaseCartList.splice(e.detail.index, 1)
    this.setData({
      goodsList: app.globalData.purchaseCartList
    })


  },
  priceAmountChange(e) {
    app.globalData.purchaseTotalPrice = e.detail.totalPrice
    app.globalData.purchaseTotalAmount = e.detail.totalAmount
  },
  operate(e) {
    var index = e.detail.index
    this.setData({
      editingIndex: index,
      showEditPop: true,
      popData: this.data.goodsList[index]
    })
  },
  goodsDetail(e) {
    console.log(e)
    var index = e.detail.index  
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate?operateType=view&orderType=purchase&goodsNo=' + this.data.goodsList[index].goodsNo + "&wareKey=" + this.data.slectedStoreHouseId
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
    app.globalData.purchaseTotalPrice = totalPrice
    app.globalData.purchaseTotalAmount = totalAmount
  },
  closePop(){
    this.setData({
      showEditPop:false
    })
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
  obtianOperateType(e) {
    this.setData({
      operateType: e.target.dataset.operateType
    })
  },
  formSubmit(e) {
    var info = e.detail.value
    var data = this.data
    var list = app.globalData.purchaseCartList
    var operateType = this.data.operateType
    var billingAmount = 0
    list.forEach(item=>{
      billingAmount += parseFloat(item.billingAmount)
    })
   

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



    var params = {
      upperpartOrder: JSON.stringify([{
        orderNo: info.orderId,
        supplyNo: data.supplyNo,
        supplyName: info.supplier,
        buySalesMan: info.buyer,
        insertDate: new Date().toISOString(), //*
        deliveryDate: null, //*
        billingAmount: billingAmount, //*
        orderStatus: operateType === 'save' ? "wait" : '090001',
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
        purchaseWarehouse: data.slectedStoreHouseId,
        invoice: "0003", //*
        orderTypeChoose: "01", //*
        consignee: info.receiver,
        reflect: 0, //
        logisticsCost: parseFloat(info.logisticsCost).toFixed(2)
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
    this.setData({
      isLoad: true
    })
// console.log(params)
//     this.setData({
//       isLoad: false
//     })
// return

    app.http("savePurchaseOrderUpperAndLower", params, true).then(() => {
        app.showToast("添加成功")
        this.setData({
          isLoad: false
        })
        app.globalData.purchaseCartList = []
        app.globalData.purchaseTotalPrice = 0
        app.globalData.purchaseTotalAmount = 0

        wx.redirectTo({
          url: '/pages/purchase/orderDetail/orderDetail?orderNo=' + this.data.orderId,
        })
      })
      .catch((e) => {
        app.showToast(e)
      })
  },
})