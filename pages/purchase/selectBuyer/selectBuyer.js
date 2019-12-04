import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  data: {
    buyerList: [],
    setData:null
  },
  onLoad(options){
    app.setTitle("选择采购员")
    this.setData({
      setData:options.setData
    })
  },
  onShow() {
    this.setData({
      buyerList:[]
    })
   app.http("queryAllUsingSalesman", { pageSize: 10000}).then(data=>{
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
       [this.data.setData]: e.detail
    })
    wx.navigateBack()
  },
  focus(){
    app.showToast("暂不支持搜索,抱歉")
  }
});