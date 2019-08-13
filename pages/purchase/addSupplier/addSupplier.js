import store from '../../../store'
import create from '../../../utils/create'
let app=getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    region: "",
    address: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  addSubmit(e) {
    var info = e.detail.value  
    app.http("addProvider",{
      customerNo:"",
      blNumber: info.businessLicenseId,
      supplyName: info.company,
      supCompanyPhone: info.companyPhoneNumber,
      supContact: info.contact,
      supPhone: info.cantactPhoneNumber,
      supAddress: "【" + this.data.region[0] + "/" + this.data.region[1] + "/" + this.data.region[2] +"】"+info.address,
      supRemarks: info.remark
    }) 
    wx.navigateBack()
  }
})