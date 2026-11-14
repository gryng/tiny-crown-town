const {mk,trial}=require('./calc.js'); const f=x=>(x*100).toFixed(0)+'%';
// 章ごとの目安の冒険者（章の始め／なかば／終わり）。[レベル, 武器, 防具]
const REF={3:[[12,5,5],[14,6,6],[17,7,7]],4:[[17,7,7],[19,8,7],[21,8,8]],5:[[21,8,8],[23,9,8],[26,9,9]],6:[[26,9,9],[28,9,9],[30,9,9]],7:[[30,9,9],[31,9,9],[32,9,9]]};
const CONV={warrior:12,white:5,black:14,thief:18};
const H=(ch,i,job='fighter')=>{const [L,w,a]=REF[ch][i]; return mk(job,L,CONV[job]||L,w,a,job+ch+i);};
const party=(ch,i,jobs)=>jobs.map((j,k)=>({...H(ch,i,j),name:j+k}));
const A={
 3:{name:'古い街道',road:[
   {n:'野犬',hp:20,atk:11,def:2,pack:3,xp:18},{n:'追いはぎ',hp:58,atk:12,def:5,steal:1,xp:20},{n:'大ガラス',hp:40,atk:13,def:3,swift:1,steal:1,xp:20},{n:'石像',hp:64,atk:11,def:11,hard:1,xp:22}],
  masters:[{n:'野犬の頭',hp:90,atk:21,def:4,pack:3,xp:90},{n:'見張りの石像',hp:320,atk:23,def:13,hard:1,xp:100,hits:2}],
  boss:{n:'盗賊の頭',hp:580,atk:25,def:7,boss:1,hits:2,summon:{hp:66,atk:22},addSnipe:1,xp:200}},
 4:{name:'雪の山',road:[
   {n:'雪オオカミ',hp:36,atk:14,def:4,pack:2,swift:1,xp:20},{n:'氷の精',hp:56,atk:14,def:3,ghost:1,cold:2,xp:22},{n:'雪男',hp:120,atk:16,def:7,xp:22},{n:'氷ガメ',hp:90,atk:14,def:16,hard:1,cold:2,xp:24}],
  masters:[{n:'雪男の長',hp:420,atk:26,def:8,regen:12,xp:130,hits:2},{n:'氷の女王の影',hp:320,atk:24,def:6,ghost:1,cold:5,xp:140,hits:2}],
  boss:{n:'雪山の主',hp:840,atk:29,def:9,boss:1,hits:2,cold:5,blizzard:1,xp:280}},
 5:{name:'峠の砦',road:[
   {n:'よろいの兵',hp:100,atk:17,def:22,hard:1,xp:26},{n:'さまよう鎧',hp:80,atk:17,def:12,ghost:1,hard:1,xp:26},{n:'砦のコウモリ',hp:70,atk:17,def:5,swift:1,leech:1,xp:24},{n:'弓の亡霊',hp:70,atk:18,def:4,ghost:1,snipe:1,xp:28}],
  masters:[{n:'門番の鎧',hp:560,atk:30,def:28,hard:1,xp:170,hits:2},{n:'亡霊の隊長',hp:230,atk:27,def:8,ghost:1,pack:3,xp:180}],
  boss:{n:'砦の将軍',hp:1300,atk:36,def:22,boss:1,iron:1,hits:2,snipe:1,xp:360}},
 6:{name:'眠りの荒れ地',road:[
   {n:'眠りの霧',hp:110,atk:19,def:6,ghost:1,cold:2,xp:30},{n:'大サソリ',hp:150,atk:21,def:18,hard:1,poison:1,xp:32},{n:'魔王の手下',hp:80,atk:19,def:9,pack:2,steal:1,xp:28},{n:'時を食う虫',hp:130,atk:20,def:8,leech:1,regen:6,xp:30}],
  masters:[{n:'三つ首の番犬',hp:340,atk:38,def:11,pack:3,swift:1,xp:220},{n:'時計塔の亡霊',hp:540,atk:33,def:10,ghost:1,regen:16,xp:230,hits:2}],
  boss:{n:'荒れ地の番人',hp:1600,atk:50,def:24,boss:1,hard:1,hits:2,snipe:1,regen:48,form2:{def:10,ghost:false},xp:460}},
};
const CASTLE={pillars:[
  {n:'毒の柱の番人',hp:700,atk:34,def:12,hits:2,aura:8,xp:300},
  {n:'氷の柱の番人',hp:700,atk:34,def:12,hits:2,cold:7,ghost:1,xp:300},
  {n:'鉄の柱の番人',hp:900,atk:36,def:24,hits:2,iron:1,xp:300}],
 king:left=>({n:'魔王',hp:Math.round(2000*Math.pow(1.2,left)),atk:42,def:16,boss:1,hits:2,king:1,regen:left*8,xp:1000})};
