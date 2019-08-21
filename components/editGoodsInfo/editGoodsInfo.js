// components/editGoodsInfo/editGoodsInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popData: {
      type: Object,
      value: {}
    },
    amountKey: {
      type: String,
      value: "goodsCount"
    },
    noTaxPriceKey: {
      type: String,
      value: "NTPSingle"
    },
    noTaxTotalPrice: {
      type: String,
      value: "NTP"
    },
    taxKey: {
      type: String,
      value: "taxRate"
    },
    containTaxPriceKey: {
      type: String,
      value: "discountPrice"
    },
    totalPriceKey: {
      type: String,
      value: "sttAmount"
    },
    goodsDiscountKey: {
      type: String,
      value: "sttAmount"
    },

  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    popDataCopy: {}
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
      var goodsCount = isNaN(this.data.popData[this.data.amountKey]) ? "0" : this.data.popData[this.data.amountKey]
      var discountPrice = isNaN(this.data.popData[this.data.containTaxPriceKey]) ? "0" : this.data.popData[this.data.containTaxPriceKey]
      var NTPSingle = isNaN(this.data.popData[this.data.noTaxPriceKey]) ? "0" : this.data.popData[this.data.noTaxPriceKey]
      var taxRate = isNaN(this.data.popData[this.data.taxKey]) ? "13" : this.data.popData[this.data.taxKey]

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
        ["popData." + this.data.amountKey]: parseInt(e.detail.value),
      })
      this.setData({
        ["popData." + this.data.totalPriceKey]: this.compute("sttAmount")
      })
      console.log(this.data.popData[this.data.totalPriceKey])

    },
    amountBlur(e) {
      var value = e.detail.value
      console.log(this.data.popDataCopy)
      if (!value || parseInt(value) < parseInt(this.data.popDataCopy.minNums)) {
        this.setData({
          ['popData.' + this.data.amountKey]: this.data.popDataCopy.minNums
        })
        this.setData({
          ["popData." + this.data.totalPriceKey]: this.compute("sttAmount")
        })

      }
    },

    noTaxPriceInput(e) {

      this.setData({
        ["popData." + this.data.noTaxPriceKey]: parseFloat(e.detail.value),
      }) //含税价和总价跟着改变
      this.setData({
        ["popData." + this.data.containTaxPriceKey]: this.compute("discountPrice"),
      })
      this.setData({
        ["popData." + this.data.totalPriceKey]: this.compute("sttAmount")
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
          ["popData." + this.data.noTaxPriceKey]: "0",
        })
      } else {
        this.setData({
          ["popData." + this.data.noTaxPriceKey]: value,
        })
      }
      this.setData({
        ["popData." + this.data.containTaxPriceKey]: this.compute("discountPrice"),
      })
      this.setData({
        ["popData." + this.data.totalPriceKey]: this.compute("sttAmount")
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
        ["popData." + this.data.taxKey]: value
      })
      this.setData({
        ["popData." + this.data.containTaxPriceKey]: this.compute("discountPrice"),
      })
      this.setData({
        ["popData." + this.data.totalPriceKey]: this.compute("sttAmount")
      })
    },
    taxRateBlur(e) {
      var value = e.detail.value
      value = parseFloat(value).toFixed(2)
      if (isNaN(value)) {
        this.setData({
          ["popData." + this.data.taxKey]: this.data.popDataCopy[this.data.taxKey]
        })
      } else {
        this.setData({
          ["popData." + this.data.taxKey]: value + "%"
        })
      }

    },
    /**
     * 税率input获得焦点时去掉%保留两位小数
     */
    taxRateFocus(e) {
      this.setData({
        ["popData." + this.data.taxKey]: parseFloat(e.detail.value).toFixed(2), //保留两位小数
      })
    },
    /**
     * 含税价input
     */
    containTaxPriceInput(e) {
      this.setData({
        ["popData." + this.data.containTaxPriceKey]: parseFloat(e.detail.value),
      })
      this.setData({
        ["popData." + this.data.noTaxPriceKey]: this.compute("NTPSingle"),
      }) //含税价和总价跟着改变
      this.setData({
        ["popData." + this.data.totalPriceKey]: this.compute("sttAmount")
      })

    },
    containTaxPriceBlur(e) {
      var value = e.detail.value
      value = parseFloat(value).toFixed(2)

      if (isNaN(value)) {
        this.setData({
          ["popData." + this.data.containTaxPriceKey]: "0",
        })
      } else {
        this.setData({
          ["popData." + this.data.containTaxPriceKey]: value,
        })
      }
      this.setData({
        ["popData." + this.data.noTaxPriceKey]: this.compute("NTPSingle"),
      })
      this.setData({
        ["popData." + this.data.totalPriceKey]: this.compute("sttAmount")
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
      var data = this.data
      data.popData[data.noTaxTotalPrice] = parseFloat(data.popData[data.noTaxPriceKey]) * parseFloat(data.popData[data.amountKey])
      data.popData[data.goodsDiscount] = (parseFloat(data.popData[data.noTaxTotalPrice]) / parseFloat(this.data.popDataCopy[data.noTaxTotalPrice])).toFixed(2)
      if (data.popData[data.goodsDiscount] > 1) {
        data.popData[data.goodsDiscount] = 1
      }
      this.triggerEvent("editedInfo", {
        data: this.data.popData
      })
    },
  }
})