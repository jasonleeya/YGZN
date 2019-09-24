let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: "",
    address: "",
    operateType: "",
    canEdit: false,
    formData: {},
    formEvent: {},
    showDropdown: false,
    searchInputValue: "",
    searchList: [],
    custNo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      operateType: options.operateType
    })
    if (options.operateType === "edit") {
      app.setTitle("编辑供应商")
      var pages = getCurrentPages()
      var prePage = pages[pages.length - 2]
      var data = prePage.data.supplierList[options.index]

      this.setData({
        formData: data
      })
    }
    if (options.operateType === "add") {
      app.setTitle("添加供应商")
      this.setData({
        canEdit: true
      })
    }
  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  // custNo: 201902011137000002
  // customerNo: DL201907301446050000
  // blNumber: 执照
  // supplyName: 测试需求用户
  // supCompanyPhone: 公司电话
  // supContact: 联系人
  // supPhone: 联系人电话
  // supAddress: 地址
  // supRemarks: 备注
  submit(e) {
    this.setData({
      formEvent: e
    })
     
  },
  add() {
    var paramas = this.data.formEvent.detail.value
    paramas.custNo=this.data.custNo
    paramas.customerNo=""
    if (paramas.supplyName==="") {
      app.showToast("请填写供应商名称")
      return
     }
    app.http("addProvider", paramas).then(res => {
      app.showToast("添加成功")
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
     
  },
  edit() {
    console.log(this.data.formEvent)
  },
  delete() {},
  searchInput(e) {
    var value = e.detail.value
    if (value === "") {
      return
    }
    app.http("searchApproveAgent", {
      pageSize: 1000,
      keyword: value
    }).then(data => {
      this.setData({
        searchList: data.list
      })
    })


  },
  searchBlur(e) {
    // this.setData({
    //   searchInputValue: "",
    //   searchList: []
    // })
  },
  hiddenMask() {
    this.setData({
      showDropdown: false,
    })
  },
  searchFocus() {
    this.setData({
      searchInputValue: "",
      searchList: [],
      showDropdown: true
    })
  },
  chooseSearchItem(e) {
    this.setData({
      showDropdown: false,
      ['formData.supplyName']: this.data.searchList[e.target.dataset.index].userName, 
      custNo: this.data.searchList[e.target.dataset.index].custNo,  
    })
  },
})