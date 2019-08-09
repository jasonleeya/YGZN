import addGoods from './pages/common/addGoods/store.js'
import newPurchase from './pages/purchase/newPurchase/store.js'
import selectSupplier from './pages/purchase/selectSupplier/store.js'
import selectBuyer from "./pages/purchase/selectBuyer/store.js"
import productManage from "./pages/product/productManage/store.js"
import newSales from "./pages/sales/newSales/store.js"
import selectCustomer from "./pages/sales/selectCustomer/store.js"
import selectSeller from "./pages/sales/selectSeller/store.js"

export default {
  data: {
    messageCount: 5, //未读消息数
    showOrderpage: false, //是否显示开单层

    addGoods: addGoods.data,
    newPurchase: newPurchase.data,
    selectSupplier: selectSupplier.data,
    selectBuyer: selectBuyer.data, 
    productManage: productManage.data,
    newSales: newSales.data,
    selectCustomer: selectCustomer.data,
    selectSeller: selectSeller.data
  },
  globalData: [],
  logMotto: function() {},
  //默认 false，为 true 会无脑更新所有实例
  updateAll: false
}