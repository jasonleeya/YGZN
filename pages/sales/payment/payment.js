let app = getApp()
Page({
  data: {
    paymentMethods: {
      // list: ["预存款支付", "信用额度支付", "转账支付", "现金支付"],
      list: ["预存款支付", "信用额度支付", "线下支付"],
      index: null,
    },
    supplyNo: null,
    customerNo: null,
    orderNoArr: null,
    orderNo: null,
    postage: null,
    orderAmount: null,
    preDeposit: null,
    credits: null,
    supplyName: null,
    custName: null,
    paymentAccount: {
      list: [],
      accountList: [],
      index: '0'
    },
    receiveAccount: {
      list: [],
      accountList: [],
      index: '0'
    },
    isCheckeOrder:false,
    oando:""
  },
  onLoad: function (options) {
    app.setTitle("收款")
    this.setData({
      supplyNo: options.supplyNo,
      customerNo: options.customerNo,
      orderNo: options.orderNoArr,
      orderNoArr: "," + options.orderNoArr,
      supplyName: options.supplyName,
      oando:options.oando
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
    app.http("getSupplyAccount").then(data => {
      if (data.list.length > 0) {
        var nameList = ["现金"]
        var accountList = [""]

        data.list.forEach(item => {
          nameList.push(item.openBank)
          accountList.push(item.account)
        })
        this.setData({
          ["receiveAccount.list"]: nameList,
          ["receiveAccount.accountList"]: accountList
        })
      } else {
        this.setData({
          ["receiveAccount.list"]: ['现金', ' 其他'],
          ["receiveAccount.noAccount"]: true
        })

      }
    })
    app.http("getSupplyAccount", { custNo: options.custNo}).then(data => {
      if (data.list.length > 0) {
        var nameList = ["现金"]
        var accountList = [""]

        data.list.forEach(item => {
          nameList.push(item.openBank)
          accountList.push(item.account)
        })
        this.setData({
          ["paymentAccount.list"]: nameList,
          ["paymentAccount.accountList"]: accountList
        })
      } else {
        this.setData({
          ["paymentAccount.list"]: ['现金', ' 其他'],
          ["paymentAccount.noAccount"]: true
        })

      }
    })
  },
  onReady: function () { },
  onShow: function () { },
  selectPaymentMethod(e) {
    this.setData({
      ["paymentMethods.index"]: e.detail.value
    })
  },
  selectReceiveAccount(e) {
    this.setData({
      ["receiveAccount.index"]: e.detail.value
    })
  },
  selectpaymentAccount(e) {
    this.setData({
      ["paymentAccount.index"]: e.detail.value
    })
  },
  pay() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    switch (this.data.paymentMethods.list[this.data.paymentMethods.index]) {
      case "预存款支付": 
        if(parseFloat(this.data.orderAmount)>parseFloat(this.data.preDeposit)){
          app.showToast("预存款不足,请用其他方式支付")
          return
        } 
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
        // var params = prevPage.data.params
        // params.upperpartOrder = JSON.parse(params.upperpartOrder)
        // params.upperpartOrder[0].orderStatus = "090002"
        // params.upperpartOrder[0].orderTypeChoose = "03"
        // params.upperpartOrder = JSON.stringify(params.upperpartOrder)
        // // console.log(params)
        if(parseFloat(this.data.orderAmount)>parseFloat(this.data.credits)&&this.data.oando==='up'){
          app.showToast("信用额度不足,请用其他方式支付")
          return
        }

        app.http("creditPayment", {
          orderNo: this.data.orderNo
        }, true).then(() => {
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
      case "线下支付":
        var preData = prevPage.data.infos
        console.log(prevPage.data.infos)
        var p = {
          supplyNo: this.data.supplyNo,
          customerNo: this.data.customerNo,
          orderNo: this.data.orderNo,
          supplyName: this.data.supplyName,
          autoAudit: this.data.isCheckeOrder?1:0,
          billDataJson: JSON.stringify([{
            billNo: '',
            billtype: '1',
            billbank: this.data.paymentAccount.list[this.data.paymentAccount.index],
            billaccno: this.data.paymentAccount.accountList[this.data.paymentAccount.index],
            billusername: preData.custName,
            bookno: '',
            amount: preData.sttAmount,
            rcvbank: this.data.receiveAccount.list[this.data.receiveAccount.index],
            rcvaccno: this.data.receiveAccount.accountList[this.data.receiveAccount.index],
            remark: preData.orderNo + '订单直接付款'
          }])
        }   
        app.http("custOrderPay", p).then((data) => {
          app.showToast(data.msg)
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
  },
  paymentAccountInput(e) {
    this.setData({
      ["paymentAccount.accountList[0]"]: e.detail.value
    })
  },
  receiveAccountInput(e) {
    this.setData({
      ["receiveAccount.accountList[0]"]: e.detail.value
    })
  },
  back(){
    wx.navigateBack()
  },
  checkeOrder(e){
    this.setData({
      isCheckeOrder: e.detail.value
    })
  }
})