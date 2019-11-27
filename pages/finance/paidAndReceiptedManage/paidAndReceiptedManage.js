let app = getApp()
Page({
  data: {
    type:"收款",
    filterMethod: "",
    dateRangeType: "all",
    orderStatus: "-1",
    dateRange: {
      start: "",
      end: "",
      nowDate: ""
    },
    orderList: [],
    timeOut: null,
    searchList: [],
    showSearchList: false,
    searchValue: "",
    custNo: ""
  },
  onLoad: function(options) {
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      ["dateRange.nowDate"]: nowDate,
      type:options.type
    })
    app.setTitle("已"+this.data.type+"管理")
  },
  onShow: function() {
    this.getList()
  },
  getList() {
    app.http("getAcceptBillList", {
      pageNo: 0,
      pageSize: 1000,
      custcode: this.data.custNo,
      status: this.data.orderStatus,
      begtime: this.data.dateRange.start,
      endtime: this.data.dateRange.end,
      searchstr: ""
    }).then(data => {
      var list = data.list
      list.forEach(item => {
        switch (item.bill.status) {
          case 0:
            item.bill.statusStr = "未提交"
            break
          case 1:
            item.bill.statusStr = "已提交"
            break
          case 2:

            item.bill.statusStr = "已审核"
            break
          case 3:
            item.bill.statusStr = "已撤销"
            break
        }
 
        var date = new Date(item
          .bill.billdate)
        item.bill.billdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      })

      this.setData({
        orderList: list
      })
    })
  },
  chooseFilterMethod(e) {
    var method = e.currentTarget.dataset.method
    if (method === this.data.filterMethod) {
      method = ""
    }
    this.setData({
      filterMethod: method
    })
  },
  chooseDateRangeType(e) {
    this.setData({
      dateRangeType: e.currentTarget.dataset.type
    })
    if (this.data.dateRangeType === 'custom') {
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
  chooseStatus(e) {
    this.setData({
      orderStatus: e.currentTarget.dataset.status
    })
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
  searchInput(e) {
    var timeOut = null
    if (this.data.timeOut) {
      clearTimeout(this.data.timeOut)
    }
    timeOut = setTimeout(() => {
      if (e.detail.value === '') {
        this.setData({
          searchList:[],
          custNo:""
        })
        this.getList()
        return
      }
      app.http("queryCustomer", {
        pageSize: 1000,
        keyword: e.detail.value
      }).then(data => {
        this.setData({
          searchList: data.list
        })
      })
    }, 300)
    this.setData({
      timeOut
    })
  },
  searchFocus(e) {
    this.setData({
      showSearchList: true
    })
  },
  chooseCustomer(e) {
    this.setData({
      searchValue: e.currentTarget.dataset.name,
      custNo: e.currentTarget.dataset.no
    })
    this.getList()
  },
  closeSearchList() {
    this.setData({
      showSearchList: false
    })
  },
  add(){
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/paidAndReceiptedOperate/paidAndReceiptedOperate?type='+this.data.type+'&operateType=add' 
    })
  },
  edit(e) {
    wx.navigateTo({
      url: '/pages/finance/paidAndReceiptedManage/paidAndReceiptedOperate/paidAndReceiptedOperate?type=' + this.data.type +'&operateType=edit&editIndex='+e.currentTarget.dataset.index
    })
  },
})