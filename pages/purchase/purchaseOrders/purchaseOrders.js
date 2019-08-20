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
      },
      {
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
      list: [{
        id: 0,
        name: "业务员1"
      }, {
        id: 1,
        name: "业务员2"
      }, {
        id: 2,
        name: "业务员3"
      }, {
        id: 3,
        name: "业务员4"
      }, {
        id: 4,
        name: "业务员5"
      }, {
        id: 5,
        name: "业务员6"
      }, {
        id: 6,
        name: "业务员7"
      }, {
        id: 7,
        name: "业务员8"
      }, {
        id: 8,
        name: "业务员9"
      }, {
        id: 9,
        name: "业务员10"
      }, {
        id: 10,
        name: "业务员11"
      }, {
        id: 11,
        name: "业务员12"
      }, {
        id: 12,
        name: "业务员13"
      }, {
        id: 14,
        name: "业务员15"
      }, {
        id: 15,
        name: "业务员16"
      }, {
        id: 16,
        name: "业务员17"
      }, {
        id: 17,
        name: "业务员18"
      }, {
        id: 19,
        name: "业务员20"
      }, {
        id: 20,
        name: "业务员21"
      }, {
        id: 21,
        name: "业务员22"
      }, {
        id: 22,
        name: "业务员23"
      }, {
        id: 23,
        name: "业务员24"
      }]
    },
    //订单列表
    orderList: [], 
    isLoading: false,
    curPage: 1,
    totalPages: null,
    isSearchBlur: false,
    searchValue: "",
    sortStartTime: "",
    sortEndTime: "",
    orderStatus:""
  },
  onLoad(options) {
    this.setData({
      orderStatus: options.orderStatus
    })

    this.getList()

    //分页逻辑
    var listCopy = JSON.parse(JSON.stringify(this.data.personList.list))
    this.data.personList.personList = Math.ceil(listCopy.length / 10)
    this.setData({
      ["sortMethodsList[3].options"]: listCopy.splice((this.data.personList.curPage - 1) * 10, 10)
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
          case "":
            item.status = "未完成"
            break
          case "back":
            item.status = "退货"
            break
        }
        var orderType = ''
        orderType += item.oando === "up" ? "线上/" : item.oando === "down" ? "线下/" : ""
        orderType += item.hdGoods ? "代发货/" : ""
        orderType += String.call(this, item.remark).indexOf("已提前入库") > -1 ? "已拆分/" : ""
        orderType += parseInt(item.orderStatus) > parseInt("090002") ? item.isPaid ? "已支付/" : "信用/" : ""
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
  searchFocus() {
    this.setData({
      isSearchBlur: true
    })
  },
  searchBlur(e) {
    this.setData({
      isSearchBlur: false
    })
  },
  searchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  search() {
    this.setData({
      curPage: 1,
    })
    this.getList(true)
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
    this.setData({
      selectingMothod: e.target.dataset.index
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
        if (new Date(this.data.customTimeRange.startDate).getTime() === new Date(this.data.customTimeRange.endDate).getTime()) {
          this.setData({
            ["customTimeRange.isShow"]: true,
            ["sortMethodsList[0].options[4]"]: this.data.customTimeRange.endDate
          })
        } else {
          this.setData({
            ["customTimeRange.isShow"]: true,
            ["sortMethodsList[0].options[4]"]: this.data.customTimeRange.startDate + "至" + this.data.customTimeRange.endDate
          })
        }
        this.getList(true)
    }
  },
  startDateChange(e) {
    //起始时间不能大于结束时间
    if (new Date(e.detail.value).getTime() >= new Date(this.data.customTimeRange.endDate).getTime()) {
      this.setData({
        ["customTimeRange.startDate"]: this.data.customTimeRange.endDate,
        ["sortMethodsList[0].options[4]"]: this.data.customTimeRange.endDate
      })
    } else {
      this.setData({
        ["customTimeRange.startDate"]: e.detail.value,
        ["sortMethodsList[0].options[4]"]: e.detail.value + "至" + this.data.customTimeRange.endDate
      })
    }
    this.setData({
      sortStartTime: this.data.customTimeRange.startDate,
    })
    this.getList(true)
  },
  endDateChange(e) {
    //起始时间不能大于结束时间
    if (new Date(e.detail.value).getTime() <= new Date(this.data.customTimeRange.startDate).getTime()) {
      this.setData({
        ["customTimeRange.endDate"]: this.data.customTimeRange.startDate,
        ["sortMethodsList[0].options[4]"]: this.data.customTimeRange.startDate
      })
    } else {
      this.setData({
        ["customTimeRange.endDate"]: e.detail.value,
        ["sortMethodsList[0].options[4]"]: this.data.customTimeRange.startDate + "至" + e.detail.value
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

    console.log(id)
  },
  //人员列表上一页
  prePage() {
    var listCopy = JSON.parse(JSON.stringify(this.data.personList.list))
    if (this.data.personList.curPage > 1) {
      this.setData({
        ["personList.curPage"]: this.data.personList.curPage - 1,
      }, function() {
        this.setData({
          ["sortMethodsList[3].options"]: listCopy.splice((this.data.personList.curPage - 1) * 10, 10)
        })
      })
      console.log(this.data.personList.curPage)
    }
  },
  //人员列表下一页
  nextPage() {
    var listCopy = JSON.parse(JSON.stringify(this.data.personList.list))
    if (this.data.personList.curPage < 3) {
      this.setData({
        ["personList.curPage"]: this.data.personList.curPage + 1,
      }, function() {
        this.setData({
          ["sortMethodsList[3].options"]: listCopy.splice((this.data.personList.curPage - 1) * 10, 10)
        })
      })
      console.log(this.data.personList.curPage)
    }
  },
  //查看详情
  seeDetail(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderNo=' + e.currentTarget.dataset.id
    })
  },

})