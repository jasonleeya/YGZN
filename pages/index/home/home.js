// pages/home/home.js
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
    salesData: [{
      title: '今日销售金额',
      money: '8,000.00'
    },
    {
      title: '月销售金额',
      money: '4,000.00'
    },
    {
      title: '月采购金额',
      money: '3,000.00'
    },
    {
      title: '月出库金额',
      money: '2,000.00'
    },
    ],

    projectData: [
      {
        title: '采购',
        titleEn: 'Purcjase',
        color: 'blue',
        icon: '',
        link: ''
      },
      {
        title: '销售',
        titleEn: 'Sales',
        color: 'cyan',
        icon: '',
        link: ''
      },
      {
        title: '公司',
        titleEn: 'Company',
        color: 'mauve',
        icon: '',
        link: ''
      },
      {
        title: '统计',
        titleEn: 'Statistics',
        color: 'purple',
        icon: '',
        link: ''
      },
      {
        title: '资源',
        titleEn: 'Resource',
        color: 'brown',
        icon: '',
        link: ''
      },
      {
        title: '产品',
        titleEn: 'Product',
        color: 'pink',
        icon: '',
        link: ''
      },
      {
        title: '发票',
        titleEn: 'Invoice',
        color: 'orange',
        icon: '',
        link: ''
      },
      {
        title: '财务',
        titleEn: 'Finance',
        color: 'red',
        icon: '',
        link: ''
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
