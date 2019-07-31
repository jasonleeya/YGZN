import store from '../../../store'
import create from '../../../utils/create'
create(store, {

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  addSubmit(e) {
    var info = e.detail.value
    info.companyType = "自建"
    info.supplierType = "普通客户"
    //添加所填信息到选择供应商页面store中
    this.store.data.selectSupplier.supplierList.push(e.detail.value)
    wx.navigateBack()
  }
})