module.exports={A,REF,H,party,CONV,CASTLE};
if(require.main===module){
 const row=(t,P,m,o)=>{const r=trial(P,m,o,400); return `${t} ${f(r.win).padStart(4)} ${r.rounds.toFixed(0).padStart(2)}R`;};
 const C=(ch,i,j)=>party(ch,i,j), only=process.argv[2];
 for(const ch of [3,4,5,6]){ if(only&&+only!==ch)continue; const a=A[ch]; console.log(`\n== ${ch}章 ${a.name}`);
  for(const m of [...a.masters,a.boss])console.log((m.boss?' 親':' 主')+m.n.padEnd(8),row('終1人',[H(ch,2)],m),'|',row('戦戦戦半',C(ch,1,['fighter','fighter','fighter']),m),'|',row('戦戦白半',C(ch,1,['fighter','fighter','white']),m),'|',row('戦戦白終',C(ch,2,['fighter','fighter','white']),m),'|',row('戦士戦白半',C(ch,1,['warrior','fighter','white']),m),'|',row('戦士戦白終',C(ch,2,['warrior','fighter','white']),m),'|',row('戦黒白終',C(ch,2,['fighter','black','white']),m),'|',row('戦士黒白半',C(ch,1,['warrior','black','white']),m),'|',row('戦士黒白終',C(ch,2,['warrior','black','white']),m));
 }
}

