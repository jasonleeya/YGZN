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

      var pageInfo = wx.getStorageSync('enterByShare')
          if (pageInfo) { 
            switch (pageInfo.type) {
              case "orderDetail":
                var companyId=data.msg 
                if(companyId!==pageInfo.supplyNo&&companyId!==pageInfo.custNo){
                    wx.showModal({  
                      content: '您无权访问改订单'
                    })
                  return
                }
                wx.navigateTo({
                  url: '/pages/' + (companyId === pageInfo.custNo ? 'purchase' : 'sales') + '/orderDetail/orderDetail?orderNo=' + pageInfo.orderNo,
                  success: (result) => {
                    wx.removeStorageSync('enterByShare')
                  },
                })
                break
            }
          }


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
        }).then(infos => {
          app.globalData.userInfo = infos.list
          wx.setStorageSync("userInfo", infos.list)
 

        }).catch(err => {
          app.showToast(err)

        })

      })
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