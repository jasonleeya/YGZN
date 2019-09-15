let app = getApp()
Page({
  data: {
    list: [],
    expName: "", 
    lgtNums: "",   //4300191466177 
    statusStr: "未知",
  },

  onLoad: function(options) {
    app.setTitle("物流信息")

    this.setData({
      lgtNums: options.lgtNums
    })
    //获取物流信息
    app.http("getLogistics", {
      lgtNums: options.lgtNums
    }).then(data => {
      if (data.result.list.length===0){
        return
      }
      this.setData({
        expName: data.result.expName
      })
      var list = data.result.list
      list.forEach(item => {
        //格式化时间
        var date = new Date(item.time)
        item.dayStr = (date.getMonth() + 1) + "-" + date.getDate()
        item.timeStr = new Date(item.time).toTimeString().substr(0, 8)
        //正则匹配手机号并设置样式
        item.status = item.status.replace(/(1[3456789]\d{9})/g, "<span style='color:red;'>$1</span>")
      })
      this.setData({
        list: list
      })
      // 0：快递收件(揽件)1.在途中 2.正在派件 3.已签收 4.派送失败 5.疑难件 6.退件签收 
      //设置物流状态
      var statusStr = ""
      switch (data.result.deliverystatus) {
        case "0":
          statusStr = "已揽件"
          break
        case "1":
          statusStr = "运输中"
          break
        case "2":
          statusStr = "正在派件"
          break
        case "3":
          statusStr = "已签收"
          break
        case "4":
          statusStr = "派送失败"
          break
        case "5":
          statusStr = "疑难件"
          break
        case "6":
          statusStr = "退件签收"
          break
      }
      this.setData({
        statusStr
      })

    })
  },

})