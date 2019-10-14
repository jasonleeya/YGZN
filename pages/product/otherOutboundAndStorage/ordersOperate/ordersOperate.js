let app = getApp()
Page({
  data: {
    cartList: [],
    totalAmount: 0,
    totalPrice: 0,
    showPop: false,
    popData: {},
    popDataCopy: {},
    editIndex: null,
    storageDate: "",
    warehouse: {
      index: 0,
      list: [],
      idList: []
    }
  },
  onLoad: function(options) {
    app.showToast("该功能尚未完善")
    this.setData({
      operateType: options.operateType
    })
    if (options.operateType === "edit") {
      this.setData({
        editId:options.editId
      })
      app.http("findAllDataById", {
        id: options.editId
      }).then(data => {

      })


    }
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
    this.setData({
      storageDate: nowDate
    })

    app.http("getWarehouse").then(data => {
      var list = []
      var idList = []
      data.list.forEach(item => {
        list.push(item.name)
        idList.push(item.tableKey)
      })
      this.setData({
        ["warehouse.list"]: list,
        ["warehouse.idList"]: idList
      })
    })
  },
  onShow: function() {

  },
  addGoods() {
    wx.navigateTo({
      url: '/pages/product/otherOutboundAndStorage/addGoods/addGoods?needTypes=false'
    })
  },
  editGoodsInfo(e) {
    this.setData({
      showPop: true,
      popData: this.data.cartList[e.detail.index],
      editIndex: e.detail.index
    })
  },
  getEditInfo(e) {
    this.setData({
      showPop: false,
      ["cartList[" + this.data.editIndex + "]"]: e.detail.data
    })
    var totalAmount = 0
    var totalPrice = 0
    var cartList = this.data.cartList

    cartList.forEach(item => {
      totalAmount = parseInt(totalAmount) + parseInt(item.qty)
      totalPrice = parseFloat(totalPrice) + parseFloat(item.totalPrice)
    })
    this.setData({
      totalAmount,
      totalPrice
    })
  },
  dateChange(e) {
    this.setData({
      storageDate: e.detail.value
    })
  },
  warehouseChange(e) {
    this.setData({
      ["warehouse.index"]: e.detail.value
    })
  },
  goodsCountChange(e) {
    var index = e.detail.index
    var amount = e.detail.amount
    var cartList = this.data.cartList
    var totalAmount = 0
    var totalPrice = 0


    this.setData({
      ["cartList[" + index + "].qty"]: e.detail.amount,
      ["cartList[" + index + "].totalPrice"]: (parseFloat(this.data.cartList[index].price) * amount).toFixed(2),
      ["cartList[" + index + "].noTaxTotal"]: (parseFloat(this.data.cartList[index].noTaxPrice) * amount).toFixed(2)
    })
    cartList.forEach(item => {
      totalAmount = parseInt(totalAmount) + parseInt(item.qty)
      totalPrice = parseFloat(totalPrice) + parseFloat(item.totalPrice)
    })

    this.setData({
      totalAmount,
      totalPrice
    })
  },
  submit(e) {
    var formData = e.detail.value
    var params = {}
    var cartList = this.data.cartList
    cartList.forEach(item => {
      delete item.imgPath
      delete item.brandName
      delete item.productName
      delete item.brandCode
    })
    formData.wareKey = this.data.warehouse.idList[formData.wareKey]


    params.mainJson = JSON.stringify({
      "tranDate": formData.tranDate,
      "tabkey": "",
      "wareKey": formData.wareKey,
      "tranCode": 2,
      "tranName": "其他入库",
      "remark": formData.remark
    })
    params.detailsJson = JSON.stringify(cartList)
    app.http("saveData", params).then(() => {
      app.showToast("保存成功")
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
  }
})