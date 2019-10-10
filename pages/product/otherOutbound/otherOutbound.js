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
    showSearchList: false,
    searchValue: "",
    searchListTimeOut: null,
    searchList: [],
    searchListTotlePage: 0,
    searchListCurPage: 1,
    searchListLoading: false
  },

  onLoad: function(options) {
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
    this.getList()
  },
  onShow: function() {

  },

  getList() {
    var params = {}
    if (this.data.searchType !== '订单号') {
      params = {
        tranNo: "",
        startTime: this.data.dateRange.start,
        wareKey: this.data.warehouse,
        itemKey: this.data.searchValue,
        status: this.data.orderStatus,
        pageNo: this.data.searchListCurPage,
        pageSize: 20,
        tranCode: 2,
      }
    } else {
      params = {
        tranNo: this.data.searchValue,
        startTime: this.data.dateRange.start,
        wareKey: this.data.warehouse,
        status: this.data.orderStatus,
        pageNo: this.data.searchListCurPage,
        pageSize: 20,
        tranCode: 2,
      }
    }
    app.http("selectData", params).then(data => {
      var list=data.list
      list.forEach(item=>{
        item.tranDate = item.tranDate.match(/\d*-\d*-\d*/) + " " + item.tranDate.match(/\d*:\d*:\d*/)
      })
      this.setData({
        orderList: data.list
      })
    })
  },
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
        ["dateRange.start"]: this.data.dateRange.nowDate,
        ["dateRange.end"]: this.data.dateRange.nowDate,
      })
    }
    this.setData({
      searchType: this.data.searchType === '订单号' ? '产品代码' : '订单号'
    })
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
      searchList: []
    })
    var timeOut = setTimeout(handler, 500)
    this.setData({
      searchListTimeOut: timeOut
    })


  },
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
      searchValue: e.currentTarget.dataset.code
    })
    this.getList()
  },
  closeSearchList() {
    this.setData({
      showSearchList: false
    })
  },
  searchListScorllToLower() {
    if (this.data.searchListLoading === true || parseInt(this.data.searchListTotlePage) < this.data.searchListCurPage) {
      return
    }
    this.setData({
      searchListCurPage: this.data.searchListCurPage + 1
    })
    this.getSearchList()
  },

  chooseFilterMethod(e) {
    var method = e.currentTarget.dataset.method
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
  },
  chooseWarehouse(e) {
    this.setData({
      warehouse: e.currentTarget.dataset.id
    })
  },
  startDateChange(e) {
    var d = e.detail.value
    if (new Date(this.data.dateRange.end).getTime() < new Date(d).getTime()) {
      d = this.data.dateRange.end
    }
    this.setData({
      ["dateRange.start"]: d
    })
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
  },
})