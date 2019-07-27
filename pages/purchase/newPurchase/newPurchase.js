import store from '../../../store'
import create from '../../../utils/create'

create(store,{

  /**
   * 页面的初始数据
   */
  data: {
    date: '2019-07-25',
    region: ['北京市', '北京市', '东城区'],
    goodsList: [],
    totalPrice:0
  },

  onShow: function() {
    this.setData({
      goodsList:this.store.data.newPurchase.cartList,
      totalPrice: this.store.data.newPurchase.totalPrice
    })
  },
  confirmOrder(){
    console.log(this.store.data.newPurchase.cartList)
  },
  getChangedData(e){
    var store = this.store.data.newPurchase
    var data=e.detail
    store.cartList = data.goodsList,
      store.totalPrice=data.totalPrice,
      store.totalAmount=data.totalAmount
  }
})  