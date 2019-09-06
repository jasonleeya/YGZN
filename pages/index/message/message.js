import create from '../../../utils/create'
let app = getApp()
create({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
    isLoad: false
  },
  /**
   * 组件的初始数据
   */
  data: {
    msgList: [],
    topList: [],
    curPage: 1,
    totalPage: null
  },

  lifetimes: {
    ready() { 
      this.getList()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    getList() {
      this.setData({
        isLoad: true
      })
      app.http("selectReminderMessageByEnterpriseId", {
        pageSize: 15,
        pageNum: this.data.curPage
      }).then(data => {
        var msgList = JSON.parse(data.t)
        console.log(msgList)
        this.setData({
          isLoad: false,
          totalPage: msgList.totalPages
        })
        msgList.list.forEach(msg => {
          var time = new Date(parseInt(msg.messageDate)) 
          msg.time = time.toLocaleDateString().replace(/\//g, "-") + " " + time.toTimeString().substr(0,9)

          if (msg.content.search("<b class='sale'>") > 0) {
            msg.msgType = "销售订单-"
          } else if (msg.content.search("<b class='purchase'>") > 0) {
            msg.msgType = "采购订单-"
          } else {
            msg.msgType = "其他消息-"
            msg.head = "其他消息"
          }
          msg.content = msg.content.replace(/(<b class='purchase'>)|(<b class='sale'>)|(<\/b>)|(<b>)|(<i>)|(<\/i>)/g,"")

          if (msg.content.search("取消了订单") > 0) {
            msg.operate = "已取消"
            msg.head = "订单取消"
          }
          if (msg.content.search("24小时未付款，取消了订单") > 0) {
            msg.operate = "逾期自动取消"
            msg.head = "订单取消"
          }
          if (msg.content.search("申请为客户") > 0) {
            msg.operate = "申请成为我的客户"
            msg.head = "申请通知"
          }
          if (msg.content.search("通过你客户的申请") > 0) {
            msg.operate = "客户申请通过"
            msg.head = "申请通知"
          }
          if (msg.content.search("拒绝了你客户的申请") > 0) {
            msg.operate = "客户申请未通过"
            msg.head = "申请通知"
          }
          if (msg.content.search("申请为供应商") > 0) {
            msg.operate = "申请成为供应商"
            msg.head = "申请通知"
          }
          if (msg.content.search("提交") > 0) {
            msg.operate = "新增-"
            msg.head = "新增订单"
          }
          if (msg.content.search("发货") > 0) {
            msg.operate = "已发货"
            msg.head = "订单发货"
          }
          if (msg.content.search("确认") > 0) {
            msg.operate = "已确认"
            msg.head = "订单确认"
          }
          if (msg.content.search("收货") > 0) {
            msg.operate = "已收货"
            msg.head = "订单收货"
          }
          if (msg.content.search("付款") > 0) {
            msg.operate = "已付款"
            msg.head = "订单付款"
          }
          if (msg.content.search("审批") > 0) {
            msg.operate = "待审批"
            msg.head = "订单审批"
          }
          if (msg.content.search("出库") > 0) {
            msg.operate = "已出库"
            msg.head = "订单出库"
          }
          if (msg.content.search("收款") > 0) {
            msg.operate = "已收款"
            msg.head = "订单收款"
          }
          if (msg.content.search("提交") > 0) {
            msg.operate = "已提交"
            msg.head = "订单提交"
          }
        })
        if (parseInt(this.data.totalPage) > parseInt(this.data.curPage)){
          this.setData({
            msgList: this.data.msgList.concat(msgList.list)
          })
        }
        
      })
    },
    scrollToBottom() {
      if (this.data.isLoad) {
        return
      } 
      if (parseInt(this.data.totalPage) > parseInt(this.data.curPage)) {
        this.setData({
          curPage: this.data.curPage + 1
        })
      } else {
        app.showToast("没有更多消息了")
      }

      this.getList()
    },
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
      app.showToast("该功能正在开发中")
      return
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
      var insertIndex = 0;
      for (let i = 0; i < newMessageList.length; i++) {
        if (newMessageList[i].id < newTopList[index].id) {
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
      app.showToast("该功能正在开发中")
      return
      var newMessageList = this.data.messageList
      var newTopList = this.data.topList
      var index = e.target.dataset.deleteIndex
      if (newMessageList[index].status === 0) {
        this.store.data.messageCount--
          this.update()
      }
      if (e.target.dataset.top === "true") {
        newTopList.splice(index, 1)
        this.setData({
          topList: newTopList
        })
      } else {
        newMessageList.splice(index, 1)
        this.setData({
          messageList: newMessageList
        })
      }
    },
    // 设置已读
    SetRead(e) {
      app.showToast("该功能正在开发中")
      return
      console.log(e)
      var newMessageList = this.data.messageList
      var newTopList = this.data.topList
      if (e.target.dataset.top === "true") {
        if (newTopList[e.target.dataset.setReadIndex].status === 0) {
          this.store.data.messageCount--
            this.update()
        }
        newTopList[e.target.dataset.setReadIndex].status = 1
        this.setData({
          topList: newTopList
        })
      } else {
        if (newMessageList[e.target.dataset.setReadIndex].status === 0) {
          this.store.data.messageCount--
            this.update()
        }
        newMessageList[e.target.dataset.setReadIndex].status = 1
        this.setData({
          messageList: newMessageList
        })
      }

    },

  },
})