import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  data: {
    buyerList: []
  },
  onShow() {
    // this.store.data.selectBuyer.buyerList.sort(this.compare("letter"))

    //   this.setData({
    //     buyerList: this.store.data.selectBuyer.buyerList
    //   })
  
    app.http("queryAllUsingSalesman", { pageSize: 1000}).then(data=>{
      this.setData({
        buyerList:data.list
      }) 
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
  addBuyer() {
    wx.navigateTo({
      url: '/pages/purchase/addBuyer/addBuyer',
    })
  },
  selectedBuyer(e){
   
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
       buyer: e.detail
    })
    wx.navigateBack()
  },
 
});