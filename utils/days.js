const DAY_FIELDS={wusongDay:'wusongDate',yangcaoDay:'yangcaoDate',inboundDay:'inboundDate',nightReturnDay:'nightReturnDate',circleDay:'circleDate',skiDay:'skiDate'}
function dayLabel(day){return ['日期待定','第一天','第二天','第三天','第四天','第五天','第六天','第七天'][day] || ('第'+day+'天')}
function dateAt(start,day){
  if(!start || !day) return ''
  const base=new Date(start+'T00:00:00Z');if(!Number.isFinite(base.getTime()))return ''
  base.setUTCDate(base.getUTCDate()+Number(day)-1);return base.toISOString().slice(0,10)
}
function migrateDays(form){
  if(form.relativeDays) return form
  const next={...form,relativeDays:true}
  for(const [dayField,dateField] of Object.entries(DAY_FIELDS)){
    const date=form[dateField] || (dayField==='wusongDay'?form.date:dayField==='nightReturnDay'?form.yangcaoDate:'')
    const offset=form.date && date ? Math.round((Date.parse(date+'T00:00:00Z')-Date.parse(form.date+'T00:00:00Z'))/86400000)+1 : 0
    next[dayField]=offset>0?offset:dayField==='wusongDay'?1:0
  }
  return next
}
function syncDates(form){const updates={};for(const [dayField,dateField]of Object.entries(DAY_FIELDS))updates[dateField]=dateAt(form.date,form[dayField]);return updates}
module.exports={DAY_FIELDS,dayLabel,dateAt,migrateDays,syncDates}
