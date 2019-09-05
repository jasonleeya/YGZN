let app = getApp()
Page({

  data: {
    today: new Date().toLocaleDateString().replace(/\//g, "-"),
    timeRange: {
      start: "",
      end: ""
    },
    choosedType: "all",
    choosedTimeRange: "allTime",
    isShowTimePicker: false,
    isShowTimeFloat: false,
  },

  onLoad: function(options) {

  },
  limitType(e) {
    var type = e.target.dataset.type
    console.log(type)
    if (type === "time") {
      this.setData({
        isShowTimeFloat: !this.data.isShowTimeFloat
      })
    } else {
      this.setData({
        choosedType: type, 
        isShowTimeFloat:false
      })
    }
  },
  timeLimit(e) {
    var type = e.target.dataset.type
    console.log(type)
    this.setData({
      choosedTimeRange: type
    })
    if (type === "customerDate") {
      this.setData({
        ["timeRange.start"]: this.data.today,
        ["timeRange.end"]: this.data.today,
        isShowTimePicker: true
      })

      this.setData({

      })
    } else {
      this.setData({
        isShowTimePicker: false
      })
      switch (type) {
        case "allTime":
          this.setData({
            ["timeRange.start"]: "",
            ["timeRange.end"]: "",
          })
          break
        case"today":
          this.setData({
            ["timeRange.start"]: this.data.today,
            ["timeRange.end"]: this.data.today,
          })
          break
          case"lastWeek":
          var date = new Date()
          var year = date.getFullYear()
          var mouth = date.getMonth() + 1
          var day = date.getDate()
          var lastWeek = null
          if (day > 7) {
            day = day - 7
          } else {
            day = new Date(year, mouth, 0).getDate() - (7 - day)
            if (mouth === 1) {
              mouth = 12
              year = year - 1
            } else (
              mouth = mouth - 1
            )

          }
          lastWeek = year + "-" + mouth + "-" + day
          this.setData({
            ["timeRange.start"]: lastWeek,
            ["timeRange.end"]: this.data.today,
          })
          break
          case"lastMonth":
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var day = date.getDate()
          var lastMonth = null
          if (month > 1) {
            month = month - 1
          } else {
            month = 12
            year = year - 1
          }
          lastMonth = year + "-" + month + "-" + day

          this.setData({
            ["timeRange.start"]: lastMonth,
            ["timeRange.end"]: this.data.today,
          })
          break
      }


     
    }
  },
  startDateChange(e) {
    var value = e.detail.value
    if (new Date(value) > new Date(this.data.timeRange.end)) {
      value = this.data.timeRange.end
    }
    this.setData({
      ["timeRange.start"]: value
    })
  },
  endDateChange(e) {
    var value = e.detail.value
    if (new Date(value) < new Date(this.data.timeRange.start)) {
      value = this.data.timeRange.start
    }
    this.setData({
      ["timeRange.end"]: value
    })
  }
})