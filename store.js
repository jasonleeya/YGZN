import addGoods from './pages/purchase/addGoods/store.js'
import newPurchase from './pages/purchase/newPurchase/store.js'
import selectSupplier from './pages/purchase/selectSupplier/store.js'
export default {
  data: {
    messageCount: 5, //未读消息数
    showOrderpage: false, //是否显示开单层
    addGoods: addGoods.data,
    newPurchase: newPurchase.data,
    selectSupplier: selectSupplier.data
  },
  globalData: [],
  logMotto: function() {},
  //默认 false，为 true 会无脑更新所有实例
  updateAll: false
}