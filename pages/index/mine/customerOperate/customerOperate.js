import chiniseToPinyin from "../../../../utils/chinese2pinyin.js"
let app = getApp()
Page( {

  /**
   * 页面的初始数据
   */
  data: {
    customerLevel: {
      list: [],
      index: null,
      value: []
    },
    salesman: {
      list: [],
      index: null,
      value: []
    },
    formData: {},
    region: [],
    showDropdown: false,
    searchInputValue: "",
    searchList: [],
    operateType:"edit"
  },
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle("添加客户")
    
    app.http("getCustomerByCustomerNo", { customerNo:options.custNo}).then(data=>{
      this.setData({
        formData:data.list[0]
      })
    })
  },
  onShow() {
    app.http("queryAllUsingSalesman").then(data => {
      var list = []
      data.list.forEach(item => {
        list.push(item.userName)
      })
      this.setData({
        ["salesman.value"]: data.list,
        ["salesman.list"]: list
      })
    })

    app.http("queryAllGrade").then(data => {
      var list = []
      data.list.forEach(item => {
        list.push(item.name)
      })
      this.setData({
        ["customerLevel.value"]: data.list,
        ["customerLevel.list"]: list
      })
    })


  },
  setLevel: function (e) {
    this.setData({
      ["customerLevel.index"]: e.detail.value
    })
  },
  setSalesman(e) {
    this.setData({
      ["salesman.index"]: e.detail.value
    })
  },
  addSubmit(e) { 

    var formData = e.detail.value

    var grade = this.data.customerLevel.value[this.data.customerLevel.index].id
    var address = "【" + formData.region + "】" + formData.detailAddress

    formData.grade = grade
    formData.address = address

    formData.creditLine = '0.00'
    formData.customerType = '1001'
    formData.settlementDate = '30'
    formData.overdraftAmount = '0.00'
    formData.customerNo = ""

    app.http("addCustomer", formData)
    wx.navigateBack()
  },
  chooseRegion(e) {

    this.setData({
      region: e.detail.value
    })
  },
  searchInput(e) {
    var value = e.detail.value
    if (value === "") {
      this.setData({
        searchList: []
      })
      return
    }
    this.setData({
      searchList: this.data.approvedCustomerList.filter(item => {
        return item.name.match(value) || chiniseToPinyin(item.name)[0].match(value.toUpperCase())
      })
    })
  },
  searchBlur(e) {
    this.setData({
      searchInputValue: "",
      searchList: []
    })
  },
  hiddenMask() {
    this.setData({
      showDropdown: false,
      searchList: []
    })
  },
  searchFocus() {
    this.setData({
      showDropdown: true
    })
  },
  chooseSearchItem(e) {
    this.setData({
      formData: this.data.approvedCustomerList.filter(item => {
        return item.id === e.currentTarget.dataset.id
      })[0],
      searchList: [],
      showDropdown: false
    })
  },
  customerNameInput(e) {
    this.setData({
      ['formData.pinyinInitial']: chiniseToPinyin(e.detail.value)[0]
    })
  }
})