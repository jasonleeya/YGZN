// pages/common/selectReceiveAddress/selectReceiveAddress.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    setData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      addressKey: options.addressKey,
      phoneNumberKey: options.phoneNumberKey,
      receiverKey: options.receiverKey
    })
  },
  onShow: function() {


    var address = ""
    app.http("getDtfAddress").then(data => {
      address = data.list
      address.forEach(item => {
        item.region = item.province + "/" + item.city + "/" + item.area
      }, true)
      this.setData({
        list: address
      })
    })

  },



  edit(e) {
    var index = e.currentTarget.dataset.index
    var address = this.data.list[index]
    wx.navigateTo({
      url: '/pages/common/operateReceiveAddress/operateReceiveAddress?operateType=edit&consignee=' + address.consignee + '&telephone=' + address.telephone + '&region=' + address.region + '&address=' + address.address + "&dftStatus=" + address.dftStatus + "&tableKey=" + address.tableKey + "&custNo=" + address.custNo
    })
  },
  add() {
    wx.navigateTo({
      url: '/pages/common/operateReceiveAddress/operateReceiveAddress?operateType=add'
    })
  },
  choose(e) {
    var index = e.currentTarget.dataset.index
    getCurrentPages()[getCurrentPages().length - 2].setData({
      [this.data.addressKey]: "【" + this.data.list[index].region + "】" + this.data.list[index].address,
      [this.data.phoneNumberKey]: this.data.list[index].telephone,
      [this.data.receiverKey]: this.data.list[index].consignee, 
    })
    wx.navigateBack({
      delta: 1,
    })
  }
})