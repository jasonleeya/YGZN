let app = getApp()
Page({
  data: {
    payerNo: "",
    payerName: "",
    receiverNo: "",
    receiverName: "",
    operateType: "",
    payMethod: {
      index: 0,
      list: [],
      idList: []
    },
    receiveMethod: {
      index: 0,
      list: [],
      idList: []
    },
    receiptDate: "", 
    supplyNo: "",
    infos: {}
  },
  onLoad: function(options) {

    this.setData({
      type: options.type,
      operateType: options.operateType
    })

    if (options.operateType === "edit") {
      var pages = getCurrentPages()
      console.log(options.editIndex)
      var infos = pages[pages.length - 2].data.orderList[options.editIndex].bill
      this.setData({
        infos
      })
      app.setTitle("编辑" + this.data.type + "单")
    } else {
      app.setTitle("新增" + this.data.type + "单")
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
      if(options.type==='收款'){
        this.setData({
          ["receiveMethod.list"]: list,
          ["receiveMethod.idList"]: idList
        })
      }else{
        this.setData({
          ["payMethod.list"]: list,
          ["payMethod.idList"]: idList
        })
      }
    
    })
    
    app.http("getSupplyAccount").then(data => {
      var list = ['现金']
      var idList = ['-'] 
      data.list.forEach(item => {
        list.push(item.openBank)
        idList.push(item.account)
      }) 
      if (options.type === '收款') {
        this.setData({
          ['receiveMethod.list']: list,
          ['receiveMethod.idList']: idList,
        }) 
      } else {
        this.setData({
          ['payMethod.list']: list,
          ['payMethod.idList']: idList,
        }) 
      } 
 
    })
    if (options.type === '收款') {   
      this.setData({
        receiverNo: wx.getStorageSync('userInfo')[0].queryNo,
        receiverName: app.globalData.companies[wx.getStorageSync('currentCompanyIndex')][0],
      })
    } else { 
       this.setData({
        payerNo: wx.getStorageSync('userInfo')[0].queryNo,
        payerName: app.globalData.companies[wx.getStorageSync('currentCompanyIndex')][0],
      })
    }  
    
  },
  onShow: function() {
    if(this.data.type==='收款'&&this.data.payerName!==''&&this.payerNo!==''){
      app.http("getSupplyAccount",{
        custNo:this.data.payerNo
      }).then(data=>{
        var list=["现金"]
        var idList = [""] 
        if(data.list.length===0){
          list.unshift('其他')
          idList.unshift("") 
        }else{
          data.list.forEach(item=>{
            list.push(item.openBank)
            idList.push(item.account)
          })
        }
        this.setData({
          ['payMethod.list']: list,
          ['payMethod.idList']: idList
        })
      })
    } else if (this.data.type === '付款' && this.data.receiverName !== '' && this.receiverNo !== ''){
      app.http("getSupplyAccount", {
        custNo: this.data.receiverNo
      }).then(data => {
        var list = this.data.receiveMethod.list
        var idList = this.data.receiveMethod.idList 
        if (data.list.length === 0) {
          list.unshift('其他')
          idList.unshift("") 
        } else {
          data.list.forEach(item => {
            list.push(item.openBank)
            idList.push(item.account)
          })
        }
        this.setData({
          ['receiveMethod.list']: list,
          ['receiveMethod.idList']: idList
        })
      })
    }
  }, 
  chooseReceiver() {
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/chooseCustomer/chooseCustomer?type=receiver'
    })
  },
  choosePayer() {
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/chooseCustomer/chooseCustomer?type=payer'
    })
  },
 
  payMethodChange(e){
    this.setData({
      ["payMethod.index"]: e.detail.value
    })
  },
  receiveMethodChange(e){
    this.setData({
      ["receiveMethod.index"]: e.detail.value
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
    console.log(formData)
    // formData.tableKey = ""
    // formData.supplyNo = this.data.supplyNo
    // formData.action = "save"
    // if (!formData.custNo) {
    //   app.showToast("请选择客户")
    //   return
    // }
    // if (!formData.amount) {
    //   app.showToast("请输入金额")
    //   return
    // }
    // if (!formData.item) {
    //   app.showToast("请输入用途")
    //   return
    // }

    // app.http("acceptbillEdit", formData).then(() => {
    //   app.showToast("添加成功")
    //   setTimeout(() => {
    //     wx.navigateBack()
    //   }, 500)
    // }).catch(err => {
    //   app.showToast(err)
    // })
  }
})