// pages/mine/mine.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
    showToggleAccountPop: false
  },
  /**
   * 组件的初始数据
   */
  data: {
    account: {
      currentId: "0000000001",
      currentCompany:"东莞川牌量具有限公司",
      checked:"0000000001",
      list: [{
        company: "东莞川牌量具有限公司",
        id: '0000000001'
      },
        {
          company: "成都成量集团有限公司",
          id: '0000000002'
        },
        {
          company: "日本三菱有限公司",
          id: '0000000003'
        }
      ]
    },
    todoList: [{
      name: "采购单",
      count: 5,
      color: 'red',
      icon: '',
      link: ''
    }, {
      name: "销售单",
      count: 3,
      color: 'orange',
      icon: '',
      link: ''
    }, {
      name: "调拨单",
      count: 1,
      color: 'blue',
      icon: '',
      link: ''
    }, {
      name: "库存预警",
      count: 0,
      color: 'green',
      icon: '',
      link: ''
    }],
    optionList: [
      [{
        name: '个人中心',
        icon: '',
        link: ''
      }, {
        name: '帮助中心',
        icon: '',
        link: ''
      }],
      [{
        name: '供应商管理',
        icon: '',
        link: ''
      }, {
        name: '信用管理',
        icon: '',
        link: ''
      }, {
        name: '客户管理',
        icon: '',
        link: ''
      }, {
        name: '代理品牌管理',
        icon: '',
        link: ''
      }, ]
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    logout() {
      wx.setStorageSync("token", null)
      wx.redirectTo({
        url: '/pages/login/login',
      })
    },
    showToggleAccountPop() {
      this.setData({
        showToggleAccountPop: true
      })
    },
    toggleAccount(e){
      this.setData({
        ["account.checked"]:e.currentTarget.dataset.id
      })
    },
    toggleAccountCancel(){
      this.setData({
        showToggleAccountPop: false,
        ["account.checked"]: this.data.account.currentId
      })
    },
    toggleAccountConfirm(){
      var currentCompany=""
      this.data.account.list.forEach(item => {
        if (item.id === this.data.account.checked) {
          currentCompany = item.company
        }
      })
      this.setData({
        showToggleAccountPop: false,
        ["account.currentId"]:this.data.account.checked,
        ["account.currentCompany"]: currentCompany
      })
    },
  
  },


})