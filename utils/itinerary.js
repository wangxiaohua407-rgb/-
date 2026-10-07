const {ROUTES}=require('./routes')
function itinerary(form) {
  const entries=[]
  const add=(date,time,title,detail)=>entries.push({date:date||'',time:time||'时间待定',title,detail:detail||''})
  const transport=form.items[0].enabled && form.transportType==='routes'
  const outbound=transport && ROUTES.find(r=>r.id===form.outbound)
  const inbound=transport && ROUTES.find(r=>r.id===form.inbound)
  if(outbound){
    const time=form.outbound==='0'?form.outboundTime:form.otherOutboundTime
    add(form.date,time,outbound.label+' · 出发','车程约'+outbound.duration+(time?'':'；可选班次：'+outbound.departure))
    if(form.outbound==='0' && time==='6:00') add(form.date,'11:00','预计抵达雪谷小满客栈','车程约5小时，实际抵达以路况为准')
    if(form.outbound==='0' && time==='8:00') add(form.date,'13:00','预计抵达雪谷小满客栈','车程约5小时，实际抵达以路况为准')
  }
  if(form.items[2].enabled) add(form.wusongDate||form.date,form.wusongTime,'雾凇岭 · 出发上山','套票游玩；现金支付；返程车辆陆续发车，时间待定')
  if(form.items[3].enabled){
    const packaged=form.yangcaoOptions && Number(form.yangcaoPlan)===1
    add(form.yangcaoDate,form.yangcaoTime,packaged?'羊草山550套票 · 不去雪乡':'羊草山 · 出发游玩',packaged?'马拉爬犁往返、天下第一漂、雪地摩托车': (Number(form.yangcaoSlideMode)===2?'往雪谷方向：山顶→茶房，后续返程时间待定':'按所选项目游玩；穿越路线雪谷→茶房→山顶→雪乡'))
  }
  const packageSelected=form.items[3].enabled && form.yangcaoOptions && Number(form.yangcaoPlan)===1
  const nightIncluded=transport && [form.outbound,form.inbound].includes('15')
  if(form.nightReturn && !packageSelected && !nightIncluded) add(form.nightReturnDate||form.yangcaoDate,form.nightReturnTime,'雪乡五常山门 → 雪谷小满客栈','夜间返程；车程约2小时；60元/人')
  if(inbound) add(form.inboundDate,form.inboundTime,inbound.label+' · 出发','车程约'+inbound.duration+(form.inboundTime?'':'；可选班次：'+inbound.departure))
  if(form.items[1].enabled) add('', '', '住宿安排',form.nights+'晚 / '+form.rooms+'间；入住时间待定')
  // Dates and times left unset stay explicitly pending, rather than inventing a day.
  return entries.map((entry,index)=>({...entry,index})).sort((a,b)=>{
    const dateA=a.date||'9999', dateB=b.date||'9999'
    if(dateA!==dateB)return dateA.localeCompare(dateB)
    const minute=t=>{const m=/^(\d{1,2}):(\d{2})/.exec(t);return m?Number(m[1])*60+Number(m[2]):9999}
    return minute(a.time)-minute(b.time)||a.index-b.index
  }).map(entry=>({...entry,dateLabel:entry.date||'日期待定'}))
}
function itineraryText(form,result,entries){
 return ['雪谷旅行 · 行程报价单','客户：'+(form.customer||'未填写')+' / '+form.people+'人',...entries.map(e=>e.dateLabel+' '+e.time+' '+e.title+'\n'+e.detail),'费用明细：',...result.lines.filter(x=>x.enabled).map(x=>x.name+'：¥'+x.amount+(x.detail?'（'+x.detail+'）':'')),'总价：¥'+result.total+' / 人均约¥'+result.perPerson,'备注：'+(form.note||'无'),'预计时间以路况及实际安排为准'].join('\n')
}
module.exports={itinerary,itineraryText}
