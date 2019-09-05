import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    storeHouseList: [],
    selectedStoreHouseId: "",
    totalPage: null,
    curPage: 1,
    isLoad: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    app.http("getWarehouse").then(data => {
      this.setData({
        storeHouseList: data.list,
      })
      if (this.data.selectedStoreHouseId === "") {
        this.setData({
          selectedStoreHouseId: data.list[0].tableKey
        })
      }

      this.getList(this.data.selectedStoreHouseId, 1)
    })
  },

  getList(storeHouseId, page = 1) {
    this.setData({
      isLoad: true
    })
    if(page===1){
      this.setData({
        productList:[]
      })
    }
    app.http("queryStock", {
      wareKey: storeHouseId,
      pageNo: page,
      pageSize: 15,
      searchKey: "",
      brandName: "",
      stockStatus: "",
    }, true).then(data => {
      this.setData({
        productList: this.data.productList.concat(data.list),
        totalPage: data.totalPages,
        isLoad: false
      })
    })
  },
  addProduct() {
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate?operateType=add',
    })
  },
  editProductInfo(e) {
    wx.navigateTo({
      url: '/pages/product/productOperate/productOperate?operateType=edit&editId=' + e.currentTarget.dataset.index,
    })
  },
  deleteItem(e) {
    app.showToast("暂不支持删除")
    return
    this.store.data.productManage.productList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      productList: this.store.data.productManage.productList
    })
  },
  searchType(e) {
    this.setData({
      selectedStoreHouseId: e.detail.tableKey
    })
    this.getList(e.detail.tableKey,1)
  },
  reachBottom() {
    if (this.data.isLoad) {
      return
    }
    if (this.data.curPage < this.data.totalPage) {
      this.setData({
        curPage: this.data.curPage+1
      })
      this.getList(this.data.selectedStoreHouseId, this.data.curPage+1)
    }else{
      app.showToast("没有更多数据了")
    }
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    if (Math.abs(e.touches[0].pageX - this.data.ListTouchStart) > 40) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 40 ? 'right' : 'left'
      })
    }

  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
      console.log(this.data.modalName)
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})