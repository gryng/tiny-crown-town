const {mk,trial}=require('./calc.js'); const {A,REF,H,party,CASTLE}=require('./design.js'); const f=x=>(x*100).toFixed(0)+'%';
const W=(P,m,o)=>{const r=trial(P,m,o,600); return f(r.win)+(r.win?`(${r.rounds.toFixed(0)}R)`:'');};
console.log('## 別の答え');
// 3章の親玉：戦士なしでどこまで行けるか
const b3=A[3].boss; console.log('盗賊の頭: 戦戦白 終',W(party(3,2,['fighter','fighter','white']),b3),'| 戦士戦白 終',W(party(3,2,['warrior','fighter','white']),b3),'| 戦戦白 Lv19装備7',W([mk('fighter',19,19,7,7,'a'),mk('fighter',19,19,7,7,'b'),mk('white',19,5,7,7,'w')],b3),'| 戦士戦白 なかば+1(Lv15,装備7)',W([mk('warrior',15,12,7,7,'a'),mk('fighter',15,15,7,7,'b'),mk('white',15,5,7,7,'w')],b3));
// 4章の親玉：防具の段階とお守り
const b4=A[4].boss; for(const at of [6,7,8]){const P=[mk('fighter',21,21,8,at,'a'),mk('fighter',21,21,8,at,'b'),mk('white',21,5,8,at,'w')]; console.log(`雪山の主: 戦戦白 Lv21 防具${at}`,W(P,b4),'| お守りあり',W(P,b4,{charm:1}));}
console.log('雪山の主: 戦士戦白 防具7',W([mk('warrior',21,12,8,7,'a'),mk('fighter',21,21,8,7,'b'),mk('white',21,5,8,7,'w')],b4),'| 戦黒白 防具8',W(party(4,2,['fighter','black','white']),b4));
const b5=A[5].boss; console.log('砦の将軍: 戦士黒白 終',W(party(5,2,['warrior','black','white']),b5),'| 戦黒白 終',W(party(5,2,['fighter','black','white']),b5),'| 黒黒白 終',W(party(5,2,['black','black','white']),b5),'| 戦士黒白 なかば',W(party(5,1,['warrior','black','white']),b5),'| 戦士戦白',W(party(5,2,['warrior','fighter','white']),b5));
const b6=A[6].boss; console.log('荒れ地の番人: 戦士黒白 終',W(party(6,2,['warrior','black','white']),b6),'| 戦士戦白',W(party(6,2,['warrior','fighter','white']),b6),'| 戦黒白',W(party(6,2,['fighter','black','white']),b6),'| 戦士黒白 なかば',W(party(6,1,['warrior','black','white']),b6));
console.log('\n## 魔王の城（Lv32・装備9）');
const best=party(7,2,['warrior','black','white']), fw=party(7,2,['warrior','fighter','white']), fbw=party(7,2,['fighter','black','white']), ffw=party(7,2,['fighter','fighter','white']);
for(const p of CASTLE.pillars)console.log(p.n,'戦士黒白',W(best,p),'| 戦士戦白',W(fw,p),'| 戦黒白',W(fbw,p),'| 戦戦白',W(ffw,p),'| 戦戦戦',W(party(7,2,['fighter','fighter','fighter']),p));
for(const left of [0,1,2,3])console.log(`魔王（柱の残り${left}） 体力${CASTLE.king(left).hp}`,'戦士黒白',W(best,CASTLE.king(left)),'| 戦士戦白',W(fw,CASTLE.king(left)),'| 戦黒白',W(fbw,CASTLE.king(left)),'| Lv30',W(party(7,0,['warrior','black','white']),CASTLE.king(left)));
console.log('\n## 道の魔物（ひとり）と目安の冒険者');
for(const ch of [3,4,5,6]){const a=A[ch], s=H(ch,0), e=H(ch,2); console.log(`${ch}章 始めLv${s.L} 攻${s.atk} 守${s.def} 体${s.hp} / 終わりLv${e.L} 攻${e.atk} 守${e.def} 体${e.hp}`);
 for(const m of a.road){const r0=trial([s],m,{},500), r1=trial([e],m,{},500); console.log('  ',m.n,`体${m.hp} 攻${m.atk} 守${m.def}`,`始め ${r0.rounds.toFixed(1)}R -${f(r0.loss)}`,`終わり ${r1.rounds.toFixed(1)}R -${f(r1.loss)}`);}}
console.log('\n## レベルの見込み（1日5勝として）');
let xp=12.5*12*11; const days={3:13,4:13,5:14,6:14}; for(const ch of [3,4,5,6]){const a=A[ch], avg=a.road.reduce((t,m)=>t+m.xp,0)/4; xp+=days[ch]*5*avg*1.1+a.masters.reduce((t,m)=>t+m.xp,0)+a.boss.xp; const L=Math.floor((1+Math.sqrt(1+4*xp/12.5))/2); console.log(`${ch}章の終わり 経験値${Math.round(xp)} → Lv${L}（目安Lv${REF[ch][2][0]}） 道の魔物の経験値 平均${avg}`);}
