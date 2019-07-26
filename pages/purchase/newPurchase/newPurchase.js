import store from '../../../store'
import create from '../../../utils/create'

create(store,{

  /**
   * 页面的初始数据
   */
  data: {
    date: '2019-07-25',
    region: ['北京市', '北京市', '东城区'],
    goodsList: []
  },

  onShow: function() {
    this.setData({
      goodsList:this.store.data.newPurchase.cartList
    })
  },
  confirmOrder(){
    console.log(this.store.data.newPurchase.cartList)
  }
})  