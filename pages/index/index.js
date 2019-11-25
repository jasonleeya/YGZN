import store from '../../store'
import create from '../../utils/create'
var app = getApp();
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    curTab: "home",
    messageCount: 0,
    interval: null,
    
  },

  onLoad() {
  
   app.setTitle()

    app.http("queryCompany").then(data => {
      app.globalData.companies = data.list  
      data.list.forEach((item,index)=>{
        if(item[2]==='1'){
          wx.setStorageSync("currentCompanyIndex",index)
        }
      })

      app.http("toggleAccount", {
        id: data.list[wx.getStorageSync("currentCompanyIndex")][1]
      })

    })
  },
  onShow(){ 
    let taht=this
     
    app.watchGloabalData("unreadMsgCount", function (value) {  
      taht.setData({
        messageCount: app.globalData.unreadMsgCount
      })
    })
  
  },
  //  切换tab
  NavChange(e) {
    if (e.currentTarget.dataset.link !== 'order') {
      this.setData({
        curTab: e.currentTarget.dataset.link
      })
    } else {
      this.store.updateAll = true;
      this.store.data.showOrderPage = true
      this.update()

    }
  },
  onShareAppMessage: function (res) { 
    // app.globalData.companies = data.list

    // app.http("toggleAccount", {
    //   id: data.list[wx.getStorageSync("currentCompanyIndex")][1]
    // })
  
    if (res.from === 'button') {
      console.log(wx.getStorageInfoSync())
      console.log(wx.getStorageSync("userInfo"))
 
      var referrerId = app.globalData.companies[wx.getStorageSync("currentCompanyIndex")][1]
      var salesmanId = wx.getStorageSync("userInfo")[0].custNo 
      return {
        title: '欢迎注册IMATCH企业助手',
        path: '/pages/register/register?referrerId=' + referrerId + '&salesmanId=' + salesmanId,
        imageUrl:"https://lsj97-1300009684.cos.ap-chengdu.myqcloud.com/%E5%90%AF%E5%8A%A8%E9%A1%B5.jpg",
        success: function (res) {
          console.log('成功', res)
        }
      }
    }

  },
})