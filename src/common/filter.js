import Vue from 'vue'

const formatMoney = Vue.filter('formatMoney', function (money) {
  if (isNaN(money)) {
    return "0.00"
  }
  const _formatMoney = (money / 100).toFixed(2)
  return _formatMoney;
})

const formatDateTime = Vue.filter('formatDateTime', function (datetime) {
  if (!datetime) {
    return "1970-01-01"
  }
  const _datetimeArr = datetime.split(' ')
  return _datetimeArr[0];
})

export {
  formatMoney,
  formatDateTime
}