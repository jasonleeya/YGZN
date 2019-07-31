import store from '../../../store'
import create from '../../../utils/create'
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
      options: ["全部状态", "已完成", "待付款", "待入库"]
    }, {
      activeOption: 0,
      name: "收款状态",
      options: ["全部状态", "已收款", "待收款"]
    }, {
      activeOption: null,
      name: "业务人员",
      options: []
    }],
    //自定义选择时间段
    customTimeRange: {
      isShow: false,
      nowDate: '',
      startDate: "2015-09-01",
      endDate: "2015-09-01"
    },
    //是否是选择全部人员
    chooseAllPerson: true,
    //人员列表分页
    personList: {
      curPage: 1,
      totalPage: 0,
      isLoad:false,
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
    orderList: [{
      id: '201907171712190071',
      status: 1,  
      supplier: '成都成量集团有限个公司',
      orderType: '线上订单/信用订单',
      buyer: '吴建秋',
      money: '6630.08'
    }, {
      id: '201907171712190071',
      status: 2,
      supplier: '成都成量集团有限个公司',
      orderType: '线上订单/信用订单',
      buyer: '吴建秋',
      money: '6630.08'
    }, {
      id: '201907171712190071',
      status: 3,
      supplier: '成都成量集团有限个公司',
      orderType: '线上订单/信用订单',
      buyer: '吴建秋',
      money: '6630.08'
    }, {
      id: '201907171712190071',
      status: 1,
      supplier: '成都成量集团有限个公司',
      orderType: '线上订单/信用订单',
      buyer: '吴建秋',
      money: '6630.08'
    }, {
      id: '201907171712190071',
      status: 2,
      supplier: '成都成量集团有限个公司',
      orderType: '线上订单/信用订单',
      buyer: '吴建秋',
      money: '6630.08'
    }, ]

  },
  onLoad() {
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
      case 1:
      case 2:
      case 3:
        {
          this.setData({
            //当选中非自定义时间段时日期选择期隐藏自定义按钮显示自定义
            ["customTimeRange.isShow"]: false, 
            ["sortMethodsList[0].options[4]"]: "自定义" 
          })
        }
        break;
      case 4:
      //如果选择的起始时间和结束时间一致则只显示所选的那天,不一致则显示时间段
        if (new Date(this.data.customTimeRange.startDate).getTime() === new Date(this.data.customTimeRange.endDate).getTime()) {
          this.setData({
            ["customTimeRange.isShow"]: true,
            ["sortMethodsList[0].options[4]"]:this.data.customTimeRange.endDate
          })
        }else{
          this.setData({
            ["customTimeRange.isShow"]: true,
            ["sortMethodsList[0].options[4]"]: this.data.customTimeRange.startDate + "至" + this.data.customTimeRange.endDate
          })
        }
    }
  },
  startDateChange(e) {
    //起始时间不能大于结束时间
    if (new Date(e.detail.value).getTime() >= new Date(this.data.customTimeRange.endDate).getTime()){
      this.setData({
        ["customTimeRange.startDate"]: this.data.customTimeRange.endDate,
        ["sortMethodsList[0].options[4]"]: this.data.customTimeRange.endDate
      })
    }else{
      this.setData({
        ["customTimeRange.startDate"]: e.detail.value,
        ["sortMethodsList[0].options[4]"]: e.detail.value + "至" + this.data.customTimeRange.endDate
      })
    }
  
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
  },
  //订单状态
  chooseOrderStatus(e) {
    var index = e.target.dataset.index
    this.setData({
      ["sortMethodsList[" + this.data.selectingMothod + "].activeOption"]: index
    })
    console.log(this.data.sortMethodsList[this.data.selectingMothod].options[index])
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
  seeDetail(e){
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id='+e.currentTarget.dataset.id,
    })
  },
  //监听滑动到底部
  onReachBottom(){
    this.setData({
      isLoad:true
    })
    setTimeout(() => {
      this.setData({
        isLoad: false
      })
    }, 2000)
  }
})