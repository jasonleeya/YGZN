// pages/function/function.js
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
      subtitleLink: '/pages/purchase/purchaseOrders/purchaseOrders',
      id: 0,
      items: [{
        value: "新增采购",
        icon: "iconcaigouoff",
        link: '/pages/purchase/newPurchase/newPurchase',
      }, {
        value: "采购订单确认",
        icon: "iconcaigouoff",
        link: "",
        number: 3
      }, {
        value: "采购待付款",
        icon: "iconcaigouoff",
        link: "",
        number: 10
      }, {
        value: "采购待发货",
        icon: "iconcaigouoff",
        link: "",
        number: 100
      }, {
        value: "采购待入库",
        icon: "iconcaigouoff",
        link: "",
        number: 23
      }, {
        value: "采购已完成",
        icon: "iconcaigouoff",
        link: "",
        number: 100
      }, {
        value: "采购未完成",
        icon: "iconcaigouoff",
        link: "",
        number: 23
      }],
    }, {
      name: "销售管理",
      id: 1,
      items: [{
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 31
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 4
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 64
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 13
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 45
      }]
    }, {
      name: "公司管理",
      id: 2,
      items: [{
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 14
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 64
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 27
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 96
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 234
      }]
    }, {
      name: "统计管理",
      id: 3,
      items: [{
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 31
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 34
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 22
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 23
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 56
      }]
    }, {
      name: "产品管理",
      id: 4,
      items: [{
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 32
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 12
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 73
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 22
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 33
      }]
    }, {
      name: "资源管理",
      id: 5,
      items: [{
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 11
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 86
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 6
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 3
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 62
      }]
    }, {
      name: "财务管理",
      id: 6,
      items: [{
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 12
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 56
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 78
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 29
      }, {
        value: "新增采购",
        icon: "iconcaigouoff",
        link: "",
        number: 48
      }]
    }],
    load: true
  },

  /**
   * 组件的方法列表
   */
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
    }
  }
})