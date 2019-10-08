import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    selectingMothod: null, //正在选择的排序方法
    //排序方法列表
    sortMethodsList: [{
        name: "日期范围",
        activeOption: 0,
        options: ["全部时间", "今日", "最近7天", "最近1月", "自定义"]
      }, {
        activeOption: 0,
        name: "订单状态",
        options: [{
          name: "全部状态",
          status: ""
        }, {
          name: "待审核",
          status: "wait"
        }, {
          name: "待确认",
          status: "090001"
        }, {
          name: "待付款",
          status: "090003"
        }, {
          name: "待发货",
          status: "090002"
        }, {
          name: "待入库",
          status: "090004"
        }, {
          name: "已完成",
          status: "090005"
        }, {
          name: "已取消",
          status: "090008"
        }]
      },
      {
        activeOption: 0,
        name: "收款状态",
        options: ["全部状态", "已收款", "待收款"]
      }, {
        activeOption: null,
        name: "业务人员",
        options: []
      }
    ],


    //自定义选择时间段
    customTimeRange: {
      isShow: false,
      nowDate: '',
      startDate: "",
      endDate: ""
    },
    //是否是选择全部人员
    chooseAllPerson: true,
    //人员列表分页
    personList: {
      curPage: 1,
      totalPages: 0,
      isLoad: false,
      list: []
    },
    //订单列表
    orderList: [],
    isLoading: false,
    curPage: 1,
    totalPages: null,
    searchValue: "",
    sortStartTime: "",
    sortEndTime: "",
    orderStatus: "",
    timeOut: null,
    isAllOrder: false,
    fromHome: false
  },
  onLoad(options) {
    app.setTitle("采购订单")
    if (options.isAllOrder === '1') {
      this.setData({
        isAllOrder: true
      })
    }
    this.setData({
      orderStatus: options.orderStatus
    })
    if (options.from) {
      this.setData({
        fromHome: true
      })
    }

    this.getList()

    //分页逻辑

    app.http("queryAllUsingSalesman", {
      pageSize: 10000
    }).then(data => {
      data.list.forEach(item => {
        item.name = item.userName
        item.id = item.custNo
      })
      var listCopy = JSON.parse(JSON.stringify(data.list))
      var sortMethodsList = this.data.sortMethodsList
      var index = sortMethodsList.indexOf(sortMethodsList.filter(item => {
        return item.name === "业务人员"
      })[0])
      this.setData({
        ["personList.list"]: data.list,
        ["personList.totalPages"]: Math.ceil(listCopy.length / 10),
        ["sortMethodsList[" + index + "].options"]: listCopy.splice((this.data.personList.curPage - 1) * 10, 10)
      })
    })

    //获取当前日期
    var date = new Date()
    var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      ["customTimeRange.nowDate"]: nowDate,
      ["customTimeRange.startDate"]: nowDate,
      ["customTimeRange.endDate"]: nowDate
    })
  },
  getList(isReplaceList = false, isLoadMore = false) {
    if (isReplaceList) {
      this.setData({
        orderList: []
      })
    }
    if (!isLoadMore) {
      this.setData({
        curPage: 1
      })
    }

    var parmas = {
      orderStatus: this.data.orderStatus === "back" ? "" : this.data.orderStatus,
      currentPage: this.data.curPage,
      pageSize: 10,
      simpleSeek: this.data.searchValue,
      beginTime: this.data.sortStartTime,
      endTime: this.data.sortEndTime,
      warehouse: "",
    }
    var query = ""
    if (this.data.orderStatus === "back") {
      query = "queryPurchaseBackUpp"
    } else {
      query = "queryPurchaseUpp"
    }

    app.http(query, parmas).then(data => {
      data.list.forEach(item => {
        switch (item.orderStatus) {
          case "wait":
            item.status = "待审核"
            break
          case "090001":
            item.status = "待确认"
            break
          case "090003":
            item.status = "待付款"
            break
          case "090002":
            item.status = "待发货"
            break
          case "090004":
            item.status = "待入库"
            break
          case "090005":
            item.status = "已完成"
            break
          case "090008":
            item.status = "已取消"
            break
        }
        if (item.isBackOrder === 1) {
          item.status = "退货"
        }

        var orderType = ''
        orderType += item.oando === "up" ? "线上/" : item.oando === "down" ? "线下/" : ""
        orderType += item.hdGoods ? "代发货/" : ""
        orderType += String.call(this, item.remark).indexOf("已提前入库") > -1 ? "已拆分/" : ""
        orderType += item.orderStatus === "090002" || item.orderStatus === "090004" || item.orderStatus === "090005" ? (item.isPaid ? "已支付/" : "信用/") : ""
        orderType += item.typeOfGoods === "002" ? "有退货/" : ""
        orderType += item.showPayBtn === "yes" && item.orderStatus === "090003" ? "已汇款/" : ""
        item.orderType = orderType.slice(0, orderType.length - 1)
      })

      this.setData({
        orderList: this.data.orderList.concat(data.list),
        isLoading: false,
        totalPages: data.totalPages
      })


    })

  },

  searchInput(e) {
    this.setData({
      searchValue: e.detail.value,
      curPage: 1,
    })
    if (this.data.timeOut) {
      clearTimeout(this.data.timeOut)
    }
    var timeOut = setTimeout(() => {
      this.getList(true)
    }, 500)
    this.setData({
      timeOut: timeOut
    })

  },
  search() {

  },

  //监听滑动到底部
  onReachBottom() {
    if (this.data.curPage === 1 || this.data.curPage < this.data.totalPages) {
      this.setData({
        isLoading: true,
        curPage: this.data.curPage + 1
      })
      this.getList(false, true)
    } else {
      app.showToast("没有更多订单了")
    }

  },
  //关闭正在选择的列表
  closeHeader() {
    this.setData({
      selectingMothod: null
    })
  },
  //展开列表
  chooseSortMethod(e) {
    var index = e.target.dataset.index
    if (this.data.sortMethodsList[index].name === "订单状态" && !this.data.isAllOrder) {
      return
    }
    this.setData({
      selectingMothod: this.data.selectingMothod === index ? null : index,
    })
  },
  chooseTimeRange(e) {
    var index = e.target.dataset.index
    //设置选中的方法
    this.setData({
      ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: index
    })
    console.log(this.data.sortMethodsList[this.data.selectingMothod].options[index])
    switch (index) {
      case 0:
        this.setData({
          sortStartTime: "",
          sortEndTime: "",
          ["customTimeRange.isShow"]: false,
          ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: "自定义"
        })
        this.getList(true)
        break
      case 1:
        this.setData({
          sortStartTime: this.data.customTimeRange.nowDate,
          sortEndTime: this.data.customTimeRange.nowDate,
          ["customTimeRange.isShow"]: false,
          ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: "自定义"
        })
        this.getList(true)
        break
      case 2:
        var date = new Date()
        var year = date.getFullYear()
        var mouth = date.getMonth() + 1
        var day = date.getDate()
        var lastWeek = null
        if (day > 7) {
          day = day - 7
        } else {
          day = new Date(year, mouth, 0).getDate() - (7 - day)
          if (mouth === 1) {
            mouth = 12
            year = year - 1
          } else(
            mouth = mouth - 1
          )

        }
        lastWeek = year + "-" + mouth + "-" + day

        this.setData({
          sortStartTime: lastWeek,
          sortEndTime: this.data.customTimeRange.nowDate,
          ["customTimeRange.isShow"]: false,
          ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: "自定义"
        })
        this.getList(true)
        break
      case 3:
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var lastMonth = null
        if (month > 1) {
          month = month - 1
        } else {
          month = 12
          year = year - 1
        }
        lastMonth = year + "-" + month + "-" + day

        this.setData({
          sortStartTime: lastMonth,
          sortEndTime: this.data.customTimeRange.nowDate,
          ["customTimeRange.isShow"]: false,
          ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: "自定义"
        })
        this.getList(true)
        break;
      case 4:
        this.setData({
          sortStartTime: this.data.customTimeRange.nowDate,
          sortEndTime: this.data.customTimeRange.nowDate,
        })
        //如果选择的起始时间和结束时间一致则只显示所选的那天,不一致则显示时间段
        if (new Date(this.data.customTimeRange.startDate.replace(/-/g, "/")).getTime() === new Date(this.data.customTimeRange.endDate.replace(/-/g, "/")).getTime()) {
          this.setData({
            ["customTimeRange.isShow"]: true,
            ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: this.data.customTimeRange.endDate
          })
        } else {
          this.setData({
            ["customTimeRange.isShow"]: true,
            ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: this.data.customTimeRange.startDate + "至" + this.data.customTimeRange.endDate
          })
        }
        this.getList(true)
    }
  },
  startDateChange(e) {
    //起始时间不能大于结束时间
    if (new Date(e.detail.value.replace(/-/g, "/")).getTime() >= new Date(this.data.customTimeRange.endDate.replace(/-/g, "/")).getTime()) {
      this.setData({
        ["customTimeRange.startDate"]: this.data.customTimeRange.endDate,
        ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: this.data.customTimeRange.endDate
      })
    } else {
      this.setData({
        ["customTimeRange.startDate"]: e.detail.value,
        ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: e.detail.value + "至" + this.data.customTimeRange.endDate
      })
    }
    this.setData({
      sortStartTime: this.data.customTimeRange.startDate,
    })
    this.getList(true)
  },
  endDateChange(e) {
    //起始时间不能大于结束时间
    if (new Date(e.detail.value.replace(/-/g, "/")).getTime() <= new Date(this.data.customTimeRange.startDate.replace(/-/g, "/")).getTime()) {
      this.setData({
        ["customTimeRange.endDate"]: this.data.customTimeRange.startDate,
        ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: this.data.customTimeRange.startDate
      })
    } else {
      this.setData({
        ["customTimeRange.endDate"]: e.detail.value,
        ["sortMethodsList[" + this.data.selectingMothod + "].options[4]"]: this.data.customTimeRange.startDate + "至" + e.detail.value
      })
    }
    this.setData({
      sortEndTime: this.data.customTimeRange.endDate,
    })
    this.getList(true)
  },
  //订单状态
  chooseOrderStatus(e) {
    var index = e.target.dataset.index
    this.setData({
      ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: index,
      orderStatus: this.data.sortMethodsList[this.data.selectingMothod].options[index].status
    })
    this.getList(true)
  },
  //付款状态
  chooseReceiptStatus(e) {
    var index = e.target.dataset.index
    this.setData({
      ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: index
    })
    console.log(this.data.sortMethodsList[this.data.selectingMothod].options[index])
    switch (this.data.sortMethodsList[this.data.selectingMothod].options[index]) {
      case "已收款":
        // break
      case "待收款":
        // break
      default:
        app.showToast("暂时不支持")
    }
  },
  //人员选择
  choosePerson(e) {
    //是否选择所有人员
    var id = e.target.dataset.id
    if (id === "all") {
      this.setData({
        chooseAllPerson: true,
        ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: null
      })
    } else {
      this.setData({
        chooseAllPerson: false,
        ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: id
      })
    }

    var name = null
    if (id === "all") {
      name = ""
    } else {
      name = this.data.personList.list.filter(item => {
        return item.id === id
      })[0].name
    }
    console.log(name)

    this.setData({
      searchValue: name
    })
    this.getList(true)
  },
  //人员列表上一页
  prePage() {
    var listCopy = JSON.parse(JSON.stringify(this.data.personList.list))
    if (this.data.personList.curPage > 1) {
      this.setData({
        ["personList.curPage"]: this.data.personList.curPage - 1,
      }, function() {
        this.setData({
          ["sortMethodsList[" + this.data.selectingMothod + "].options"]: listCopy.splice((this.data.personList.curPage - 1) * 10, 10)
        })
      })
      console.log(this.data.personList.curPage)
    }
  },
  //人员列表下一页
  nextPage() {
    var listCopy = JSON.parse(JSON.stringify(this.data.personList.list))
    if (this.data.personList.curPage < this.data.personList.totalPages) {
      this.setData({
        ["personList.curPage"]: this.data.personList.curPage + 1,
      }, function() {
        this.setData({
          ["sortMethodsList[" + this.data.selectingMothod + "].options"]: listCopy.splice((this.data.personList.curPage - 1) * 10, 10)
        })
      })
      console.log(this.data.personList.curPage)
    }
  },
  //查看详情
  seeDetail(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderNo=' + e.currentTarget.dataset.id
    })
  },
  addProduct() {
    wx.navigateTo({
      url: '/pages/purchase/newPurchase/newPurchase'
    })
  }
})