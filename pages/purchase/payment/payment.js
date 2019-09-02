let app = getApp()
Page({
  data: {
    paymentMethods: {
      list: ["预存款支付", "信用额度支付", "转账支付", "现金支付"],
      index: null,
    },
    supplyNo: null,
    customerNo: null,
    orderNoArr: null,
    orderNo:null,
    postage: null,
    orderAmount: null,
    preDeposit: null,
    credits: null,
    payee: null
  },
  onLoad: function(options) {
    app.setTitle("支付")
    this.setData({
      supplyNo: options.supplyNo,
      customerNo: options.customerNo,
      orderNo: options.orderNoArr,
      orderNoArr: "," + options.orderNoArr,
    })
    app.http("getOrderPayByOrderNoCost", {
      supplyNo: options.supplyNo,
      customerNo: options.customerNo,
      orderNoArr: "," + options.orderNoArr
    }, true).then(data => {
      var value = data.list[0]
      this.setData({
        postage: value.logisticsAmount,
        orderAmount: value.orderAmount,
        preDeposit: value.amountAmount,
        credits: value.creditCount
      })
    })
    app.http("getSupplyAccount", {
      custNo: options.supplyNo
    }).then(data => {
      if (data.list.length > 0) {
        var value = data.list[0]
        this.setData({
          payee: value.custName,
          bank: value.openBank,
          payeeAccount: value.account
        })
      }
    })
  },
  onReady: function() {},
  onShow: function() {},
  selectPaymentMethod(e) {
    this.setData({
      ["paymentMethods.index"]: e.detail.value
    })
  },
  pay() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    switch (this.data.paymentMethods.list[this.data.paymentMethods.index]) {
      case "预存款支付":
        app.http("orderPayByOrderNo", {
          supplyNo: this.data.supplyNo,
          customerNo: this.data.customerNo,
          orderNoArr: this.data.orderNoArr,
        }).then(() => {
          app.showToast("支付成功")
          setTimeout(() => {
            wx.navigateBack({
              delta: 3
            })
          }, 2000)
        }).catch(err => {
          app.showToast(err)
        })

        break
      case "信用额度支付":
        var paramas = prevPage.data.paramas
        paramas.upperpartOrder = JSON.parse(paramas.upperpartOrder)
        paramas.upperpartOrder[0].orderStatus = "090002"
        paramas.upperpartOrder[0].orderTypeChoose = "03"
        paramas.upperpartOrder = JSON.stringify(paramas.upperpartOrder)
        // console.log(paramas)

        app.http("savePurchaseOrderUpperAndLower", paramas, true).then(() => {
          app.showToast("支付成功")
          setTimeout(() => {
            wx.navigateBack({
              delta: 3
            })
          }, 2000)
        }).catch(err => {
          app.showToast(err)
        })
        break
      case "转账支付":
      case "现金支付":  
        var preData = prevPage.data.infos
        console.log(prevPage.data.infos)
        var p = {
          supplyNo: this.data.supplyNo,
          customerNo: this.data.customerNo,
          orderNo: this.data.orderNo,
          billDataJson: JSON.stringify([{
            billNo: '',
            billtype: 'undefined',
            billbank: '',
            billaccno: preData.custNo,
            billusername: preData.custName,
            bookno: '',
            amount: preData.sttAmount,
            rcvbank: 'undefined',
            rcvaccno: 'undefined',
            remark: preData.orderNo + '订单直接付款'
          }])
        }

        app.http("custOrderPay", p).then(() => {
          app.showToast("支付成功")
          setTimeout(() => {
            wx.navigateBack({
              delta: 3
            })
          }, 2000)
        }).catch(err => {
          app.showToast(err)
        })
        break
    }


  }
})