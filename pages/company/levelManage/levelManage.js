let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelList: []
  },

   
  onLoad: function(options) {
    app.setTitle("等级管理")
  },

  onShow: function() {
    app.http("queryAllGrade").then(data => {
      this.setData({
        levelList: data.list
      })
    })
  },

  editLevel(e) {
    wx.navigateTo({
      url: '/pages/company/levelManage/levelOperate/levelOperate?operateType=edit&editIndex='+e.currentTarget.dataset.index, 
    })
  },
  addLevel() {
    wx.navigateTo({
      url: '/pages/company/levelManage/levelOperate/levelOperate?operateType=add'
    })
  }

})