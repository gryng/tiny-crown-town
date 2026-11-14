// 計算機が、いまの1章・2章の実測と合うかを確かめる
const {mk,trial}=require('./calc.js'); const f=x=>(x*100).toFixed(0)+'%';
const show=(t,P,m,o)=>{const r=trial(P,m,o); console.log(t.padEnd(34),'勝率',f(r.win).padStart(4),'ラウンド',r.rounds.toFixed(1).padStart(4),'失う体力',f(r.loss).padStart(4));};
const h6=mk('fighter',6,6,3,2), h9=mk('fighter',9,9,4,4), h12=mk('fighter',12,12,5,4), w10=mk('white',10,5,4,4);
show('1章 岩トカゲ vs Lv6',[h6],{hp:22,atk:7,def:3});
show('1章 岩トカゲの長 vs Lv6',[h6],{hp:34,atk:7,def:3});
show('1章 親玉 vs Lv6ひとり',[h6],{hp:84,atk:10,def:4,boss:true});
show('1章 親玉 vs Lv6ふたり',[h6,mk('fighter',6,6,3,2)],{hp:84,atk:10,def:4,boss:true});
show('2章 沼ガエル vs Lv9',[h9],{hp:30,atk:10,def:3});
show('2章 大ガエル(主) vs Lv9ひとり',[h9],{hp:100,atk:13,def:4});
show('2章 大ガエル(主) vs 3人',[h9,mk('fighter',9,9,4,4),w10],{hp:100,atk:13,def:4});
show('2章 沼の主 vs Lv12ひとり',[h12],{hp:210,atk:16,def:6,aura:4,boss:true});
show('2章 沼の主 vs Lv12×2+白',[h12,mk('fighter',12,12,5,4),w10],{hp:210,atk:16,def:6,aura:4,boss:true});
