import store from '../../../store'
import create from '../../../utils/create'
let app = getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    supplierList: [],
    isLoad: true,
    currentPage: 0,
  },
  onLoad() {},
  onShow() {
    //接收新建供应商的数据
    // this.setData({
    //   supplierList: this.store.data.selectSupplier.supplierList
    // })
    app.http("getSupplyList", {
      pageNo: 0,
      pageSize: 15,
      keyword: "",
      status: "1,2"
    }, true).then(data => {
      this.setData({
        supplierList: data.list,
        isLoad: false,
      })
    })
  },

  //将所选的供应商存到新增采购单的store中
  chooseSupplier(e) {
    this.store.data.newPurchase.supplier = this.data.supplierList[e.currentTarget.dataset.index]

    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      supplier: this.data.supplierList[e.currentTarget.dataset.index].customer.supplyName
    })
    wx.navigateBack()
  },

  scrollToBottom() {
    if (!this.data.isLoad) {
      this.setData({
        isLoad: true,
        currentPage: this.data.currentPage + 1
      })
      app.http("getSupplyList", {
        pageNo: this.data.currentPage,
        pageSize: 15,
        keyword: "",
        status: "1,2"
      }, true).then(data => {
        if (data.list) {
          this.setData({
            supplierList: this.data.supplierList.concat(data.list),
            isLoad: false,
          })
        }else{
          this.setData({
            isLoad: false
          })
        }
      })
    }
  },
  //新增供应商
  addSupplier() {
    wx.navigateTo({
      url: '/pages/purchase/addSupplier/addSupplier',
    })
  },
})