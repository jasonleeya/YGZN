import chiniseToPinyin from "../../../../utils/chinese2pinyin.js"
let app = getApp()
Page({

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
    operateType: "",
    canEdit: false,
    formEvent: {}
  },
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("添加客户")
    this.setData({
      operateType: options.operateType
    })
    if (options.operateType === 'add') {
      this.setData({
        canEdit: true
      })
    }
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

    if (options.operateType === 'edit') {
      app.http("getCustomerByCustomerNo", {
        customerNo: options.custNo
      }).then(data => {
        var infos = data.list[0]
        var gIndex = null
        this.data.customerLevel.value.forEach((item, index) => {
          if (item.id === infos.grade) {
            gIndex = index
          }
        })

        this.setData({
          ["customerLevel.index"]: gIndex,
          formData: infos
        })
      })
    }
  },
  onShow() {


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
  submit(e) {
    this.setData({
      formEvent: e
    })
    return
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
      ['formData.customerName']: this.data.searchList[e.target.dataset.index].userName,
      ['formData.letter']: chiniseToPinyin(this.data.searchList[e.target.dataset.index].userName)[0]
    })
  },
  customerNameInput(e) {
    this.setData({
      ['formData.letter']: chiniseToPinyin(e.detail.value)[0]
    })
  },
  allowEdit() {
    this.setData({
      canEdit: true
    })
  },
  confirmEdit() {
    var params = this.data.formEvent.detail.value
    params.customerNo = this.data.formData.customerNo
    params.grade = this.data.customerLevel.value[this.data.customerLevel.index].id
    params.creditLine = '0.00'
    params.customerType = "1001"
    params.settlementDate = "30"
    params.overdraftAmount = "0"

    app.http("updateCustomer", params).then(res => {
      app.showToast("修改成功")
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
  },
  delete() {
    wx.showModal({
      title: '你确定要删除此客户吗',
      success: (res) => {
        if (res.cancel) {
          return
        }
        app.http("deleteCustomer", {
          customerNo: this.data.formData.customerNo
        }).then(res => {
          app.showToast("删除成功")
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }).catch(err => {
          app.showToast(err)
        })
      }
    })
  },
 
  add() {
    var params = this.data.formEvent.detail.value
    params.customerNo = ""
    params.grade = this.data.customerLevel.value[this.data.customerLevel.index].id
    params. creditLine= '0.00'
    params.customerType = "1001"
    params.settlementDate = "30"
    params.overdraftAmount = "0"
    params.address = "【" + params.region + "】" + params.detailAddress
    app.http("addCustomer", params).then(res => {
      app.showToast("添加成功")
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      app.showToast(err)
    })
  }
})