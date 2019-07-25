// pages/mine/mine.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
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
      }],[
        {
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
        },
      ]
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})