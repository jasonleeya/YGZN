let app = getApp()
Page({

  data: {
    operateType: '',
    infos: {}
  },

  onLoad: function(options) {
    app.setTitle("职位编辑")
    this.setData({
      operateType: options.operateType
    })
    if (options.operateType === 'edit') {
      var pages = getCurrentPages()
      var infos = pages[pages.length - 2].data.positionList[options.editIndex]
      this.setData({
        infos
      })
    }
  },
  onShow: function() {

  },
  submit(e) {
    var parama = e.detail.value
    if (!parama.role_name){
      app.showToast("职位名称不能为空")
      return
    }
    
    if (this.data.operateType === 'add') {
      parama.role_id = ""
    }
    if (this.data.operateType === 'edit') {
      parama.role_id = this.data.infos.role_id
    }
    app.http("addOrUpdateRole", parama).then(() => {
      app.showToast(this.data.operateType === 'add' ? "添加成功" : '修改成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
  },
  delete() {
    wx.showModal({
      title: '确定要删除此职位吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("deleteRole", {
          role_id: this.data.infos.role_id,
          loginUserId: wx.getStorageSync("token")
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
  }
})