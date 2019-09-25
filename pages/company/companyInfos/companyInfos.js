// pages/company/companyInfos/companyInfos.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTabIndex:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  toggleTab(e){
   this.setData({
     activeTabIndex:e.currentTarget.dataset.index
   })
 }
})