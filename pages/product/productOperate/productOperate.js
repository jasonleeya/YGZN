import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    quantifier: {
      list: ['个', '只', '条'],
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
    editData: {},
    editId:null,
    canEdit:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    if (options.operateType === "edit") {
      var editId = options.editId 
      this.setData({
        operateType:'edit',
        canEdit:false,
        editId: editId,
        editData: this.store.data.productManage.productList[editId],
        uploadPicUrl: this.store.data.productManage.productList[editId].pic
      })
    }
  },
  pick: function(e) {
    if(!this.data.canEdit){
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
    this.setData({
      uploadPicUrl: "",
      ["editData.pic"]:""
    })
  },
  scan() {
    if (!this.data.canEdit) {
      return
    }
    let that = this
    wx.scanCode({
      success(res) {
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
      if(!this.data.canEdit){
      return
    }
    var data = e.detail.value
    if (!data.brand) {
      app.showToast("请填写品牌")
      return
    }
    if (!data.brandId) {
      app.showToast("请填写品牌代码")
      return
    }
    if (!data.quantifier) {
      app.showToast("请填写单位")
      return
    }
    if (!data.receiptDay) {
      app.showToast("请填写默认到货天数")
      return
    }
    if (!data.safeStock) {
      app.showToast("请填写安全库存")
      return
    }

    data.negotiablePrice = "0.00"
    data.sellingPrice = "0.00"
    data.type = "---"
    data.pic = this.data.uploadPicUrl

    if (this.data.operateType==="edit"){
      this.store.data.productManage.productList[this.data.editId] = e.detail.value
    }else{
      this.store.data.productManage.productList.push(e.detail.value)
    }
    console.log(this.store.data.productManage.productList)

    wx.navigateBack()
  },
  allowEdit(){ 
    this.setData({
      canEdit:true
    })
  }
})