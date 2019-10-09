let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos: {
      name: "",
      percent: "100",
      dftDiscount: "10",
      purchaseDiscount: "10"
    },
    dftStatusCopy: "",
  },

  onLoad: function(options) {
    app.setTitle("编辑等级")

    this.setData({
      operateType: options.operateType
    })
    if (options.operateType === 'edit') {
      var pages = getCurrentPages()
      var infos = pages[pages.length - 2].data.levelList[options.editIndex]
      this.setData({
        infos,
        dftStatusCopy: JSON.parse(JSON.stringify(infos.dftStatus))
      })
    }

  },

  onShow: function() {

  },

  submit(e) {
    var params = e.detail.value
    params.priority = ""
    if (!params.name){
      app.showToast("名称不能为空")
      return
    }
    if (!params.percent) {
      app.showToast("库存透明度不能为空")
      return
    }
    if (!params.dftDiscount) {
      app.showToast("销售价默认折扣不能为空")
      return
    }
    if (!params.purchaseDiscount) {
      app.showToast("面价默认折扣不能为空")
      return
    }

    if (this.data.operateType === 'edit') {
      if (this.data.infos.dftStatus !== this.data.dftStatusCopy) {
        app.http("updateDftGrade", {
          id: this.data.infos.id
        }, false, false)
      }

      params.id = this.data.infos.id
      app.http("updateGrade", params).then(() => {
        app.showToast("修改成功")
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      }).catch(err => {
        app.showToast(err)
      })
    }
    if (this.data.operateType === 'add') {
      params.id = ""
      app.http("insertGrade", params).then(() => {
        app.showToast("添加成功")
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      }).catch(err => {
        app.showToast(err)
      })
    }

  },
  delete() {
    wx.showModal({
      title: '确定要删除此等级吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("delGrade", {
          id: this.data.infos.id
        }).then(() => {
          app.showToast("删除成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast("删除失败")
        })
      }
    })
  },
  setDefault(e) {
    this.setData({
      ["infos.dftStatus"]: e.detail.value === true ? "1" : "0"
    })
  }

})