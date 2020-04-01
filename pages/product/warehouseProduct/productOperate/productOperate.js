let app = getApp()
Page({
  data: {
    editData: {
      productUuid: '',
      brandName: '',
      brandCode: '',
      productName: '',
      description: '',
      spcsCode: '',
      productUnit: '',
      minCount: 1,
      price: '',
      sellPrice: '',
      flag: 0 
    },
    statusList: [{ name: '上架', flag: 0 }, { name: '下架', flag: -1 }]
  },
  onLoad: function (options) {
    if (options.operateIndex) {
      var pages = getCurrentPages()
      var prePage = pages[pages.length - 2]
      var editData = prePage.data.productList[options.operateIndex]
      this.setData({
        editData
      })
    }
    
  },
  input(e) {
    this.setData({
      ['editData.' + e.currentTarget.dataset.name]: e.detail.value
    })
  },

  uploadPic() {
    app.showToast("暂不支持")
  },
  removePic() {
    this.uploadPic()
  },
  scan() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          ["editData.brandCode"]: res.result
        })
      },
      fail: (res) => {
        app.showToast("没有发现条形码")
      }
    })
  },
  statusPick(e) {
    this.setData({
      ["editData.flag"]: this.data.statusList[e.detail.value].flag
    })
  },
  save() {
    var editData = this.data.editData
    var text=""
    if(editData.brandName===''){
      text = '请填写品牌' 
    } 
    else if(editData.brandCode===''){
      text = '请填写品牌代码' 
    }
    else if(editData.productName===''){
      text = '请填写产品名称' 
    }
    else if(editData.description===''){
      text = '请填写规格' 
    }
    else if(editData.minCount===''){
      text = '请填写最小包装量'
    } 
    else if(editData.productUnit===''){
      text = '请填写单位'
    } 
    else if(editData.price===''){
      text = '请填写面价'
    }
    else if(editData.sellPrice===''){
      text = '请填写销售价'
    }
   if(text!==''){
     app.showToast(text)
    return 
   }
    app.http("createSimpleProduct", {
      productUuid: editData.productUuid || "",
      brandName: editData.brandName,
      brandCode: editData.brandCode,
      productName: editData.productName,
      description: editData.description,
      spcsCode: editData.spcsCode || "",
      productUnit: editData.productUnit,
      minCount: editData.minCount,
      price: editData.price,
      sellPrice: editData.sellPrice,
      flag: editData.flag
    }).then(data => {
      if (data.success) {
        app.showToast("保存成功")
        setTimeout(() => {
          wx.navigateBack()
        }, 300)
      } else {
        app.showToast("保存失败")
      }
    })
  }
})