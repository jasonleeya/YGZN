import store from '../../../store'
import create from '../../../utils/create'
import chiniseToPinyin from "../../../utils/chinese2pinyin.js"
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    customerLevel: {
      list: ["Level01", "Level02", "Level03", "Level04", "Level05"],
      index: null,
    },
    formData:{},
    region: [],
    showDropdown: false,
    approvedCustomerList: [{
      name: "顾栋涵",
      id: "001",
      pinyinInitial: "GDH",
      primaryContact: "顾栋涵",
      phoneNumber: "18888888888",
      companyPhoneNumber: "18888888888",
      customerLevel: "Level01",
      region: "四川省/成都市/成华区",
      detailAddress: "建设路钻石广场B座3006",
      salesman: "顾栋涵",
      creditBalance: "0.00",
      createType: "自建"
    }, {
      name: "李栋涵",
      id: "002",
      pinyinInitial: "LDH",
      primaryContact: "李栋涵",
      phoneNumber: "18888888888",
      companyPhoneNumber: "18888888888",
      customerLevel: "Level01",
      region: "四川省/成都市/成华区",
      detailAddress: "建设路钻石广场B座3006",
      salesman: "李栋涵",
      creditBalance: "0.00",
      createType: "自建"
    }, {
      name: "张栋涵",
      id: "003",
      pinyinInitial: "ZDH",
      primaryContact: "张栋涵",
      phoneNumber: "18888888888",
      companyPhoneNumber: "18888888888",
      customerLevel: "Level01",
      region: "四川省/成都市/成华区",
      detailAddress: "建设路钻石广场B座3006",
      salesman: "张栋涵",
      creditBalance: "0.00",
      createType: "自建"
    }, {
      name: "刘栋涵",
      id: "004",
      pinyinInitial: "LDH",
      primaryContact: "刘栋涵",
      phoneNumber: "18888888888",
      companyPhoneNumber: "18888888888",
      customerLevel: "Level01",
      region: "四川省/成都市/成华区",
      detailAddress: "建设路钻石广场B座3006",
      salesman: "刘栋涵",
      creditBalance: "0.00",
      createType: "自建"
      }, {
        name: "王栋涵",
        id: "005",
        pinyinInitial: "WDH",
        primaryContact: "王栋涵",
        phoneNumber: "18888888888",
        companyPhoneNumber: "18888888888",
        customerLevel: "Level01",
        region: "四川省/成都市/成华区",
        detailAddress: "建设路钻石广场B座3006",
        salesman: "王栋涵",
        creditBalance: "0.00",
        createType: "自建"
      }],
    searchInputValue:"",
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  setLevel: function(e) {
    this.setData({
      ["customerLevel.index"]: e.detail.value
    })
  },
  addSubmit(e) {
    var info = e.detail.value
    info.createType = "自建"
    info.creditBalance = "0.00"
    info.address = "【" + info.region + "】" + info.detailAddress
    console.log(info)
    this.store.data.selectCustomer.customerList.push(e.detail.value)
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
      searchInputValue:"",
      searchList: []
    })
  },
  hiddenMask() {
    this.setData({
      showDropdown: false,
      searchList:[]
    })
  },
  searchFocus() {
    this.setData({
      showDropdown: true
    })
  },
  chooseSearchItem(e){
   this.setData({
     formData: this.data.approvedCustomerList.filter(item => {
       return item.id === e.currentTarget.dataset.id
     })[0],
     searchList: [],
     showDropdown:false
   })
  }
})