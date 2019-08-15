// import create from '../../utils/create'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Array,
      value: []
    },
    totalPrice: {
      type: Number,
      value: 0
    },
    editable: {
      type: Boolean,
      value: true
    },
    picUrlKey: {
      type: String,
      value: ""
    },
    nameKey: {
      type: String,
      value: ""
    },
    typeKey: {
      type: String,
      value: ""
    },
    priceKey: {
      type: String,
      value: ""
    },
    amountKey: {
      type: String,
      value: ""
    },
    idKey: {
      type: String,
      value: ""
    },
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {},
  ready() {
    // this.computeTotalPriceTotalAmount()
  },

  pageLifetimes: {
    show() {

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 添加商品数量
    plusGoods(e) {
      var id = e.target.dataset.id
      var index = e.target.dataset.index
      this.setData({
        ["goodsList[" + index + "]." + this.data.amountKey]: parseInt(this.data.goodsList[index][this.data.amountKey]) + 1
      })
      this.triggerEvent("changeAmount", {
        amount: this.data.goodsList[index][this.data.amountKey],
        index:index
      })
      this.setData({
        totalPrice: (parseFloat(this.data.totalPrice) + parseFloat(this.data.goodsList[index][this.data.priceKey])).toFixed(2)
      })

    },

    // 减少商品数量
    minusGoods(e) {
      var id = e.target.dataset.id
      var index = e.target.dataset.index
      if (this.data.goodsList[index][this.data.amountKey] > 0) {
        this.setData({
          ["goodsList[" + index + "]." + this.data.amountKey]: parseInt(this.data.goodsList[index][this.data.amountKey]) - 1
        })
        this.triggerEvent("changeAmount", {
          amount: this.data.goodsList[index][this.data.amountKey],
          index: index
        })
        this.setData({
          totalPrice: (parseFloat(this.data.totalPrice) - parseFloat(this.data.goodsList[index][this.data.priceKey])).toFixed(2)
        })
      }

      if (this.data.goodsList[index][this.data.amountKey] === 0) { //商品数量减少到0删除项
        var newList = this.data.goodsList
        newList.splice(index, 1)
        this.setData({
          goodsList: newList
        })
        this.triggerEvent("deleteGoods", {
          index: index
        })
      }
    },
    /**
     * 重新计算总价和总量并保存到store中
     */
    computeTotalPriceTotalAmount() {
      // var totalPrice = 0
      // var totalAmount = 0
      // this.data.goodsList.forEach(item => {
      //   totalPrice += parseFloat(item.amount * item.containTaxPrice)
      //   totalAmount += parseInt(item.amount)
      // })
      // totalPrice = parseFloat(totalPrice.toFixed(2))
      // this.setData({
      //   totalPrice: totalPrice
      // })
      // //向父组件传递改变的数据
      // this.triggerEvent("changeData", {
      //   goodsList: this.data.goodsList,
      //   totalPrice: this.data.totalPrice,
      //   totalAmount: totalAmount
      // })
    },
    // 左滑删除商品
    slideToDelete(e) {
      var deleteIndex = e.target.dataset.deleteIndex
      var newList = this.data.goodsList
      newList.splice(deleteIndex, 1)
      this.setData({
        goodsList: newList
      })

      this.computeTotalPriceTotalAmount()
    },
    amountInput(e) {
      var value = parseInt(e.detail.value)
      var index = e.target.dataset.index
      this.setData({
        ["goodsList[" + index + "].amount"]: value
      })
      this.computeTotalPriceTotalAmount()

    },
    amountBlur(e) {
      var value = e.detail.value
      var index = e.target.dataset.index
      var newList = this.data.goodsList

      if (value === "") {
        newList.splice(index, 1)
        this.setData({
          goodsList: newList
        })

        this.computeTotalPriceTotalAmount()
      }
    },

    // ListTouch触摸开始
    ListTouchStart(e) {
      if (!this.data.editable) {
        return
      }
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