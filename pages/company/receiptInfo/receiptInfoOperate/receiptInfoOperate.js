let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveInfos: [],
    statusCopy: ""
  },

  onLoad: function(options) {
    app.setTitle("编辑收款信息")
    this.setData({
      operateType: options.operateType
    })
    if (options.operateType === 'edit') {
      var pages = getCurrentPages()
      var prePageData = pages[pages.length - 2].data.receiptList[options.editIndex]
      this.setData({
        receiveInfos: prePageData,
        statusCopy: JSON.parse(JSON.stringify(prePageData.status))
      })
    }
  },

  onShow: function() {

  },
  delete() {
    wx.showModal({
      title: '确定要删除此账户吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("deleteAcct", {
          tableKey: this.data.receiveInfos.tableKey
        }).then(() => {
          app.showToast('删除成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      },
    })

  },
  submit(e) {
    var infos = e.detail.value
    if (!infos.openBank){
      app.showToast("开户行不能为空")
      return
    }
    if (!infos.account) {
      app.showToast("账号能为空")
      return
    }

    if (this.data.operateType === 'add') {
      infos.status = '0'
      infos.tableKey = ""
    }
    if (this.data.operateType === 'edit') {
      infos.tableKey = this.data.receiveInfos.tableKey
      infos.status = infos.status === true ? '1' : '0'
      if (infos.status !== this.data.statusCopy) {
        app.http("updateAcctStatus", {
          status: infos.status,
          tableKey: infos.tableKey
        })
      }
    }

    app.http("saveAccount", infos).then(() => {
      app.showToast(this.data.operateType === 'edit' ? "修改成功" : '添加成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
  }

})