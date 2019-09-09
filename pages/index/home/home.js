let app=getApp()
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
     
    monthPurchaseAmount: 0,
    monthSaleAmount: 0,
    monthSaleNum: 0,
    todaySaleAmount: 0,
    projectData: [
      {
        title: '采购',
        titleEn: 'Purcjase',
        color: 'blue',
        icon: '',
        link: '/pages/sales/salesOrders/salesOrders?orderStatus=&isAllOrder=1'
      },
      {
        title: '销售',
        titleEn: 'Sales',
        color: 'cyan',
        icon: '',
        link: '/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=&isAllOrder=1'
      },
      // {
      //   title: '公司',
      //   titleEn: 'Company',
      //   color: 'mauve',
      //   icon: '',
      //   link: ''
      // },
      // {
      //   title: '统计',
      //   titleEn: 'Statistics',
      //   color: 'purple',
      //   icon: '',
      //   link: ''
      // },
      // {
      //   title: '资源',
      //   titleEn: 'Resource',
      //   color: 'brown',
      //   icon: '',
      //   link: ''
      // },
      {
        title: '产品',
        titleEn: 'Product',
        color: 'pink',
        icon: '',
        link: '/pages/product/productManage/productManage'
      },
      // {
      //   title: '发票',
      //   titleEn: 'Invoice',
      //   color: 'orange',
      //   icon: '',
      //   link: ''
      // },
      // {
      //   title: '财务',
      //   titleEn: 'Finance',
      //   color: 'red',
      //   icon: '',
      //   link: ''
      // },
    ]
  },

  lifetimes:{
  ready(){
    app.http("fetchOrderAggregate").then(data=>{
      var list=data.infoBody
      this.setData({
        monthPurchaseAmount: list.monthPurchaseAmount,
        monthSaleAmount: list.monthSaleAmount,
        monthSaleNum: list.monthSaleNum,
        todaySaleAmount: list.todaySaleAmount
      })
    })
  }
},
  methods: {
    jump(e){
      console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.link 
      })
    },
    toProductManage(){
      wx.navigateTo({
        url: "/pages/product/productManage/productManage"
      })
    }
  }
})
