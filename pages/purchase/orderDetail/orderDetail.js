// pages/purchase/orderDetail/orderDetail.js\
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalPrice: "",
    totalAmount: "",
    infos: {},
    canEdit: false,
    purchaseWarehouse: null,
    buyer: null,
    storehouse: {
      list: [],
      idList: [],
      index: null
    },
    showEditPop: false,
    popData: {},
    editingIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    //验证登录
    app.checkLogin()
    app.http("queryByOrderNo", {
      orderNo: options.orderNo
    }, false, false).then(data => {
      this.setData({
        infos: Object.assign(data.infoBody.address, data.infoBody.upp),
        goodsList: data.infoBody.lows,
        purchaseWarehouse: data.infoBody.upp.purchaseWarehouse,
        totalPrice: data.infoBody.upp.sttAmount
      })

      app.http("getWarehouse").then(wareHouse => {
        var list = []
        var idList = []
        var index = null
        wareHouse.list.forEach(item => {
          list.push(item.name)
          idList.push(item.tableKey)

          if (item.tableKey === this.data.purchaseWarehouse) {

            index = wareHouse.list.indexOf(item)
          }
        })
        this.setData({
          ["storehouse.list"]: list,
          ["storehouse.idList"]: idList
        })
        this.setData({
          ["storehouse.index"]: index
        })
      })
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  orderLogs() {
    wx.navigateTo({
      url: '/pages/purchase/orderLogs/orderLogs',
    })
  },
  selectStorehouse: function(e) {
    this.setData({
      ["storehouse.index"]: e.detail.value,
      slectedStoreHouseId: this.data.storehouse.idList[e.detail.value]
    })
  },
  edit() {
    if (this.data.infos.orderStatus === "wait" || this.data.infos.orderStatus === "090001") {
      this.setData({
        canEdit: true
      })
    }
  },
  // {{(canEdit&&infos.orderStatus==='wait')||(canEdit&&infos.orderStatus==='090001'&&infos.oando==='down')?'':'text-gray'}}
  selectBuyer() {
    if (!this.data.canEdit || (!this.data.canEdit && this.data.infos.orderStatus === '090001' && this.data.infos.oando === 'down')) {
      return
    }
    wx.navigateTo({
      url: '/pages/purchase/selectBuyer/selectBuyer?setData=infos.buySalesMan',
    })
  },

  addAeceiveAddress() {
    if (!this.data.canEdit) {
      return
    }
    wx.navigateTo({
      url: '/pages/common/selectReceiveAddress/selectReceiveAddress?setData=infos.address'
    })
  },
  dateChange(e) {
    this.setData({
      ["infos.receiveTime"]: e.detail.value
    })
  },


  getEditGoodsId(e) {
    if (!this.data.canEdit) {
      return
    }
    var index = e.detail.index
    this.setData({
      editingIndex: index,
      showEditPop: true,
      popData: this.data.goodsList[index]
    })
  },
  getEditedInfo(e) {
    if (!this.data.canEdit) {
      return
    }
    var totalPrice = 0
    var totalAmount = 0
    e.detail.data.taxRate = parseFloat(e.detail.data.taxRate)
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


  getChangeAmount(e) {
    if (!this.data.canEdit) {
      return
    }
    // app.globalData.purchaseCartList[e.detail.index].goodsCount = e.detail.amount
    var index = e.detail.index
    this.setData({
      ["goodsList[" + index + "].goodsCount"]: e.detail.amount,
      ["goodsList[" + index + "].sttAmount"]: (parseInt(e.detail.amount) * parseFloat(this.data.goodsList[index].discountPrice)).toFixed(2)
    })
  },
  deleteGoods(e) {
    if (!this.data.canEdit) {
      return
    }
    var list = this.data.goodsList
    list.splice(e.detail.index, 1)
    this.setData({
      goodsList: list
    })
  },
  priceAmountChange(e) {
    if (!this.data.canEdit) {
      return
    }
    this.setData({
      totalPrice: e.detail.totalPrice,
      totalAmount: e.detail.totalAmount
    })
  },
})