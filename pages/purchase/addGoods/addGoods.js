import store from '../../../store'
import create from '../../../utils/create'

create(store,{

  /**
   * 页面的初始数据
   */
  data: {
    ...store.data.addGoods,
    isShowPop: false, //显示弹窗
    activeIndex: null, //当前添加项的index
    popData: {}, //弹出框的内容
  },
  onLoad(){
    console.log(this.store.data)
  },
  /**
   * 显示弹出框
   */
  showPop(e) {
    var index = e.target.dataset.index

    this.setData({
      isShowPop: true,
      activeIndex: index,
      popData: JSON.parse(JSON.stringify(this.data.goodsList[index])) //深拷贝添加项内容到popData
    })
  },
  /**
   * 库存input
   */
  stockInput(e) {
    if (e.detail.value > this.data.goodsList[this.data.activeIndex].stock) { //如果输入内容大于库存则输入内容等于库存
      e.detail.value = this.data.goodsList[this.data.activeIndex].stock
    }
    this.setData({
      ["popData.stock"]: e.detail.value
    })
  
    
  },
  noTaxPriceInput(e) {
    this.setData({
      ["popData.noTaxPrice"]: e.detail.value,
      ["popData.containTaxPrice"]: (((parseFloat(this.data.popData.taxRate) / 100) + 1) * parseFloat(e.detail.value)).toFixed(2),
    })
  },
  noTaxPriceBlur(e){
this.setData({
  ["popData.noTaxPrice"]: parseFloat(e.detail.value).toFixed(2),
})
  },
  /**
   * 税率input
   */

  taxRateBlur(e) {
 
    var value = e.detail.value
    if (value===''){
      this.setData({
        ["popData.taxRate"]: '0',
      })
    }
    if (parseFloat(value) <= 1 && parseFloat(value)>=0){
      this.setData({
        ["popData.taxRate"]: (parseFloat(value) * 100).toFixed(2), 
    })
    }
    if (parseFloat(value) > 1 && parseFloat(value)<100){
      this.setData({
        ["popData.taxRate"]: parseFloat(value).toFixed(2), 
      })
    }
    if (parseFloat(value) >= 100) {
      this.setData({
        ["popData.taxRate"]: '100',
      })
    }
    this.setData({
      ["popData.containTaxPrice"]: (((parseFloat(this.data.popData.taxRate) / 100) + 1) * parseFloat(this.data.popData.noTaxPrice)).toFixed(2)
    })
  },
  taxRateFocus(e){
    this.setData({
      ["popData.taxRate"]: parseFloat(e.detail.value).toFixed(2),
    })
  },


  containTaxPriceInput(e) {
    var value = e.detail.value
    this.setData({
      ["popData.containTaxPrice"]: e.detail.value,
      ["popData.noTaxPrice"]: (parseFloat(value) / ((parseFloat(this.data.popData.taxRate) / 100) + 1)).toFixed(2)
    })
  },
  containTaxPriceBlur(e){
    this.setData({
      ["popData.containTaxPrice"]: parseFloat(e.detail.value).toFixed(2),
    })
  },
  addCancel() {
    this.setData({
      isShowPop: false
    })
    console.log(this.store.data.purchase.addGoods.isShowPop)
  },
  addConfirm() {
    this.setData({
      isShowPop: false
    })
  }
})