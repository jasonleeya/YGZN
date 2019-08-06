import store from '../../../store'
import create from '../../../utils/create'
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    customerLevel:{
      list: ["Level01", "Level02", "Level03", "Level04", "Level05"],
      index:null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setLevel: function (e) {    
    this.setData({
      ["customerLevel.index"]: e.detail.value
    })
  },
  addSubmit(e) {
    var info = e.detail.value
    info.createType = "自建" 
    info.creditBalance="0.00",
 
    this.store.data.selectCustomer.customerList.push(e.detail.value)
    wx.navigateBack()
  }
})