let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTabIndex:'0',
    personalInfo:{},
    companies:[],
    applyingCompanies:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log( app.globalData)
    getApp().showToast("该页面功能尚未完善,敬请期待")
    app.http("getUserByCustNo",{flag:true}).then(data=>{
      this.setData({
        personalInfo: data.list[0]
      })
    })
    this.setData({
      companies: app.globalData.companies
    })

    app.http("findApplys",{
      applyType:0
    }).then(data=>{
      this.setData({
        applyingCompanies:data.list
      })
    })
  },  
  toggleTab(e){
    this.setData({
      activeTabIndex:e.currentTarget.dataset.index
    })
  },
  setDefaultLoginCompany(e){
    app.http("updateDftCompany",{
      companyId:e.currentTarget.dataset.id
    }).then(()=>{
      app.showToast("设置成功")
      app.http("queryCompany").then(data => {
        this.setData({
          companies: data.list
        })
      })
    }).catch(err=>{
      app.showToast(err)
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
  },
  applyRefuse(e){
console.log(e.currentTarget.dataset.index)
wx.showModal({  
  showCancel: true,
  title: '确定要拒绝此申请吗', 
  success: (result) => {
    if(result.cancel){
      return
    }
    var id=this.data.applyingCompanies[e.currentTarget.dataset.index].id
    app.http("updateApply",{
      id: id,
      applyType: -1
    }).then(data=>{
      app.showToast("已拒绝申请")
    }).catch(err=>{
      app.showToast(err)
    }) 
  },
})
  },
  applyAgree(e){
    var id=this.data.applyingCompanies[e.currentTarget.dataset.index].id
    app.http("updateApply",{
      id: id,
      applyType: 1 
    }).then(data=>{
      app.showToast("已同意申请")
    }).catch(err=>{
      app.showToast(err) 
    })
  }
})