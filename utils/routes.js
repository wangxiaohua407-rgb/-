const ROUTES = [
  {
    "id": "0",
    "label": "哈尔滨中央大街 → 雪谷小满客栈",
    "departure": "6:00、8:00、12:30–13:00",
    "duration": "5小时",
    "price": 80,
    "departures": [
      "6:00",
      "8:00",
      "12:30–13:00"
    ]
  },
  {
    "id": "1",
    "label": "哈尔滨中央大街 → 雪乡五常山门",
    "departure": "8:00",
    "duration": "5小时",
    "price": 80,
    "departures": [
      "8:00"
    ]
  },
  {
    "id": "2",
    "label": "雪谷小满客栈 → 哈尔滨中央大街",
    "departure": "7:00、9:00、12:00、14:00、15:00",
    "duration": "5小时",
    "price": 80,
    "departures": [
      "7:00",
      "9:00",
      "12:00",
      "14:00",
      "15:00"
    ]
  },
  {
    "id": "3",
    "label": "雪谷小满客栈 → 雪乡五常山门",
    "departure": "8:00、9:00、13:00",
    "duration": "2小时",
    "price": 60,
    "departures": [
      "8:00",
      "9:00",
      "13:00"
    ]
  },
  {
    "id": "4",
    "label": "雪谷小满客栈 → 长春龙嘉机场",
    "departure": "7:00",
    "duration": "5小时",
    "price": 230,
    "departures": [
      "7:00"
    ]
  },
  {
    "id": "5",
    "label": "雪谷小满客栈 → 吉林高铁站",
    "departure": "7:00",
    "duration": "4小时",
    "price": 130,
    "departures": [
      "7:00"
    ]
  },
  {
    "id": "6",
    "label": "雪谷小满客栈 → 亚布力（西）森林温泉酒店",
    "departure": "7:00",
    "duration": "4小时",
    "price": 130,
    "departures": [
      "7:00"
    ]
  },
  {
    "id": "7",
    "label": "雪谷小满客栈 → 延吉网红墙 / 东北亚客运站",
    "departure": "7:00",
    "duration": "7小时",
    "price": 200,
    "departures": [
      "7:00"
    ]
  },
  {
    "id": "8",
    "label": "雪谷小满客栈 → 长白山（北坡）二道白河镇酒店",
    "departure": "7:00",
    "duration": "7.3小时",
    "price": 240,
    "departures": [
      "7:00"
    ]
  },
  {
    "id": "9",
    "label": "延吉东北客运站（长白路） → 雪谷小满客栈",
    "departure": "9:20",
    "duration": "7小时",
    "price": 200,
    "departures": [
      "9:20"
    ]
  },
  {
    "id": "10",
    "label": "长白山（北坡）二道白河镇酒店 → 雪谷小满客栈",
    "departure": "7:30",
    "duration": "7.3小时",
    "price": 240,
    "departures": [
      "7:30"
    ]
  },
  {
    "id": "11",
    "label": "长春龙嘉机场 → 雪谷小满客栈",
    "departure": "11:30",
    "duration": "5小时",
    "price": 230,
    "departures": [
      "11:30"
    ]
  },
  {
    "id": "12",
    "label": "吉林高铁站 → 雪谷小满客栈",
    "departure": "12:30",
    "duration": "4小时",
    "price": 130,
    "departures": [
      "12:30"
    ]
  },
  {
    "id": "13",
    "label": "亚布力（西）森林温泉酒店 → 雪谷小满客栈",
    "departure": "15:00",
    "duration": "4小时",
    "price": 130,
    "departures": [
      "15:00"
    ]
  },
  {
    "id": "14",
    "label": "哈尔滨中央大街（经雪乡联乘） → 雪谷小满客栈",
    "departure": "哈尔滨8:00；雪乡18:00或20:00转车",
    "duration": "5+2小时",
    "price": 160,
    "departures": [
      "8:00；雪乡18:00转车",
      "8:00；雪乡20:00转车"
    ]
  },
  {
    "id": "15",
    "label": "雪乡五常山门 → 雪谷小满客栈（夜间返程）",
    "departure": "18:00、20:00",
    "duration": "2小时",
    "price": 60,
    "departures": [
      "18:00",
      "20:00"
    ]
  }
]
function fare(outbound, inbound) {
  return [outbound, inbound].reduce((sum, id) => {
    if (id === '' || id === null || id === undefined) return sum
    const route = ROUTES.find(r => r.id === String(id))
    if (!route) throw new Error('请选择有效车程')
    return sum + route.price
  }, 0)
}
function departures(id){const route=ROUTES.find(r=>r.id===String(id));return route?route.departures:[]}
module.exports = {ROUTES, fare, departures}
