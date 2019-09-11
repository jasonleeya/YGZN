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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.showToast("该页面功能尚未完善")
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