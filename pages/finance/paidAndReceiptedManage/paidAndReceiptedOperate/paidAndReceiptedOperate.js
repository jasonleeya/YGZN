let app = getApp()
Page({
  data: {
    payerNo:"",
    payerName:"",
    receiverNo:"",
    receiverName:"",
    operateType: "",
    paymentMethod: {
      index: 0,
      list: ["银行", "现金"],
      idList: ["bank", "cash"]
    },
    receiptDate: "",
    receiptAccount: {
      index: 0,
      list: [],
      idList: []
    },
    supplyNo:"",
    infos:{}
  },
  onLoad: function(options){ 
    this.setData({
      type:options.type,
      operateType:options.operateType
    })
    if(options.operateType==="edit"){
      var pages=getCurrentPages()
      console.log(options.editIndex)
      var infos = pages[pages.length - 2].data.orderList[options.editIndex].bill 
        this.setData({
          infos 
        })  
    }
    var date = new Date()
    this.setData({
      receiptDate: date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    })
    app.http("getSupplyAccount").then(data => {
      var list = []
      var idList = []
      data.list.forEach(item => {
        list.push(item.openBank)
        idList.push(item.account)
      })
      this.setData({
        ["receiptAccount.list"]: list,
        ["receiptAccount.idList"]: idList
      }) 
    })

    app.http("getUserByCustNo",{flag:true}).then(data=>{
      this.setData({
        supplyNo: data.list[0].queryNo
      })
    })
  },
  onShow: function() {

  },
  chooseCustomer() {
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/chooseCustomer/chooseCustomer'
    })
  },
  chooseReceiver(){
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/chooseCustomer/chooseCustomer?type=receiver'
    })
  },
  choosePayer(){
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/chooseCustomer/chooseCustomer?type=payer'
    })
  },

  paymentMethodChange(e) {
    this.setData({
      ["paymentMethod.index"]: e.detail.value
    })
  },
  receiptDateChange(e) {
    this.setData({
      receiptDate: e.detail.value
    })
  },
  receiptAccountChange(e) {
    this.setData({
      ["receiptAccount.index"]: e.detail.value
    })
  }, 
   
  submit(e) {
    var formData = e.detail.value
    formData.tableKey = ""
    formData.supplyNo = this.data.supplyNo
    formData.action = "save"
    if (!formData.custNo){
      app.showToast("请选择客户")
      return
    }
    if (!formData.amount) {
      app.showToast("请输入金额")
      return
    } 
    if (!formData.item) {
      app.showToast("请输入用途")
      return
    }

    app.http("acceptbillEdit",formData).then(()=>{
      app.showToast("添加成功")
      setTimeout(()=>{
        wx.navigateBack()
      },500)
    }).catch(err=>{
      app.showToast(err)
    })
  }
})