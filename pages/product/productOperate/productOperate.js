import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    quantifier: {
      list: ['个', '片', '条','盒', '只'],
      picked: null,
    },
    receiptDay: {
      list: [1, 2, 3, 4, 5, 6, 7],
      picked: null,
    },
    safeStock: {
      list: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      picked: null,
    },
    stockTransparency: {
      list: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      picked: null,
    },
    uploadPicUrl: "",
    barCode: "",
    operateType: "",
    orderType: "all",
    editData: {},
    editId: null,
    canEdit: false,
    goodsNo: "",
    wareKey: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("商品信息")
    if (options.operateType === "view") {
      this.setData({
        canEdit: false,
        operateType: "view",
        goodsNo: options.goodsNo,
        wareKey: options.wareKey
      })
      switch (options.orderType) {
        case "purchase":
          this.setData({
            orderType: "purchase"
          })
          break
        case "sale":
          this.setData({
            orderType: "sale"
          })
          break
        default:
          this.setData({
            orderType: "all"
          })
      }

      app.http("queryStock", {
        searchKey: options.goodsNo,
        wareKey: options.wareKey,
        pageNo: 1,
        pageSize: 15,
        brandName: "",
        stockStatus: ""
      }).then((data) => {
        if (data.list.length === 0) {
          app.showToast("无该商品信息,两秒后自动返回上一页面")
          setTimeout(()=>{
            wx.navigateBack()
          },2000)
          return
        }
        var obj = data.list[0]
        obj.defaultTime = obj.defaultTime ? 0 : obj.defaultTime
        for (let i in obj) {
          if (obj[i] === null || obj[i] === "") {
            obj[i] = "无"
          }
          if (obj[i] === 0) {
            obj[i] = "0"
          }
        }

        this.setData({
          editData: obj
        })
      })
    }

    if (options.operateType === "edit") {
      var editId = options.editId
      var pages = getCurrentPages()
      var prePage = getCurrentPages()[pages.length - 2]
      var goodsInfo = prePage.data.productList[editId]

      goodsInfo.defaultTime = goodsInfo.defaultTime === null ? 0 : goodsInfo.defaultTime
      for (let i in goodsInfo) {
        if (goodsInfo[i] === null || goodsInfo[i] === "") {
          goodsInfo[i] = "无"
        }
        if (goodsInfo[i] === 0) {
          goodsInfo[i] = "0"
        }
      }
      this.setData({
        editData: goodsInfo,
        operateType: 'edit',
        editId: editId,
      })
    }
    if (options.operateType === "add") {
      this.setData({
        canEdit: true,
        operateType: "add"
      })
    }

  },
  pick: function(e) {
    if (!this.data.canEdit) {
      return
    }
    var name = e.currentTarget.dataset.name
    this.setData({
      [name + ".picked"]: e.detail.value
    })
  },
  uploadPic() {
    if (!this.data.canEdit) {
      return
    }
    app.showToast("暂不支持操作图片")
    return
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          uploadPicUrl: res.tempFilePaths
        })
      }
    })
  },
  removePic() {
    if (!this.data.canEdit) {
      return
    }
    app.showToast("暂不支持操作图片")
    return

    this.setData({
      uploadPicUrl: "",
      ["editData.pic"]: ""
    })
  },
  scan() {
    if (!this.data.canEdit) {
      return
    }
    let that = this
    wx.scanCode({
      success(res) {
        console.log(res.result)
        if (that.data.operateType === "edit") {
          that.setData({
            ["editData.brandCode"]: res.result
          })
        }
        that.setData({
          barCode: res.result
        })
      },
      fail(res) {
        app.showToast("没有发现条形码")
      }
    })
  },
  formSubmit(e) {
    if (!this.data.canEdit) {
      return
    }
    var editData = this.data.editData
    var formData = e.detail.value

    if (!formData.brandName) {
      app.showToast("请填写品牌")
      return
    }
    if (!formData.brandCode) {
      app.showToast("请填写品牌代码")
      return
    }
    if (!formData.unitCode) {
      app.showToast("请填写或选择单位")
      return
    }
    if (!formData.defaultTime) {
      app.showToast("请填写或选择默认到货天数")
      return
    }
    if (!formData.warnQty) {
      app.showToast("请填写或选择安全库存")
      return
    }



    if (this.data.operateType === "edit") {
      var params = {
        itemKey: editData.itemKey,
        wareKey: editData.wareKey,
        shelfPosition: formData.shelfPosition,
        brandCode: formData.brandCode,
        unitCode: formData.unitCode,
        description: formData.description,
        productName: formData.productName,
        minCount: formData.minCount,
        defaultTime: formData.defaultTime,
        innerCode: formData.innerCode,
        brandName: formData.brandName,
        flag: false
      }

      app.http("updateWareItem", params).then(res => {
        if (res.success === true) {
          app.showToast("修改成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
          
        } else {
          app.showToast("修改失败")
        }
      }).catch(err => {
        app.showToast(err)
      })
    }
    if (this.data.operateType === "add") {
      var pages = getCurrentPages()
      var storeHouseId = pages[pages.length - 2].data.selectedStoreHouseId
      var params = {
        itemKey: '',
        wareKey: storeHouseId,
        shelfPosition: formData.shelfPosition,
        brandCode: formData.brandCode,
        unitCode: formData.unitCode,
        description: formData.description,
        productName: formData.productName,
        minCount: formData.minCount,
        defaultTime: formData.defaultTime,
        innerCode: formData.innerCode,
        brandName: formData.brandName
      }
      app.http("addWareItem", params).then(res => {
        if (res.success === true) {
          app.showToast("添加成功")
          setTimeout(() => { 
            wx.navigateBack()
          }, 1000) 
        } else {
          app.showToast("添加失败")
        }
      }).catch(err => {
        app.showToast(err)
      })
    }
  },
  allowEdit() {
    this.setData({
      canEdit: true
    })
  },
  buySellRecord() {

    switch (this.data.orderType) {
      case "all":
        wx.navigateTo({
          url: "/pages/product/goodsInAndOut/goodsInAndOut?wareHouse=" + this.data.editData.wareKey + "&goodsNo=" + this.data.editData.itemKey
        })
        break
      case "purchase":
        wx.navigateTo({
          url: "/pages/product/goodsPurchaseOrSaleRecord/goodsPurchaseOrSaleRecord?orderType=purchase&wareHouse=" + this.data.wareKey + "&goodsNo=" + this.data.goodsNo
        })
        break
      case "sale":
        wx.navigateTo({
          url: "/pages/product/goodsPurchaseOrSaleRecord/goodsPurchaseOrSaleRecord?orderType=sale&wareHouse=" + this.data.wareKey + "&goodsNo=" + this.data.goodsNo
        })
        break
    }


  },


})