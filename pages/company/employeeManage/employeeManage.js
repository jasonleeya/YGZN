let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    employeeList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("员工信息")
  },
  onShow: function() {
    app.http("queryAllSalesman", {
      pageSize: 10000,
      pageNo: 0
    }).then(data=>{
      this.setData({
        employeeList:data.list
      })
    })
  },
  addEmployee(){
    wx.navigateTo({
      url: '/pages/company/employeeManage/employeeOperate/employeeOperate?operateType=add'
    })
  },
  editEmployee(e){
    var index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/company/employeeManage/employeeOperate/employeeOperate?operateType=edit&editIndex='+index
    })
  }
})