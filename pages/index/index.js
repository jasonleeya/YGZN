import store from '../../store'
import create from '../../utils/create'
var app = getApp();
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    curTab: "home",
    messageCount: store.data.messageCount,
    interval:null
  },

  onLoad() {
    app.checkLogin()
    let that=this
    this.data.interval=setInterval(function(){
      app.http("homeMessage", {}, true).then(data=>{
        if(!data.list){
          console.log(11111111)
        }
      })
      if (that.data.curTab === "function") {
        clearInterval(that.data.interval)
      }
    },2000)
    
 
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