let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelList: [],
    nextLevel:''
  },

   
  onLoad: function(options) {
    app.setTitle("等级管理")
  },

  onShow: function() {
    app.http("queryAllGrade").then(data => {
      var list = JSON.parse(JSON.stringify(data.list))
      list.sort(function(a,b){
        return parseInt(a.name.match(/\d+/)[0]) - parseInt(b.name.match(/\d+/)[0])
      })
      var nextLevel = parseInt(list[list.length - 1].name.match(/\d+/)[0])+1 
      this.setData({
        levelList: data.list,
        nextLevel
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
      url: '/pages/company/levelManage/levelOperate/levelOperate?operateType=add&nextLevel=' + this.data.nextLevel
    })
  }

})