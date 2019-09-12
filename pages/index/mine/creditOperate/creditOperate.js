let app = getApp()
Page({

  data: {
    begtime: '',
    endtime: '',
    custcode: '',
    // custname:'',
    type: '',
    credit: '',
    custNo: "",
    customerName: "",
    creditType: {
      active: 0,
      list: ["固定额度", "临时额度"],
      idList: ['fixed', 'temp']
    },
    operateType: "",
    editIndex: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    switch (options.operateType) {
      case "add":
        this.setData({
          operateType: "add"
        })
        break
      case "edit":
        var index = options.index
        var pages = getCurrentPages()
        var curPage = pages[pages.length - 2]
        var prePageData = curPage.data.customerList[index]

        this.setData({
          operateType: "edit",
          editIndex: index,

          begtime: prePageData.begdate,
          endtime: prePageData.enddate,
          custcode: prePageData.custcode,
          type: prePageData.type,
          credit: prePageData.credit,
          custNo: prePageData.custNo,
          customerName: prePageData.custname,

          ["creditType.active"]: this.data.creditType.idList.indexOf(prePageData.type) > -1 ? this.data.creditType.idList.indexOf(prePageData.type) : 0
        })
    }
  },
  toSelectCostomer() {
    wx.navigateTo({
      url: '/pages/sales/selectCustomer/selectCustomer'
    })
  },
  bindCreditTypeChange(e) {
    this.setData({
      ["creditType.active"]: e.detail.value
    })
  },
  bindBegTimeChange(e) {
    var value = e.detail.value
    if (new Date(this.data.endtime).getTime() < new Date(value).getTime()) {
      value = this.data.endtime
    }
    this.setData({
      begtime: value
    })
  },
  bindEndTimeChange(e) {
    var value = e.detail.value
    if (new Date(value).getTime() < new Date(this.data.begtime).getTime()) {
      value = this.data.begtime
    }
    this.setData({
      endtime: value
    })

  },
  changeEnableStatus(e) {
    console.log(e)
  },
  formSubmit(e) {
    if (this.data.disable) {
      return
    }
    var formData = e.detail.value
    formData.custcode = this.data.custNo
    formData.tableKey = ""
    if (formData.custname === "") {
      app.showToast("请选择客户")
      return
    }
    if (formData.credit === "") {
      app.showToast("请填写信用额度")
      return
    }
    if (formData.begtime === "") {
      app.showToast("请选择开始时间")
      return
    }
    if (formData.endtime === "") {
      app.showToast("请选择结束时间")
      return
    }
    // if (formData.endtime === formData.begtime) {
    //   app.showToast("所选时间段重合,请重新选择")
    //   return
    // }

    app.http("creditEdit", formData).then(res => {
      this.setData({
        disable: true
      })
      app.showToast("添加成功")
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }).catch(err => {
      app.showToast(err)
    })
  }

})