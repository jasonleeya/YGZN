import store from '../../../store'
import create from '../../../utils/create'
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    supplierList: []
  },
  onLoad() {
  },
  onShow(){
    //接收新建供应商的数据
    this.setData({
      supplierList: this.store.data.selectSupplier.supplierList
    })
  },

  //将所选的供应商存到新增采购单的store中
  chooseSupplier(e) {
    this.store.data.newPurchase.supplier = this.data.supplierList[e.currentTarget.dataset.index]
    wx.navigateBack()
  },
  //新增供应商
  addSupplier() {
    wx.navigateTo({
      url: '/pages/purchase/addSupplier/addSupplier',
    })
  },
})