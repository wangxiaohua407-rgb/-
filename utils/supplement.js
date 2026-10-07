const SUPPLEMENT_ROUTES=['雪谷 → 雪乡','雪乡 → 雪谷（包车）','其他用车']
let sequence=0
function newTrip(){return {id:Date.now()+'-'+(++sequence),route:0,label:'',mode:0,price:'',people:'',day:0,time:''}}
function tripLabel(trip){return Number(trip.route)===2?(String(trip.label||'').trim()||'其他用车'):SUPPLEMENT_ROUTES[Number(trip.route)]}
module.exports={SUPPLEMENT_ROUTES,newTrip,tripLabel}
