let app = getApp()
Page({
  data: {
    positionList: []
  },

  onLoad: function(options) {
   
  },

  onShow: function() {
    app.setTitle("职位管理")
    app.http("findRoles", {
      loginUserId: wx.getStorageSync("token")
    }, false, false).then(data => {
      this.setData({
        positionList: data.list
      })
    })
  },
  add(){
    wx.navigateTo({
      url: '/pages/company/positionManage/ positionOperate/ positionOperate?operateType=add'
    })
  },
  edit(e){
    wx.navigateTo({
      url: '/pages/company/positionManage/ positionOperate/ positionOperate?operateType=edit&editIndex='+e.currentTarget.dataset.index
    })
  }

})