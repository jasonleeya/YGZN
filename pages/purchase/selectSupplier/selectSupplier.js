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
  onLoad() {
    app.setTitle("选择供应商")
  },
  onShow() {
    this.getList()
  },
  chooseSupplier(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    var data = this.data.supplierList[e.currentTarget.dataset.index]
    prevPage.setData({
      isAutoAssign: false,
      supplier: data.supplyName,
      supplyNo: data.supplyNo,
      customerType: parseInt(data.approveStatus)===1?'up':'down',
      approveStatus: data.approveStatus
    })
    wx.navigateBack()
  },
  autoAssign() {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      isAutoAssign: true,
      supplier: "自动分配订单",
      supplyNo: "AUTO",
      customerType: "", 
    })
    wx.navigateBack()
  },
  searchBlur(e) {},
  searchFocus(e) {},
  searchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
    if (this.data.timeOut) {
      clearTimeout(this.data.timeOut)
    }
    var timeOut = setTimeout(() => {
      this.getList(true)
    }, 500)
    this.setData({
      timeOut: timeOut
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
        if(data.list.length===0){
          app.showToast("无可选供应商或供应商申请正在审核中",2000)
        }
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
    // if (!this.data.isLoad) {
    //   this.setData({
    //     currentPage: this.data.currentPage + 1
    //   })
    //   this.getList()
    // }
  },
  //新增供应商
  addSupplier() {
    wx.navigateTo({
      url: '/pages/index/mine/supplierOperate/supplierOperate?operateType=add',
    })
  },
})