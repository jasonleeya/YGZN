let app = getApp()
Page({
  data: {
    cartList: [],
    totalAmount: 0,
    totalPrice: 0,
    showPop: false,
    popData: {},
    popDataCopy: {},
    editIndex: null,
    storageDate: "",
    warehouse: {
      index: 0,
      list: [],
      idList: []
    },
    canEdit: true,
    orderStatus: "",
    tranCode:null
  },
  onLoad: function(options) {  
    if (options.tranCode==='1'){
      app.setTitle("其他出库编辑")
    }else{
      app.setTitle("其他入库编辑")
    }
    this.setData({
      tranCode: options.tranCode
    })
    this.setData({
      operateType: options.operateType
    })
    app.http("getWarehouse").then(data => {
      var list = []
      var idList = []
      data.list.forEach(item => {
        list.push(item.name)
        idList.push(item.tableKey)
      })
      this.setData({
        ["warehouse.list"]: list,
        ["warehouse.idList"]: idList
      })
    })

    var date
    var storageDate
    if (options.operateType === "edit") {
      this.setData({
        editId: options.editId,
        canEdit: false
      })
      app.http("findAllDataById", {
        id: options.editId
      }).then(data => {
        date = new Date(data.infoBody.main.tranDate)
        storageDate = date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
        this.setData({
          storageDate,
          remark: data.infoBody.main.remark,
          orderStatus: data.infoBody.main.status
        })

        var warehouseIndex = data.infoBody.main.wareKey
        this.setData({
          ["warehouse.index"]: this.data.warehouse.idList.indexOf(warehouseIndex)
        })

        var list = []
        var totalPrice = 0

        data.infoBody.details.forEach((item) => {
          list.push(Object.assign(item.tranDetail, {
            brandName: item.productDetail.brandName,
            imgPath: item.productDetail.imgPath,
            productName: item.productDetail.productName
          }))
          totalPrice += parseFloat(item.tranDetail.totalPrice)
        })
        this.setData({
          cartList: list,
          totalPrice: totalPrice
        })
      }) 
    } else { 
      var date = new Date()
      storageDate = date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
      this.setData({
        storageDate
      }) 
    } 
  },
  onShow: function() {

  },
  addGoods() {
    if (!this.data.canEdit) {
      return
    }
    wx.navigateTo({
      url: '/pages/product/otherOutboundAndStorage/addGoods/addGoods?needTypes=false'
    })
  },
  editGoodsInfo(e) {
    this.setData({
      showPop: true,
      popData: this.data.cartList[e.detail.index],
      editIndex: e.detail.index
    })
  },
  closePop() {
    this.setData({
      showPop: false
    })
  },
  getEditInfo(e) {
    if (!this.data.canEdit) {
      app.showToast("不可编辑或请先点击编辑按钮")
      this.setData({
        showPop: false
      })
      return
    }
    this.setData({
      showPop: false,
      ["cartList[" + this.data.editIndex + "]"]: e.detail.data
    })
    var totalAmount = 0
    var totalPrice = 0
    var cartList = this.data.cartList

    cartList.forEach(item => {
      totalAmount = parseInt(totalAmount) + parseInt(item.qty)
      totalPrice = parseFloat(totalPrice) + parseFloat(item.totalPrice)
    })
    this.setData({
      totalAmount,
      totalPrice
    })
  },
  edit() {
    if (!this.data.canEdit) {
      this.setData({
        canEdit: true
      })
    } else {

    }
  },
  submitCheck() {
    wx.showModal({
      title: '确定要提交吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("updateStatus", {
          status: 1,
          id: this.data.editId
        }).then(() => {
          app.showToast("提交成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      }
    })

  },
  check() {
    wx.showModal({
      title: '确定要审核吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("updateStatus", {
          status: 2,
          id: this.data.editId
        }).then(() => {
          app.showToast("审核成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      }
    })
  },
  abandon() {
    wx.showModal({
      title: '确定要弃审吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("updateStatus", {
          status: -1,
          id: this.data.editId
        }).then(() => {
          app.showToast("弃审成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      }
    })
  },
  dateChange(e) {
    this.setData({
      storageDate: e.detail.value
    })
  },
  warehouseChange(e) {
    this.setData({
      ["warehouse.index"]: e.detail.value
    })
  },
  goodsCountChange(e) {
    var index = e.detail.index
    var amount = e.detail.amount
    var cartList = this.data.cartList
    var totalAmount = 0
    var totalPrice = 0 

    this.setData({
      ["cartList[" + index + "].qty"]: e.detail.amount,
      ["cartList[" + index + "].totalPrice"]: (parseFloat(this.data.cartList[index].price) * amount).toFixed(2),
      ["cartList[" + index + "].noTaxTotal"]: (parseFloat(this.data.cartList[index].noTaxPrice) * amount).toFixed(2)
    })
    cartList.forEach(item => {
      totalAmount = parseInt(totalAmount) + parseInt(item.qty)
      totalPrice = parseFloat(totalPrice) + parseFloat(item.totalPrice)
    })

    this.setData({
      totalAmount,
      totalPrice
    })
  },
  deleteGoods(e){
    var cartList=this.data.cartList
    var totalAmount = 0
    var totalPrice = 0
    cartList.splice(e.detail.index,1) 

    cartList.forEach(item => {
      totalAmount = parseInt(totalAmount) + parseInt(item.qty)
      totalPrice = parseFloat(totalPrice) + parseFloat(item.totalPrice)
    })

    this.setData({
      cartList,
      totalAmount,
      totalPrice
    }) 
  },
  submit(e) {
    if (!this.data.canEdit) {
      return
    }
    var formData = e.detail.value
    var params = {}
    var cartList = this.data.cartList
    if(cartList.length===0){
      app.showToast("请添加商品")
      return
    }
    cartList.forEach(item => {
      delete item.imgPath
      delete item.brandName
      delete item.productName
      delete item.brandCode
    })
    formData.wareKey = this.data.warehouse.idList[formData.wareKey]


    params.mainJson = JSON.stringify({
      "tranDate": formData.tranDate,
      "tabkey": this.data.operateType === 'edit' ? this.data.editId : '',
      "wareKey": formData.wareKey,
      "tranCode": this.data.tranCode,
      "tranName": "其他入库",
      "remark": formData.remark
    })
    params.detailsJson = JSON.stringify(cartList)

    app.http("saveData", params).then(() => {
      app.showToast("保存成功")
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
  }
})