let result = [
  {
      "code": "2368",
      "name": "金像電",
      "bias_20": 9.2,
      "bias_10": 2.91,
      "burstIndex": 80,
      "close": 138.0
  },
  {
      "code": "3481",
      "name": "群創",
      "bias_20": 2.86,
      "bias_10": 0.21,
      "burstIndex": 80,
      "close": 14.65
  },
  {
      "code": "2886",
      "name": "兆豐金",
      "bias_20": 2.15,
      "bias_10": 0.66,
      "burstIndex": 71,
      "close": 37.4
  },
  {
      "code": "1611",
      "name": "中電",
      "bias_20": 10.88,
      "bias_10": 9.41,
      "burstIndex": 79,
      "close": 20.0
  }
]

result.forEach(item => {
  console.log(`${item.code}`)
})

result.forEach(item => {
  console.log(`${item.name}`)
})
