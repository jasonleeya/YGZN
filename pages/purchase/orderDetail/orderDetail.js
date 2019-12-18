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
    orderStatus: null,
    params: {},
    formEvent: {},
    isShowOrderLogPop:false,
    type:""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    if(typeof options.type!=='undefined'){
      this.setData({
        type: options.type
      })
    }

    //设为已读
    app.http("viewOrder", {
      orderNo: options.orderNo
    })

    app.http(this.data.type !== 'snapshot' ? "queryByOrderNo" :'queryOriginalByOrderNo', {
      orderNo: options.orderNo
    }, false, false).then(data => {

      var orderType = ''
      var infos = data.infoBody.upp
      orderType += infos.oando === "up" ? "线上/" : infos.oando === "down" ? "线下/" : ""
      orderType += infos.hdGoods ? "代发货/" : ""
      orderType += String.call(this, infos.remark).indexOf("已提前入库") > -1 ? "已拆分/" : ""
      orderType += infos.orderStatus === "090002" || infos.orderStatus === "090004" || infos.orderStatus === "090005" ? (infos.isPaid ? "已支付/" : "信用/") : ""
      orderType += infos.typeOfGoods === "002" ? "有退货/" : ""
      orderType += infos.showPayBtn === "yes" && infos.orderStatus === "090003" ? "已汇款/" : ""
      infos.orderType = orderType.slice(0, orderType.length - 1)

      var statusStr = ""
      switch (infos.orderStatus) {
        case "wait":
          statusStr = "待审核"
          break
        case "090001":
          statusStr = "待确认"
          break
        case "090003":
          statusStr = "待付款"
          break
        case "090002":
          statusStr = "待发货"
          break
        case "090004":
          statusStr = "待入库"
          break
        case "090005":
          statusStr = "已完成"
          break
        case "090008":
          statusStr = "已取消"
          break
      }
      if(this.data.type==='snapshot'){
        app.setTitle("采购订单快照")
      }else{
        app.setTitle("采购" + statusStr + "订单")
      }
      

      this.setData({
        infos: infos,
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
    }).catch(err => {
      app.showToast(err)
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

  ////////////
  getChangeAmount(e) {
    var index = e.detail.index
    var goods = this.data.goodsList[index]
    var amount = e.detail.amount

    var goodsDiscount = (parseFloat(goods.ntpsingle) / parseFloat(goods.facePrice)).toFixed(2)
    if (goodsDiscount > 1 || String(goodsDiscount) === 'Infinity' || isNaN(goodsDiscount)) {
      goodsDiscount = 1
    }

    this.setData({
      ["goodsList[" + index + "].goodsCount"]: amount,
      ["goodsList[" + index + "].sttAmount"]: (parseInt(amount) * parseFloat(goods.discountPrice)).toFixed(2),
      ["goodsList[" + index + "].ntp"]: parseInt(amount) * parseFloat(goods.ntpsingle),
      ["goodsList[" + index + "].billingAmount"]: (parseInt(amount) * parseFloat(goods.facePrice)).toFixed(2),
      ["goodsList[" + index + "].goodsDiscount"]: goodsDiscount
    })

  },
  deleteGoods(e) {
    var list = this.data.goodsList

    list.splice(e.detail.index, 1)
    this.setData({
      goodsList: list
    })
  },
  priceAmountChange(e) {
    this.setData({
      totalPrice: e.detail.totalPrice,
      totalAmount: e.detail.totalAmount
    })
  },

  operate(e) {
    // if (!this.data.canEdit) {
    //   return
    // }
    //


    var index = e.detail.index
    this.setData({
      editingIndex: index,
      showEditPop: true,
      popData: this.data.goodsList[index]
    })
  },
  getEditedInfo(e) {
    if (!this.data.canEdit) {
      app.showToast("不能修改此订单或先点击修改订单", 4000)
      this.setData({
        showEditPop: false
      })
      return
    }


    var totalPrice = 0
    var totalAmount = 0
    var data = e.detail.data
    data.billingAmount = parseFloat(data.facePrice) * parseInt(data.goodsCount)

    var goodsDiscount = (parseFloat(data.ntpsingle) / parseFloat(data.facePrice)).toFixed(2)
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

  },
  closePop() {
    this.setData({
      showEditPop: false
    })

  },
  lgtInput(e) {
    this.setData({
      ['infos.lgtNums']: e.detail.value
    })
  },
  seeLogisticsInfo() {
    wx.navigateTo({
      url: '/pages/common/LogisticsInfo/LogisticsInfo?lgtNums=' + this.data.infos.lgtNums
    })
  },

  goodsDetail(e) {
    var index = e.detail.index
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate?operateType=view&orderType=purchase&goodsNo=' + this.data.goodsList[index].goodsNo + "&wareKey=" + this.data.purchaseWarehouse
    })

  },

  formSubmit(e) {
    this.setData({
      formEvent: e
    })
  },
  submit(e) {
    var formData = e.detail.value
    console.log(formData)
    var data = this.data
    var list = data.goodsList
    var info = data.infos
    var address = data.address

    var billingAmount = 0
    list.forEach(item => {
      billingAmount += parseFloat(item.billingAmount)
    })

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


    var params = {
      upperpartOrder: JSON.stringify([{
        orderNo: info.orderNo,
        supplyNo: info.supplyNo,
        supplyName: info.supplyName,
        buySalesMan: formData.buyer,
        insertDate: "", //*
        deliveryDate: null, //*
        billingAmount: billingAmount, //*
        orderStatus: this.data.orderStatus,
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
      params: params
    })
    if (this.data.infos.orderStatus === "090003") {
      return
    }

    // console.log(params)

    app.http("savePurchaseOrderUpperAndLower", params, true).then(() => {
        app.showToast("添加成功")
        this.setData({
          isLoad: false
        })

        wx.redirectTo({
          url: '/pages/purchase/orderDetail/orderDetail?orderNo=' + info.orderNo + "&orderTypeStr=" + this.data.orderTypeStr,
        })
      })
      .catch((e) => {
        app.showToast(e)
      })
  },

  confirmOrder(e) {
    this.setData({
      orderStatus: "090001"
    })
    let that = this
    wx.showModal({
      title: '是否确认订单?',
      content: '',
      success(res) {
        if (res.cancel) {
          return
        }
        that.submit(that.data.formEvent)
      }
    })
  },
  confirmOfflineOrder(e) {
    this.setData({
      orderStatus: "090003"
    })
    let that = this
    wx.showModal({
      title: '是否确认订单?',
      content: '',
      success(res) {
        if (res.cancel) {
          return
        }
        that.submit(that.data.formEvent)
      }
    })
  },
  cancelOrder() {
    wx.showModal({
      title: '确定取消订单吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("cancelOrder", {
          orderNo: this.data.infos.orderNo
        }).then(data => {
          app.showToast('取消订单成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      }
    })

  },
  split() {
    app.showToast("暂不支持")
  },
  confirmStorage() {
    let that = this
    wx.showModal({
      title: '确定入库吗?',
      content: '',
      success(res) {
        if (res.cancel) {
          return
        }
        app.http("reOrderTake", {
          orderNo: that.data.infos.orderNo,
          wareKey: that.data.infos.purchaseWarehouse
        }).then(data => {
          app.showToast('入库成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      }
    })
  },
  returnGoods() {
    app.showToast("暂不支持")
  },
  confirmSend() {
    this.setData({
      orderStatus: "090004"
    })
    let that = this
    wx.showModal({
      title: '确定出库吗?',
      content: '',
      success(res) {
        if (res.cancel) {
          return
        }
        that.submit(that.data.formEvent)
      }
    })
  },
  purchaseAgain() {
    wx.showModal({
      title: '确定要再次采购吗',
      content: '',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("againOrder", {
          orderNo: this.data.infos.orderNo
        }).then(() => {
          app.showToast("再次采购成功")
        }).catch(err => {
          app.showToast(err)
        })
      }
    })

  },
  viewOrderLogs(){
    wx.navigateTo({
      url: '/pages/common/orderLogs/orderLogs?orderNo=' + this.data.infos.orderNo +"&orderTypes="+"采购"
    })
  },
  appllyCancelOrder(){
  wx.showModal({
    title: '确定要申请取消该订单吗',
    success: (res)=>{
      if(res.cancel){return}
      app.http("cancelApply", {
        orderNo: this.data.infos.orderNo
      }).then(() => {
        app.showToast("已申请取消该订单,请等待对方确认")
      }).catch((err) => {
        app.showToast(err)
      })
    },
  })
  },
  viewSnapshot(){
    wx.navigateTo({
      url: '/pages/purchase/orderDetail/orderDetail?orderNo=' + this.data.infos.orderNo + "&type=snapshot" 
    })
  },
  back(){
    wx.navigateBack()
  },
  payment() {
    var infos = this.data.infos
    setTimeout(() => {
      this.submit(this.data.formEvent)
      wx.navigateTo({
        url: '/pages/purchase/payment/payment?supplyNo=' + infos.supplyNo + '&customerNo=' + infos.custNo + '&orderNoArr=' + infos.orderNo + "&supplyName=" + infos.supplyName
      })
    }, 100)
  }
})