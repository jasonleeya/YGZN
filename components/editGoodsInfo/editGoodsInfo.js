// components/editGoodsInfo/editGoodsInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popData: {
      type: Object,
      value: {}
    }
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    popDataCopy:{}
  },
  lifetimes: {
    attached() {
      this.setData({
        popDataCopy: JSON.parse(JSON.stringify(this.data.popData))
      })
    }

  },
  methods: {

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
      console.log(this.data.popDataCopy)
      if (!value || parseInt(value) < parseInt(this.data.popDataCopy.minNums)) {
        this.setData({
          ['popData.goodsCount']: this.data.popDataCopy.minNums
        })
        this.setData({
          ["popData.sttAmount"]: this.compute("sttAmount")
        })

      }
    },

    noTaxPriceInput(e) {

      this.setData({
        ["popData.NTPSingle"]: parseFloat(e.detail.value),
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
        ["popData.discountPrice"]: parseFloat(e.detail.value),
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
      this.triggerEvent("editedInfo", { data: this.data.popData})
      // var goods = this.data.goodsList[this.data.activeIndex]
      // var popData = this.data.popData
      // var value = () => {
      //   return {
      //     brandNo: goods.brandCode,
      //     goodsUnit: goods.productUnit,
      //     goodsNo: goods.productUuid,
      //     goodsName: goods.productName + "~" + goods.parameter,
      //     facePrice: this.data.popDataCopy.NTPSingle,
      //     minNums: this.data.popDataCopy.goodsCount,
      //     goodsDiscount: (parseFloat(popData.NTPSingle) / parseFloat(this.data.popDataCopy.NTPSingle)).toFixed(2),
      //     goodsBrand: goods.brandName,
      //     NTP: parseFloat(popData.NTPSingle) * parseInt(popData.goodsCount),
      //     taxRate: parseFloat(popData.taxRate),
      //     billingAmount: parseFloat(this.data.popDataCopy.NTPSingle) * popData.goodsCount,
      //     sttAmount: (parseFloat(popData.discountPrice) * popData.goodsCount).toFixed(2),
      //     goodsCount: popData.goodsCount,
      //     remark: "",
      //     sourceOrder: "",
      //     tableKey: "",
      //     pirctureWay: "",
      //     NTPSingle: popData.NTPSingle,
      //     discountPrice: popData.discountPrice,
      //     beforeSendNumsPurchase: "0",
      //     sortID: "",

      //     brandCode: goods.brandCode,
      //     name: goods.brandName + "/" + goods.productName
      //   }
      // }
      // var totalAmount = 0
      // var totalPrice = 0
      // var cartList = app.globalData.purchaseCartList
      // var index = null
      // var flag = cartList.some(item => {
      //   if (item.goodsNo === value().goodsNo) {
      //     index = cartList.indexOf(item)
      //     return true
      //   }

      // })
      // if (!flag) {
      //   cartList.push(value())
      // } else {
      //   this.setData({
      //     ["popData.goodsCount"]: parseInt(this.data.popData.goodsCount) + parseInt(cartList[index].goodsCount)
      //   })
      //   app.globalData.purchaseCartList[index] = value()
      // }

      // cartList.forEach(item => {
      //   totalAmount = parseInt(totalAmount) + parseInt(item.goodsCount)
      //   totalPrice = parseFloat(totalPrice) + parseFloat(item.sttAmount)
      // })
      // this.setData({
      //   isShowPop: false,
      //   totalAmount: totalAmount,
      //   totalPrice: totalPrice
      // })
      // app.globalData.purchaseTotalPrice = totalPrice
      // app.globalData.purchaseTotalAmount = totalAmount
    },
  }
})