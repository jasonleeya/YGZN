let app = getApp()
Page({
  data: {
    infos: {},
    operateType: "",
    dftStatus: "",
    dftStatusCopy: ""
  },
  onLoad: function(options) {
    app.setTitle("编辑仓库信息")
    this.setData({
      operateType: options.operateType,
    })
    if (options.operateType === 'edit') {
      var pages = getCurrentPages()
      var infos = pages[pages.length - 2].data.wareHouseList[options.operateIndex]

      this.setData({
        infos: infos,
        dftStatus: infos.dftStatus,
        dftStatusCopy: infos.dftStatus
      })
    }
  },
  onShow: function() {

  },
  chooseRegion(e) {
    this.setData({
      ["infos.region"]: e.detail.value
    })
  },
  setDefault(e) {
    this.setData({
      dftStatus: e.detail.value === true ? '1' : '0'
    })
  },
  delete() {
    wx.showModal({
      title: '确定要删除此仓库吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("delWarehouse", {
          tableKey: this.data.infos.tableKey
        }, false, false).then(() => {
          app.showToast("删除成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      }
    })
  },
  submit(e) {
    var formData = e.detail.value
    formData.region = formData.region.join('/')
    console.log(formData)
    app.http("saveWarehouse", {
      tableKey: this.data.operateType === 'add' ? '' : this.data.infos.tableKey,
      name: formData.name,
      dftStatus: this.data.operateType === 'add' ? '0' : this.data.infos.dftStatus,
      province: this.data.infos.region[0] ? this.data.infos.region[0] : '',
      city: this.data.infos.region[1] ? this.data.infos.region[1] : '',
      area: this.data.infos.region[2] ? this.data.infos.region[2] : '',
      address: formData.address,
      remark: formData.remark,
      status: 1,
    }).then(() => {
      app.showToast(this.data.operateType === 'add' ? '添加成功' : '修改成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })

    if (this.data.operateType === 'edit') {

      if (this.data.dftStatusCopy !== this.data.dftStatus) {
        app.http("setDftWarehouse", {
          tableKey: this.data.infos.tableKey
        })
      }
    }
  }
})