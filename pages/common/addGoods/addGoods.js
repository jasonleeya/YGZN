import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    // ...store.data.addGoods,
    goodsList: [],
    isShowPop: false, //显示弹窗
    activeIndex: null, //当前选择项的index
    popData: {}, //弹出框的内容
    popDataCopy: {}, //储存选择项原始值
    totalPrice: 0, //总价
    totalAmount: 0, //总量
    isLoad: false, //是否显示加载图标
    store: "",
    supplyNo: '',
    wareId: "",
    searchType: "",
    searchValue: ""
  },
  onLoad(options) {
    this.setData({
      store: options.store,
      supplyNo: options.supplyNo,
      wareId: options.wareId
    })
    //验证登录
    app.checkLogin()
  },
  //进入页面初始化数据
  onShow() {
    this.setData({
      totalPrice: this.store.data[this.data.store].totalPrice.toFixed(2),
      totalAmount: this.store.data[this.data.store].totalAmount
    }) //添加store里的总价和总额
  },

  searchTypeChange(e) {
    this.setData({
      searchType: e.detail.name
    })
    this.search()
  },

  inputValue(e) {
    var inputValue = e.detail
    if (e.detail === "") {
      this.setData({
        goodsList: []
      })
      return
    }
    this.setData({
      searchValue: e.detail
    })
    this.search()

  },
  search() {
    switch (this.data.searchType) {
      case "":
      case "我的仓库":
        app.http("searchStockProduct", {
          wareKey: "",
          pageNo: "1",
          pageSize: "10",
          custNo: "",
          searchKey: this.data.searchValue,
        }).then(data => {
          this.setData({
            goodsList: data.list
          })
        })

        break
      case "供方仓库":
        app.http("searchStockProduct", {
          wareKey: "",
          pageNo: "1",
          pageSize: "10",
          custNo: this.data.custNo,
          searchKey: this.data.searchValue,
        }).then(data => {
          this.setData({
            goodsList: data.list
          })
        })

        break
      case "全局搜索":

        break
    }
  },

  // 显示弹出框
  showPop(e) {
    var index = e.target.dataset.index
    console.log(this.data.goodsList[index])

    app.http("purchaseDiscount", {
      supplyNo: this.data.supplyNo,
      productId: this.data.goodsList[index].productUuid
    }, true).then(data => {
      this.setData({
        isShowPop: true,
        ['popData.goodsCount']: this.data.goodsList[index].minCount,
        ["popData.NTPSingle"]: data.infoBody.price,
        ["popData.taxRate"]: 13,
        ["popData.discountPrice"]: parseFloat(data.infoBody.price) * 1.3,
        ["popData.sttAmount"]: parseFloat(data.infoBody.price) * 1.3 * parseInt(this.data.goodsList[index].minCount)
      })

      this.setData({
        popDataCopy: JSON.parse(JSON.stringify(this.data.popData))
      })


    })



    // app.http("etchPurchaseProductInfo",{
    //   supplyNo: this.data.supplyNo,
    //   wareId: this.data.wareId,
    //   productId: this.data.goodsList[index]. productUuid
    // },true)

    // var index = e.target.dataset.index
    // console.log(this.data.goodsList[index]) 


    // var cartList = this.store.data[this.data.store].cartList
    // var flag = false;
    // this.setData({
    //   isShowPop: true,
    //   activeIndex: index,
    // })

    // cartList.forEach(item => {
    //   if (item.id === this.data.goodsList[index].id) { //判断cartList中是否有此商品
    //     flag = true
    //     this.setData({
    //       popData: JSON.parse(JSON.stringify(item)), //深拷贝cartList中已有项到popData
    //       popDataCopy: JSON.parse(JSON.stringify(item)), //保存初始数据
    //     }, function() {
    //       //回调
    //       var totalPrice = parseInt(item.amount) * (parseFloat(this.data.popData.noTaxPrice) * (1 + parseFloat(this.data.popData.taxRate) / 100))
    //       // 总价=数量x无税价(1+税率)
    //       totalPrice = totalPrice.toFixed(2)
    //       this.setData({
    //         ["popData.amount"]: parseInt(item.amount), //cartList中该商品数量
    //         ["popData.totalPrice"]: totalPrice
    //       })
    //     })
    //   }
    // })
    // if (!flag) {
    //   this.setData({
    //     popData: JSON.parse(JSON.stringify(this.data.goodsList[index])), //深拷贝所选项内容到popData
    //     popDataCopy: JSON.parse(JSON.stringify(this.data.goodsList[index])),
    //   }, function() {
    //     //回调
    //     this.setData({
    //       ["popData.amount"]: 1, //总价初始值为1
    //       ["popData.totalPrice"]: (parseFloat(this.data.popData.noTaxPrice) * (1 + parseFloat(this.data.popData.taxRate) / 100)).toFixed(2)
    //     }) //初始总价
    //   })
    // }
  },



  /**
   * 数量input
   */
  amountInput(e) {
    var value = e.detail.value
    console.log(value)
  

    // if (e.detail.value === "") { //如果输入内容为空则为0
    //   e.detail.value = "0"
    // }
    // this.setData({
    //   ["popData.amount"]: parseInt(e.detail.value),
    //   ["popData.totalPrice"]: (parseInt(e.detail.value) * parseFloat(this.data.popData.noTaxPrice) * (1 + parseFloat(this.data.popData.taxRate) / 100)).toFixed(2)
    // }) //数量和总价改变
    // /**
    //  * 无税价input
    //  */
  },
  amountBlur(e){
    var value = e.detail.value
    if (!value || parseInt(value) < parseInt(this.data.popDataCopy.goodsCount)) {
      this.setData({
        ['popData.goodsCount']: this.data.popDataCopy.goodsCount
      })
    }
  },

  noTaxPriceInput(e) {
    if (e.detail.value === "") { //如果输入内容为空则为原始值
      e.detail.value = this.data.popDataCopy.noTaxPrice
    }
    this.setData({
      ["popData.noTaxPrice"]: e.detail.value,
      ["popData.containTaxPrice"]: (((parseFloat(this.data.popData.taxRate) / 100) + 1) * parseFloat(e.detail.value)).toFixed(2),
      ["popData.totalPrice"]: (parseInt(this.data.popData.amount) * parseFloat(e.detail.value) * (1 + parseFloat(this.data.popData.taxRate) / 100)).toFixed(2)
    }) //含税价和总价跟着改变
  },
  /**
   * 无税价input失去焦点保留两位小数
   */
  noTaxPriceBlur(e) {
    this.setData({
      ["popData.noTaxPrice"]: parseFloat(e.detail.value).toFixed(2),
    })
  },
  /**
   * 税率input失去焦点
   */

  taxRateBlur(e) {
    var value = e.detail.value
    if (value === '') { //输入为空返回原始值
      this.setData({
        ["popData.taxRate"]: this.data.popDataCopy.taxRate
      })
    }
    if (parseFloat(value) <= 1 && parseFloat(value) >= 0) { //0~1的小数转换为百分数
      this.setData({
        ["popData.taxRate"]: (parseFloat(value) * 100).toFixed(2),
      })
    }
    if (parseFloat(value) > 1 && parseFloat(value) < 100) { //1-100直接加%
      this.setData({
        ["popData.taxRate"]: parseFloat(value).toFixed(2),
      })
    }
    if (parseFloat(value) >= 100) { //大于100返回100
      this.setData({
        ["popData.taxRate"]: '100',
      })
    }
    this.setData({
      ["popData.containTaxPrice"]: (((parseFloat(this.data.popData.taxRate) / 100) + 1) * parseFloat(this.data.popData.noTaxPrice)).toFixed(2),
      ["popData.totalPrice"]: (parseInt(this.data.popData.amount) * parseFloat(this.data.popData.noTaxPrice) * (1 + parseFloat(this.data.popData.taxRate) / 100)).toFixed(2)
    }) //含税价总价跟着改变
  },
  /**
   * 税率input获得焦点时去掉%保留两位小数
   */
  taxRateFocus(e) {
    this.setData({
      ["popData.taxRate"]: parseFloat(e.detail.value).toFixed(2), //保留两位小数
    })
  },
  /**
   * 含税价input
   */
  containTaxPriceInput(e) {
    if (e.detail.value === "") { //如果输入内容为空则为原始值
      e.detail.value = this.data.popDataCopy.containTaxPrice
    }
    var value = e.detail.value
    this.setData({
      ["popData.containTaxPrice"]: e.detail.value,
      ["popData.noTaxPrice"]: (parseFloat(value) / ((parseFloat(this.data.popData.taxRate) / 100) + 1)).toFixed(2),
      ["popData.totalPrice"]: (parseInt(this.data.popData.amount) * parseFloat(value)).toFixed(2)
    }) //不含税价总价跟着改变
  },
  containTaxPriceBlur(e) {
    this.setData({
      ["popData.containTaxPrice"]: parseFloat(e.detail.value).toFixed(2),
    })
  },
  totalPriceInput(e) {

  },
  totalPriceBlur(e) {

  },
  addCancel() {
    this.setData({
      isShowPop: false
    })
  },
  addConfirm() {
    var flag = false
    var totalAmount = 0
    var totalPrice = 0
    var cartList = this.store.data[this.data.store].cartList
    cartList.forEach((item, index) => {
      if (item.id === this.data.popData.id) { //如果id相同则合并
        flag = true
        if (this.data.popData.amount === 0) { // 数量改为0时删除项
          cartList.splice(index, 1)
        } else {
          cartList[index] = this.data.popData
        }
      }
    })
    if (!flag) {
      if (this.data.popData.amount !== 0) {
        cartList.push(this.data.popData) //如果id不相同则添加
      }
    } //计算总量总价存到store中
    cartList.forEach(item => {
      totalAmount += item.amount
      totalPrice += item.amount * item.containTaxPrice
    })
    totalPrice = totalPrice.toFixed(2)
    this.store.data[this.data.store].totalPrice = totalPrice
    this.store.data[this.data.store].totalAmount = totalAmount
    this.setData({
      totalPrice: totalPrice,
      totalAmount: totalAmount,
      isShowPop: false
    })
    this.update()
  },
  confirmOrder() {

    wx.navigateBack()
  },
  //监听滑动到底部
  scrollToBottom() {
    this.setData({
      isLoad: true
    })
    setTimeout(() => {
      this.setData({
        isLoad: false
      })
    }, 2000)
  }
})