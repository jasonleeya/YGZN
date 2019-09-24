let app = getApp()
Page({
  data: {
    supplierList: [],
    isLoad: false,
    currentPage: 0,
    searchValue: "",
    timeOut: null,
  },
  onLoad() {
    app.showToast('该页面功能尚未完善')
    app.setTitle("供应商管理")
  },
  onShow() {
    this.getList()
  },
  seeDetail(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    var data = this.data.supplierList[e.currentTarget.dataset.index]

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
    app.http("getSupplyList", {
      pageSize: 1000,
      keyword: this.data.searchValue,
      pageNo:0,
      status:"1,2"
    }).then(data => {
      if (data.list) {
          var tempList=[]
          data.list.forEach(item=>{
            tempList.push(item.customer)
          })
        this.setData({
          supplierList: this.data.supplierList.concat(tempList),
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
  edit(e) {
    wx.navigateTo({
      url: '/pages/index/mine/supplierOperate/supplierOperate?operateType=edit&index=' + e.currentTarget.dataset.index,
    })
  }
})