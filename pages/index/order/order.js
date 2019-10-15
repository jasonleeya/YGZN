let app=getApp()
import create from '../../../utils/create'
create({
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
    routate: null,
    orderList: [{
        name: '新增采购',
        icon: "iconkaidancaigou",
        link: "/pages/purchase/newPurchase/newPurchase"
      },
      {
        name: '新增销售',
        icon: "iconkaidanxiaoshou",
        link: "/pages/sales/newSales/newSales"
      },
      {
        name: '产品管理',
        icon: "iconkaidanchanpinguanli",
        link: "/pages/product/productManage/productManage"
      }
    ]
  },
  /**
   * 加号旋转为叉号
   */
  ready() {
   
    // 开始动画
    var btnAni = wx.createAnimation({
      timingFunction: "linear"
    })
    btnAni.rotate(45).step({
      duration: 300
    })
    this.setData({
      btnAni: btnAni.export()
    })


    var listAni = wx.createAnimation({
      timingFunction: "linear"
    })
    listAni.scale(1).step({
      duration: 300
    })
    this.setData({
      listAni: listAni.export()
    })


  },
  pageLifetimes:{
    hide(){
      this.CloseOrder()
    }
  },

  methods: {
    jump(e) {
      console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    },
    CloseOrder() {
      var btnAni = wx.createAnimation({
        timingFunction: "linear"
      })
      btnAni.rotate(90).step({
        duration: 300
      })
      this.setData({
        btnAni: btnAni.export()
      })


      var listAni = wx.createAnimation({
        timingFunction: "linear"
      })
      listAni.translateY(300).scale(0.1).step({
        duration: 300
      })
      this.setData({
        listAni: listAni.export()
      })


      setTimeout(function() {
        this.store.data.showOrderPage = false
        this.update()
        this.store.updateAll = true;
      }.bind(this), 300)

    },
  },

})