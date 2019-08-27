import store from '../../../store'
import create from '../../../utils/create'
let app = getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    supplierList: [],
    isLoad: false,
    currentPage: 0,
    searchValue: "",
    timeOut: null,
  },
  onLoad() {},
  onShow() {
    this.getList()
  },
  chooseSupplier(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      supplier: this.data.supplierList[e.currentTarget.dataset.index].supplyName,
      supplyNo: this.data.supplierList[e.currentTarget.dataset.index].supplyNo,
      customerType: this.data.supplierList[e.currentTarget.dataset.index].customerType
    })
    wx.navigateBack()
  },
  searchBlur(e) {},
  searchFocus(e) {},
  searchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
    if(this.data.timeOut){
      clearTimeout(this.data.timeOut)
    }
    var timeOut = setTimeout(() => {
      this.getList(true)
    }, 500)
    this.setData({
      timeOut:timeOut
    })
 
  },

  getList(isReplace = false) {
    if (isReplace) {
      this.setData({
        supplierList: []
      })
    }
    this.setData({
      isLoad: true,
    })
    app.http("getPurchasingSupplyNew", { 
      pageSize: 1000,
      keyword: this.data.searchValue, 
    }).then(data => {
      if (data.list) {
        this.setData({
          supplierList: this.data.supplierList.concat(data.list),
          isLoad: false,
        })
      } else {
        this.setData({
          isLoad: false
        })
      }
    })
  },
  scrollToBottom() {
    if (!this.data.isLoad) {
      this.setData({
        currentPage: this.data.currentPage + 1
      })
      this.getList()
    }
  },
  //新增供应商
  addSupplier() {
    wx.navigateTo({
      url: '/pages/purchase/addSupplier/addSupplier',
    })
  },
})