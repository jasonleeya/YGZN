let app = getApp()
Page({
  data: {
    dateRange: {
      start: "",
      end: "",
      nowDate: ""
    },
    warehouseList: [],
    filterMethod: "",
    orderStatus: "",
    warehouse: "",
    searchType: "订单号",
    orderList: [],
    timeRangeType: "all",
    orderListTotalPage: 0,
    orderListCurPage: 1,
    orderListLoading: false,
    showSearchList: false,
    searchValue: "",
    searchItemKey: "",
    searchListTimeOut: null,
    searchList: [],
    searchListTotlePage: 0,
    searchListCurPage: 1,
    searchListLoading: false,
  },

  onLoad: function (options) {
    app.setTitle("其他出入库")
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      ["dateRange.nowDate"]: nowDate
    })

    app.http("getWarehouse").then(data => {
      this.setData({
        warehouseList: data.list
      })
    })
    this.getList(false)
  },
  onShow: function () {

  },
  /**
   * @replece: true替换列表false push列表
   */
  getList(replace = true) {
    if (replace) {
      this.setData({
        orderListCurPage: 1,
        searchListCurPage: 0
      })
    }
    var params = {}
    this.setData({
      orderListLoading: true
    })
    if (this.data.searchType !== '订单号') {
      params = {
        tranNo: "",
        startTime: this.data.dateRange.start,
        wareKey: this.data.warehouse,
        itemKey: this.data.searchItemKey,
        status: this.data.orderStatus,
        pageNo: this.data.orderListCurPage,
        pageSize: 5,
        tranCode: 2,
      }
    } else {
      params = {
        tranNo: this.data.searchValue,
        startTime: this.data.dateRange.start,
        wareKey: this.data.warehouse,
        status: this.data.orderStatus,
        pageNo: this.data.orderListCurPage,
        pageSize: 5,
        tranCode: 2,
      }
    }
    app.http("selectData", params).then(data => {
      var list = data.list
      list.forEach(item => {
        item.tranDate = item.tranDate.match(/\d*-\d*-\d*/) + " " + item.tranDate.match(/\d*:\d*:\d*/)
        switch (item.status) {
          case '0':
            item.status = '未提交'
            break
          case '1':
            item.status = '未审核'
            break
          case '2':
            item.status = '已提交'
            break
          case '3':
            item.status = '已审核'
            break
        }
      })
      this.setData({
        orderList: replace ? list : this.data.orderList.concat(list),
        orderListTotalPage: data.totalPages,
        orderListLoading: false
      })
    })
  },
  orderListScrollToLower(e) {
    if (this.data.orderListLoading || parseInt(this.data.orderListTotalPage) <= this.data.orderListCurPage) {
      return
    }
    this.setData({
      orderListCurPage: this.data.orderListCurPage + 1
    })
    this.getList(false)
  },

  //切换搜索类型
  toggleSearchType() {
    if (this.data.searchType !== '订单号') {
      this.setData({
        filterMethod: "",
        orderStatus: "",
        warehouse: "",
        searchList: [],
        searchValue: '',
        showSearchList: false,
        ["dateRange.start"]: '',
        ["dateRange.end"]: '',
      })
    } else {
      this.setData({
        searchValue: '',
      })
    }
    this.setData({
      orderList: [],
      searchType: this.data.searchType === '订单号' ? '产品代码' : '订单号'
    })
    this.getList()
  },
  searchFocus() {
    if (this.data.searchType === "订单号") {
      return
    }
    this.setData({
      showSearchList: true
    })
  },
  searchInput(e) {
    var handler = () => {
      var value = e.detail.value
      if (value === "") {
        return
      }
      this.setData({
        searchValue: e.detail.value
      })
      if (this.data.searchType !== '订单号') {
        this.getSearchList()
      } else {
        this.getList()
      }
    }
    clearTimeout(this.data.searchListTimeOut)
    this.setData({
      searchListTimeOut: null,
      searchList: [],
      searchListTotlePage: 0,
      searchListCurPage: 1,
      searchItemKey: ""
    })
    var timeOut = setTimeout(handler, 500)
    this.setData({
      searchListTimeOut: timeOut
    })


  },
  //获取通过产品代码搜索的产品
  getSearchList() {
    this.setData({
      searchListLoading: true
    })
    app.http("searchStockProduct", {
      wareKey: "",
      pageNo: this.data.searchListCurPage,
      pageSize: 20,
      searchKey: this.data.searchValue,
      custNo: ""
    }).then(data => {
      this.setData({
        searchList: this.data.searchList.concat(data.list),
        searchListLoading: false,
        searchListTotlePage: data.totalPages
      })
    })
  },
  chooseBrandCode(e) {
    this.setData({
      searchValue: e.currentTarget.dataset.code,
      searchItemKey: e.currentTarget.dataset.key,
    })
    this.getList()
  },
  closeSearchList() {
    this.setData({
      showSearchList: false
    })
  },
  searchListScorllToLower() {
    if (this.data.searchListLoading || parseInt(this.data.searchListTotlePage) <= this.data.searchListCurPage) {
      return
    }
    this.setData({
      searchListCurPage: this.data.searchListCurPage + 1
    })
    this.getSearchList()
  },
  //选择筛选方式
  chooseFilterMethod(e) {
    var method = e.currentTarget.dataset.method
    if (method === 'more') {
      app.showToast("暂不支持更多筛选方式")
    }
    if (this.data.filterMethod === method) {
      this.setData({
        filterMethod: ""
      })
      method = ""
    }
    this.setData({
      filterMethod: method
    })
  },
  chooseOrderStatus(e) {
    this.setData({
      orderStatus: e.currentTarget.dataset.status
    })
    this.getList()
  },
  chooseWarehouse(e) {
    this.setData({
      warehouse: e.currentTarget.dataset.id
    })
    this.getList()
  },
  chooseTimeRangeType(e) {
    this.setData({
      timeRangeType: e.currentTarget.dataset.type
    })
    if (this.data.timeRangeType === 'custom') {
      this.setData({
        ["dateRange.start"]: this.data.dateRange.nowDate,
        ["dateRange.end"]: this.data.dateRange.nowDate,
      })
    } else {
      this.setData({
        ["dateRange.start"]: '',
        ["dateRange.end"]: '',
      })
    }
    this.getList()
  },
  startDateChange(e) {
    var d = e.detail.value
    if (new Date(this.data.dateRange.end).getTime() < new Date(d).getTime()) {
      d = this.data.dateRange.end
    }
    this.setData({
      ["dateRange.start"]: d
    })
    this.getList()
  },
  endDateChange(e) {
    var d = e.detail.value

    if (new Date(this.data.dateRange.nowDate).getTime() < new Date(d).getTime()) {
      d = this.data.dateRange.nowDate
    }
    if (new Date(this.data.dateRange.start).getTime() > new Date(d).getTime()) {
      d = this.data.dateRange.start
    }
    this.setData({
      ["dateRange.end"]: d
    })
    this.getList()
  },
  //添加订单
  addOrder(){
    wx.navigateTo({
      url: '/pages/product/otherOutboundAndStorage/ordersOperate/ordersOperate?operateType=add' 
    })
  }
})
 