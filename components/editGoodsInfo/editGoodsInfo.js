+ // 商品编辑弹框

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
      nameKey: {
        type: String,
        value: "name"
      },
      noTaxPriceKey: {
        type: String,
        value: "NTPSingle"
      },
      noTaxTotalPriceKey: {
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
        value: "goodsDiscount"
      },
      remarkKey: {
        type: String,
        value: "remark"
      },
      minNumsKey: {
        type: Number,
        value: "minNums"
      },
      fromPage: {
        type: String,
        value: ""
      },
      facePriceKey: {
        type: String,
        value: "facePrice"
      },
      goodsDiscountkey: {
        type: String,
        value: "goodsDiscount"
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
          popDataCopy: JSON.parse(JSON.stringify(this.data.popData)) //浅复制编辑前的信息
        })
      }

    },
    methods: {
      compute(type) {
        //这些数据可能为null..
        var goodsCount = isNaN(this.data.popData[this.data.amountKey]) ? "0" : this.data.popData[this.data.amountKey]
        var discountPrice = isNaN(this.data.popData[this.data.containTaxPriceKey]) ? "0" : this.data.popData[this.data.containTaxPriceKey]
        var NTPSingle = isNaN(this.data.popData[this.data.noTaxPriceKey]) ? "0" : this.data.popData[this.data.noTaxPriceKey]
        var taxRate = isNaN(this.data.popData[this.data.taxKey]) ? "13" : this.data.popData[this.data.taxKey]
        //根据计算类型计算相应的数值
        switch (type) {
          case this.data.amountKey:
            break
          case this.data.noTaxPriceKey:
            return (parseFloat(discountPrice) / (1 + taxRate / 100)).toFixed(2)
            break
          case this.data.taxKey:
            break
          case this.data.containTaxPriceKey:
            return (NTPSingle * (1 + (taxRate / 100))).toFixed(2)
            break
          case this.data.totalPriceKey:
            return (parseInt(goodsCount) * parseFloat(discountPrice)).toFixed(2)
            break
          case this.data.noTaxTotalPriceKey:
            return (parseInt(goodsCount) * parseFloat(NTPSingle)).toFixed(2)
            break
          case this.data.goodsDiscountKey:
            var discount = (parseFloat(NTPSingle) / parseFloat(this.data.popData[this.data.facePriceKey])).toFixed(2) 
            if (isNaN(discount) || discount > 1) {
              discount = 1
            }  
            return discount
        }
      },
      //数量input,数量改变总价改变
      amountInput(e) {
        var value = e.detail.value
        this.setData({
          ["popData." + this.data.amountKey]: parseInt(e.detail.value),
        })
        this.setData({
          ["popData." + this.data.totalPriceKey]: this.compute(this.data.totalPriceKey),
          ["popData." + this.data.noTaxTotalPriceKey]: this.compute(this.data.noTaxTotalPriceKey)
        })
      },
      //数量input失去焦点如果数量小于最小包装量数量边为最小包装量
      amountBlur(e) {
        var value = e.detail.value
        var minNums = this.data.popDataCopy[this.data.minNumsKey]
        if (typeof minNums === 'undefined') {
          minNums = 1
        }
        if (!value || parseInt(value) < parseInt(minNums)) {
          this.setData({
            ['popData.' + this.data.amountKey]: minNums
          })
          this.setData({
            ["popData." + this.data.totalPriceKey]: this.compute(this.data.totalPriceKey),
            ["popData." + this.data.noTaxTotalPriceKey]: this.compute(this.data.noTaxTotalPriceKey)
          })

        }
      },
      //无税价input，无税价改变含税价和总价跟着改变
      noTaxPriceInput(e) {
        this.setData({
          ["popData." + this.data.noTaxPriceKey]: e.detail.value,
        })
        this.setData({
          ["popData." + this.data.containTaxPriceKey]: this.compute(this.data.containTaxPriceKey),
        })
        this.setData({
          ["popData." + this.data.totalPriceKey]: this.compute(this.data.totalPriceKey),
          ["popData." + this.data.noTaxTotalPriceKey]: this.compute(this.data.noTaxTotalPriceKey),
        })
        if (this.data.fromPage !== 'other') {
          this.setData({
            ["popData." + this.data.goodsDiscountKey]: this.compute(this.data.goodsDiscountKey),
          }) 
        }
      },
      /**
       * 无税价input失去焦点，总价含税价改变
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
          ["popData." + this.data.containTaxPriceKey]: this.compute(this.data.containTaxPriceKey),
        })
        this.setData({
          ["popData." + this.data.totalPriceKey]: this.compute(this.data.totalPriceKey),
          ["popData." + this.data.noTaxTotalPriceKey]: this.compute(this.data.noTaxTotalPriceKey), 
        })
        if (this.data.fromPage !== 'other') {
          this.setData({
            ["popData." + this.data.goodsDiscountKey]: this.compute(this.data.goodsDiscountKey),
          })
        }

      },
      /**
       * 税率input失去焦点，含税价总价改变
       */
      textRateInput(e) {
        var value = e.detail.value
        parseFloat(value)
        //控制税率在1-100间
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
          ["popData." + this.data.containTaxPriceKey]: this.compute(this.data.containTaxPriceKey),
        })
        this.setData({
          ["popData." + this.data.totalPriceKey]: this.compute(this.data.totalPriceKey),
          ["popData." + this.data.noTaxTotalPriceKey]: this.compute(this.data.noTaxTotalPriceKey)
        })
      },
      //税率input失去焦点加上%
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

      //税率input获得焦点时去掉%保留两位小数
      taxRateFocus(e) {
        this.setData({
          ["popData." + this.data.taxKey]: parseFloat(e.detail.value).toFixed(2)
        })
      },
      /**
       * 含税价input,含税价和总价跟着改变
       */
      containTaxPriceInput(e) {
        this.setData({
          ["popData." + this.data.containTaxPriceKey]: e.detail.value,
        })
        this.setData({
          ["popData." + this.data.noTaxPriceKey]: this.compute(this.data.noTaxPriceKey),
        })
        this.setData({
          ["popData." + this.data.totalPriceKey]: this.compute(this.data.totalPriceKey),
          ["popData." + this.data.noTaxTotalPriceKey]: this.compute(this.data.noTaxTotalPriceKey), 
        })
        if (this.data.fromPage !== 'other') {
          this.setData({
            ["popData." + this.data.goodsDiscountKey]: this.compute(this.data.goodsDiscountKey),
          })
        }
      },
      //含税价input，总价不含税价跟着改变
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
          ["popData." + this.data.noTaxPriceKey]: this.compute(this.data.noTaxPriceKey),
        })
        this.setData({
          ["popData." + this.data.totalPriceKey]: this.compute(this.data.totalPriceKey),
          ["popData." + this.data.noTaxTotalPriceKey]: this.compute(this.data.noTaxTotalPriceKey), 
        })
        if (this.data.fromPage !== 'other') {
          this.setData({
            ["popData." + this.data.goodsDiscountKey]: this.compute(this.data.goodsDiscountKey),
          })
        }
      },
      remarkBlur(e) {
        this.setData({
          ["popData." + this.data.remarkKey]: e.detail.value
        })
      },
      totalPriceInput(e) {

      },
      totalPriceBlur(e) {

      },
      //通知父组件关闭弹窗
      addCancel() {
        this.triggerEvent("closePop")
      },
      //确定改变数据并计算不含税总价，商品折扣
      addConfirm() {
        var data = this.data
        // data.popData[data.noTaxTotalPriceKey] = parseFloat(data.popData[data.noTaxPriceKey]) * parseFloat(data.popData[data.amountKey])
        if (typeof data.popData[data.goodsDiscountKey] !== "undefined") {
          data.popData[data.goodsDiscountKey] = (parseFloat(data.popData[data.noTaxTotalPriceKey]) / parseFloat(data.popDataCopy[data.noTaxTotalPriceKey])).toFixed(2)
        }
        data.popData[data.taxKey] = parseFloat(parseFloat(data.popData[data.taxKey]).toFixed(2))

        if (data.popData[data.goodsDiscountKey] > 1) {
          data.popData[data.goodsDiscountKey] = 1
        }
        this.triggerEvent("editedInfo", {
          data: this.data.popData
        })
      },
    }
  })