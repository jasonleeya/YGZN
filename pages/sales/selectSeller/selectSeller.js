import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  data: {
    sellerList: []
  },
  onShow() {
    this.store.data.selectSeller.sellerList.sort(this.compare("letter"))

    this.setData({
      sellerList: this.store.data.selectSeller.sellerList
    })
  },
  compare(pro) {
    return function (obj1, obj2) {
      var val1 = obj1[pro];
      var val2 = obj2[pro];
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  add() {
    wx.navigateTo({
      url: '/pages/sales/addSeller/addSeller',
    })
  },
  selectedSeller(e) {
    var selectedName =
      this.store.data.newSales.seller = e.detail
    wx.navigateBack()
  }
});