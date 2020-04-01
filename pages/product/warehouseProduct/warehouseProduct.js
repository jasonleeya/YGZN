let app = getApp()
Page({
  data: {
    productList: [],
    isShowFilterDropdown: false,
    count: 0,
    curPage: 1,
    totalPages: 0,
    isLoading: false,
    searchText: "",
    timeOut: null,
    userAlias:""
  },
  onLoad: function (options) {
    app.http("getUserByCustNo").then(data=>{
      this.setData({
        userAlias:data.list[0].userAlias
      })
      this.getList() 
    })

  },
  onReady: function () {

  },
  onShow: function () {
    // this.setData({
    //   productList:[],
    //   searchText:""
    // })
    this.getList()
  },
  getList() {
    this.setData({
      isLoading: true
    })
    wx.request({
      url: 'https://gateway.imatchas.com/imatchProduct/product/getProductsByBrandName',
      data: {
        brandName: this.data.userAlias,
        pageIndex: this.data.curPage,
        pageSize: 10
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (result) => {
        var data = result.data.infoBody
        data.content.forEach(item => {
          item.imgUrl = !item.imgPathList ? "" : 'http://182.151.17.189:24000/res' + item.imgPathList.split(',')[0]
        })
        this.setData({
          isLoading: false,
          productList: this.data.productList.concat(data.content),
          count: data.totalElements,
          totalPages: data.totalPages
        })
      },
      fail: (res) => {
        app.showToast(res)
      },
    })
  },
  scrollToLower(e) {
    if (this.data.isLoading) {
      return
    }
    if (this.data.totalPages < this.data.curPage) {
      app.showToast("没有更多产品了")
      return
    }
    this.setData({
      curPage: this.data.curPage + 1
    })

    this.getList()
  },
  addProduct() {
    wx.navigateTo({
      url: '/pages/product/warehouseProduct/productOperate/productOperate?type=add'
    })
  },
  toggleFilterDropdown() {
    this.setData({
      isShowFilterDropdown: !this.data.isShowFilterDropdown
    })
  },
  seeDetail(e) {
    wx.navigateTo({
      url: '/pages/product/warehouseProduct/productOperate/productOperate?operateIndex=' + e.currentTarget.dataset.index
    })
  },
  searchInput(e) {
    var searchText = e.detail.value
    if (searchText === '') {
      this.setData({
        productList: [],
        searchText: ""
      })
      this.getList()
      return
    }
    this.setData({
      searchText: searchText
    })
    if (this.data.timeOut) {
      clearTimeout(this.data.timeOut)
      this.setData({
        timeOut: null
      })
    }
    var timeOut = setTimeout(() => {
      this.search()
    }, 500)
    this.setData({
      timeOut
    })
  },
  search() {
    app.http("searchHome", {
      selectKey: this.data.searchText,
      propertyId: "",
      brandName: "",
      start: 1,
      minView: 10,
    }).then(data => {
      this.setData({
        productList: data.infoBody,
        count: data.count
      })
    }).catch(err => {
      app.showToast(err)
    })
  }
})