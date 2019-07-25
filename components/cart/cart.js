// components/cart/cart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    totalAmount: 0,
    goodsList: [{
      name: '三菱/通用型螺纹车刀片',
      type: ' MMT22R050APBU VP10MF',
      price: '666.00',
      pic: 'http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg',
      choosedAmount: 10
    }, {
      name: '三菱/通用型螺纹车刀片',
      type: ' MMT22R050APBU VP10MFVP10MFVP10MF',
      price: '666.00',
      pic: 'http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg',
      choosedAmount: 10
    }, {
      name: '三菱/通用型螺纹车刀片',
      type: ' MMT22R050APBU VP10MFVP10MFVP10MF',
      price: '666.00',
      pic: 'http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg',
      choosedAmount: 10
    }, {
      name: '三菱/通用型螺纹车刀片',
      type: ' MMT22R050APBU VP10MFVP10MFVP10MF',
      price: '666.00',
      pic: 'http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg',
      choosedAmount: 10
    }, {
      name: '三菱/通用型螺纹车刀片',
      type: ' MMT22R050APBU VP10MFVP10MFVP10MF',
      price: '666.00',
      pic: 'http://img4.imgtn.bdimg.com/it/u=2022307077,2423689529&fm=15&gp=0.jpg',
      choosedAmount: 10
    }, ]
  },
  ready() {
    var total = 0
    this.data.goodsList.forEach(item => {
      total += item.price * item.choosedAmount
    })
    this.setData({
      totalAmount: total
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 添加商品
    plusGoods(e) {
      var index = e.target.dataset.index
      this.setData({
        totalAmount: this.data.totalAmount + parseInt(this.data.goodsList[index].price),
        ["goodsList[" + index + "].choosedAmount"]: this.data.goodsList[index].choosedAmount + 1
      })
    },
    // 减少商品
    minusGoods(e) {
      var index = e.target.dataset.index
      if (this.data.goodsList[index].choosedAmount > 0) {
        this.setData({
          totalAmount: this.data.totalAmount - parseInt(this.data.goodsList[index].price),
          ["goodsList[" + index + "].choosedAmount"]: this.data.goodsList[index].choosedAmount - 1
        })
      }
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
    },
    // 左滑删除商品
    delete(e) {
      var deleteIndex = e.target.dataset.deleteIndex;
      var newList = this.data.goodsList
      this.setData({
        totalAmount: this.data.totalAmount - parseInt(this.data.goodsList[deleteIndex].price) * this.data.goodsList[deleteIndex].choosedAmount
      })
      newList.splice(deleteIndex, 1)
      this.setData({
        goodsList: newList,

      })
    }
  }
})