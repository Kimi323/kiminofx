let myTrade = {
  _id: 1,
  currencyPair: 'GBP/JPY',
  amount: 5000,
  entryPrice: 149.37,
  exitPrice: 149.90,
  entryDate: '2018/05/02',
  exitDate: '2018/05/02',
  success: false
}

let calcProfit = function(result){
  result.profit = Math.round((result.exitPrice - result.entryPrice) * result.amount)
  return result.profit
}

console.log(calcProfit(myTrade))
