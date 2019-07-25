import purchase from './pages/purchase/store.js'

export default {
  data: {
    messageCount:5,  //未读消息数
    showOrderpage:false, //是否显示开单层
    purchase: purchase.data
    
  },
  globalData: [],
  logMotto: function () {
  },
  //默认 false，为 true 会无脑更新所有实例
  updateAll: false
}