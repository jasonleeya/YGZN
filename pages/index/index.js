import store from '../../store'
import create from '../../utils/create'
create(store,{
  /**
   * 页面的初始数据
   */
  data: {
    curTab:"function",
    messageCount: store.data.messageCount,
  },

//  切换tab
  NavChange(e) {
    if (e.currentTarget.dataset.link!=='order'){
      this.setData({
        curTab: e.currentTarget.dataset.link
      })
    }
   else{
      this.store.updateAll=true;
      this.store.data.showOrderPage=true
      this.update()
       
   }
  },
})