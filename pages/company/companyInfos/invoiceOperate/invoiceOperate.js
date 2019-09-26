// pages/company/companyInfos/invoiceOperate/invoiceOperate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.operateType==='edit'){
      var pages=getCurrentPages()
      var prePage=pages[pages.length-2]
      var editData = prePage.data.invoiceInfos[options.editIndex]
     this.setData({
       editData 
     })
    }
  },

   
})