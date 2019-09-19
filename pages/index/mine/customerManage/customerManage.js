let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerList: [],
    // isLoad: true,
    // currentPage: 0,
    // totalPage:null
    searchValue: "",
    timeOut: null,
    levelList: [],
    isShowLevelDropdown: false,
    selectedLevelIndex: ""
  },
  onLoad() {
    app.showToast('该页面功能尚未完善')

    app.setTitle("选择客户")
  },
  onShow() {
    this.getList()
    app.http("queryAllGrade").then(data => {
      this.setData({
        levelList: data.list
      })
    })
  },
  getList() {
    this.setData({
      customerList: []
    })
    app.http("getCustomerList", {
      keyword: this.data.searchValue,
      pageNo: 0,
      pageSize: 10000,
      status: '1,2',
      grade: this.data.selectedLevelIndex === "" ? "" : this.data.levelList[this.data.selectedLevelIndex].id
    }).then(data => {
      this.setData({
        customerList: data.list
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