import util from "../../../utils/util.js"
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
      receiverKey: options.receiverKey,
    })
    if (options.addressIdKey) {
      this.setData({
        addressIdKey: options.addressIdKey
      })

    }
  },
  onShow: function() {
    app.setTitle("选择地址")

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
      // url: '/pages/common/operateReceiveAddress/operateReceiveAddress?operateType=edit&consignee=' + address.consignee + '&telephone=' + address.telephone + '&region=' + address.region + '&address=' + address.address + "&dftStatus=" + address.dftStatus + "&tableKey=" + address.tableKey + "&custNo=" + address.custNo
      //对象转url
      url: util.objToUrl({
        operateType: "edit",
        consignee: address.consignee,
        telephone: address.telephone,
        region: address.region,
        address: address.address,
        dftStatus: address.dftStatus,
        tableKey: address.tableKey,
        custNo: address.custNo
      }, "/pages/common/operateReceiveAddress/operateReceiveAddress")

    })
  },
  add() {
    wx.navigateTo({
      url: '/pages/common/operateReceiveAddress/operateReceiveAddress?operateType=add'
    })
  },
  //设置上个页面的收货信息data
  choose(e) {
    var index = e.currentTarget.dataset.index
    var prePage = getCurrentPages()[getCurrentPages().length - 2]
    prePage.setData({
      [this.data.addressKey]: "【" + this.data.list[index].region + "】" + this.data.list[index].address,
      [this.data.phoneNumberKey]: this.data.list[index].telephone,
      [this.data.receiverKey]: this.data.list[index].consignee,
    })
    if (this.data.addressIdKey){
      prePage.setData({
        [this.data.addressIdKey]: this.data.list[index].tableKey,
      })
    }
    wx.navigateBack({
      delta: 1,
    })
  }
})