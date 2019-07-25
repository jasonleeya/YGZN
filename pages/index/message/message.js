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
    messageList: [{
        id: 0,
        icon: '发货通知',
        type: 1,
        title: '采购订单已发货',
        content: 'EWRWRWWER已经确认订单，订单',
        time: '14:05',
        status: 0,
        setTop: false,
      },
      {
        id: 1,
        icon: '系统公告',
        type: 2,
        title: '系统公告',
        content: '企业助手升级为全新2.0版本，新增功能',
        time: '2017-7-17',
        status: 0,
        setTop: false,
      },
      {
        id: 2,
        icon: '滞销产品',
        type: 3,
        title: '新增滞销商品',
        content: '本月新增滞销商品，请及时处理',
        time: '2017-7-15',
        status: 0,
        setTop: false,
      },
      {
        id: 3,
        icon: '付款通知',
        type: 4,
        title: '客户已付款',
        content: '销售订单2013695555客户已付款，请注意查收',
        time: '2017-6-10',
        status: 0,
        setTop: false,
      },
      {
        id: 4,
        icon: '审核通知',
        type: 5,
        title: '采购单已审核',
        content: '您提交的采购单，主管已审核通过',
        time: '2017-2-17',
        status: 0,
        setTop: false,
      }
    ],
    topList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      if (Math.abs(e.touches[0].pageX - this.data.ListTouchStart) > 40) {
        this.setData({
          ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 40 ? 'right' : 'left'
        })
      }

    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
    // 置顶
    SetTop(e) {
      var newTopList = this.data.topList
      var newMessageList = this.data.messageList
      var index = e.target.dataset.setTopIndex
      newTopList.unshift(this.data.messageList[index])
      newMessageList.splice(index, 1)
     
      this.setData({
        topList: newTopList,
        messageList: newMessageList
      })
    },
    // 取消置顶
    CancelTop(e) {
      var newTopList = this.data.topList
      var newMessageList = this.data.messageList
      var index = e.target.dataset.cancelTopIndex
      this.setData({
        topList: newTopList,
      })
      var insertIndex=0;
      for(let i=0;i<newMessageList.length;i++){
        if (newMessageList[i].id<newTopList[index].id){
          insertIndex++
        }
      }
      newMessageList.splice(insertIndex, 0, newTopList[index])
      newTopList.splice(index, 1)
      this.setData({
        topList: newTopList,
        messageList: newMessageList
      })
   
    },
    // 删除项
    Delete(e) {
      var newMessageList = this.data.messageList
      var newTopList=this.data.topList
      var index = e.target.dataset.deleteIndex
      if (newMessageList[index].status===0){
        this.store.data.messageCount--
        this.update()
      }
      if(e.target.dataset.top==="true"){
        newTopList.splice(index, 1)
        this.setData({
          topList: newTopList
        })
      }else{
        newMessageList.splice(index, 1)
        this.setData({
          messageList: newMessageList
        })
      }
    },
    // 设置已读
    SetRead(e) {
      console.log(e)
      var newMessageList = this.data.messageList
      var newTopList=this.data.topList
      if (e.target.dataset.top === "true"){
        if (newTopList[e.target.dataset.setReadIndex].status ===0){
          this.store.data.messageCount--
          this.update()
        }
        newTopList[e.target.dataset.setReadIndex].status = 1
        this.setData({
          topList: newTopList
        })
      }else{
        if (newMessageList[e.target.dataset.setReadIndex].status === 0) {
          this.store.data.messageCount--
          this.update()
        }
        newMessageList[e.target.dataset.setReadIndex].status = 1
        this.setData({
          messageList: newMessageList
        })
      }
      
    }
  },
})