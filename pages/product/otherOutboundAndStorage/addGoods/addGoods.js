 var app = getApp()

 Page({
 
   data: { 
     goodsList: [],
     isShowPop: false, //显示弹窗
     activeIndex: null, //当前选择项的index
     popData: {}, //弹出框的内容
     popDataCopy: {}, //储存选择项原始值
     totalPrice: 0, //总价
     totalAmount: 0, //总量
     loadMore: false, //是否显示加载图标
     store: "",
     supplyNo: '',
     wareId: "",
     searchType: "",
     searchValue: "",
     isLoad: false,
     pageNo: 2,
     needSearchTypes: true
   },
   onLoad(options) {
     app.setTitle("添加商品") 
     if (options.needTypes === 'false') {
       this.setData({
         needSearchTypes: false
       })
     }


   },
   //进入页面初始化数据
   onShow() {
     var pages = getCurrentPages()
     var prePageData = pages[pages.length - 2].data
     var cartList = prePageData.cartList 
     var totalAmount = prePageData.totalAmount
     var totalPrice = prePageData.totalPrice
 
     this.setData({
       cartList: cartList,
       totalPrice: totalPrice,
       totalAmount: totalAmount
     })

   },

   searchTypeChange(e) {
     this.setData({
       pageNo: 1,
       searchType: e.detail.name
     })
     this.search()
   },

   inputValue(e) {
     var inputValue = e.detail
     this.setData({
       pageNo: 1,
       loadMore: false
     })
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
     var params = {}

     params = {
       wareKey: "",
       pageNo: this.data.pageNo,
       pageSize: "10",
       custNo: '',
       searchKey: this.data.searchValue,
     }

     app.http('searchStockProduct', params).then(data => {
         var queryString = []
         data.list.forEach(item => {
           queryString.push(item.productUuid)
           for (let key in item) {
             item[key] = String(item[key]).replace(/(\<b style='color:red'\>)|\<\/b\>/g, "")
           }
         })
         queryString.join(",")
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

  //  goodsDetail(e) {
  //    var index = e.currentTarget.dataset.index
  //    wx.navigateTo({
  //      url: '/pages/product/productOperate/productOperate?operateType=view&orderType=purchase&goodsNo=' + this.data.goodsList[index].productUuid + "&wareKey=" + this.data.wareId
  //    })
  //  },

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
     var goods=this.data.goodsList[index]
     var cartList=this.data.cartList
     var flag = cartList.some((item, i) => {
       if (item.itemKey === goods.productUuid) {
         index = i
         return true
       }
     })
     this.setData({
       isShowPop: true
     })
     if(flag){
       this.setData({
         popData:cartList[index]
       })
     }else{
       this.setData({ 
         ['popData.qty']: 1,
         ["popData.noTaxPrice"]: 0,
         ["popData.taxRate"]: '0',
         ["popData.price"]: 0,
         ["popData.totalPrice"]: 0,
         ["popData.noTaxTotal"]: 0
       })
     }

     this.setData({
       activeIndex: index
     })
    

   },

   compute(type) {
     var qty = isNaN(this.data.popData.qty) ? "0" : this.data.popData.qty
     var price = isNaN(this.data.popData.price) ? "0" : this.data.popData.price
     var noTaxPrice = isNaN(this.data.popData.noTaxPrice) ? "0" : this.data.popData.noTaxPrice
     var taxRate = isNaN(this.data.popData.taxRate) ? "0" : this.data.popData.taxRate

     switch (type) {
       case "qty":
         break
       case "noTaxPrice":
         return (parseFloat(price) / (1 + taxRate / 100)).toFixed(2)
         break
       case "taxRate":
         break
       case "price":
         return (noTaxPrice * (1 + (taxRate / 100))).toFixed(2)
         break
       case "totalPrice":
         return (parseInt(qty) * parseFloat(price)).toFixed(2)
         break
       case "noTaxTotal":
         return (parseInt(qty) * parseFloat(noTaxPrice)).toFixed(2)
         break
     }
   },
   amountInput(e) {
     var value = e.detail.value

     this.setData({
       ["popData.qty"]: parseInt(e.detail.value),
     })
     this.setData({
       ["popData.totalPrice"]: this.compute("totalPrice"),
       ["popData.noTaxTotal"]: this.compute("noTaxTotal")
     })

   },
   amountBlur(e) {
     var value = e.detail.value
     if (!value || parseInt(value) < parseInt(this.data.popDataCopy.minCount)) {
       this.setData({
         ['popData.qty']: 1
       })
       this.setData({
         ["popData.totalPrice"]: this.compute("totalPrice"),
         ["popData.noTaxTotal"]: this.compute("noTaxTotal")
       })

     }
   },

   noTaxPriceInput(e) {

     this.setData({
       ["popData.noTaxPrice"]: e.detail.value,
     }) //含税价和总价跟着改变
     this.setData({
       ["popData.price"]: this.compute("price"),
     })
     this.setData({
       ["popData.totalPrice"]: this.compute("totalPrice"),
       ["popData.noTaxTotal"]: this.compute("noTaxTotal")
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
         ["popData.noTaxPrice"]: "0",
       })
     } else {
       this.setData({
         ["popData.noTaxPrice"]: value,
       })
     }
     this.setData({
       ["popData.price"]: this.compute("price"),
     })
     this.setData({
       ["popData.totalPrice"]: this.compute("totalPrice"),
       ["popData.noTaxTotal"]: this.compute("noTaxTotal")
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
       ["popData.price"]: this.compute("price"),
     })
     this.setData({
       ["popData.totalPrice"]: this.compute("totalPrice"),
       ["popData.noTaxTotal"]: this.compute("noTaxTotal")
     })
   },
   taxRateBlur(e) {
     var value = e.detail.value
     value = parseFloat(value).toFixed(2)
     if (isNaN(value)) {
       this.setData({
         ["popData.taxRate"]: "0"
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
       ["popData.price"]: e.detail.value,
     })
     this.setData({
       ["popData.noTaxPrice"]: this.compute("noTaxPrice"),
     }) //含税价和总价跟着改变
     this.setData({
       ["popData.totalPrice"]: this.compute("totalPrice"),
       ["popData.noTaxTotal"]: this.compute("noTaxTotal")
     })

   },
   containTaxPriceBlur(e) {
     var value = e.detail.value
     value = parseFloat(value).toFixed(2)

     if (isNaN(value)) {
       this.setData({
         ["popData.price"]: "0",
       })
     } else {
       this.setData({
         ["popData.price"]: value,
       })
     }
     this.setData({
       ["popData.noTaxPrice"]: this.compute("noTaxPrice"),
     })
     this.setData({
       ["popData.totalPrice"]: this.compute("totalPrice"),
       ["popData.noTaxTotal"]: this.compute("noTaxTotal")
     })

   },
   remarkBlur(e){ 
     this.setData({
       ["popData.remark"]: e.detail.value,
     })
   },
   totalPriceInput(e) {

   },
   noTaxTotalPriceInput(e) {},
   totalPriceBlur(e) {

   },
   addCancel() {
     this.setData({
       isShowPop: false
     })
   },

   addConfirm() {
     var goods = this.data.goodsList[this.data.activeIndex]
     var popData = JSON.parse(JSON.stringify(this.data.popData)) 
     var totalAmount = 0
     var totalPrice = 0
     var cartList = this.data.cartList
     var index = null

     var flag = cartList.some((item,i) => { 
       if (item.itemKey === goods.productUuid) {
         index = i 
         return true
       } 
     })
     popData.itemKey = goods.productUuid
     popData.unitCode = goods.productUnit
     popData.brandName = goods.brandName
     popData.productName = goods.productName
     popData.brandCode = goods.brandCode 
     popData.imgPath = goods.imgPath 
     popData.taxRate = parseInt(popData.taxRate) 

     popData.noTaxPrice = parseFloat(popData.noTaxPrice)
     popData.price=parseFloat(popData.price)
     popData.totalPrice=parseFloat(popData.totalPrice)
     popData.noTaxTotal = parseFloat(popData.noTaxTotal) 
     
     if (!flag) {
       cartList.push(popData)
     } else {
       this.setData({
         ["cartList["+index+"]"]: popData
       }) 
     }

     cartList.forEach(item => {
       totalAmount = parseInt(totalAmount) + parseInt(item.qty)
       totalPrice = parseFloat(totalPrice) + parseFloat(item.totalPrice)
     })
 
     this.setData({
       isShowPop: false,
       totalAmount: totalAmount,
       totalPrice: totalPrice
     })

     var pages = getCurrentPages()
     var prePage = pages[pages.length - 2] 
     prePage.setData({
       totalAmount: totalAmount,
       totalPrice: totalPrice,
       cartList: cartList
     })

   },
   confirmOrder() {
     wx.navigateBack()
   },

 })