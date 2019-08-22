import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalPrice: 0,
    customerName: null,
    customerNo: null,
    custNo:null,
    storehouse: {
      list: [],
      idList: [],
      index: null
    },
    slectedStoreHouseId: "",
    orderId: "",
    customer: "",
    seller: "",
    receiver: "",
    phoneNumber: "",
    receiveAddress: "",
    receiveDate: "",
    region: "",
    addressDetail: ""
  },

  onLoad() {
    //验证登录
    app.checkLogin()
    this.initData()
    this.store.data.newSales.receiveAddress = this.data.receiveAddress
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      receiveDate: nowDate
    })
  },
  onShow() {
    if (this.data.customerNo) {
      app.http("getDftAddress", {
        customerNo: this.data.customerNo
      }).then(data => {
        var address = data.list[0]
        this.setData({
          region: [address.province, address.city, address.area],
          addressDetail: address.address
        })
      })
    }
  },
  initData() {
    app.http("getOrderNo").then(data => {
      this.setData({
        orderId: data
      })
    })
    app.http("getWarehouse").then(data => {
      var list = []
      var idList = []
      data.list.forEach(item => {
        list.push(item.name)
        idList.push(item.tableKey)
      })
      this.setData({
        ["storehouse.list"]: list,
        ["storehouse.idList"]: idList
      })
    })
  },
  selectStorehouse: function(e) {
    this.setData({
      ["storehouse.index"]: e.detail.value,
      slectedStoreHouseId: this.data.storehouse.idList[e.detail.value]
    })
  },
  //跳转选择供应商页面
  selectCustomer() {
    wx.navigateTo({
      url: '/pages/sales/selectCustomer/selectCustomer',
    })
  },
  selectSeller() {
    wx.navigateTo({
      url: '/pages/sales/selectSeller/selectSeller',
    })
  },
  toAddGoods(){
    if (this.data.customerNo === "") {
      app.showToast("请先选择客户")
      return
    }

    wx.navigateTo({
      url: "/pages/sales/addGoods/addGoods"
    })
    
  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  //监听购物车组件信息的改变
  getChangedData(e) {
    var store = this.store.data.newSales
    var data = e.detail
    store.cartList = data.goodsList,
      store.totalPrice = data.totalPrice,
      store.totalAmount = data.totalAmount
  },
  dateChange(e) {
    this.setData({
      receiveDate: e.detail.value
    })
  },
  addAeceiveAddress() {
    wx.navigateTo({
      url: '/pages/common/addReceiveAdress/addReceiveAdress?adress=' + this.data.receiveAddress + "&store=newSales.receiveAddress",
    })
  },
  formSubmit(e) {
    var info = e.detail.value
    var data=this.data
    info.goods = this.store.data.newSales.cartList

    var paramas = {
      upperpartOrder:{
        orderNo: info.orderId,
        custNo: data.custNo,
        custName: data.custName,
        sellSalesMan: data.seller,
        insertDate: '',//
        deliveryDate: '',//
        billingAmount: '500.00',//
        orderStatus: '090003',//
        sttAmount: '508.50',//
        sttMode: '',//
        remark: info.remark,
        buyOperator: wx.getStorageSync("userInfo")[0].userName,
        auditor: '',//
        oando: 'down',//---
        getGoodsDate: info.receiveDate,
        hdGoods: '0',//
        lgtNums: '',//
        cpdOrder: '',//
        saleWarehouse: '233113894401343488',//---
        invoice: '0003',//
        orderTypeChoose: '01',//
        logisticsCost: '0.00',//
        consignor: '',//
        reflect: '0'//
      }
    }
    console.log(paramas)  
  },

})
