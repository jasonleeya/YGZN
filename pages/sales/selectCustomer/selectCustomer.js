import store from '../../../store'
import create from '../../../utils/create'
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    customerList: []
  },
  onLoad() {
  },
  onShow() {
    //接收新建供应商的数据
    this.setData({
      customerList: this.store.data.selectCustomer.customerList
    })
  },

  //将所选的供应商存到新增采购单的store中
  chooseCustomer(e) {
    this.store.data.newSales.customer = this.data.customerList[e.currentTarget.dataset.index]
    wx.navigateBack()
  },
  //新增供应商
  add() {
    wx.navigateTo({
      url: '/pages/sales/addCustomer/addCustomer',
    })
  },
})