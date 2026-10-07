const {scheduleIssue}=require('./schedule')
const {fare}=require('./routes')
const ITEMS = [
  {key:'transport', name:'往返车费', units:['整团往返','每人往返']},
  {key:'stay', name:'住宿费', units:['每人每晚','每间每晚']},
  {key:'wusong', name:'雾凇岭', defaultPrice:'400', units:['每人','整团']},
  {key:'yangcao', name:'羊草山', units:['每人','整团']}
]
function integer(value, name) {
  if (!/^\d+$/.test(String(value)) || Number(value)<1 || Number(value)>9999) throw new Error(name+'请输入1至9999的整数')
  return Number(value)
}
function cents(value) {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(String(value))) throw new Error('请填写有效单价，最多两位小数')
  const [whole, decimal=''] = String(value).split('.')
  return Number(whole)*100 + Number(decimal.padEnd(2,'0'))
}
function calculate(form) {
  const issue=scheduleIssue(form);if(issue) throw new Error(issue)
  const people=integer(form.people,'人数'), nights=integer(form.nights,'晚数'), rooms=integer(form.rooms,'房间数')
  const lines=ITEMS.map((item,index)=>{
    const row=form.items[index], mode=Number(row.mode)
    if (![0,1].includes(mode)) throw new Error('计费方式无效')
    let qty=index===0?(mode===0?1:people):index===1?(mode===0?people*nights:rooms*nights):(mode===0?people:1)
    if (!row.enabled) qty=0
    let unitCents=row.enabled && !(index===0 && form.transportType==='routes') && !(index===2 && form.wusongPackage) && !(index===3 && form.yangcaoOptions)?cents(row.price):0
    if(index===0 && row.enabled && form.transportType==='routes'){
      unitCents=fare(form.outbound,form.inbound)*100
      if (!unitCents) throw new Error('请至少选择一个车程')
      qty=people
    }
    if(index===2 && row.enabled && form.wusongPackage){
      const count=(value)=>{if(!/^\d+$/.test(String(value)) || Number(value)>9999) throw new Error('儿童人数请输入0至9999的整数');return Number(value)}
      const half=count(form.wusongHalf), free=count(form.wusongFree), full=people-half-free
      if(full<0) throw new Error('半票与免票人数不能超过出行总人数')
      return {name:'雾凇岭套票',unit:'全票/半票/免票',qty:people,unitCents:40000,amountCents:full*40000+half*20000,enabled:true,detail:'全票'+full+'人×400元，半票'+half+'人×200元，免票'+free+'人'}
    }
    if(index===3 && row.enabled && form.yangcaoOptions && Number(form.yangcaoPlan||0)===1){
      return {name:'羊草山550套票',unit:'每人',qty:people,unitCents:55000,amountCents:people*55000,enabled:true,detail:'550元/人：马拉爬犁往返、天下第一漂、雪地摩托；不去雪乡'}
    }
    if(index===3 && row.enabled && form.yangcaoOptions){
      const snow=Number(form.yangcaoSnow)
      if(![0,1,2].includes(snow)) throw new Error('请选择有效雪地摩托方案')
      const horse=form.yangcaoHorse===true?100:0, snowPrice=[0,150,300][snow]
      const freeText=form.yangcaoFree===undefined?'0':String(form.yangcaoFree)
      if(!/^\d+$/.test(freeText) || Number(freeText)>people) throw new Error('羊草山免门票人数不能超过总人数，且须为非负整数')
      const slideMode=form.yangcaoSlideMode===undefined?(form.yangcaoSlide===true?1:0):Number(form.yangcaoSlideMode)
      if(![0,1,2].includes(slideMode)) throw new Error('请选择有效雪飘方向')
      const free=Number(freeText), slide=[0,80,150][slideMode]
      const perPerson=40+horse+snowPrice+slide
      const detail='门票40'+(horse?' + 马爬犁100':'')+(snow?' + '+(snow===1?'半程':'全程')+'摩托'+snowPrice:'')+(slideMode===1?' + 去雪乡雪飘80':slideMode===2?' + 天下第一漂150':'')+'元/人'+(free?'；免门票'+free+'人':'')
      return {name:'羊草山穿越',unit:'每人',qty:people,unitCents:perPerson*100,amountCents:(perPerson*people-40*free)*100,enabled:true,detail}
    }
    return {name:item.name,unit:index===0 && form.transportType==='routes'?'每人所选车程':item.units[mode],qty,unitCents,amountCents:qty*unitCents,enabled:row.enabled}
  })
  if(form.nightReturn && !(form.items[3].enabled && form.yangcaoOptions && Number(form.yangcaoPlan)===1)){
    const covered=form.transportType==='routes' && form.items[0].enabled && [form.outbound,form.inbound].includes('15')
    lines.push({name:'夜间雪乡→雪谷车票',unit:'每人',qty:people,unitCents:covered?0:6000,amountCents:covered?0:people*6000,enabled:true,detail:covered?'已含在所选直通车费中，不重复收费':'18:00 / 20:00；60元/人'})
  }
  const totalCents=lines.reduce((sum,line)=>sum+line.amountCents,0)
  return {lines,totalCents,perPersonCents:Math.round(totalCents/people)}
}
function money(value){return (value/100).toFixed(2)}
module.exports={ITEMS,calculate,money}
