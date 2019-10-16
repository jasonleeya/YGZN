// pages/function/function.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  lifetimes: {
    created: function() {
      // wx.showLoading({
      //   title: '加载中...',
      //   mask: true
      // });
    },
    ready: function() {
      wx.hideLoading()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    activeTab: 0, //当前左边激活tab
    curContent: null, //当前右边内容部分
    verticalNavTop: 0, //左边导航距顶部距离
    list: [{
        name: "采购管理",
        subTitle: '全部订单',
        subtitleLink: '/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=&isAllOrder=1',
        id: 0,
        items: [{
          value: "新增采购",
          icon: "icondingdan",
          link: '/pages/purchase/newPurchase/newPurchase',
        }, {
          value: "采购待审核",
          icon: "iconshenhe",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=wait",
        }, {
          value: "采购待确认",
          icon: "iconqueren",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090001",
        }, {
          value: "采购待付款",
          icon: "iconfukuan",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090003",
          number: 0
        }, {
          value: "采购待发货",
          icon: "iconfahuo",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090002",
        }, {
          value: "采购待入库订单",
          icon: "iconruku",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090004",
          number: 0
        }, {
          value: "采购已完成",
          icon: "iconyiwancheng",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090005",
        }, {
          value: "采购取消订单",
          icon: "iconquxiaodingdan",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090008",
          number: 0
        }, {
          value: "采购退货列表",
          icon: "icontuihuo",
          link: "/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=back",

        }],
      }, {
        name: "销售管理",
        id: 1,
        subTitle: '全部订单',
        subtitleLink: '/pages/sales/salesOrders/salesOrders?orderStatus=&isAllOrder=1',
        items: [{
          value: "新增销售",
          icon: "icondingdan",
          link: "/pages/sales/newSales/newSales",
        }, {
          value: "销售待确认订单",
          icon: "iconqueren",
          link: "/pages/sales/salesOrders/salesOrders?orderStatus=090001",
          number: 0
        }, {
          value: "销售待付款订单",
          icon: "iconfukuan",
          link: "/pages/sales/salesOrders/salesOrders?orderStatus=090003",
          number: 0
        }, {
          value: "销售待发货订单",
          icon: "iconfahuo",
          link: "/pages/sales/salesOrders/salesOrders?orderStatus=090002",
          number: 0
        }, {
          value: "销售待收货订单",
          icon: "iconshouhuo",
          link: "/pages/sales/salesOrders/salesOrders?orderStatus=090004",
          number: 0
        }, {
          value: "销售已完成",
          icon: "iconyiwancheng",
          link: "/pages/sales/salesOrders/salesOrders?orderStatus=090005",
        }, {
          value: "销售取消订单",
          icon: "iconquxiaodingdan",
          link: "/pages/sales/salesOrders/salesOrders?orderStatus=090008",
          number: 0
        }, {
          value: "销售退货列表",
          icon: "icontuihuo",
          link: "/pages/sales/salesOrders/salesOrders?orderStatus=back",
        }]
      },
      {
        name: "公司管理",
        id: 2,
        items: [{
            value: "公司信息",
            icon: "icongongsiguanli",
            link: "/pages/company/companyInfos/companyInfos"
          }, {
            value: "收款信息",
            icon: "iconshoukuan",
            link: "/pages/company/receiptInfo/receiptInfo"
          }, {
            value: "员工管理",
            icon: "iconyuangongguanli",
            link: "/pages/company/employeeManage/employeeManage"
          }, {
            value: "职位管理",
            icon: "iconzhiwei",
            link: "/pages/company/positionManage/positionManage"
          },
          //  {
          //   value: "职位权限",
          //   icon: "iconquanxian",
          //   link: "/pages/company/positionRight/positionRight"
          // }, 
          {
            value: "等级管理",
            icon: "icondengji",
            link: "/pages/company/levelManage/levelManage"
          }, {
            value: "登录日志",
            icon: "icondenglurizhi",
            link: "/pages/company/loginLogs/loginLogs"
          }
        ]
      },
      // {
      //   name: "统计管理",
      //   id: 3,
      //   items: [{
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }]
      // }, 
      {
        name: "产品管理",
        id: 4,
        items: [{
            value: "产品管理",
            icon: "iconchanpinguanli",
            link: "/pages/product/productManage/productManage",
          },
          {
            value: "仓库管理",
            icon: "iconcangku",
            link: "/pages/product/warehouseManage/warehouseManage",
          },
          // {
          //   value: "调拨管理",
          //   icon: "icontiaoboguanli",
          //   link: "/pages/product/transferManage/transferManage",
          // },
          {
            value: "其他出库",
            icon: "iconqitachuku",
            link: "/pages/product/otherOutboundAndStorage/otherOutboundAndStorage?type=outbound",
          },
          {
            value: "其他入库",
            icon: "iconqitaruku",
            link: "/pages/product/otherOutboundAndStorage/otherOutboundAndStorage?type=storage",
          },
        ]
      },
      // {
      //   name: "资源管理",
      //   id: 5,
      //   items: [{
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }, {
      //     value: "新增采购",
      //     icon: "iconcart",
      //     link: ""
      //   }]
      // }, 
      {
        name: "财务管理",
        id: 6,
        items: [{
          value: "已收款管理",
          icon: "iconyishoukuan",
          link: "/pages/finance/paidAndReceiptedManage/paidAndReceiptedManage?type=receipted"
        }, {
          value: "已付款管理",
          icon: "iconyifukuan",
          link: "/pages/finance/paidAndReceiptedManage/paidAndReceiptedManage?type=paid"
        }, ]
      }
    ],
    load: true,
    interval: null
  },
  lifetimes: {

    ready() {
      app.setTitle("功能")
      let that = this
      if (app.globalData.homeMessage) {
        getMessage()
      }
      app.watchGloabalData("homeMessage", function(value) {
        getMessage()
      })



      function getMessage() {
        for (let i = 0; i < that.data.list[0].items.length; i++) {
          app.globalData.homeMessage.forEach(item => {
            if (item.typeZh === that.data.list[0].items[i].value) {
              that.setData({
                ["list[0].items[" + i + "].number"]: item.notRead
              })
            }
          })
        }
        for (let i = 0; i < that.data.list[1].items.length; i++) {
          app.globalData.homeMessage.forEach(item => {
            if (item.typeZh === that.data.list[1].items[i].value) {
              that.setData({
                ["list[1].items[" + i + "].number"]: item.notRead
              })
            }
          })
        }
      }
    },
    detached() {
      clearInterval(this.data.interval)
    }


  },

  methods: {
    TabSelect(e) {
      this.setData({
        activeTab: e.currentTarget.dataset.id,
        curContent: e.currentTarget.dataset.id,
        verticalNavTop: (e.currentTarget.dataset.id - 1) * 50
      })
    },
    VerticalMain(e) {
      let that = this;
      let list = this.data.list;
      let tabHeight = 0;
      if (this.data.load) {
        //循环获取内容高度
        for (let i = 0; i < list.length; i++) {
          let view = wx.createSelectorQuery().in(this).select("#content-" + list[i].id);
          view.fields({
            size: true
          }, data => {
            list[i].top = tabHeight;
            tabHeight = tabHeight + data.height;
            list[i].bottom = tabHeight;
          }).exec();
        }
        that.setData({
          load: false,
          list: list
        })
      }
      // 10为margin
      let scrollTop = e.detail.scrollTop - 10;
      for (let i = 0; i < list.length; i++) {
        if (scrollTop > list[i].top - i * 10 && scrollTop < list[i].bottom + i * 10) {
          that.setData({
            verticalNavTop: (list[i].id - 1) * 50,
            activeTab: list[i].id
          })
          return false
        }
      }
    },
  }
})