// 3章〜魔王の城の数字を決めるための戦いの計算機。いまの本体と同じ式（ダメージ＝攻撃−守り±1、会心、後列は狙われにくい、いやしの光…）に、設計中の特徴とジョブを足したもの
let seed=7; const R=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
// 冒険者をつくる。job, レベル, 転職したレベル, 武器の段階, 防具の段階
function mk(job,L,conv,wt,at,name){
  conv=Math.min(conv||L,L); let hp=24+3*(conv-1), atk=3+(conv-1), def=1, mag=0; const n=L-conv;
  if(job==='fighter'||!job){hp+=3*n; atk+=n;} if(job==='warrior'){hp+=5*n; atk+=n; def+=Math.floor(n/2);} if(job==='thief'){hp+=3*n; atk+=n;}
  if(job==='white'){hp+=3*n; mag=conv+n; def+=Math.floor(n/3);} if(job==='black'){hp+=2*n; mag=conv+2*n;}
  const mage=job==='white'||job==='black'; if(mage)mag+=Math.ceil(wt/2); else atk+=2*wt; def+=mage?Math.ceil(at/2):at; hp+=6*at;
  return {name:name||job,job:job||'fighter',L,hp,hpMax:hp,atk,def,mag,at,casts:mage?3+Math.floor(mag/6):0};
}
// 1回の戦い。P=冒険者の配列（コピーして使う）, m=魔物
function fight(P0,m,opt={}){
  const P=P0.map(a=>({...a})); let bodies=[]; const n=m.pack||1; for(let i=0;i<n;i++)bodies.push({hp:m.hp,atk:m.atk}); let adds=[];
  let kingIron=0; let round=0, magicHits=0, breakLeft=0, form2=false, guts={}, prayer=P.some(a=>a.job==='white'&&a.L>=14)?3:0; const cold=m.cold||0, start=P.reduce((t,a)=>t+a.hp,0);
  const alive=()=>P.filter(a=>!a.out), foe=()=>adds.find(b=>b.hp>0)||bodies.find(b=>b.hp>0);
  const mdef=()=>breakLeft>0?0:(form2&&m.form2?m.form2.def:m.def);
  while(round<60){ round++; const live=alive(); if(!live.length)break; if(!foe())break;
    const strike=()=>{ for(const a of alive()){ const f=foe(); if(!f)break;
        if(a.job==='white'&&a.casts>0){const t=alive().filter(x=>x.hp<x.hpMax*.5).sort((x,y)=>x.hp/x.hpMax-y.hp/y.hpMax)[0]; if(t){a.casts--; t.hp=Math.min(t.hpMax,t.hp+a.mag*3); continue;}}
        if(a.job==='black'&&a.casts>0&&(opt.magic!==false)){ a.casts--; magicHits++; let d=Math.round(a.mag*1.5*((m.hard||m.iron)&&a.L>=8?1.5:1));
          if(a.L>=14&&(bodies.filter(b=>b.hp>0).length+adds.filter(b=>b.hp>0).length)>1){for(const b of [...bodies,...adds])if(b.hp>0)b.hp-=a.mag;} else f.hp-=d;
          if(m.iron&&magicHits>=3){magicHits=0; breakLeft=3;} continue; }
        const base=a.job==='white'||a.job==='black'?Math.max(2,Math.floor(a.L/2)):a.atk, crit=R()<.06;
        let d=crit?base*2:Math.max(1,base-mdef()+Math.floor(R()*3)-1);
        if(a.job==='warrior'&&a.L>=8&&round%3===0)d=Math.max(d,Math.round((base-mdef()/2)*1.5));
        const ghost=f===adds.find(b=>b.hp>0)?false:(form2&&m.form2?m.form2.ghost:m.ghost); if(ghost)d=Math.ceil(d/2);
        if((m.iron&&breakLeft<=0)||kingIron>0)d=1;
        f.hp-=d; if(m.leech&&f.hp>0){} } };
    const bite=()=>{ const att=[...bodies.filter(b=>b.hp>0).flatMap(b=>Array(m.hits||1).fill(b)),...adds.filter(b=>b.hp>0)]; for(const b of att){ const L=alive(); if(!L.length)break;
        const wt=x=>(x.job==='white'||x.job==='black')&&L.length>1?.43:1; let pick=R()*L.reduce((t,x)=>t+wt(x),0), a=L[0]; for(const x of L){pick-=wt(x); if(pick<0){a=x;break;}}
        if((m.snipe||(m.addSnipe&&adds.includes(b)))&&L.length>1){const back=L.filter(x=>x.job==='white'||x.job==='black'); if(back.length&&R()<.6)a=back[Math.floor(R()*back.length)];}
        let def=a.def+(prayer>0?2:0); const w=L.find(x=>x.job==='warrior'); if(w&&w!==a&&R()<.7){a=w; def=Math.round(w.def*1.5)+(prayer>0?2:0);}
        let d=Math.max(1,b.atk-def+Math.floor(R()*3)-1); a.hp-=d; if(m.leech)b.hp=Math.min(m.hp,b.hp+Math.ceil(d/2)); } };
    if(m.swift){bite(); strike();} else {strike(); bite();}
    if(!foe())break;
    // 場の効き目：毒の沼（白魔道士Lv8で打ち消す）、冷気（防具の段階3つごとに1やわらぐ）、ふぶき、再生、手下を呼ぶ、姿が変わる
    if(m.aura&&!alive().some(x=>x.job==='white'&&x.L>=8))for(const a of alive())a.hp-=m.aura;
    if(cold)for(const a of alive())a.hp-=Math.max(0,cold*(m.blizzard&&round%3===0?2:1)-Math.floor(a.at/3)-(opt.charm?2:0));
    if(m.blizzard&&round%3===0)for(const a of alive())a.hp-=Math.max(1,Math.round(m.atk*.6)-a.def);
    if(m.regen){const b=bodies.find(b=>b.hp>0); if(b&&(!m.form2||form2))b.hp=Math.min(m.hp,b.hp+m.regen);}
    if(m.summon&&round%3===0&&adds.filter(b=>b.hp>0).length<3)adds.push({hp:m.summon.hp,atk:m.summon.atk});
    if(m.form2&&!form2&&bodies[0].hp<=m.hp/2)form2=true;
    if(m.king&&round%3===0){const k=(round/3-1)%3; if(k===0){if(!alive().some(x=>x.job==='white'&&x.L>=8))for(const a of alive())a.hp-=12;} else if(k===1){for(const a of alive())a.hp-=Math.max(1,Math.round(m.atk*.6)-a.def)+Math.max(0,6-Math.floor(a.at/3));} else kingIron=2;}
    if(kingIron>0)kingIron--; if(breakLeft>0)breakLeft--; if(prayer>0)prayer--;
    for(const a of alive()){ if(a.hp<=0){ if(a.job==='warrior'&&a.L>=14&&!guts[a.name]){guts[a.name]=1; a.hp=1;} else {a.out=true; a.ko=true;} } else if(a.hp<=a.hpMax*(m.boss?.18:.3)&&!(opt.noFlee)){a.out=true;} }
  }
  const win=!foe(); const lost=P.reduce((t,a)=>t+(a.hpMax-Math.max(0,a.hp)),0)-P0.reduce((t,a)=>t+(a.hpMax-a.hp),0);
  return {win,round,loss:lost/P.reduce((t,a)=>t+a.hpMax,0),ko:P.filter(a=>a.ko).length};
}
function trial(P,m,opt,n=600){let w=0,r=0,l=0,k=0; for(let i=0;i<n;i++){const f=fight(P,m,opt); if(f.win){w++; r+=f.round; l+=f.loss;} k+=f.ko;} return {win:w/n,rounds:w?r/w:0,loss:w?l/w:0,ko:k/n};}
module.exports={mk,fight,trial};
