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
    address: {},
    canEdit: false,
    purchaseWarehouse: null,
    beforeWareHouse: null,
    buyer: null,
    storehouse: {
      list: [],
      idList: [],
      index: null
    },
    showEditPop: false,
    popData: {},
    editingIndex: null,
    oprateType: null,
    paramas: {}
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
        infos: data.infoBody.upp,
        address: data.infoBody.address,
        goodsList: data.infoBody.lows,
        purchaseWarehouse: data.infoBody.upp.purchaseWarehouse,
        beforeWareHouse: JSON.parse(JSON.stringify(data.infoBody.upp.purchaseWarehouse)),
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
      purchaseWarehouse: this.data.storehouse.idList[e.detail.value]
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
      url: '/pages/common/selectReceiveAddress/selectReceiveAddress?addressKey=address.address&phoneNumberKey=address.telephone&receiverKey=address.consigneeName'
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

  formSubmit(e) {
    var formData = e.detail.value
    var data = this.data
    var list = data.goodsList
    var info = data.infos
    var address = data.address


    if (!formData.supplier) {
      app.showToast("请选择供应商")
      return
    }
    if (!formData.buyer) {
      app.showToast("请选择采购员")
      return
    }
    if (!formData.storehouse) {
      app.showToast("请选择仓库")
      return
    }
    if (!formData.receiveAddress) {
      app.showToast("请选择收货地址")
      return
    }
    if (!formData.receiver) {
      app.showToast("请填写收货人姓名")
      return
    }
    if (!formData.phoneNumber) {
      app.showToast("请填写收货人电话号")
      return
    }
    if (formData.length === 0) {
      app.showToast("请先添加商品")
      return
    }


    var paramas = {
      upperpartOrder: JSON.stringify([{
        orderNo: info.orderNo,
        supplyNo: info.supplyNo,
        supplyName: info.supplyName,
        buySalesMan: formData.buyer,
        insertDate: "", //*
        deliveryDate: null, //*
        billingAmount: "0.00", //*
        orderStatus: this.data.oprateType,
        sttAmount: data.totalPrice,
        sttMode: "--选择结算方式--", //*
        remark: formData.remark,
        adsaleWay: "", //  *           
        adsaleWayAcct: "", //*
        adsalePerson: "", //*
        buyOperator: info.buyOperator,
        auditor: "", //*
        oando: info.oando,
        getGoodsDate: formData.receiveDate,
        hdGoods: "", //*
        lgtNums: "", //*
        cpdOrder: "", //*
        purchaseWarehouse: data.purchaseWarehouse,
        invoice: "0003", //*
        orderTypeChoose: "01", //*
        consignee: formData.receiver,
        reflect: 0 //
      }]),
      list: JSON.stringify(list),
      tBusAddress: JSON.stringify([{
        orderNo: formData.orderId,
        consigneeName: formData.receiver,
        address: formData.receiveAddress,
        telephone: formData.phoneNumber
      }]),
      isIncreaseGoodsNum: "no", //*
      beforeGoodsNum: "", //*
      beforeWareHouse: data.beforeWareHouse
    }

    this.setData({
      paramas: paramas
    })
    if (this.data.infos.orderStatus === "090003") {
      return
    }

    // console.log(paramas)

    app.http("savePurchaseOrderUpperAndLower", paramas, true).then(() => {
        app.showToast("添加成功")
        this.setData({
          isLoad: false
        })
        wx.redirectTo({
          url: '/pages/purchase/orderDetail/orderDetail?orderNo=' + info.orderNo,
        })
      })
      .catch((e) => {
        app.showToast(e)
      })
  },

  confirmOrder(e) {
    this.setData({
      oprateType: "090003"
    })
  },
  cancelOrder() {
    app.http("cancelOrder", {
      orderNo: this.data.infos.orderNo
    }).then(data => {
      app.showToast('取消订单成功')
    }).catch(err => {
      app.showToast(err)
    })
  },
  split() {
    app.showToast("暂不支持")
  },
  confirmStorage() {
    this.setData({
      oprateType: "090005"
    })
  },
  returnGoods () {
    app.showToast("暂不支持")
  },
  confirmSend(){
    this.setData({
      oprateType: "090004"
    })
  },
  purchaseAgain() {
    app.http("homeMessage", { orderNo: this.data.infos.orderNo}).then(()=>{
      app.showToast("再次采购成功")
    }).catch(err=>{
      app.showToast(err)
    })
  },
  payment() {
    var infos = this.data.infos
    wx.navigateTo({
      url: '/pages/purchase/payment/payment?supplyNo=' + infos.supplyNo + '&customerNo=' + infos.custNo + '&orderNoArr=' + infos.orderNo
    })
  }
})