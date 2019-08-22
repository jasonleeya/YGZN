import store from '../../../store'
import create from '../../../utils/create'
import chiniseToPinyin from "../../../utils/chinese2pinyin.js"
let app = getApp()
create(store, {

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

  },
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
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
  setLevel: function(e) {
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
    // var info = e.detail.value
    // info.createType = "自建"
    // info.creditBalance = "0.00"
    // info.address = "【" + info.region + "】" + info.detailAddress
    // console.log(info)
    // this.store.data.selectCustomer.customerList.push(e.detail.value)

    var formData = e.detail.value 

    var grade=this.data.customerLevel.value[this.data.customerLevel.index].id
    var address = "【" + formData.region + "】" + formData.detailAddress

    formData.grade=grade
    formData.address=address

    // creditLine: 0.00  
    // customerType: 1001
    // settlementDate: 30
    // overdraftAmount: 0.00
    // customerNo: 
    formData.creditLine= '0.00' 
    formData.customerType= '1001'
    formData.settlementDate= '30'
    formData.overdraftAmount= '0.00'
    formData.customerNo=""
    
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