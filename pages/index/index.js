const {SUPPLEMENT_ROUTES,newTrip}=require('../../utils/supplement')
const {DAY_FIELDS,dayLabel,migrateDays,syncDates}=require('../../utils/days')
const {itinerary,itineraryText}=require('../../utils/itinerary')
const {scheduleIssue}=require('../../utils/schedule')
const {ROUTES,fare,departures}=require('../../utils/routes')
const {ITEMS,calculate,money}=require('../../utils/quote')
const fresh=()=>({transportType:'routes',outbound:'0',outboundTime:'6:00',inbound:'2',customer:'',circleDay:0,circleTime:'',skiDay:0,skiTime:'',supplementEnabled:false,supplementTrips:[newTrip()],relativeDays:true,wusongDay:1,yangcaoDay:0,inboundDay:0,nightReturnDay:0,date:'',otherOutboundTime:'',inboundDate:'',inboundTime:'',yangcaoDate:'',yangcaoTime:'',nightReturnDate:'',nightReturnTime:'',people:'2',nights:'1',rooms:'1',wusongTime:'',wusongDate:'',wusongPackage:true,wusongHalf:'0',wusongFree:'0',yangcaoOptions:true,yangcaoPlan:0,nightReturn:false,yangcaoHorse:false,yangcaoSnow:0,yangcaoFree:'0',yangcaoSlide:false,yangcaoSlideMode:0,note:'',items:ITEMS.map(item=>({...item,enabled:item.optional!==true,price:item.defaultPrice||'',mode:0}))})
Page({
 data:{form:fresh(),supplementRoutes:SUPPLEMENT_ROUTES,supplementModes:['每人票价','整车包车价'],detailOpen:{wusong:false,yangcao:false},dayLabels:Array.from({length:15},(_,i)=>dayLabel(i)),posterHeight:940,result:null,history:[],scheduleMessage:'',outboundTimes:['待定','6:00','8:00','12:30–13:00'],outboundTimeIndex:1,otherOutboundTimeIndex:0,inboundTimes:['待定',...departures('2')],inboundTimeIndex:0,nightReturnTimes:['待定','18:00','20:00'],nightReturnTimeIndex:0,yangcaoPlanLabels:['单项组合 · 门票加选项目','羊草山套票 · 550元/人（不去雪乡）'],yangcaoSlideLabels:['不乘坐雪飘','往雪乡 · 雪飘80元/人','往雪谷 · 天下第一漂150元/人'],yangcaoSnowLabels:['不乘坐雪地摩托','半程 · 150元/人','全程登顶 · 300元/人（推荐）'],wusongTimes:['待定','7:00','9:00','12:30–13:00'],wusongTimeIndex:0,routes:ROUTES,routeLabels:['不含此车程',...ROUTES.map(r=>r.label+' · ¥'+r.price)],outboundIndex:1,inboundIndex:ROUTES.findIndex(r=>r.id==='2')+1,outboundRoute:ROUTES.find(r=>r.id==='0'),inboundRoute:ROUTES.find(r=>r.id==='2'),routeFare:160},
 onLoad(){this.refreshHistory();this.syncRoutes();this.syncSchedule()},
 syncRoutes(){
  const f=this.data.form,changes={};const outboundField=f.outbound==='0'?'outboundTime':'otherOutboundTime'
  for(const [field,id] of [[outboundField,f.outbound],['inboundTime',f.inbound]]){
   if(f[field] && !departures(id).includes(f[field])){changes['form.'+field]='';f[field]=''}
  }
  const outboundTimes=['待定',...departures(f.outbound)],inboundTimes=['待定',...departures(f.inbound)]
  this.setData({...changes,outboundTimes,inboundTimes,outboundTimeIndex:Math.max(0,outboundTimes.indexOf(f.outboundTime)),otherOutboundTimeIndex:Math.max(0,outboundTimes.indexOf(f.otherOutboundTime)),inboundTimeIndex:Math.max(0,inboundTimes.indexOf(f.inboundTime)),nightReturnTimeIndex:Math.max(0,this.data.nightReturnTimes.indexOf(f.nightReturnTime)),outboundIndex:ROUTES.findIndex(r=>r.id===f.outbound)+1,inboundIndex:ROUTES.findIndex(r=>r.id===f.inbound)+1,outboundRoute:ROUTES.find(r=>r.id===f.outbound)||null,inboundRoute:ROUTES.find(r=>r.id===f.inbound)||null,routeFare:fare(f.outbound,f.inbound)})
 },
 syncSchedule(){if(this.data.form.relativeDays){const updates=syncDates(this.data.form),patch={};for(const [key,value]of Object.entries(updates))patch['form.'+key]=value;const max=Math.max(14,...Object.keys(DAY_FIELDS).map(key=>Number(this.data.form[key])||0));patch.dayLabels=Array.from({length:max+1},(_,i)=>dayLabel(i));this.setData(patch)}this.setData({scheduleMessage:scheduleIssue(this.data.form),outboundTimeIndex:Math.max(0,this.data.outboundTimes.indexOf(this.data.form.outboundTime))})},
 fixedDeparture(e){const {field,options}=e.currentTarget.dataset,index=Number(e.detail.value);this.setData({['form.'+field]:index===0?'':this.data[options][index],result:null});this.syncRoutes();this.syncSchedule()},
 outboundTime(e){const index=Number(e.detail.value);this.setData({'form.outboundTime':index===0?'':this.data.outboundTimes[index],result:null});this.syncSchedule()},
 route(e){const field=e.currentTarget.dataset.field,index=Number(e.detail.value);this.setData({['form.'+field]:index===0?'':ROUTES[index-1].id,result:null});this.syncRoutes();this.syncSchedule()},
 transport(e){this.setData({'form.transportType':Number(e.detail.value)===0?'routes':'manual',result:null});this.syncSchedule()},
 wusongTime(e){const index=Number(e.detail.value);this.setData({'form.wusongTime':index===0?'':this.data.wusongTimes[index],wusongTimeIndex:index,result:null});this.syncSchedule()},
 yangcaoPlan(e){const plan=Number(e.detail.value),updates={'form.yangcaoPlan':plan,result:null};if(plan===1){updates['form.nightReturn']=false;if(this.data.form.transportType==='routes' && this.data.form.inbound==='15')updates['form.inbound']='';}this.setData(updates);this.syncRoutes();this.syncSchedule()},
 supplementField(e){const {index,field}=e.currentTarget.dataset;this.setData({['form.supplementTrips['+index+'].'+field]:e.detail.value,result:null});this.syncSchedule()},
 addTrip(){if(this.data.form.supplementTrips.length>=5){wx.showToast({title:'最多添加5段补充用车',icon:'none'});return}this.setData({'form.supplementTrips':[...this.data.form.supplementTrips,newTrip()],result:null})},
 removeTrip(e){const trips=this.data.form.supplementTrips.filter((_,index)=>index!==Number(e.currentTarget.dataset.index));this.setData({'form.supplementTrips':trips.length?trips:[newTrip()],result:null})},
 selectDay(e){this.setData({['form.'+e.currentTarget.dataset.field]:Number(e.detail.value),result:null});this.syncSchedule()},
 clearDate(){this.setData({'form.date':'',result:null});this.syncSchedule()},
 toggleDetails(e){const key=e.currentTarget.dataset.key;this.setData({['detailOpen.'+key]:!this.data.detailOpen[key]})},
 refreshHistory(){this.setData({history:wx.getStorageSync('xuegu-quotes')||[]})},
 field(e){this.setData({['form.'+e.currentTarget.dataset.field]:e.detail.value,result:null});this.syncSchedule()},
 item(e){const {index,field}=e.currentTarget.dataset;this.setData({['form.items['+index+'].'+field]:e.detail.value,result:null});this.syncSchedule()},
 quote(){try{const result=calculate(this.data.form);this.setData({result:{...result,itinerary:itinerary(this.data.form),total:money(result.totalCents),perPerson:money(result.perPersonCents),lines:result.lines.map(line=>({...line,price:money(line.unitCents),amount:money(line.amountCents)}))}})}catch(err){wx.showToast({title:err.message,icon:'none'});return false}return true},
 save(){if(!this.quote())return;const entry={id:Date.now(),label:this.data.form.customer||'未填写客户',total:this.data.result.total,form:JSON.parse(JSON.stringify(this.data.form))};try{wx.setStorageSync('xuegu-quotes',[entry,...this.data.history].slice(0,30));this.refreshHistory();wx.showToast({title:'已保存'})}catch(e){wx.showToast({title:'保存失败，请检查存储空间',icon:'none'})}},
 restore(e){const entry=this.data.history.find(x=>x.id===Number(e.currentTarget.dataset.id));if(entry){this.setData({form:{supplementEnabled:false,supplementTrips:[newTrip()],transportType:'manual',outbound:'',outboundTime:'',inbound:'',wusongTime:'',wusongDate:'',wusongPackage:false,wusongHalf:'0',wusongFree:'0',yangcaoOptions:false,yangcaoPlan:0,nightReturn:false,yangcaoHorse:false,yangcaoSnow:0,yangcaoFree:'0',yangcaoSlide:false,...JSON.parse(JSON.stringify(entry.form))},result:null});this.setData({form:migrateDays({...this.data.form,items:ITEMS.map((item,index)=>this.data.form.items[index]||{...item,enabled:false,price:item.defaultPrice||'',mode:0})})});if(this.data.form.yangcaoSlideMode===undefined)this.setData({'form.yangcaoSlideMode':this.data.form.yangcaoSlide?1:0});this.setData({wusongTimeIndex:Math.max(0,this.data.wusongTimes.indexOf(this.data.form.wusongTime))});this.syncRoutes();this.syncSchedule();this.quote()}},
 reset(){this.setData({form:fresh(),result:null,wusongTimeIndex:0});this.syncRoutes();this.syncSchedule()},
 copyItinerary(){if(!this.quote())return;wx.setClipboardData({data:itineraryText(this.data.form,this.data.result,this.data.result.itinerary),fail:()=>wx.showToast({title:'复制失败',icon:'none'})})},
 poster(){
  if(!this.quote())return
  const r=this.data.result,f=this.data.form,render=[]
  const line=(text,size=19,gap=28)=>render.push({text,size,gap})
  const wrap=(text,size=17)=>{const chunks=String(text).match(/.{1,28}/g)||[''];chunks.forEach(chunk=>line(chunk,size,25))}
  line('雪谷小满客栈 · 专属行程',30,48)
  line('客户：'+(f.customer||'未填写').slice(0,20))
  line(f.people+'人 / '+f.nights+'晚',19,40)
  line('时间行程',24,38)
  r.itinerary.forEach(entry=>{line(entry.dateLabel+' '+entry.time,18,26);wrap(entry.title,21);wrap(entry.detail);line('',17,14)})
  line('费用明细',24,38)
  r.lines.filter(x=>x.enabled).forEach(entry=>{line(entry.name+'  ¥'+entry.amount,21,30);wrap(entry.detail||('¥'+entry.price+' × '+entry.qty+'（'+entry.unit+'）'));line('',17,12)})
  line('合计 ¥'+r.total,30,44);line('人均约 ¥'+r.perPerson,19,32)
  wrap('备注：'+(f.note||'费用以最终确认为准'))
  wrap('预计时间以路况及实际安排为准')
  const height=100+render.reduce((sum,row)=>sum+row.gap,0)
  this.setData({posterHeight:height},()=>{
   const ctx=wx.createCanvasContext('quoteCanvas',this);ctx.setFillStyle('#f4f5f7');ctx.fillRect(0,0,600,height);ctx.setFillStyle('#243f60');let y=55
   render.forEach(row=>{ctx.setFontSize(row.size);ctx.fillText(row.text,40,y);y+=row.gap})
   ctx.draw(false,()=>wx.canvasToTempFilePath({canvasId:'quoteCanvas',width:600,height,destWidth:600,destHeight:height,success:res=>wx.previewImage({urls:[res.tempFilePath]}),fail:()=>wx.showToast({title:'图片生成失败，可复制文字行程',icon:'none'})},this))
  })
 },
 onShareAppMessage(){return {title:'雪谷旅行 · 制作行程报价',path:'/pages/index/index'}}
})
