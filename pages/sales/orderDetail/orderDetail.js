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
    saleWarehouse: null,
    beforeWareHouse: null,
    sellSalesMan: null,
    storehouse: {
      list: [],
      idList: [],
      index: null
    },
    region: '',
    addressDetail: "",
    showEditPop: false,
    popData: {},
    editingIndex: null,
    params: {},
    orderStatus: "",
    formEvent: null,
    viewByShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    if (typeof options.type !== 'undefined') {
      this.setData({
        type: options.type
      })
    }
    if (options.companyId) {
      app.checkLogin().catch(()=>{  
        var route = '/' + 'pages/sales/orderDetail/orderDetail' + '?orderNo=' + options.orderNo+'&companyId='+options.companyId
        wx.setStorageSync('pageBeforeLogin', route) 
      }) 
      this.setData({
        viewByShare:true
      })
      if (options.companyId == wx.getStorageSync('userInfo')[0].queryNo) { 

        wx.redirectTo({
          url: '/pages/purchase/orderDetail/orderDetail?orderNo=' + options.orderNo
        })
        return
      }
    }
    app.http("viewOrder", {
      orderNo: options.orderNo
    })
    app.http(this.data.type !== 'snapshot' ? "queryByOrderNo" : 'queryOriginalByOrderNo', {
      orderNo: options.orderNo
    }, false, false).then(data => {

      var region = ""
      var addressDetail = data.infoBody.address.address

      //  if (data.infoBody.address) {
      //    var ad = data.infoBody.address.address
      //    var reg = ad.match(/【.*】/) === null ? "" : ad.match(/【.*】/)[0]
      //    region = reg.replace("【", "").replace("】", "")
      //    addressDetail = ad.replace(reg, "")
      //  }

      var orderType = ''
      var infos = data.infoBody.upp
      orderType += infos.oando === "up" ? "线上/" : infos.oando === "down" ? "线下/" : ""
      orderType += infos.hdGoods ? "代发货/" : ""
      orderType += infos.orderStatus === "090002" || infos.orderStatus === "090004" || infos.orderStatus === "090005" ? (infos.isPaid ? "已支付/" : "信用/") : ""
      orderType += infos.typeOfGoods === "002" ? "有退货/" : ""
      orderType += infos.showPayBtn === "yes" && infos.orderStatus === "090003" ? "已汇款/" : ""
      orderType += infos.enoughStatus === 1 ? infos.orderStatus === "090001" || infos.orderStatus === "090002" ? "A(可出货)/" : infos.orderStatus === "090004" && infos.oando === "down" ? "A(可出货)/" : '' : ''
      orderType += infos.enoughStatus === 2 ? infos.orderStatus === "090001" || infos.orderStatus === "090002" ? "P(库存不足)/" : infos.orderStatus === "090004" && infos.oando === "down" ? "P(库存不足)/" : '' : ''
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
      if (this.data.type === 'snapshot') {
        app.setTitle("销售订单快照")
      } else {
        app.setTitle("销售" + statusStr + "订单")
      }
      if (this.data.viewByShare&&infos.supplyNo !== wx.getStorageSync('userInfo')[0].queryNo) {
       console.log(infos.supplyNo,wx.getStorageSync('userInfo')[0].queryNo)
        wx.showModal({
          content: '您无权访问该订单',
          showCancel: false,
          success: (result) => {
            wx.navigateBack()
          },
        })
        return
      }
      data.infoBody.lows.forEach(item=>{
        item.pirctureWay=item.productInfo.imgPath
      })
      this.setData({
        infos: infos,
        //  region: region === "" ? "" : region.split("/"),
        addressDetail: addressDetail,
        address: data.infoBody.address,
        goodsList: data.infoBody.lows,
        saleWarehouse: data.infoBody.upp.saleWarehouse,
        beforeWareHouse: JSON.parse(JSON.stringify(data.infoBody.upp.saleWarehouse)),
        totalPrice: data.infoBody.upp.sttAmount
      })

      var list = data.infoBody.lows
      list.forEach(item => {
        item.NTP = item.ntp
        item.NTPSingle = item.ntpsingle
      })

      app.globalData.salesCartList = list


      app.http("getWarehouse").then(wareHouse => {
        var list = []
        var idList = []
        var index = null
        if (wareHouse.list.length === 1) {
          this.setData({
            saleWarehouse: wareHouse.list[0].tableKey
          })
        }
        wareHouse.list.forEach(item => {
          list.push(item.name)
          idList.push(item.tableKey)

          if (item.tableKey === this.data.saleWarehouse) {

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
  onReady: function () {

  },

  onShow() {
    var list = app.globalData.salesCartList
    if (list.length > 0) {
      list.forEach(item => {
        item.ntp = item.NTP
        item.ntpsingle = item.NTPSingle
      })
      this.setData({
        goodsList: list,
        // totalPrice: app.globalData.salesTotalPrice,
        // totalAmount: app.globalData.salesTotalAmount,
      })
    }

  },
  orderLogs() {

  },
  selectStorehouse: function (e) {
    this.setData({
      ["storehouse.index"]: e.detail.value,
      saleWarehouse: this.data.storehouse.idList[e.detail.value]
    })
  },
  edit() {
    if (this.data.infos.orderStatus === "090001" || this.data.infos.orderStatus === '090002') {
      this.setData({
        canEdit: true
      })
    }
  },
  // {{(canEdit&&infos.orderStatus==='wait')||(canEdit&&infos.orderStatus==='090001'&&infos.oando==='down')?'':'text-gray'}}
  selectBuyer() {
    if (!this.data.canEdit) {
      return
    }
    wx.navigateTo({
      url: '/pages/sales/selectSeller/selectSeller?setData=infos.sellSalesMan',
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
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  /////////////
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
      ["goodsList[" + index + "].NTP"]: parseInt(amount) * parseFloat(goods.ntpsingle),
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
    //  if (!this.data.canEdit) {
    //    return
    //  }
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
  confirmOrder(e) {
    this.setData({
      orderStatus: "090003"
    })
    let that = this
    wx.showModal({
      title: '是否确认订单',
      content: '',
      success(res) {
        if (res.cancel) {
          return
        }
        that.submit(that.data.formEvent)
      }
    })
  },

  split() {
    app.showToast("暂不支持")
  },
  saleAgain() {
    wx.showModal({
      title: '确定要再次销售吗',
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
  splitOrder() {
    app.showToast('暂不支持')
  },
  confirmStorage() {
    this.setData({
      orderStatus: "090005"
    })
    let that = this
    wx.showModal({
      title: '确定要入库吗',
      content: '',
      success(res) {
        if (res.cancel) {
          return
        }
        that.submit(that.data.formEvent)
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
      title: '确定要出库吗',
      content: '',
      success(res) {
        if (res.cancel) {
          return
        }
        //  that.submit(that.data.formEvent)
        var formData = that.data.formEvent.detail.value
        if (formData.storehouse === '') {
          app.showToast('请选择仓库')
          return
        }
        app.http("deliver", {
          orderNo: formData.orderId,
          remark: formData.remark,
          lgtNums: formData.lgtNums,
          wareKey: that.data.saleWarehouse
        }).then(() => {
          app.showToast('出库成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)

        })
      }
    })
  },
  purchaseAgain() {
    app.http("homeMessage", {
      orderNo: this.data.infos.orderNo
    }).then(() => {
      app.showToast("再次采购成功")
    }).catch(err => {
      app.showToast(err)
    })
  },
  payment() {
    var infos = this.data.infos
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/sales/payment/payment?custNo=' + infos.custNo + '&customerNo=' + infos.custNo + '&supplyNo=' + infos.supplyNo + '&orderNoArr=' + infos.orderNo + "&supplyName=" + infos.supplyName + '&oando=' + this.data.infos.oando
      })
    }, 100)
  },
  returnGoods() {
    app.showToast("暂不支持")
  },
  goodsDetail(e) {
    var index = e.detail.index
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate?operateType=view&orderType=sale&goodsNo=' + this.data.goodsList[index].goodsNo + "&wareKey=" + this.data.saleWarehouse
    })

  },
  formSubmit(e) {
    this.setData({
      formEvent: e
    })
  },
  submit(e) {
    var formData = e.detail.value
    var data = this.data
    var list = data.goodsList
    var info = data.infos
    var address = data.address

    var billingAmount = 0
    list.forEach(item => {
      billingAmount += parseFloat(item.billingAmount)
    })
    if (!formData.custName) {
      app.showToast("请选择客户")
      return
    }
    if (!formData.sellSalesMan) {
      app.showToast("请选择销售员")
      return
    }
    if (!formData.storehouse) {
      app.showToast("请选择仓库")
      return
    }
    if (!formData.addressDetail) {
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
    console.log(info)

    var params = {
      upperpartOrder: JSON.stringify([{
        orderNo: info.orderNo,
        custNo: info.custNo,
        custName: info.custName,
        sellSalesMan: formData.sellSalesMan,
        insertDate: info.insertDate,
        deliveryDate: info.deliveryDate,
        billingAmount: billingAmount,
        orderStatus: data.orderStatus,
        sttAmount: data.totalPrice,
        sttMode: "",
        remark: info.remark === null ? "" : info.remark,
        buyOperator: info.buyOperator,
        auditor: "",
        oando: info.oando,
        isPaid: null,
        getGoodsDate: info.receiveDate,
        hdGoods: "0",
        lgtNums: "",
        cpdOrder: "",
        saleWarehouse: data.saleWarehouse,
        invoice: "0003",
        orderTypeChoose: "01",
        logisticsCost: info.logisticsCost,
        consignor: info.consignor === null ? "" : info.consignor,
        reflect: 0,
      }]),
      list: JSON.stringify(list),
      tBusAddress: JSON.stringify([{
        orderNo: formData.orderId,
        consigneeName: formData.receiver,
        address: formData.addressDetail,
        telephone: formData.phoneNumber
      }]),
      isIncreaseGoodsNum: "yes", //*
      beforeGoodsNum: "", //*
      beforeWareHouse: data.beforeWareHouse
    }

    this.setData({
      params: params
    })
    //  if (this.data.infos.orderStatus === '090001' && this.data.infos.oando === 'up' ? true : this.data.infos.orderStatus === '090003' && this.data.infos.oando === 'down' ? true : false) {
    //    return
    //  } 

    app.http("saveSaleOrderUpperAndLower", params, true).then(() => {
      app.showToast("确认订单成功")
      this.setData({
        isLoad: false
      })
      app.globalData.salesCartList = []
      app.globalData.salesTotalPrice = 0
      app.globalData.salesTotalAmount = 0

      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/sales/orderDetail/orderDetail?orderNo=' + info.orderNo,
        }, 500)
      })

    })
      .catch((e) => {
        app.showToast(e)
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
  viewOrderLogs() {
    wx.navigateTo({
      url: '/pages/common/orderLogs/orderLogs?orderNo=' + this.data.infos.orderNo + "&orderTypes=" + "销售"
    })
  },
  viewSnapshot() {
    wx.navigateTo({
      url: '/pages/sales/orderDetail/orderDetail?orderNo=' + this.data.infos.orderNo + "&type=snapshot"
    })
  },
  back() {
    wx.navigateBack()
  },
  addGoods() {
    // var list = this.data.goodsList
    // list .forEach(item=>{
    //   item.NTP=item.ntp
    //   item.NTPSingle = item.ntpsingle
    // })
    // app.globalData.salesCartList = list
    // salesTotalPrice: 0,
    //   salesTotalAmount: 0,

    wx.navigateTo({
      url: "/pages/sales/addGoods/addGoods?custNo="
    })

  },
  agreeCancelOrder() {
    wx.showModal({
      title: '确定同意取消此订单吗',
      success: (res) => {
        if (res.cancel) { return }
        app.http("cancelOrder", {
          orderNo: this.data.infos.orderNo,
          flag: "true"
        }).then(() => {
          app.showToast("取消订单成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      },
    })
  },
  onShareAppMessage(res) {
    return {
      title: '订单分享',
      path: '/pages/purchase/orderDetail/orderDetail?orderNo=' + this.data.infos.orderNo + "&companyId=" + wx.getStorageSync('userInfo')[0].queryNo,
      success: function (res) { }
    }
  }

})