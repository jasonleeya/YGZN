let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levels: {
      active: 0,
      list: [],
      idList: []
    },
    positions: {
      active: 0,
      list: []
    },
    infos: {},  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      operateType: options.operateType
    })
    var pages = getCurrentPages()
    var infos = pages[pages.length - 2].data.employeeList[options.editIndex]
    if (options.operateType === 'edit') {
      this.setData({
        infos,
      })
    }
    app.http("queryAllGrade").then(data => {
      var list = []
      var idList = []
      data.list.forEach(item => {
        list.push(item.name)
        idList.push(item.id)
      })
      this.setData({
        ["levels.list"]: list,
        ["levels.idList"]: idList
      })
      if (options.operateType === 'edit') {
        this.setData({
          ["levels.active"]: list.indexOf(infos.grade),
        })
      }
    })
    app.http("findRoles", {
      loginUserId: wx.getStorageSync("token")
    }, false, false).then(data => {
      var list = []
      data.list.forEach(item => {
        list.push(item.role_name)
      })
      this.setData({
        ["positions.list"]: list
      })
      if (options.operateType === 'edit') {
        this.setData({
          ["positions.active"]: list.indexOf(infos.position),
        })
      }
    })

  },

  onShow: function() {

  },
  choosePosition(e) {
    this.setData({
      ["positions.active"]: e.detail.value
    })
  },
  chooseLevel(e) {
    this.setData({
      ["levels.active"]: e.detail.value
    })
  },

  submit(e) {
    if (this.data.operateType === 'add') {
      var paramas = {
        roleId: "",
        userName: e.detail.value.userName,
        userPhone: e.detail.value.userLoginName,
        position: e.detail.value.position,
        grade: this.data.levels.idList[this.data.levels.active],
        remark: e.detail.value.remark,
      }
      app.http("insertSalesman", paramas).then(() => {
        app.showToast("添加成功")
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      }).catch((err) => {
        app.showToast(err)
      })
    }

    if (this.data.operateType === 'edit') {
      var paramas = {
        custNo: this.data.infos.custNo,
        roleId: "",
        userName: e.detail.value.userName,
        userPhone: e.detail.value.userLoginName,
        grade: this.data.levels.idList[this.data.levels.active],
        position: e.detail.value.position,
        remark: e.detail.value.remark,
        useStatus: e.detail.value.useStatus===true?'1':'0',
      }

      app.http("updateSalesman", paramas).then(() => {
        app.showToast("修改成功")
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      }).catch((err) => {
        app.showToast(err)
      })
    }
  },

  delete() {
    wx.showModal({
      title: '确定要删除此员吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("delSalesman", {
          custNo: this.data.infos.custNo
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
})