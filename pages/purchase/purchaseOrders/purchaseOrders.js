import store from '../../../store'
import create from '../../../utils/create'
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
    selectingMothod: null,
    sortMethodsList: [{
      name: "日期范围",
      activeOption: 0,
      options: ["全部时间", "今日", "最近7天", "最近1月", "自定义"]
    }, {
      activeOption: 0,
      name: "订单状态",
      options: ["全部状态", "订单状态1", "订单状态2", "订单状态3", "订单状态4", "订单状态5"]
    }, {
      activeOption: 0,
      name: "收款状态",
      options: ["全部状态", "收款状态1", "收款状态2", "收款状态3", "收款状态4", "收款状态5"]
    }, {
      activeOption: null,
      name: "业务人员",
      options: []
    }],
    customTimeRange: {
      isShow: false,
      date: "2015-09-01"
    },
    chooseAllPerson: true,
    personList: {
      curPage: 1,
      totalPage: 0,
      list: [{
        id: 0,
        name: "人员1"
      }, {
        id: 1,
        name: "人员2"
      }, {
        id: 2,
        name: "人员3"
      }, {
        id: 3,
        name: "人员4"
      }, {
        id: 4,
        name: "人员5"
      }, {
        id: 5,
        name: "人员6"
      }, {
        id: 6,
        name: "人员7"
      }, {
        id: 7,
        name: "人员8"
      }, {
        id: 8,
        name: "人员9"
      }, {
        id: 9,
        name: "人员10"
      }, {
        id: 10,
        name: "人员11"
      }, {
        id: 11,
        name: "人员12"
      }, {
        id: 12,
        name: "人员13"
      }, {
        id: 14,
        name: "人员15"
      }, {
        id: 15,
        name: "人员16"
      }, {
        id: 16,
        name: "人员17"
      }, {
        id: 17,
        name: "人员18"
      }, {
        id: 19,
        name: "人员20"
      }, {
        id: 20,
        name: "人员21"
      }, {
        id: 21,
        name: "人员22"
      }, {
        id: 22,
        name: "人员23"
      }, {
        id: 23,
        name: "人员24"
      }, ]
    }
  },
  onLoad() {
    var listCopy = JSON.parse(JSON.stringify(this.data.personList.list))
    this.data.personList.personList = Math.ceil(listCopy.length / 10)
    this.setData({
      ["sortMethodsList[3].options"]: listCopy.splice((this.data.personList.curPage - 1) * 10, 10)
    })

  },
  closeHeader(){
    this.setData({
      selectingMothod:null
    })
  },
  chooseSortMethod(e) {
    this.setData({
      selectingMothod: e.target.dataset.index
    })
  },
  chooseTimeRange(e) {
    var index = e.target.dataset.index
    this.setData({
      ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: index
    })
    console.log(this.data.sortMethodsList[this.data.selectingMothod].options[index])
    switch (index) {
      case 0:
      case 1:
      case 2:
      case 3:
        {
          this.setData({
            ["customTimeRange.isShow"]: false,
            ["sortMethodsList[0].options[4]"]: "自定义"
          })
        }
        break;
      case 4:
        this.setData({
          ["customTimeRange.isShow"]: true
        })
    }
  },
  bindDateChange(e) {
    this.setData({
      ["customTimeRange.date"]: e.detail.value,
      ["sortMethodsList[0].options[4]"]: e.detail.value + "至今"
    })
  },

  chooseOrderStatus(e) {
    var index = e.target.dataset.index
    this.setData({
      ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: index
    })
    console.log(this.data.sortMethodsList[this.data.selectingMothod].options[index])
  },

  chooseReceiptStatus(e) {
    var index = e.target.dataset.index
    this.setData({
      ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: index
    })
    console.log(this.data.sortMethodsList[this.data.selectingMothod].options[index])
  },
  choosePerson(e) {
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

  }
})