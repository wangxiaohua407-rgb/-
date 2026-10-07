// Business rule supplied by the operator: allow time for arrival and transfer.
function scheduleIssue(form) {
  if (!form.items[2].enabled) return ''
  const playDate=form.wusongDate||form.date
  if(form.date && playDate && playDate<form.date) return '雾凇岭游玩日期不能早于出行日期'
  if(form.transportType!=='routes' || !form.items[0].enabled || form.outbound!=='0') return ''
  if(!form.outboundTime) return '请选择哈尔滨去雪谷的发车时间，以检查当天行程'
  if(!['6:00','8:00','12:30–13:00'].includes(form.outboundTime)) return '请重新选择有效的哈尔滨发车时间'
  if(form.date && form.wusongDate && form.wusongDate>form.date) return ''
  if(form.outboundTime!=='6:00') return '此班车赶不上当天雾凇岭，请改选次日游玩或6:00班车'
  if(form.wusongTime && form.wusongTime!=='12:30–13:00') return '6:00班车约11:00到雪谷，当天雾凇岭请选择12:30–13:00'
  return ''
}
module.exports={scheduleIssue}
