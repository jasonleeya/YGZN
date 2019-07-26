import store from '../../../store'
import create from '../../../utils/create'

create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    ...store.data.addGoods,
    isShowPop: false, //显示弹窗
    activeIndex: null, //当前添加项的index
    popData: {}, //弹出框的内容
    popDataCopy: {}, //储存原始值
    totalPrice:0, //总价
    totalAmount:0 //总量
  },
  //进入页面初始化数据
  onShow() {
    var totalAmount=0
    if (this.store.data.newPurchase.cartList.length===0){
        totalAmount=0
    }else{
      this.store.data.newPurchase.cartList.forEach(item => {
          totalAmount += item.amount
      
      })
    }
   
    this.setData({
      totalPrice:this.store.data.newPurchase.totalPrice.toFixed(2),  
      totalAmount: totalAmount
    }) //添加store里的总价和总额
  },
  // 显示弹出框
  showPop(e) {
    var index = e.target.dataset.index
    var cartList = this.store.data.newPurchase.cartList
    var flag=false;

    cartList.forEach(item=>{
      if (item.id === this.data.goodsList[index].id) {//判断cartList中是否有此商品
        flag=true
        this.setData({
          isShowPop: true,
          activeIndex: index,
          popData: JSON.parse(JSON.stringify(item)), //深拷贝添加项内容到popData
          popDataCopy: JSON.parse(JSON.stringify(item)), //保存初始数据
        }, function () {
          //回调
          var totalPrice = parseInt(item.amount) * (parseFloat(this.data.popData.noTaxPrice) * (1 + parseFloat(this.data.popData.taxRate) / 100))
          totalPrice = totalPrice.toFixed(2)
          this.setData({
            ["popData.amount"]: parseInt(item.amount), //cartList中该商品数量
            ["popData.totalPrice"]: totalPrice
          }) //初始总价
        })
      }
    })
    if(!flag){ 
      this.setData({
        isShowPop: true,
        activeIndex: index,
        popData: JSON.parse(JSON.stringify(this.data.goodsList[index])), //深拷贝添加项内容到popData
        popDataCopy: JSON.parse(JSON.stringify(this.data.goodsList[index])),
      }, function () {
        //回调
        this.setData({
          ["popData.amount"]: 1, //总价初始值为1
          ["popData.totalPrice"]: (parseFloat(this.data.popData.noTaxPrice) * (1 + parseFloat(this.data.popData.taxRate) / 100)).toFixed(2)
        }) //初始总价
      }) 
    }
  },
  /**
   * 库存input
   */
  amountInput(e) {
    if (e.detail.value === "") { //如果输入内容为空则为0
      e.detail.value = "0"
    }
    this.setData({
      ["popData.amount"]: parseInt(e.detail.value),
      ["popData.totalPrice"]: (parseInt(e.detail.value) * parseFloat(this.data.popData.noTaxPrice) * (1 + parseFloat(this.data.popData.taxRate) / 100)).toFixed(2)
    }) //数量和总价改变


  },
  noTaxPriceInput(e) {
    if (e.detail.value === "") { //如果输入内容为空则为原始值
      e.detail.value = this.data.popDataCopy.noTaxPrice
    }
    this.setData({
      ["popData.noTaxPrice"]: e.detail.value,
      ["popData.containTaxPrice"]: (((parseFloat(this.data.popData.taxRate) / 100) + 1) * parseFloat(e.detail.value)).toFixed(2),
      ["popData.totalPrice"]: (parseInt(this.data.popData.amount) * parseFloat(e.detail.value) * (1 + parseFloat(this.data.popData.taxRate) / 100)).toFixed(2)
    })
  },
  noTaxPriceBlur(e) {
    this.setData({
      ["popData.noTaxPrice"]: parseFloat(e.detail.value).toFixed(2),
    })
  },
  /**
   * 税率input
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
    }) //含税价动态改变
  },
  taxRateFocus(e) {
    this.setData({
      ["popData.taxRate"]: parseFloat(e.detail.value).toFixed(2), //保留两位小数
    })
  },


  containTaxPriceInput(e) {
    if (e.detail.value === "") { //如果输入内容为空则为原始值
      e.detail.value = this.data.popDataCopy.containTaxPrice
    }
    var value = e.detail.value
    this.setData({
      ["popData.containTaxPrice"]: e.detail.value,
      ["popData.noTaxPrice"]: (parseFloat(value) / ((parseFloat(this.data.popData.taxRate) / 100) + 1)).toFixed(2),
      ["popData.totalPrice"]: (parseInt(this.data.popData.amount) * parseFloat(value)).toFixed(2)
    }) //不含税价动态改变
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
    var flag=false
    var totalAmount=0
    var totalPrice=0
    var cartList = this.store.data.newPurchase.cartList
    cartList.forEach((item,index)=>{
  
      if(item.id===this.data.popData.id){ //如果id相同则合并
        flag = true
      if(this.data.popData.amount===0){ // 数量改为0时删除项
        cartList.splice(index,1)
      }else{
       cartList[index] = this.data.popData
      }      
      }
    })
    if(!flag){
      if (this.data.popData.amount!==0){
        cartList.push(this.data.popData)    //如果id不相同则添加
      }
  
    }

    cartList.forEach(item=>{
      totalAmount+=item.amount
      totalPrice += item.amount*item.containTaxPrice
    })
    totalPrice=totalPrice.toFixed(2) 

    this.store.data.newPurchase.totalPrice = totalPrice 
    this.setData({
      totalPrice: totalPrice,
      totalAmount: totalAmount,
      isShowPop: false
    })
    this.update()
    console.log(cartList)
  },
  confirmOrder(){
    wx.redirectTo({
      url: '../newPurchase/newPurchase',
    })
  }
})