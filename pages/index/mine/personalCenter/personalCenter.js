let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTabIndex:'0',
    personalInfo:{},
    companies:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log( app.globalData)
    getApp().showToast("该页面功能尚未完善")
    app.http("getUserByCustNo",{flag:true}).then(data=>{
      this.setData({
        personalInfo: data.list[0]
      })
    })
    this.setData({
      companies: app.globalData.companies
    })
  },  
  toggleTab(e){
    this.setData({
      activeTabIndex:e.currentTarget.dataset.index
    })
  },
  modifyPasswordSubmit(e){
    var pwds = e.detail.value
    if (pwds.new === '' || pwds.origion === '' || pwds.confirm===''){
      app.showToast("请填写密码")
      return
    }
    if (pwds.new === pwds.origion) {
      app.showToast("请输入与原密码不一致的新密码")
      return
    }
    if (pwds.new !== pwds.confirm){
      app.showToast("两次输入新密码不一致")
      return
    }
    app.http("updateSalesmanPwd",{
      oldPwd: pwds.origion,
      newPwd: pwds.new
    }).then(data=>{
      app.showToast("修改成功")
    }).catch(err=>{
      app.showToast(err)
    })
  }
})