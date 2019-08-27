import store from '../../store'
import create from '../../utils/create'
var app = getApp();
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    curTab: "home",
    messageCount: null,
    interval: null
  },

  onLoad() {
  
    app.checkLogin()

  },
  onShow(){ 
    let taht=this
    taht.setData({
      messageCount: app.globalData.unreadMsgCount
    })
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
})