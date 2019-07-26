import create from '../../utils/create'
create({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Array,
      value: []
    },
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    totalPrice: 0,
  },
  ready() {
    this.computeTotalPrice()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 添加商品
    plusGoods(e) {
      var id = e.target.dataset.id
      var index = e.target.dataset.index
      var cartList = this.store.data.newPurchase.cartList
      cartList.forEach(item => { //更改store中的amount
        if (item.id === id) {
          item.amount += 1
        }
        item.totalPrice=item.amount*parseFloat(item.containTaxPrice)
      })
      this.setData({
        ["goodsList[" + index + "].amount"]: this.data.goodsList[index].amount + 1
      })
      this.computeTotalPrice()

    },

    // 减少商品
    minusGoods(e) {
      var id = e.target.dataset.id
      var minusIndex = e.target.dataset.index
      var cartList = this.store.data.newPurchase.cartList
      if (this.data.goodsList[minusIndex].amount > 0) {
        cartList.forEach(item => { //更改store中的amount
          if (item.id === id) {
            item.amount -= 1
          }
          item.totalPrice = item.amount * parseFloat(item.containTaxPrice)
        })
        this.setData({
          ["goodsList[" + minusIndex + "].amount"]: this.data.goodsList[minusIndex].amount - 1
        })
        this.computeTotalPrice()
      }

      if (this.data.goodsList[minusIndex].amount === 0){
        var newList = this.data.goodsList
        newList.splice(minusIndex, 1)
        this.setData({
          goodsList: newList
        })

        cartList.forEach((item,index)=>{
          if (item.id === id) {
            cartList.splice(index,1)
          }
        })
      }
    },
    /**
     * 重新计算总价
     */
    computeTotalPrice() {
      var totalPrice = 0
      this.store.data.newPurchase.cartList.forEach(item => {
        totalPrice += parseFloat(item.amount * item.containTaxPrice)
        
      })
      totalPrice = parseFloat(totalPrice.toFixed(2))
      this.setData({
        totalPrice: totalPrice
      })
      this.store.data.newPurchase.totalPrice = totalPrice
    },
    // 左滑删除商品
    slideToDelete(e) {
      var deleteIndex = e.target.dataset.deleteIndex
      var id = e.target.dataset.deleteId
      var newList = this.data.goodsList
      var cartList = this.store.data.newPurchase.cartList
      newList.splice(deleteIndex, 1)
      this.setData({
        goodsList: newList
      })
     cartList.forEach((item, index) => {
        if (item.id = id) {
          cartList.splice(index, 1)
        }
      })
      this.computeTotalPrice()
    },
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })

    },

    // ListTouch计算方向
    ListTouchMove(e) {
      if (Math.abs(e.touches[0].pageX - this.data.ListTouchStart) > 60) {
        this.setData({
          ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 60 ? 'right' : 'left'
        })
      }

    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    }
  }
})