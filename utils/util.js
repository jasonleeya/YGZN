const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const objToUrl=(obj, url)=>{
  if (["", null, undefined].includes(url)) {
    return ""
  }
  url += (url.indexOf("?") != -1) ? "" : "?"
  for (var key in obj) {
    url += ((url.indexOf("=") != -1) ? "&" : "") + key + "=" + obj[key]
  }
  return url
}
module.exports = {
  formatTime: formatTime,
  objToUrl: objToUrl
}
