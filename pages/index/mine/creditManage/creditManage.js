import util from "../../../../utils/util.js"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerList: [],
    validTime: "",
    limitType: "",
    timeRangeType: "all",
    amountType: "all",
    creditType: "all",
    custNo: "",
    customerName: "",
    currPage: 0,
    isLoad: false,
    totalPages: null,

  },
  onLoad(options) {
    this.setData({
      ['timeRange.satart']: '',
      ['timeRange.end']: ''
    })
    this.getList()
  },
  onShow() {
    this.getList()
  },

  getList(replace = true) {
    if (replace) {
      this.setData({
        customerList: []
      })
    }
    this.setData({
      isLoad: true
    })
    var status = ""
    switch (this.data.creditType) {
      case "all":
        status = -1
        break
      case "unChecked":
        status = 0
        break
      case "checked":
        status = 1
        break
      case "disable":
        status = 2
        break
    }
    app.http("getCustCreditList", {
      pageNo: 0,
      pageSize: 10,
      custname: "",
      custcode: this.data.custNo,
      type: this.data.amountType === "all" ? "" : this.data.amountType,
      status: status,
      datestar: this.data.validTime
    }).then(data => {
      var list = data.list
      list.forEach(item => {
        switch (item.status) {
          case 0:
            item.statusStr = "未审核"
            break
          case 1:
            item.statusStr = "已审核"
            break
          case 2:
            item.statusStr = "已停用"
            break
          case 3:
            item.statusStr = "已过期"
            break
        }
        // item.begdate = util.formatTime(new Date(item.begdate)).substr(0,10)
        // item.enddate = util.formatTime(new Date(item.enddate)).substr(0, 10)
        item.begdate = item.begdate.match(/\d{4}-\d{2}-\d{2}/)
        item.enddate = item.enddate.match(/\d{4}-\d{2}-\d{2}/)
      })
      this.setData({
        isLoad: false,
        customerList: this.data.customerList.concat(list),
        totalPages: data.totalPages
      })
    })
  },
  toSelectCostomer() {
    wx.navigateTo({
      url: '/pages/sales/selectCustomer/selectCustomer'
    })
  },
  add() {
    wx.navigateTo({
      url: '/pages/index/mine/creditOperate/creditOperate?operateType=add'
    })
  },
  chooseLimitType(e) {
    var type = e.target.dataset.type
    if (type === this.data.limitType) {
      this.setData({
        limitType: ""
      })
    } else {
      this.setData({
        limitType: e.target.dataset.type
      })
    }

  },
  chooseTimeRangeType(e) {
    var type = e.target.dataset.type
    if (type === "all") {
      this.setData({
        validTime: ""
      })
    } else {
      this.setData({
        validTime: util.formatTime(new Date()).substr(0,10)
      })
    }
    this.getList()
    this.setData({
      timeRangeType: type
    })
  },
  chooseValidTime(e) {
    this.setData({
      validTime:util.formatTime(new Date(e.detail.value)).substr(0, 10) 
    })
    this.getList()
  },

  chooseAmountType(e) {
    this.setData({
      amountType: e.currentTarget.dataset.type
    })
    this.getList()
  },
  chooseCreditType(e) {
    console.log(e)
    this.setData({
      creditType: e.currentTarget.dataset.type
    })
    this.getList()
  },
  scrollToLower() {
    if (this.data.isLoad) {
      return
    }
    if (parseInt(this.data.totalPages) === parseInt(this.data.currPage) + 1) {
      app.showToast("没有更多客户了")
      this.setData({
        isLoad: false
      })
      return
    }
    this.setData({
      currPage: this.data.currPage + 1,
    })
    this.getList(false)
  },
  toEdit(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/index/mine/creditOperate/creditOperate?operateType=edit&index=' + index,
    })
  }
})