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
    loadMore: false, //是否显示加载图标 
    searchValue: "",
    searchType: "",
    searchTypeList: [{
      name: "我的仓库"
    }, {
      name: "全局搜索"
    }],
    isLoad: false,
    pageNo: 2,

  },
  onLoad(options) {
    app.setTitle("添加商品")
    this.setData({
      custNo: options.custNo,
      wareId: options.wareId
    })
 
  },
  //进入页面初始化数据
  onShow() {
    var cartList = app.globalData.salesCartList
    var totalAmount = 0
    var totalPrice = 0
    cartList.forEach(item => {
      totalAmount = parseInt(totalAmount) + parseInt(item.goodsCount)
      totalPrice = (parseFloat(totalPrice) + parseFloat(item.sttAmount)).toFixed(2)
    })
    this.setData({
      totalPrice: totalPrice,
      totalAmount: totalAmount
    })

  },

  searchTypeChange(e) {
    this.setData({
      pageNo: 1,
      searchType: e.detail.name
    })
    if (this.data.searchValue === '') {
      return
    }
    this.search()
  },

  inputValue(e) {
    var inputValue = e.detail
    this.setData({
      pageNo: 1,
      loadMore: false,
      searchValue: e.detail
    })
    if (e.detail === "") {
      this.setData({
        goodsList: []
      })
      return
    } 
    this.search()

  },
  load(isLoad = true) {
    if (isLoad) {
      this.setData({
        isLoad: true
      })
    } else {
      this.setData({
        isLoad: false
      })
    }
  },

  search() {
    if (this.data.pageNo === 1) {
      this.load()
    }
    var urlAlias = ""
    var params = {}
    switch (this.data.searchType) {
      case "":
      case "供方仓库":
        urlAlias = "searchStockProduct"
        params = {
          wareKey: "",
          pageNo: this.data.pageNo,
          pageSize: "10",
          custNo: "",
          searchKey: this.data.searchValue,
        }
        break
      case "全局搜索":
        urlAlias = "searchProductNew"
        params = {
          catalogId: "",
          brandName: 1,
          pageIndex: this.data.pageNo,
          pageSize: 10,
          simpleSeek: this.data.searchValue,
        }
        break
    }
    app.http(urlAlias, params).then(data => {
      data.list.forEach(item=>{
        for (let key in item) {
          item[key] = String(item[key]).replace(/(\<b style='color:red'\>)|\<\/b\>/g, "")
        }
      })
    
      if (this.data.pageNo === 1) {
        this.setData({
          goodsList: data.list
        })
        this.load(false)
      } else {
        this.setData({
          goodsList: this.data.goodsList.concat(data.list),
          loadMore: false,
        })
      }
    })
      .catch(err => {
        this.load(false)
        this.setData({
          loadMore: false
        })
        app.showToast(err)
      })
  },

  goodsDetail(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate?operateType=view&orderType=sale&goodsNo=' + this.data.goodsList[index].productUuid + "&wareKey=" + this.data.wareId
    })
  },


  //监听滑动到底部
  scrollToBottom() {
    if (this.data.loadMore) {
      return
    }
    this.setData({
      loadMore: true,
      pageNo: this.data.pageNo + 1
    })
    this.search()
  },
  // 显示弹出框
  showPop(e) {
    var index = e.target.dataset.index
    this.setData({
      activeIndex: index
    })
    this.load()

    app.http("saleDiscount", {
      custNo: this.data.custNo,
      productId: this.data.goodsList[index].productUuid
    }).then(data => {
      if (data.infoBody.discount === null || data.infoBody.discount === 0 || data.infoBody.discount === "") {
        data.infoBody.discount = 10
      }
      this.setData({
        isShowPop: true,
        ['popData.facePrice']: data.infoBody.price.toFixed(2),
        ['popData.goodsCount']: this.data.goodsList[index].minCount,
        ["popData.NTPSingle"]: data.infoBody.price.toFixed(2),
        ["popData.taxRate"]: '13.00%',
        ["popData.discountPrice"]: (parseFloat(data.infoBody.price) * 1.13 ).toFixed(2),
        ["popData.sttAmount"]: (parseFloat(data.infoBody.price) * 1.13 * parseInt(this.data.goodsList[index].minCount) ).toFixed(2)
      })
      this.setData({
        popDataCopy: JSON.parse(JSON.stringify(this.data.popData))
      })
      this.load(false)
    }).catch(err => {
      this.load(false)
      app.showToast(err)
    })

  },

  compute(type) {
    var goodsCount = isNaN(this.data.popData.goodsCount) ? "0" : this.data.popData.goodsCount
    var discountPrice = isNaN(this.data.popData.discountPrice) ? "0" : this.data.popData.discountPrice
    var NTPSingle = isNaN(this.data.popData.NTPSingle) ? "0" : this.data.popData.NTPSingle
    var taxRate = isNaN(this.data.popData.taxRate) ? "13" : this.data.popData.taxRate

    switch (type) {
      case "goodsCount":
        break
      case "NTPSingle":
        return (parseFloat(discountPrice) / (1 + taxRate / 100)).toFixed(2)
        break
      case "taxRate":
        break
      case "discountPrice":
        return (NTPSingle * (1 + (taxRate / 100))).toFixed(2)
        break
      case "sttAmount":

        return (parseInt(goodsCount) * parseFloat(discountPrice)).toFixed(2)
        break
    }
  },
  amountInput(e) {
    var value = e.detail.value

    this.setData({
      ["popData.goodsCount"]: parseInt(e.detail.value),
    })
    this.setData({
      ["popData.sttAmount"]: this.compute("sttAmount")
    })

  },
  amountBlur(e) {
    var value = e.detail.value
    if (!value || parseInt(value) < parseInt(this.data.popDataCopy.minCount)) {
      this.setData({
        ['popData.goodsCount']: this.data.popDataCopy.minCount
      })
      this.setData({
        ["popData.sttAmount"]: this.compute("sttAmount")
      })

    }
  },

  noTaxPriceInput(e) {

    this.setData({
      ["popData.NTPSingle"]: e.detail.value,
    }) //含税价和总价跟着改变
    this.setData({
      ["popData.discountPrice"]: this.compute("discountPrice"),
    })
    this.setData({
      ["popData.sttAmount"]: this.compute("sttAmount")
    })
  },
  /**
   * 无税价input失去焦点保留两位小数
   */
  noTaxPriceBlur(e) {
    var value = e.detail.value
    value = parseFloat(value).toFixed(2)

    if (isNaN(value)) {
      this.setData({
        ["popData.NTPSingle"]: "0",
      })
    } else {
      this.setData({
        ["popData.NTPSingle"]: value,
      })
    }
    this.setData({
      ["popData.discountPrice"]: this.compute("discountPrice"),
    })
    this.setData({
      ["popData.sttAmount"]: this.compute("sttAmount")
    })


  },
  /**
   * 税率input失去焦点
   */
  textRateInput(e) {
    var value = e.detail.value
    parseFloat(value)
    if (value < 0) {
      value = 0
    }
    if (value > 100) {
      value = 100
    }
    this.setData({
      ["popData.taxRate"]: value
    })
    this.setData({
      ["popData.discountPrice"]: this.compute("discountPrice"),
    })
    this.setData({
      ["popData.sttAmount"]: this.compute("sttAmount")
    })
  },
  taxRateBlur(e) {
    var value = e.detail.value
    value = parseFloat(value).toFixed(2)
    if (isNaN(value)) {
      this.setData({
        ["popData.taxRate"]: this.data.popDataCopy.taxRate
      })
    } else {
      this.setData({
        ["popData.taxRate"]: value + "%"
      })
    }

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
    this.setData({
      ["popData.discountPrice"]: e.detail.value,
    })
    this.setData({
      ["popData.NTPSingle"]: this.compute("NTPSingle"),
    }) //含税价和总价跟着改变
    this.setData({
      ["popData.sttAmount"]: this.compute("sttAmount")
    })

  },
  containTaxPriceBlur(e) {
    var value = e.detail.value
    value = parseFloat(value).toFixed(2)

    if (isNaN(value)) {
      this.setData({
        ["popData.discountPrice"]: "0",
      })
    } else {
      this.setData({
        ["popData.discountPrice"]: value,
      })
    }
    this.setData({
      ["popData.NTPSingle"]: this.compute("NTPSingle"),
    })
    this.setData({
      ["popData.sttAmount"]: this.compute("sttAmount")
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
    var goods = this.data.goodsList[this.data.activeIndex]
    var popData = this.data.popData
    var value = () => {
      var goodsDiscount = (parseFloat(popData.NTPSingle) / parseFloat(this.data.popData.facePrice)).toFixed(2)
      if (goodsDiscount > 1 || String(goodsDiscount) === 'Infinity' || isNaN(goodsDiscount)) {
        goodsDiscount = 1
      }
      return {
        brandNo: goods.brandCode,
        goodsUnit: goods.productUnit,
        goodsNo: goods.productUuid,
        goodsName: goods.productName, //+ "~" + goods.parameter
        facePrice: this.data.popDataCopy.facePrice,
        minNums: this.data.popDataCopy.goodsCount,
        goodsDiscount: goodsDiscount,
        goodsBrand: goods.brandName,
        NTP: parseFloat(popData.NTPSingle) * parseInt(popData.goodsCount),
        taxRate: parseFloat(popData.taxRate),
        billingAmount: parseFloat(this.data.popDataCopy.facePrice) * popData.goodsCount,
        sttAmount: (parseFloat(popData.discountPrice) * popData.goodsCount).toFixed(2),
        goodsCount: popData.goodsCount,
        remark: "",
        sourceOrder: "",
        tableKey: "",
        pirctureWay: goods.imgPath,
        NTPSingle: popData.NTPSingle,
        discountPrice: popData.discountPrice,
        beforeSendNumsPurchase: "0",
        sortID: "",

        brandCode: goods.brandCode,
        name: goods.brandName + "/" + goods.productName,
      }
    }
    var totalAmount = 0
    var totalPrice = 0
    var cartList = app.globalData.salesCartList
    var index = null
    var flag = cartList.some(item => {
      if (item.goodsNo === value().goodsNo) {
        index = cartList.indexOf(item)
        return true
      }

    })
    if (!flag) {
      cartList.push(value())
    } else {
      this.setData({
        ["popData.goodsCount"]: parseInt(this.data.popData.goodsCount) + parseInt(cartList[index].goodsCount)
      })
      app.globalData.salesCartList[index] = value()
    }

    cartList.forEach(item => {
      totalAmount = parseInt(totalAmount) + parseInt(item.goodsCount)
      totalPrice = parseFloat(totalPrice) + parseFloat(item.sttAmount)
    })
    this.setData({
      isShowPop: false,
      totalAmount: totalAmount,
      totalPrice: totalPrice.toFixed(2)
    })

  },
  confirmOrder() {
    wx.navigateBack()
  },

})