let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerList: [],
    isLoad: true,
    curPage: 0,
    totalPages:null,
    searchValue: "",
    timeOut: null,
    levelList: [],
    isShowLevelDropdown: false,
    selectedLevelIndex: "",
    selfId:""
  },
  onLoad() {
    app.setTitle("选择客户")
    this.setData({
      selfId: wx.getStorageSync("userInfo")[0].queryNo
    })
  },
  onShow() {
    this.getList()
    app.http("queryAllGrade").then(data => {
      this.setData({
        levelList: data.list
      })
    })
  },
  getList(replace=true) {
    if(replace){
      this.setData({
        customerList: []
      })
    }
    this.setData({
      isLoad:true
    })
    app.http("getCustomerList", {
      keyword: this.data.searchValue,
      pageNo: this.data.curPage,
      pageSize: 10,
      status: '1,2',
      grade: this.data.selectedLevelIndex === "" ? "" : this.data.levelList[this.data.selectedLevelIndex].id
    }).then(data => {
    
      data.list.forEach(item => {
        if (this.data.selfId === item.customer.createCompany && item.customer.status === '2') {
          item.customer.statusStr = "申请中"
        }
        if (this.data.selfId !== item.customer.createCompany && item.customer.status === '2') {
          item.customer.statusStr = "对方申请待确定"
        }
      })
      this.setData({
        customerList: this.data.customerList.concat(data.list),
        isLoad: false,
        totalPages:data.totalPages
      })
    })
  },
  showLevelDropdown() {
    this.setData({
      isShowLevelDropdown: !this.data.isShowLevelDropdown
    })
  },
  selectLevel(e) {
    var index = e.currentTarget.dataset.index
    if (index === "all") {
      index = ""
    }
    this.setData({
      selectedLevelIndex: index,
      isShowLevelDropdown: !this.data.isShowLevelDropdown
    })
    this.getList()
  },
  scrollToLower(){
    if (this.data.isLoad) { 
      return
    }
    if (this.data.curPage >= parseInt(this.data.totalPages)){
      app.showToast("没有更多了")
      returns
    }
    this.setData({
      curPage:this.data.curPage+1
    })
    this.getList(false)
  },
  searchBlur(e) {},
  searchFocus(e) {},
  searchInput(e) {
    var timeOut = null
    clearTimeout(this.data.timeOut)
    timeOut = setTimeout(() => {
      this.setData({
        searchValue: e.detail.value
      })
      this.getList()
    }, 500)
    this.setData({
      timeOut: timeOut
    })
  },

  chooseCustomer(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    var data = this.data.customerList[e.currentTarget.dataset.index]
    prevPage.setData({
      customerName: data.customerName,
      customerNo: data.customerNo,
      custNo: data.custNo,
      seller: data.salesman,
      receiver: data.primaryContact,
      phoneNumber: data.contactPhone,
      address: data.address,
      approveStatus: data.approveStatus
    })

    wx.navigateBack()
  },
  //新增供应商
  add() {

    wx.navigateTo({
      url: '/pages/index/mine/customerOperate/customerOperate?operateType=add',
    })
  },
  seeDetail(e){
    wx.navigateTo({
      url: '/pages/index/mine/customerOperate/customerOperate?custNo=' + e.currentTarget.dataset.id+"&operateType=edit"
    })
  }
})