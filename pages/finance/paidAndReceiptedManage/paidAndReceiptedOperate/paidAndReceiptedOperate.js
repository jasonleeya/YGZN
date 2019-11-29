let app = getApp()
Page({
  data: {
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
    infos: {},
    canEdit:true
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
        infos,
        canEdit:false
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
        ['infos.supplyNo']: wx.getStorageSync('userInfo')[0].queryNo,
        ['infos.supplyName']: app.globalData.companies[wx.getStorageSync('currentCompanyIndex')][0],
      })
    } else { 
       this.setData({
         ['infos.billCustNo']: wx.getStorageSync('userInfo')[0].queryNo,
         ['infos.billusername']: app.globalData.companies[wx.getStorageSync('currentCompanyIndex')][0],
      })
    }  
    
  },
  onShow: function() {
    if (this.data.type === '收款' && this.data.infos.billusername !== '' && this.data.infos.billCustNo!==''){
      app.http("getSupplyAccount",{
        custNo: this.data.infos.billCustNo
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
    } else if (this.data.type === '付款' && this.data.infos.supplyName !== '' && this.data.infos.supplyNo !== ''){
      app.http("getSupplyAccount", {
        custNo: this.data.infos.custNo 
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

// tableKey:
// supplyNo: 7cde7f044f8443a4b7c604da73329a75
// supplyName: 测试代理公司
// amount: 1
// remark: 201911201316280006订单直接付款
// item: 无
// rcvbank: 人民银行
// rcvaccno: 423423542
// billbank: 其他
// billaccno: 123
// billusername: EWRWRWWER
// billCustNo: 248476153919045632
// bookno: 111111111111
// decidedate: 2019-11 - 29
// action: save

 

  submit(e) {
    var formData = e.detail.value
    formData.tableKey =this.data.operateType==='edit'?this.data.infos.tableKey:'' 
    formData.action = "save"
    formData.item="无"
    if (this.data.type === '收款' && !formData.billCustNo) {
      app.showToast("请选择付款人")
      return
    }
    if (this.data.type === '付款' && !formData.supplyName) {
      app.showToast("请选择收款人")
      return
    }
    if (!formData.amount) {
      app.showToast("请输入金额")
      return
    } 
    // console.log(formData)
    // return

    app.http("acceptbillEdit", formData).then(() => {
      app.showToast("添加成功")
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
  },
  edit(){
    this.data.payMethod.list.forEach((item,index)=>{
      if (item === this.data.infos.billbank){
          this.setData({
            ['payMethod.index']:index
          })
      }
    })
    this.data.receiveMethod.list.forEach((item, index) => {
      if (item === this.data.infos.rcvbank) {
        this.setData({
          ['receiveMethod.index']: index
        })
      }
    })
    this.setData({
      
      canEdit:true
    })
  }
})