let app = getApp()
Page({
  data: {
    filterMethod: "",
    dateRangeType: "all",
    orderStatus: "-1",
    dateRange: {
      start: "",
      end: "",
      nowDate: ""
    },
    orderList: []
  },
  onLoad: function(options) {
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      ["dateRange.nowDate"]: nowDate
    })

  },
  onShow: function() {
    this.getList()
  },
  getList() {
    app.http("getAcceptBillList", {
      pageNo: 0,
      pageSize: 10,
      custcode: '',
      status: -1,
      begtime: this.data.dateRange.start,
      endtime: this.data.dateRange.end,
      searchstr: ''
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
  },
  chooseStatus(e) {
    this.setData({
      orderStatus: e.currentTarget.dataset.status
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