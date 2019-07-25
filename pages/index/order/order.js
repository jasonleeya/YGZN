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
        name: 'order1',
        icon: ""
      },
      {
        name: 'order2',
        icon: ""
      },
      {
        name: 'order3',
        icon: ""
      },
      {
        name: 'order4',
        icon: ""
      },
      {
        name: 'order5',
        icon: ""
      },
      {
        name: 'order6',
        icon: ""
      }, {
        name: 'order7',
        icon: ""
      }, {
        name: 'order8',
        icon: ""
      }, {
        name: 'order9',
        icon: ""
      },
    ]
  },
  /**
   * 加号旋转为叉号
   */
  ready() {
    // 开始动画
    var btnAni = wx.createAnimation({ timingFunction:"linear"})
    btnAni.rotate(45).step({
      duration: 300
    })
    this.setData({
      btnAni: btnAni.export()
    })


    var listAni = wx.createAnimation({ timingFunction: "linear"})
    listAni.scale(1).step({
      duration: 300
    })
    this.setData({
      listAni: listAni.export()
    })
    

  },


  methods: {
    CloseOrder() {
      var btnAni = wx.createAnimation({ timingFunction: "linear"})
      btnAni.rotate(90).step({
        duration: 300
      })
      this.setData({
        btnAni: btnAni.export()
      })


      var listAni = wx.createAnimation({ timingFunction: "linear"})
      listAni.translateY(300).scale(0.1).step({
        duration: 300
      })
      this.setData({
        listAni: listAni.export()
      })


      setTimeout(function () {
        this.store.data.showOrderPage = false
        this.update()
        this.store.updateAll = true;
      }.bind(this), 300)
  
    },
  },

})