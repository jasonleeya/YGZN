let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("编辑发票信息")
    this.setData({
      operateType: options.operateType
    })
    if (options.operateType === 'edit') {
      var pages = getCurrentPages()
      var prePage = pages[pages.length - 2]
      var editData = prePage.data.invoiceInfos[options.editIndex]
      this.setData({
        editData,
        dftStatusCopy: JSON.parse(JSON.stringify(editData.dftStatus))
      })
    }
  },
  setDefault(e) {
    this.setData({
      ['editData.dftStatus']: e.detail.value === true ? '1' : '0'
    })
  },
  delete() {
    wx.showModal({
      title: '确定要删除此发票信息吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("deleteInvoice", {
          tableKey: this.data.editData.tableKey
        }).then(data => {
          app.showToast('删除成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast("删除失败")
        })
      }
    })
  },
  submit(e) {
    var formData = e.detail.value
    if(!formData.name){
      app.showToast("发票名称不能为空")
      return
    }
    if (!formData.duty) {
      app.showToast("纳税人识别号不能为空")
      return
    }
    if (!formData.address) {
      app.showToast("注册地址不能为空")
      return
    }
    if (!formData.telephone) {
      app.showToast("注册电话号码不能为空")
      return
    }
    if (!formData.openBank) {
      app.showToast("开户银行不能为空")
      return
    }
    if (!formData.account) {
      app.showToast("银行账户不能为空")
      return
    }


    if (this.data.operateType === 'edit') {
      formData.tableKey = this.data.editData.tableKey
      formData.invoiceType = this.data.editData.invoiceType
      formData.dftStatus = this.data.editData.dftStatus
      if (this.data.dftStatusCopy === '0') {
        if (this.data.editData.dftStatus === '1') {
          app.http("updateInvoiceDft", {
            tableKey: this.data.editData.tableKey
          })
        }
      }
    }
    if (this.data.operateType === 'add') {
      formData.tableKey = ''
      formData.invoiceType = '1'
      formData.dftStatus = '0'
    }
    app.http("updateInvoice", formData).then(data => {
      app.showToast(this.data.operateType === 'edit' ? "修改成功" : '添加成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(this.data.operateType === 'edit' ? "修改失败" : "添加失败")
    })
  }

})