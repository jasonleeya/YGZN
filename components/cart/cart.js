// import create from '../../utils/create'
var app = getApp()
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
    brandNameKey: {
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
    minNumKey: {
      type: String,
      value: ""
    },
    operateType: {
      type: String,
      value: "编辑"
    }
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {},
  ready() {

  },
  //当组件展示时计算显示的总量和总额
  pageLifetimes: {
    show() {
      this.computeTotalPriceTotalAmount()
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
      var amountKey = this.data.amountKey
      //计算组件类的数量
      this.setData({
        ["goodsList[" + index + "]." + amountKey]: parseInt(this.data.goodsList[index][amountKey]) + 1
      })
      //trigger变化后的数量和商品的index
      this.triggerEvent("changeAmount", {
        amount: this.data.goodsList[index][amountKey],
        index: index
      })
      this.computeTotalPriceTotalAmount()

    },

    // 减少商品数量
    minusGoods(e) {
      var id = e.target.dataset.id
      var index = e.target.dataset.index
      var min = parseInt(this.data.goodsList[index][this.data.minNumKey]) //最小包装量

      if (!isNaN(min)) {
        //数量不能小于最小包装量
        if (this.data.goodsList[index][this.data.amountKey] > min) {
          this.setData({
            ["goodsList[" + index + "]." + this.data.amountKey]: parseInt(this.data.goodsList[index][this.data.amountKey]) - 1
          })
          this.triggerEvent("changeAmount", {
            amount: this.data.goodsList[index][this.data.amountKey],
            index: index
          })
          this.computeTotalPriceTotalAmount()

        } else {
          app.showToast("不能小于最小采购量,如需删除该商品请左滑", 3000)
        }
        //没有最小包装量时不能小于0
      } else {
        if (this.data.goodsList[index][this.data.amountKey] > 0) {
          this.setData({
            ["goodsList[" + index + "]." + this.data.amountKey]: parseInt(this.data.goodsList[index][this.data.amountKey]) - 1
          })
          this.triggerEvent("changeAmount", {
            amount: this.data.goodsList[index][this.data.amountKey],
            index: index
          })
          this.computeTotalPriceTotalAmount()

        } else { //商品数量减少到0删除项
          this.triggerEvent("deleteGoods", {
            index: index
          })
        }
      }
    },
    /**
     * 计算总价和总量
     */
    computeTotalPriceTotalAmount() {
      var totalPrice = 0
      var totalAmount = 0

      this.data.goodsList.forEach(item => {
        if (isNaN(parseInt(item[this.data.amountKey]))) {
          item[this.data.amountKey] = 0
        }
        totalPrice = (parseFloat(totalPrice) + parseFloat(item[this.data.priceKey]) * parseInt(item[this.data.amountKey])).toFixed(2)
        totalAmount = parseInt(totalAmount) + parseInt(item[this.data.amountKey])
      })
      this.setData({
        totalPrice: totalPrice
      })
      //向父组件传递改变的数据
      this.triggerEvent("changeTotalPriceAndAmount", {
        totalPrice: totalPrice,
        totalAmount: totalAmount
      })
    },
    // 左滑向父组件传递删除的index
    slideToDelete(e) {
      var deleteIndex = e.target.dataset.deleteIndex
      this.triggerEvent("deleteGoods", {
        index: deleteIndex
      })
      this.computeTotalPriceTotalAmount()
    },

    //数量input
    amountInput(e) {
      var value = parseInt(e.detail.value)
      var index = e.target.dataset.inde
      
      this.setData({
        ["goodsList[" + index + "]." + this.data.amountKey + ""]: value
      })
      this.triggerEvent("changeAmount", {
        amount: this.data.goodsList[index][this.data.amountKey],
        index: index
      })
      this.computeTotalPriceTotalAmount()

    },
    //失去焦点时判断是否小于最小包装量
    amountBlur(e) {
      var value = e.detail.value
      var index = e.target.dataset.index
      var newList = this.data.goodsList
      var min = parseInt(this.data.goodsList[index][this.data.minNumKey])
      
      if (value === "") {
        value = 0
        e.detail.value = "0"
      }
      if (!isNaN(min)) {
        if (parseInt(value) < min) {
          value = min
          e.detail.value = min
        }
      }
      this.setData({
        ["goodsList[" + index + "]." + this.data.amountKey + ""]: value
      })
      this.triggerEvent("changeAmount", {
        amount: this.data.goodsList[index][this.data.amountKey],
        index: index
      })
      this.computeTotalPriceTotalAmount()
    },

    //让父组件弹出编辑弹窗
    operate(e) {
      this.triggerEvent("operate", {
        index: e.currentTarget.dataset.index
      })
    },
    //让父组件跳转商品详情页
    seeGoodsDetail(e) {
      this.triggerEvent("goodsDetail", {
        index: e.currentTarget.dataset.index
      })
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