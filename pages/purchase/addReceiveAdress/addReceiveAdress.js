import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    region: ['四川省', '成都市', '成华区'],
    detail:'',
    isDefault:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var region = options.adress.split("-")
    var detail=""
    detail=region[3]
    if (region[0].indexOf("省")<0){
      detail = region[2]
      region.unshift(region[0])
    }
    region.splice(3, 1) 
   this.setData({
     region: region,
     detail: detail
   })
  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  setDefault(e){
    this.setData({
      isDefault:e.detail.value
    })
  },
  addSubmit(e){
    var value = e.detail.value
    value.region.push(value.detail)
    value.address=value.region.join("-")
    this.store.data.newPurchase.receiveAddress=value.address
    wx.navigateBack()
  }
})