import util from "../../../utils/util.js"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTabIndex: '0',
    baseInfos: {},
    receiveAddress: [],
    invoiceInfos: [],
    companyCertification: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("公司信息")
    app.http("getUserByCustNo").then(data => {
      this.setData({
        baseInfos: data.list[0]
      })
    })
  },
  onShow() {
    app.http("getUserAddress").then(data => {
      this.setData({
        receiveAddress: data.list
      })
    })
    app.http("getAllInvoice").then(data => {
      this.setData({
        invoiceInfos: data.list
      })
    })
    app.http("findDataByUserId").then(data => {
      this.setData({
        companyCertification: data.list[0]
      })
    })
  },
  submit(e) {
    var formData = e.detail.value
    formData.userNo = ""
    formData.negative = formData.negative === true ? '1' : '0'

    wx.showModal({
      title: '确定要修改吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("updateUser", formData).then(() => {
          app.showToast("修改成功")
        }).catch((err) => {
          app.showToast(err)
        })
      }
    })


  },
  toggleTab(e) {
    this.setData({
      activeTabIndex: e.currentTarget.dataset.index
    })
  },
   
  uploadCertification() {
   wx.chooseImage({
     complete: (res) => {},
     count: 0,
     fail: (res) => {},
     sizeType: [],
     sourceType: [],
     success: (result) => {
      var tempFilePaths = res.tempFilePaths
      wx.uploadFile({
        url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        formData:{
          'user': 'test'
        },
        success: function(res){
          var data = res.data
          //do something
        }
      })
     },
   })

  },
  editReceeiveAddress(e) {
    var index = e.currentTarget.dataset.index
    var address = this.data.receiveAddress[index]

    wx.navigateTo({
      url: util.objToUrl({
        operateType: "edit",
        consignee: address.consignee,
        telephone: address.telephone,
        region: address.province + "/" + address.city + "/" + address.area,
        address: address.address,
        dftStatus: address.dftStatus,
        tableKey: address.tableKey,
        custNo: address.custNo
      }, "/pages/common/operateReceiveAddress/operateReceiveAddress")

    })
  },
  addRecerveAddress() {
    wx.navigateTo({
      url: '/pages/common/operateReceiveAddress/operateReceiveAddress?operateType=add'
    })
  },
  addInvoiceInfo() {
    wx.navigateTo({
      url: '/pages/company/companyInfos/invoiceOperate/invoiceOperate?operateType=add'
    })
  },
  editInvoiceInfo(e) {
    wx.navigateTo({
      url: '/pages/company/companyInfos/invoiceOperate/invoiceOperate?operateType=edit&editIndex=' + e.currentTarget.dataset.index
    })
  }
})