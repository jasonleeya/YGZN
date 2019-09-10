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
    customerNo: ""
  },
  onLoad(options) {
    this.setData({
      ['timeRange.satart']: '',
      ['timeRange.end']: ''
    })
    this.getList()
  },
  onShow() {
    if (this.data.custNo !== "") {
      this.getList()
    }
  },

  getList() {
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
      this.setData({
        customerList: data.list
      })
    })
  },
  toSelectCostomer() {
    wx.navigateTo({
      url: '/pages/sales/selectCustomer/selectCustomer'
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
        validTime: new Date().toLocaleDateString().replace(/\//g, "-"),
      })
    }
    this.getList()
    this.setData({
      timeRangeType: type
    })
  },
  chooseValidTime(e) {
    this.setData({
      validTime: new Date().toLocaleDateString().replace(/\//g, "-"),
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
  }
})