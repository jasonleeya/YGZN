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
    infos: {
      orderId: "",
      supplier: "",
      buyer: "",
      receiver: "",
      phoneNumber: "",
      receiveAddress: "",
      receiveDate: ""
    }
  },
  onLoad() {
    //验证登录
    app.checkLogin()
    this.initData()
    this.store.data.newPurchase.receiveAddress = this.data.infos.receiveAddress
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      ["infos.receiveDate"]: nowDate
    })
  },
  onShow() {
   
    if (this.store.data.newPurchase.supplier.company) { 
      this.setData({
        ["infos.supplier"]: this.store.data.newPurchase.supplier.company //从store中获取供应商信息
      })
    }
    this.setData({
      goodsList: this.store.data.newPurchase.cartList,
      totalPrice: this.store.data.newPurchase.totalPrice,
      ["infos.buyer"]: this.store.data.newPurchase.buyer,
      ["infos.receiveAddress"]: this.store.data.newPurchase.receiveAddress
    }) 
  },
  initData(){
    app.http("getOrderNo").then(data=>{
       this.setData({
         ['infos.orderId']:data
       })
    }) 
      app.http("getDtfAddress",{}).then(data=>{
       data.list.forEach(item=>{
         if (item.dftStatus==="1"){
           this.setData({ 
             ["infos.receiveAddress"]: "【" + item.province + "/" + item.city + "/" + item.area + "】" + item.address,
             ["infos.receiver"]: item.consignee,
             ["infos.phoneNumber"]: item.telephone,
           })
         }
       })
      })
 
    
    
   
  },
  //跳转选择供应商页面
  selectSupplier() {
    wx.navigateTo({
      url: '/pages/purchase/selectSupplier/selectSupplier',
      event: {
        someEvent(data) {
          console.log(data)
        }
      }
    })
  },
  selectBuyer() {
    wx.navigateTo({
      url: '/pages/purchase/selectBuyer/selectBuyer',
    })
  },

  //监听购物车组件信息的改变
  getChangedData(e) {
    var store = this.store.data.newPurchase
    var data = e.detail
    store.cartList = data.goodsList,
      store.totalPrice = data.totalPrice,
      store.totalAmount = data.totalAmount
  },
  dateChange(e){
  this.setData({
    ["infos.receiveDate"]: e.detail.value
    })
  },
  addAeceiveAddress() {
    wx.navigateTo({
      // url: '/pages/common/addReceiveAdress/addReceiveAdress?adress=' + this.data.infos.receiveAddress +'&store=newPurchase.receiveAddress',
      url: '/pages/common/selectReceiveAddress/selectReceiveAddress' 
    })
  },
  formSubmit(e) {
    var info = e.detail.value
    info.goods = this.store.data.newPurchase.cartList
    console.log(info)
  },
})