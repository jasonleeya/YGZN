import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  data: {
    sellerList: [],
    setData:""
  },
  onShow() {
    app.http("queryAllUsingSalesman", { pageSize: 1000 }).then(data => {
      this.setData({
        sellerList: data.list
      })
    })
 
  },
  onLoad(opt){
    app.setTitle("选择销售员")
    this.setData({
      setData:opt.setData
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
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      [this.data.setData]: e.detail
    })
    wx.navigateBack()
  }
});