import store from '../../../store'
import create from '../../../utils/create'
let app = getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    customerList: [],
    isLoad: true,
    curtPage: 1,
    totalPages:0,
    searchValue: "",
    timeOut: null,

  },
  onLoad() {
    app.setTitle("选择客户")
  },
  onShow() {
    this.getList()
  },
  getList(replace=true) {
    if(replace){
      this.setData({
        customerList: []
      })
    }
    this.setData({
      isLoad:true
    })
    app.http("queryCustomer", {
      pageSize: 10,
      pageNo:this.data.curtPage,
      keyword: this.data.searchValue
    }).then(data => {
      app.http("queryAllGrade").then(d => {
        data.list.forEach(item => {
          d.list.forEach(i => {
            if (i.id === item.grade) {
              item.grade = i.name
            }
          })
        })
        this.setData({
          customerList: this.data.customerList.concat(data.list),
          totalPages: data.totalPages,
          isLoad:false
        })
      })


    
    })
  },
  scrollToLower() { 
    if (this.data.isLoad){ 
      return
    }
    if (this.data.curtPage >= parseInt(this.data.totalPages)){
      app.showToast("没有更多了")
      return
    }
    this.setData({
      curtPage:this.data.curtPage+1
    })
    this.getList(false)
  },
  searchBlur(e) { },
  searchFocus(e) { },
  searchInput(e) {
    var timeOut = null
    clearTimeout(this.data.timeOut)
    timeOut = setTimeout(() => {
      this.setData({
        searchValue: e.detail.value
      })
      this.getList()
    }, 500)
    this.setData({ timeOut: timeOut })
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
      phoneNumber: data.contactPhone,
      address: data.address,
      approveStatus: data.approveStatus
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