import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    operateType: "",
    region: "",
    address: "",
    dftStatus: "",
    consignee: "",
    telephone: "",
    tableKey: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("编辑地址")
    this.setData({
      operateType: options.operateType
    })
    // this.setData({
    //   store:options.store.split(".")
    // })
    // var region = options.adress.match(/【.+】/g)[0].replace("【", "").replace("】", "").split("/")
    // var detail = options.adress.split("】")[1]

    //如果操作类型是edit,则加载数据
    if (options.operateType === "edit") {
      options.region = options.region.split("/")
      this.setData({
        region: options.region,
        address: options.address,
        dftStatus: options.dftStatus,
        consignee: options.consignee,
        telephone: options.telephone,
        tableKey: options.tableKey,
        custNo: options.custNo
      })
    }

  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  setDefault(e) {
    this.setData({
      isDefault: e.detail.value
    })
  },
  delete() {
    wx.showModal({
      title: '确定要删除此地址吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("deleteAddress", {
          tableKey: this.data.tableKey
        }).then(() => {
          app.showToast("删除地址成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast("删除地址失败")
        })
      }
    })
  },
  addSubmit(e) {
    var value = e.detail.value
    if (!value.consignee) {
      app.showToast("请填写收货人")
      return
    }
    if (!value.telephone) {
      app.showToast("请填写收货电话")
      return
    }
    if (!value.region) {
      app.showToast("请选择地区")
      return
    }
    if (!value.address) {
      app.showToast("请填写详细地址")
      return
    }
    console.log(value)

    app.http("updateUserAddress", {
      tableKey: this.data.tableKey,
      consignee: value.consignee,
      telephone: value.telephone,
      address: value.address,
      province: value.region[0],
      city: value.region[1],
      area: value.region[2],
      dftStatus: value.dftStatus ? "1" : "0"
    }).then(() => {
      if (value.dftStatus === true) {
        app.http("updateUserDftAddress", {
          tableKey: this.data.tableKey,
          custNo: this.data.custNo
        }).then(() => {
          wx.navigateBack()
        })
      } else {
        wx.navigateBack()
      }

    })

  }

})