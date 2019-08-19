// pages/purchase/orderDetail/orderDetail.js\
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    infos: {},
    canEdit: false,
    purchaseWarehouse: null,
    buyer: null,
    storehouse: {
      list: [],
      idList: [],
      index: null
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    //验证登录
    app.checkLogin()
    app.http("queryByOrderNo", {
      orderNo: options.orderNo
    }, false, false).then(data => {
      this.setData({
        infos: Object.assign(data.infoBody.address, data.infoBody.upp),
        goodsList: data.infoBody.lows,
        purchaseWarehouse: data.infoBody.upp.purchaseWarehouse
      })

      app.http("getWarehouse").then(wareHouse => {
        var list = []
        var idList = []
        var index = null
        wareHouse.list.forEach(item => {
          list.push(item.name)
          idList.push(item.tableKey)

          if (item.tableKey === this.data.purchaseWarehouse) {

            index = wareHouse.list.indexOf(item)
          }
        })
        this.setData({
          ["storehouse.list"]: list,
          ["storehouse.idList"]: idList
        })
        this.setData({
          ["storehouse.index"]: index
        })
      })




      console.log(this.data.infos)
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  orderLogs() {
    wx.navigateTo({
      url: '/pages/purchase/orderLogs/orderLogs',
    })
  },
  selectStorehouse: function(e) {
    this.setData({
      ["storehouse.index"]: e.detail.value,
      slectedStoreHouseId: this.data.storehouse.idList[e.detail.value]
    })
  },
  edit() {
    if (this.data.infos.orderStatus === "wait") {
      this.setData({
        canEdit: true
      })
    }
  },
  selectBuyer() {
    if (!this.data.canEdit) {
      return
    }
    wx.navigateTo({
      url: '/pages/purchase/selectBuyer/selectBuyer?setData=infos.buySalesMan',
    })
  },

  addAeceiveAddress() {
    if (!this.data.canEdit) {
      return
    }
    wx.navigateTo({
      url: '/pages/common/selectReceiveAddress/selectReceiveAddress?setData=infos.address'
    })
  },
  dateChange(e) {
    this.setData({
      ["infos.receiveTime"]: e.detail.value
    })
  },
})