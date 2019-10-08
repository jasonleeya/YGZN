let app = getApp()
Page({

  data: {
    wareHouseList: []
  },
  onLoad: function(options) {
    app.setTitle("仓库管理")

  },
  onShow: function() {
    app.http("getWarehouse").then((data) => {
      var list = data.list
      list.forEach(item => {
        item.region = !item.province && !item.city && !item.area ? "" : [item.province, item.city, item.area]
      })
      this.setData({
        wareHouseList: list
      })
    })
  },
  edit(e) {
    wx.navigateTo({
      url: '/pages/product/warehouseOperate/warehouseOperate?operateType=edit&operateIndex=' + e.currentTarget.dataset.index
    })
  },
  add() {
    wx.navigateTo({
      url: '/pages/product/warehouseOperate/warehouseOperate?operateType=add'
    })
  }
})