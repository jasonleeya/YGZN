import store from '../../../store'
import create from '../../../utils/create'
let app = getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    customerList: [],
    // isLoad: true,
    // currentPage: 0,
    // totalPage:null
    searchValue:"",
    isSearchFocus:false
  },
  onLoad() {},
  onShow() {
    this.getList()
  },
  getList() {
    this.setData({
      customerList:[]
    })
    app.http("queryCustomer", {
      pageSize: 10000,
      keyword: this.data.searchValue
    }).then(data => {
      this.setData({
        customerList: data.list
      })
    })
  },
  searchBlur(e){
    this.setData({
      isSearchFocus:false
    })
  },
  searchFocus(e){
    this.setData({
      isSearchFocus: true
    })
  },
  searchInput(e){
    this.setData({
      searchValue:e.detail.value
    })
  },
  search(){
    this.getList()
  },
  //将所选的供应商存到新增采购单的store中
  chooseCustomer(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] 
    var data = this.data.customerList[e.currentTarget.dataset.index]
    prevPage.setData({
      customerName: data.customerName,
      customerNo: data.customerNo,
      custNo: data.custNo,
      seller: data.salesman,
      receiver: data.primaryContact,
      phoneNumber: data.contactPhone
    })
    
    wx.navigateBack()
  },
  //新增供应商
  add() {
    
    wx.navigateTo({
      url: '/pages/sales/addCustomer/addCustomer',
    })
  },
})