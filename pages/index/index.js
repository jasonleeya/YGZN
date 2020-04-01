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

    app.http("queryCompany").then(data => {
      app.globalData.companies = data.list
      data.list.forEach((item, index) => {
        if (item[2] === '1') {
          wx.setStorageSync("currentCompanyIndex", index)
        }
      })

      app.http("toggleAccount", {
        id: data.list[wx.getStorageSync("currentCompanyIndex")][1]
      }).then(data => {
        app.http("getUserByCustNo", {
          flag: true
        }).then(data => {
          app.globalData.userInfo = data.list
          wx.setStorageSync("userInfo", data.list)
        }).catch(err => {
          app.showToast(err)
        })

      })
      if (wx.getStorageSync('pageBeforeLogin')) {  
        wx.redirectTo({
          url: wx.getStorageSync('pageBeforeLogin'), 
          success: (res) => {
            wx.removeStorageSync('pageBeforeLogin')
          },
        })
      }
    })
  },
  onShow() {
    let taht = this

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
      console.log(referrerId, salesmanId)
      return {
        title: '欢迎注册TOOLS ERA企业助手',
        path: '/pages/register/register?referrerId=' + referrerId + '&salesmanId=' + salesmanId,
        imageUrl: "http://182.151.17.189:24000/res/File/B/wx_share.jpg",
        success: function (res) {
          console.log('分享成功', res)
        }
      }
    }

  },
})