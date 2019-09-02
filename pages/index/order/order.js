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
        name: 'item1',
        icon: ""
      },
      {
        name: 'item2',
        icon: ""
      },
      {
        name: 'item3',
        icon: ""
      },
      {
        name: 'item4',
        icon: ""
      },
      {
        name: 'item5',
        icon: ""
      },
      {
        name: 'item6',
        icon: ""
      }, {
        name: 'item7',
        icon: ""
      }, {
        name: 'item8',
        icon: ""
      }, {
        name: 'item9',
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