// ---- ここから下は、実装するときにそのまま index.html の NODES / EDGES / AREAS へ写せる形のデータ ----
// 章ごとの決まり。min:そのエリアで戦える目安のレベル（腕前に合ったエリアの判定に使う） cap:冒険者の上限 stock:店に入荷できる段階 board:立て札の枚数 carps:大工の上限
const CHAPTERS=[
 {ch:1,area:'西の洞窟',min:1,cap:3,stock:4,board:3,carps:1,masterElem:30,days:13,unlock:[]},
 {ch:2,area:'北の湿地',min:5,cap:5,stock:6,board:4,carps:2,masterElem:45,days:12,unlock:['酒場','白魔法の学院']},
 {ch:3,area:'古い街道',min:10,cap:6,stock:7,board:5,carps:3,masterElem:60,days:13,unlock:['訓練場（戦士）','道具屋（お守り）']},
 {ch:4,area:'雪の山',min:15,cap:7,stock:8,board:5,carps:3,masterElem:80,days:13,unlock:['黒魔法の学院','湯屋']},
 {ch:5,area:'峠の砦',min:19,cap:8,stock:9,board:6,carps:3,masterElem:100,days:14,unlock:['遊技場（盗賊）']},
 {ch:6,area:'眠りの荒れ地',min:24,cap:8,stock:9,board:6,carps:3,masterElem:120,days:14,unlock:['鐘楼']},
 {ch:7,area:'魔王の城',min:28,cap:8,stock:9,board:6,carps:3,masterElem:150,days:5,unlock:[]},
];
// 地図。len:ターン（1ターン5分） risk:1ターンあたり魔物に出会う割合 cut:近道（clue の部屋で手がかりを見つけ、依頼「近道を切り開け」で開く）
const MAPS={
 3:{zones:{road:[['野犬',.4],['追いはぎ',.35],['大ガラス',.25]],ruins:[['追いはぎ',.3],['石像',.3],['大ガラス',.2],['野犬',.2]]},
  nodes:{k0:{n:'街道の入口'},kinn:{n:'宿場の跡',rest:true},k1:{n:'見張り台',room:true,rich:.8,master:'見張りの石像',chest:160,clue:'cutA'},k2:{n:'石の橋',room:true,rich:1,chest:120,clue:'cutB'},
   k3:{n:'野営地',room:true,rich:1.4,master:'野犬の頭',chest:180},k4:{n:'関所の跡',room:true,rich:1.8,chest:200,clue:'cutC'},kboss:{n:'盗賊のねぐら',boss:true}},
  edges:[['gate','k0',12,.16,'road'],['k0','kinn',4,.12,'road'],['k0','k1',10,.24,'road'],['k1','k2',10,.26,'road'],['k2','k3',9,.28,'ruins'],['k3','k4',9,.3,'ruins'],['k4','kboss',4,0,'ruins','bossWay'],
   ['kinn','k2',6,.2,'road','cutA'],['k0','k3',8,.22,'ruins','cutC'],['k2','k4',5,.26,'ruins','cutB']]},
 4:{zones:{snow:[['雪オオカミ',.4],['氷の精',.3],['雪男',.3]],ice:[['氷ガメ',.3],['氷の精',.3],['雪男',.25],['雪オオカミ',.15]]},
  nodes:{y0:{n:'登山口'},yhut:{n:'山小屋',rest:true,needs:'薪'},y1:{n:'氷の洞',room:true,rich:.9,master:'雪男の長',chest:220},y2:{n:'凍った滝',room:true,rich:1.2,chest:200,clue:'cutA'},
   y3:{n:'見晴らしの尾根',room:true,rich:1.8,master:'氷の女王の影',chest:260},yboss:{n:'山頂',boss:true}},
  edges:[['gate','y0',14,.16,'snow'],['y0','yhut',6,.14,'snow','cold'],['y0','y1',8,.24,'snow','cold'],['y1','y2',8,.26,'ice','cold'],['y2','y3',9,.3,'ice','cold'],['y3','yboss',4,0,'ice','bossWay'],['yhut','y2',7,.22,'ice','cutA']]},
 5:{zones:{yard:[['よろいの兵',.35],['砦のコウモリ',.35],['弓の亡霊',.3]],keep:[['さまよう鎧',.35],['よろいの兵',.25],['弓の亡霊',.25],['砦のコウモリ',.15]]},
  nodes:{t0:{n:'砦のふもと'},tcamp:{n:'古い陣地',rest:true},t1:{n:'外門',room:true,rich:.9,master:'門番の鎧',chest:260},t2:{n:'武器庫',room:true,rich:1.2,chest:300,gear:9},
   t3:{n:'中庭',room:true,rich:1.5,master:'亡霊の隊長',chest:280},t4:{n:'塔の階段',room:true,rich:1.8,chest:240,clue:'cutA'},tboss:{n:'将軍の間',boss:true}},
  edges:[['gate','t0',14,.16,'yard'],['t0','tcamp',4,.12,'yard'],['t0','t1',8,.24,'yard'],['t1','t2',6,.26,'keep'],['t1','t3',8,.28,'keep'],['t3','t4',6,.3,'keep'],['t4','tboss',3,0,'keep','bossWay'],['tcamp','t3',9,.24,'keep','cutA']]},
 6:{zones:{waste:[['魔王の手下',.35],['大サソリ',.35],['時を食う虫',.3]],mist:[['眠りの霧',.4],['時を食う虫',.3],['魔王の手下',.3]]},
  nodes:{a0:{n:'荒れ地の入口'},aoasis:{n:'眠りの泉',rest:true},a1:{n:'砂の遺跡',room:true,rich:.9,master:'三つ首の番犬',chest:320},a2:{n:'止まった市場',room:true,rich:1.3,chest:360,clue:'cutA'},
   a3:{n:'時計塔',room:true,rich:1.6,master:'時計塔の亡霊',chest:400},a4:{n:'霧の谷',room:true,rich:1.9,chest:340},aboss:{n:'番人の門',boss:true}},
  edges:[['gate','a0',14,.16,'waste'],['a0','aoasis',5,.12,'waste'],['a0','a1',9,.24,'waste'],['a1','a2',7,.26,'waste'],['a2','a3',9,.28,'mist'],['a2','a4',8,.3,'mist'],['a3','a4',6,.3,'mist'],['a4','aboss',5,0,'mist','bossWay'],['aoasis','a2',8,.24,'waste','cutA']]},
 7:{zones:{castle:[['魔王の手下',.4],['さまよう鎧',.3],['眠りの霧',.3]]},
  nodes:{c0:{n:'城門前',rest:true},c1:{n:'毒の柱の間',room:true,master:'毒の柱の番人'},c2:{n:'氷の柱の間',room:true,master:'氷の柱の番人'},c3:{n:'鉄の柱の間',room:true,master:'鉄の柱の番人'},cthrone:{n:'魔王の間',boss:true}},
  edges:[['gate','c0',16,.18,'castle'],['c0','c1',6,.26,'castle'],['c0','c2',6,.26,'castle'],['c0','c3',6,.26,'castle'],['c0','cthrone',8,0,'castle','bossWay']]},
};
module.exports.CHAPTERS=CHAPTERS; module.exports.MAPS=MAPS;
