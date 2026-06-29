import React, { useState, useEffect, useMemo, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ============================================================
//  EXERCISE LIBRARY  (start = estimated working weight, inc = +lbs on success)
// ============================================================
const EXERCISES = {
  bench:{name:"Barbell Bench Press",type:"barbell",start:115,inc:5},
  inclineDB:{name:"Incline DB Press",type:"dumbbell",start:40,inc:5},
  ohp:{name:"Overhead Press",type:"barbell",start:75,inc:5},
  latRaise:{name:"Lateral Raises",type:"dumbbell",start:15,inc:5},
  tricepPush:{name:"Tricep Pushdown",type:"cable",start:40,inc:5},
  facePull:{name:"Face Pulls",type:"cable",start:30,inc:5},
  skullCrusher:{name:"Skull Crushers",type:"barbell",start:40,inc:5},
  cableTricep:{name:"Cable Tricep Ext.",type:"cable",start:35,inc:5},
  cableFly:{name:"Cable Fly",type:"cable",start:25,inc:5},
  tricepDip:{name:"Tricep Dips",type:"bodyweight",start:0,inc:0},
  latPulldown:{name:"Lat Pulldown",type:"machine",start:100,inc:5},
  cableRow:{name:"Seated Cable Row",type:"machine",start:100,inc:5},
  dbRow:{name:"DB Bent-Over Row",type:"dumbbell",start:50,inc:5},
  rearDelt:{name:"Rear Delt Fly",type:"dumbbell",start:15,inc:5},
  bbCurl:{name:"Barbell Curl",type:"barbell",start:45,inc:5},
  hammerCurl:{name:"Hammer Curl",type:"dumbbell",start:25,inc:5},
  pullup:{name:"Pull-Ups",type:"bodyweight",start:0,inc:0},
  weightedPull:{name:"Weighted Pull-Ups",type:"bodyweight",start:0,inc:5},
  bbRow:{name:"Barbell Row",type:"barbell",start:95,inc:5},
  preacherCurl:{name:"Preacher Curl",type:"machine",start:50,inc:5},
  inclineCurl:{name:"Incline DB Curl",type:"dumbbell",start:20,inc:5},
  squat:{name:"Barbell Back Squat",type:"barbell",start:135,inc:10},
  legPress:{name:"Leg Press",type:"machine",start:180,inc:10},
  walkingLunge:{name:"Walking Lunges",type:"dumbbell",start:25,inc:5},
  legExt:{name:"Leg Extension",type:"machine",start:70,inc:5},
  calfRaise:{name:"Standing Calf Raise",type:"machine",start:90,inc:10},
  seatedCalf:{name:"Seated Calf Raise",type:"machine",start:70,inc:10},
  bulgarian:{name:"Bulgarian Split Squat",type:"dumbbell",start:25,inc:5},
  gobletSquat:{name:"Goblet Squat",type:"dumbbell",start:45,inc:5},
  stepUp:{name:"Step-Ups",type:"dumbbell",start:20,inc:5},
  deadlift:{name:"Conventional Deadlift",type:"barbell",start:155,inc:10},
  rdl:{name:"Romanian Deadlift",type:"barbell",start:115,inc:10},
  hipThrust:{name:"Barbell Hip Thrust",type:"barbell",start:135,inc:10},
  legCurl:{name:"Leg Curl (machine)",type:"machine",start:70,inc:5},
  reverseLunge:{name:"Reverse Lunge",type:"dumbbell",start:25,inc:5},
  plank:{name:"Plank",type:"bodyweight",start:0,inc:0},
  deadBug:{name:"Dead Bug",type:"bodyweight",start:0,inc:0},
  sidePlank:{name:"Side Plank",type:"bodyweight",start:0,inc:0},
  abWheel:{name:"Ab Wheel Rollout",type:"bodyweight",start:0,inc:0},
  pallof:{name:"Pallof Press",type:"cable",start:25,inc:5},
  hangingLeg:{name:"Hanging Leg Raise",type:"bodyweight",start:0,inc:0},
  coreCircuit:{name:"Core Circuit",type:"bodyweight",start:0,inc:0},
  // ---- Home-friendly additions (basement gym) ----
  kbSwing:{name:"Kettlebell Swing",type:"kettlebell",start:53,inc:9},
  kbGoblet:{name:"KB Goblet Squat",type:"kettlebell",start:53,inc:9},
  dbCurl:{name:"DB Curl",type:"dumbbell",start:25,inc:5},
  curlBarCurl:{name:"EZ-Bar Curl",type:"barbell",start:45,inc:5},
  dbOhp:{name:"DB Shoulder Press",type:"dumbbell",start:40,inc:5},
  dbRDL:{name:"DB Romanian Deadlift",type:"dumbbell",start:50,inc:5},
  dbLunge:{name:"DB Reverse Lunge",type:"dumbbell",start:30,inc:5},
  chinup:{name:"Chin-Ups",type:"bodyweight",start:0,inc:0},
  pushup:{name:"Push-Ups",type:"bodyweight",start:0,inc:0},
  dbFloorPress:{name:"DB Floor Press",type:"dumbbell",start:50,inc:5},
  calfRaiseDB:{name:"DB Calf Raise",type:"dumbbell",start:40,inc:5},
};
const ex=(k,s,r,l)=>({ex:k,sets:s,reps:r,repLabel:l||String(r)});

// ============================================================
//  PROGRAM
// ============================================================
const RAW_PROGRAM={
  meta:{name:"Mat's EDGE Program",weeks:12,bodyweight:194,goals:{bench:194,squat:240,deadlift:290,ohp:120}},
  phases:[
    {id:0,name:"Foundation",weeks:"1–4",accent:"Build movement patterns. Moderate weight, perfect form.",weekList:[
      {week:1,deload:false,days:[
        {name:"Mon",loc:"home",focus:"Lower — Squat",type:"lower",cardio:"Basement rower or assault bike: 25 min easy Zone 2.",exercises:[ex("squat",3,10),ex("dbRDL",3,10),ex("dbLunge",3,10,"10/leg"),ex("kbSwing",3,15),ex("calfRaiseDB",4,15),ex("plank",3,45,"45s")]},
        {name:"Tue",loc:"gym",focus:"Pull Focus",type:"upper",exercises:[ex("latPulldown",3,10),ex("cableRow",3,12),ex("dbRow",3,10,"10/side"),ex("rearDelt",3,15),ex("preacherCurl",3,12),ex("facePull",3,15)]},
        {name:"Thu",loc:"home",focus:"Push Focus",type:"upper",exercises:[ex("bench",3,10),ex("dbOhp",3,10),ex("inclineDB",3,12),ex("pushup",3,12),ex("latRaise",3,15),ex("curlBarCurl",3,12)]},
        {name:"Fri",loc:"gym",focus:"Lower — Machines",type:"lower",exercises:[ex("legPress",3,12),ex("legCurl",3,12),ex("legExt",3,12),ex("hipThrust",3,12),ex("seatedCalf",4,15),ex("hangingLeg",3,12)]},
      ]},
      {week:2,deload:false,sameAs:1,progressNote:"Add weight where Week 1 hit all reps at RPE 6."},
      {week:3,deload:false,progressNote:"Volume bump — 4 sets on main lifts. Deadlift introduced at home.",days:[
        {name:"Mon",loc:"home",focus:"Lower — Deadlift",type:"lower",exercises:[ex("deadlift",3,6),ex("squat",4,8),ex("dbLunge",3,12,"12/leg"),ex("kbSwing",3,20),ex("calfRaiseDB",4,15),ex("plank",3,60,"60s")]},
        {name:"Tue",loc:"gym",focus:"Pull — Volume",type:"upper",exercises:[ex("latPulldown",4,8),ex("cableRow",3,10),ex("dbRow",3,10,"10/side"),ex("rearDelt",4,12),ex("preacherCurl",3,10),ex("facePull",3,15)]},
        {name:"Thu",loc:"home",focus:"Push — Volume",type:"upper",exercises:[ex("bench",4,8),ex("dbOhp",3,10),ex("inclineDB",3,10),ex("pullup",4,8),ex("latRaise",4,12),ex("skullCrusher",3,12)]},
        {name:"Fri",loc:"gym",focus:"Lower — Machines",type:"lower",exercises:[ex("legPress",4,10),ex("legCurl",3,12),ex("legExt",3,15),ex("hipThrust",3,12),ex("seatedCalf",4,15),ex("abWheel",3,8)]},
      ]},
      {week:4,deload:true,progressNote:"Deload — reduce weight 10–15%. Recovery is where you adapt.",days:[
        {name:"Mon",loc:"home",focus:"Deload Lower",type:"lower",exercises:[ex("kbGoblet",3,12),ex("dbRDL",3,10),ex("dbLunge",3,10,"10/leg"),ex("kbSwing",3,15),ex("calfRaiseDB",3,20),ex("plank",3,60,"60s")]},
        {name:"Tue",loc:"gym",focus:"Deload Pull",type:"upper",exercises:[ex("latPulldown",3,10),ex("cableRow",3,12),ex("dbRow",3,10,"10/side"),ex("rearDelt",3,15),ex("preacherCurl",3,12)]},
        {name:"Thu",loc:"home",focus:"Deload Push",type:"upper",exercises:[ex("bench",3,8),ex("dbOhp",3,10),ex("pushup",3,12),ex("latRaise",3,15),ex("curlBarCurl",3,12)]},
        {name:"Fri",loc:"gym",focus:"Deload Machines",type:"lower",exercises:[ex("legPress",3,12),ex("legCurl",3,12),ex("legExt",3,15),ex("seatedCalf",3,20),ex("coreCircuit",2,1,"2 rounds")]},
      ]},
    ]},
    {id:1,name:"Build",weeks:"5–8",accent:"Increase intensity. 4 sets, add weight weekly.",weekList:[
      {week:5,deload:false,progressNote:"4 sets, heavier. +5–10 lbs from end of Phase 1.",days:[
        {name:"Mon",loc:"home",focus:"Lower — Squat Heavy",type:"lower",cardio:"Rower: 30 min Zone 2 + Sat assault-bike HIIT 10×(30s/60s).",exercises:[ex("squat",4,8),ex("deadlift",4,5),ex("bulgarian",3,8,"8/leg"),ex("kbSwing",4,15),ex("calfRaiseDB",4,15),ex("abWheel",3,10)]},
        {name:"Tue",loc:"gym",focus:"Pull — Heavy",type:"upper",exercises:[ex("weightedPull",4,6),ex("latPulldown",3,10),ex("cableRow",4,10),ex("rearDelt",4,12),ex("preacherCurl",3,10),ex("facePull",4,15)]},
        {name:"Thu",loc:"home",focus:"Push — Heavy",type:"upper",exercises:[ex("bench",4,8),ex("dbOhp",4,8),ex("inclineDB",4,10),ex("pullup",4,8),ex("latRaise",4,12),ex("skullCrusher",3,10)]},
        {name:"Fri",loc:"gym",focus:"Lower — Machines",type:"lower",exercises:[ex("legPress",4,10),ex("legCurl",4,12),ex("legExt",3,12),ex("hipThrust",4,10),ex("seatedCalf",4,15),ex("pallof",3,10,"10/side")]},
      ]},
      {week:6,deload:false,sameAs:5,progressNote:"Add 5 lbs to all compounds."},
      {week:7,deload:false,sameAs:5,progressNote:"Add a set to accessories. Cardio: rower 5K continuous."},
      {week:8,deload:true,progressNote:"Deload — pull back 15%. Record rower 5K + 2000m time.",days:[
        {name:"Mon",loc:"home",focus:"Deload Lower",type:"lower",exercises:[ex("kbGoblet",3,12),ex("dbRDL",3,10),ex("dbLunge",3,10,"10/leg"),ex("kbSwing",3,15),ex("plank",3,60,"60s")]},
        {name:"Tue",loc:"gym",focus:"Deload Pull",type:"upper",exercises:[ex("latPulldown",3,10),ex("cableRow",3,12),ex("dbRow",3,10,"10/side"),ex("rearDelt",3,15),ex("preacherCurl",3,12)]},
        {name:"Thu",loc:"home",focus:"Deload Push",type:"upper",exercises:[ex("bench",3,8),ex("dbOhp",3,10),ex("pushup",3,12),ex("latRaise",3,15),ex("curlBarCurl",3,12)]},
        {name:"Fri",loc:"gym",focus:"Deload Machines",type:"lower",exercises:[ex("legPress",3,12),ex("legCurl",3,12),ex("legExt",3,15),ex("seatedCalf",3,20),ex("coreCircuit",2,1,"2 rounds")]},
      ]},
    ]},
    {id:2,name:"Peak",weeks:"9–12",accent:"Heaviest weights — 5×5 on big compounds.",weekList:[
      {week:9,deload:false,progressNote:"5×5 on big compounds. Leave 1 rep in the tank.",days:[
        {name:"Mon",loc:"home",focus:"Lower — Peak Squat",type:"lower",cardio:"Rower: 40 min Zone 2 + Sat assault-bike HIIT 15 rounds.",exercises:[ex("squat",5,5),ex("deadlift",5,3),ex("bulgarian",3,8,"8/leg"),ex("kbSwing",4,15),ex("calfRaiseDB",4,15),ex("hangingLeg",4,10)]},
        {name:"Tue",loc:"gym",focus:"Pull — Peak",type:"upper",exercises:[ex("weightedPull",5,5),ex("latPulldown",4,8),ex("cableRow",3,10),ex("facePull",4,15),ex("preacherCurl",4,8),ex("hammerCurl",3,12)]},
        {name:"Thu",loc:"home",focus:"Push — Peak",type:"upper",exercises:[ex("bench",5,5),ex("dbOhp",4,6),ex("inclineDB",3,8),ex("pullup",5,5),ex("latRaise",4,12),ex("skullCrusher",4,8)]},
        {name:"Fri",loc:"gym",focus:"Lower — Machines",type:"lower",exercises:[ex("legPress",4,8),ex("legCurl",4,10),ex("legExt",3,15),ex("hipThrust",4,10),ex("seatedCalf",4,15),ex("pallof",3,10,"10/side")]},
      ]},
      {week:10,deload:false,sameAs:9,progressNote:"Add 5 lbs to all 5×5 compounds."},
      {week:11,deload:false,sameAs:9,progressNote:"PR week. Attempt bench + squat PRs. Fastest rower 5K."},
      {week:12,deload:true,progressNote:"Final deload + test all lifts at 90%. Measure & compare to Day 1.",days:[
        {name:"Mon",loc:"home",focus:"Test Lower",type:"lower",exercises:[ex("squat",3,5),ex("deadlift",3,3),ex("kbSwing",3,15),ex("calfRaiseDB",3,15)]},
        {name:"Tue",loc:"gym",focus:"Test Pull",type:"upper",exercises:[ex("weightedPull",3,5),ex("latPulldown",3,8),ex("preacherCurl",3,10)]},
        {name:"Thu",loc:"home",focus:"Test Push",type:"upper",exercises:[ex("bench",3,5),ex("dbOhp",3,6),ex("latRaise",3,12)]},
        {name:"Fri",loc:"gym",focus:"Test Machines",type:"lower",exercises:[ex("legPress",3,10),ex("legCurl",3,12),ex("seatedCalf",3,15)]},
      ]},
    ]},
  ]
};
// resolve sameAs
const PROGRAM=(()=>{const p=JSON.parse(JSON.stringify(RAW_PROGRAM));p.phases.forEach(ph=>ph.weekList.forEach(wk=>{if(wk.sameAs){const ref=ph.weekList.find(w=>w.week===wk.sameAs);if(ref)wk.days=JSON.parse(JSON.stringify(ref.days));}}));return p;})();

// flat list of all (week,dayIndex) for navigation
const ALL_DAYS=[];
PROGRAM.phases.forEach(ph=>ph.weekList.forEach(wk=>wk.days.forEach((d,di)=>ALL_DAYS.push({phaseId:ph.id,week:wk.week,dayIndex:di,day:d,deload:wk.deload}))));

// ============================================================
//  PROGRESSION ENGINE
// ============================================================
function e1rm(w,r){return r>0?Math.round(w*(1+r/30)):0;}
// key for storing a logged session
const logKey=(week,dayIndex)=>`log:w${week}d${dayIndex}`;
// suggest weight for an exercise given its most recent logged session (or null)
function suggestWeight(exKey,lastLog){
  const e=EXERCISES[exKey];
  if(!lastLog||!lastLog.sets||lastLog.sets.length===0)return{weight:e.start,reason:"estimated start",isStart:true};
  const lastWeight=lastLog.sets[0]?.weight??e.start;
  const allHit=lastLog.sets.length>=lastLog.targetSets&&lastLog.sets.every(s=>(s.reps??0)>=lastLog.targetReps);
  if(e.type==="bodyweight"&&e.inc===0)
    return{weight:0,reason:allHit?"hit all — add reps":"build reps",isStart:false,bw:true};
  if(allHit)return{weight:lastWeight+e.inc,reason:`hit all reps · +${e.inc}`,isStart:false,up:true};
  return{weight:lastWeight,reason:"missed reps · repeat",isStart:false,hold:true};
}

// ============================================================
//  STORAGE HOOK  (browser localStorage — persists on this device)
// ============================================================
const LS_PREFIX="edge:";
function lsGet(key){try{const v=localStorage.getItem(LS_PREFIX+key);return v?JSON.parse(v):null;}catch(e){return null;}}
function lsSet(key,val){try{localStorage.setItem(LS_PREFIX+key,JSON.stringify(val));}catch(e){}}
function lsRemove(key){try{localStorage.removeItem(LS_PREFIX+key);}catch(e){}}
function lsAllKeys(){try{return Object.keys(localStorage).filter(k=>k.startsWith(LS_PREFIX)).map(k=>k.slice(LS_PREFIX.length));}catch(e){return [];}}

function useStore(){
  const [ready,setReady]=useState(false);
  const [logs,setLogs]=useState({});       // {logKey: session}
  const [overrides,setOverrides]=useState({}); // {exKey: weight}
  const [progress,setProgress]=useState({week:0});

  useEffect(()=>{
    try{
      const lg={};
      lsAllKeys().forEach(k=>{
        if(k.startsWith("log:")){const v=lsGet(k);if(v)lg[k]=v;}
      });
      setLogs(lg);
      const ov=lsGet("overrides");if(ov)setOverrides(ov);
      const pr=lsGet("progress");if(pr)setProgress(pr);
    }catch(e){/* localStorage unavailable: run in-memory */}
    setReady(true);
  },[]);

  const saveLog=useCallback((key,session)=>{
    setLogs(p=>({...p,[key]:session}));
    lsSet(key,session);
  },[]);
  const saveOverride=useCallback((exKey,weight)=>{
    setOverrides(p=>{const n={...p,[exKey]:weight};lsSet("overrides",n);return n;});
  },[]);
  const saveProgress=useCallback((pr)=>{
    setProgress(pr);lsSet("progress",pr);
  },[]);
  const resetAll=useCallback(()=>{
    lsAllKeys().forEach(k=>lsRemove(k));
    setLogs({});setOverrides({});setProgress({week:0});
  },[]);

  return{ready,logs,overrides,progress,saveLog,saveOverride,saveProgress,resetAll};
}

// most recent prior log for an exercise, scanning backwards from a given week/day
function findLastLog(logs,exKey,beforeWeek,beforeDayIndex){
  // search all logs that contain this exercise, pick the latest by (week,dayIndex) before current
  let best=null,bestRank=-1;
  Object.entries(logs).forEach(([k,sess])=>{
    if(!sess||!sess.exKey||sess.exKey!==exKey)return;
    const rank=sess.week*10+sess.dayIndex;
    const curRank=beforeWeek*10+beforeDayIndex;
    if(rank<curRank&&rank>bestRank){best=sess;bestRank=rank;}
  });
  return best;
}

// ============================================================
//  THEME
// ============================================================
const C={bg:"#0f1117",surface:"#181b24",card:"#1e2130",border:"#2a2f42",orange:"#f4651a",orangeDim:"rgba(244,101,26,0.1)",orangeMid:"rgba(244,101,26,0.33)",text:"#e8eaf0",muted:"#8891aa",upper:"#a5b4fc",upperDim:"rgba(99,102,241,0.13)",lower:"#f4651a",green:"#22c55e",greenDim:"rgba(34,197,94,0.1)"};
const F={head:"'Barlow Condensed',sans-serif",body:"'Inter',sans-serif"};

// ============================================================
//  APP
// ============================================================
export default function App(){
  const store=useStore();
  const [tab,setTab]=useState("train"); // train | progress | settings
  const [navWeek,setNavWeek]=useState(1);
  const [navDay,setNavDay]=useState(0);

  // inject fonts once
  useEffect(()=>{
    const id="edge-fonts";
    if(!document.getElementById(id)){
      const l=document.createElement("link");l.id=id;l.rel="stylesheet";
      l.href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;900&family=Inter:wght@400;500;600&display=swap";
      document.head.appendChild(l);
    }
  },[]);

  if(!store.ready){
    return <div style={{background:C.bg,color:C.muted,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.body}}>Loading your program…</div>;
  }

  return (
    <div style={{background:C.bg,color:C.text,minHeight:"100vh",fontFamily:F.body,paddingBottom:72}}>
      <Header/>
      {tab==="train"&&<TrainTab store={store} navWeek={navWeek} navDay={navDay} setNavWeek={setNavWeek} setNavDay={setNavDay}/>}
      {tab==="progress"&&<ProgressTab store={store}/>}
      {tab==="settings"&&<SettingsTab store={store}/>}
      <BottomNav tab={tab} setTab={setTab}/>
    </div>
  );
}

function Header(){
  return (
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
      <div style={{fontFamily:F.head,fontWeight:900,fontSize:20,letterSpacing:"0.05em",textTransform:"uppercase"}}>MAT'S <span style={{color:C.orange}}>EDGE</span></div>
      <div style={{fontFamily:F.head,fontWeight:700,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.orange,background:C.orangeDim,border:`1px solid ${C.orangeMid}`,padding:"3px 10px",borderRadius:4}}>12-Week Recomp</div>
    </div>
  );
}

// ---------- TRAIN TAB ----------
function TrainTab({store,navWeek,navDay,setNavWeek,setNavDay}){
  const phase=PROGRAM.phases.find(ph=>ph.weekList.some(w=>w.week===navWeek));
  const wk=phase.weekList.find(w=>w.week===navWeek);
  const day=wk.days[navDay];

  return (
    <div>
      {/* Week selector */}
      <div style={{display:"flex",gap:6,padding:"12px 16px 0",overflowX:"auto"}} className="noscroll">
        {PROGRAM.phases.flatMap(ph=>ph.weekList).map(w=>(
          <button key={w.week} onClick={()=>{setNavWeek(w.week);setNavDay(0);}}
            style={{flexShrink:0,background:w.week===navWeek?C.orangeDim:C.card,border:`1px solid ${w.week===navWeek?C.orange:C.border}`,color:w.week===navWeek?C.orange:C.muted,borderRadius:6,padding:"6px 12px",fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
            W{w.week}{w.deload?" ·D":""}
          </button>
        ))}
      </div>
      {/* Phase + progress note */}
      <div style={{padding:"12px 16px 0"}}>
        <div style={{fontFamily:F.head,fontWeight:900,fontSize:22,textTransform:"uppercase"}}>{phase.name} <span style={{color:C.muted,fontSize:15,fontWeight:600}}>· Week {navWeek}</span></div>
        {wk.progressNote&&<div style={{fontSize:13,color:C.muted,marginTop:2,lineHeight:1.5}}>{wk.progressNote}</div>}
      </div>
      {/* Day tabs */}
      <div style={{display:"flex",gap:6,padding:"12px 16px 0"}}>
        {wk.days.map((d,i)=>(
          <button key={i} onClick={()=>setNavDay(i)}
            style={{flex:1,background:i===navDay?C.orangeDim:C.card,border:`1px solid ${i===navDay?C.orange:C.border}`,color:i===navDay?C.orange:C.muted,borderRadius:8,padding:"8px 4px",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontFamily:F.head,fontWeight:700,fontSize:14,textTransform:"uppercase"}}>{d.name}</div>
            <div style={{fontSize:11,marginTop:1}}>{d.loc==="home"?"🏠":"🏋️"}</div>
          </button>
        ))}
      </div>
      {/* Day workout */}
      <DayWorkout key={`${navWeek}-${navDay}`} store={store} week={navWeek} dayIndex={navDay} day={day} deload={wk.deload}/>
    </div>
  );
}

function DayWorkout({store,week,dayIndex,day,deload}){
  return (
    <div style={{padding:"14px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{fontFamily:F.head,fontWeight:900,fontSize:26,textTransform:"uppercase"}}>{day.focus}</div>
        <span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",padding:"2px 8px",borderRadius:3,background:day.type==="upper"?C.upperDim:C.orangeDim,color:day.type==="upper"?C.upper:C.orange}}>{day.type}</span>
        {day.loc&&<span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",padding:"2px 8px",borderRadius:3,background:day.loc==="home"?"rgba(99,102,241,0.13)":"rgba(34,197,94,0.1)",color:day.loc==="home"?C.upper:C.green}}>{day.loc==="home"?"🏠 Basement":"🏋️ Gym"}</span>}
        {deload&&<span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",padding:"2px 8px",borderRadius:3,background:C.greenDim,color:C.green}}>Deload</span>}
      </div>
      {day.exercises.map((exItem,i)=>(
        <ExerciseLogger key={`${week}-${dayIndex}-${i}-${exItem.ex}`} store={store} week={week} dayIndex={dayIndex} exItem={exItem}/>
      ))}
      {day.cardio&&(
        <div style={{background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:8,padding:"12px 14px",marginTop:8,fontSize:13,lineHeight:1.5}}>
          <strong style={{color:C.green}}>Cardio</strong> — {day.cardio}
        </div>
      )}
    </div>
  );
}

function ExerciseLogger({store,week,dayIndex,exItem}){
  const e=EXERCISES[exItem.ex];
  const isBW=e.type==="bodyweight"&&e.inc===0;
  const thisKey=logKey(week,dayIndex)+":"+exItem.ex;
  const existing=store.logs[thisKey];

  // find prior log for suggestion
  const lastLog=useMemo(()=>findLastLog(store.logs,exItem.ex,week,dayIndex),[store.logs,exItem.ex,week,dayIndex]);
  const suggestion=useMemo(()=>{
    const ov=store.overrides[exItem.ex];
    const base=suggestWeight(exItem.ex,lastLog?{...lastLog,targetSets:exItem.sets,targetReps:exItem.reps}:null);
    if(ov!=null&&base.isStart)return{...base,weight:ov,reason:"your starting weight"};
    return base;
  },[lastLog,store.overrides,exItem]);

  const [open,setOpen]=useState(false);
  const [sets,setSets]=useState(()=>{
    if(existing&&existing.sets)return existing.sets.map(s=>({...s}));
    return Array.from({length:exItem.sets},()=>({weight:suggestion.weight,reps:exItem.reps}));
  });
  const logged=!!existing;

  const updateSet=(i,field,val)=>{
    setSets(p=>p.map((s,j)=>j===i?{...s,[field]:val===""?"":Number(val)}:s));
  };
  const save=()=>{
    const clean=sets.map(s=>({weight:isBW?0:(s.weight===""?0:s.weight),reps:s.reps===""?0:s.reps}));
    store.saveLog(thisKey,{exKey:exItem.ex,week,dayIndex,targetSets:exItem.sets,targetReps:exItem.reps,sets:clean,ts:Date.now()});
    setOpen(false);
  };

  return (
    <div style={{background:C.card,border:`1px solid ${logged?C.orangeMid:C.border}`,borderRadius:10,marginBottom:10,overflow:"hidden"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
            {e.name}
            {logged&&<span style={{color:C.green,fontSize:12}}>✓</span>}
          </div>
          <div style={{fontSize:12,color:C.muted,marginTop:2}}>
            {exItem.sets} × {exItem.repLabel}
            {!isBW&&<> · <span style={{color:C.orange,fontWeight:600}}>{suggestion.weight} lbs</span></>}
            {isBW&&<> · <span style={{color:C.upper,fontWeight:600}}>bodyweight</span></>}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:suggestion.up?C.green:suggestion.hold?C.orange:C.muted,textTransform:"uppercase",letterSpacing:"0.05em",maxWidth:90}}>{suggestion.reason}</div>
          <div style={{color:C.muted,fontSize:11,marginTop:2}}>{open?"▲ close":"▼ log"}</div>
        </div>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr",gap:8,alignItems:"center"}}>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase"}}>Set</div>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase"}}>{isBW?"—":"Weight (lbs)"}</div>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase"}}>Reps</div>
            {sets.map((s,i)=>(
              <React.Fragment key={i}>
                <div style={{fontFamily:F.head,fontWeight:700,fontSize:15,color:C.muted,textAlign:"center"}}>{i+1}</div>
                <input inputMode="numeric" disabled={isBW} value={isBW?"":s.weight} onChange={ev=>updateSet(i,"weight",ev.target.value)}
                  style={{background:isBW?"transparent":C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"8px",fontSize:15,width:"100%",textAlign:"center",opacity:isBW?0.4:1}}/>
                <input inputMode="numeric" value={s.reps} onChange={ev=>updateSet(i,"reps",ev.target.value)}
                  placeholder={String(exItem.reps)}
                  style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"8px",fontSize:15,width:"100%",textAlign:"center"}}/>
              </React.Fragment>
            ))}
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={save} style={{flex:1,background:C.orange,color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F.head,textTransform:"uppercase",letterSpacing:"0.05em"}}>{logged?"Update":"Save"} Set</button>
            {!isBW&&<button onClick={()=>setSets(p=>p.map(s=>({...s,weight:suggestion.weight})))} style={{background:C.card,color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontSize:12,cursor:"pointer"}}>Fill {suggestion.weight}</button>}
          </div>
          {lastLog&&(
            <div style={{fontSize:11,color:C.muted,marginTop:8}}>
              Last time: {lastLog.sets.map(s=>isBW?`${s.reps}`:`${s.weight}×${s.reps}`).join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- PROGRESS TAB ----------
function ProgressTab({store}){
  const lifts=["bench","squat","deadlift","ohp"];
  const [sel,setSel]=useState("bench");

  // build series for selected lift: chronological logged sessions -> top set weight + e1RM
  const series=useMemo(()=>{
    const pts=[];
    Object.values(store.logs).forEach(sess=>{
      if(sess.exKey!==sel)return;
      const top=sess.sets.reduce((a,s)=>{const v=e1rm(s.weight,s.reps);return v>a.v?{v,w:s.weight,r:s.reps}:a;},{v:0,w:0,r:0});
      pts.push({week:sess.week,weight:top.w,e1rm:top.v,label:`W${sess.week}`});
    });
    pts.sort((a,b)=>a.week-b.week);
    return pts;
  },[store.logs,sel]);

  const goal=PROGRAM.meta.goals[sel];
  const current=series.length?series[series.length-1]:null;

  return (
    <div style={{padding:"16px"}}>
      <div style={{fontFamily:F.head,fontWeight:900,fontSize:26,textTransform:"uppercase",marginBottom:4}}>Progress</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Your logged lifts over time, estimated 1-rep max, and distance to goal.</div>

      {/* Lift selector */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {lifts.map(l=>(
          <button key={l} onClick={()=>setSel(l)} style={{flex:1,background:l===sel?C.orangeDim:C.card,border:`1px solid ${l===sel?C.orange:C.border}`,color:l===sel?C.orange:C.muted,borderRadius:8,padding:"8px 4px",cursor:"pointer",fontFamily:F.head,fontWeight:700,fontSize:13,textTransform:"uppercase"}}>
            {EXERCISES[l].name.split(" ").slice(-1)[0]}
          </button>
        ))}
      </div>

      {/* Goal progress */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
          <div style={{fontFamily:F.head,fontWeight:700,fontSize:17,textTransform:"uppercase"}}>{EXERCISES[sel].name}</div>
          <div style={{fontSize:12,color:C.muted}}>Goal: <span style={{color:C.orange,fontWeight:700}}>{goal} lbs</span></div>
        </div>
        {(()=>{
          const cur=current?Math.max(current.weight,current.e1rm):EXERCISES[sel].start;
          const pct=Math.min(100,Math.round((cur/goal)*100));
          return (
            <div style={{marginTop:12}}>
              <div style={{height:10,background:C.surface,borderRadius:5,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:C.orange,borderRadius:5,transition:"width .3s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:12,color:C.muted}}>
                <span>Now: <span style={{color:C.text,fontWeight:600}}>{cur} lbs</span></span>
                <span>{pct}% there</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Chart */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 8px 8px"}}>
        <div style={{fontFamily:F.head,fontWeight:700,fontSize:15,textTransform:"uppercase",padding:"0 8px",marginBottom:8}}>Weight & Est. 1RM</div>
        {series.length<1?(
          <div style={{color:C.muted,fontSize:13,padding:"30px 16px",textAlign:"center"}}>
            No data yet for this lift.<br/>Log a workout on the Train tab and it'll show up here.
          </div>
        ):(
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={series} margin={{top:5,right:12,left:-12,bottom:0}}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
              <XAxis dataKey="label" stroke={C.muted} fontSize={11}/>
              <YAxis stroke={C.muted} fontSize={11} domain={["auto","auto"]}/>
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text}} labelStyle={{color:C.muted}}/>
              <ReferenceLine y={goal} stroke={C.orange} strokeDasharray="4 4" label={{value:"Goal",fill:C.orange,fontSize:10,position:"insideTopRight"}}/>
              <Line type="monotone" dataKey="weight" stroke={C.upper} strokeWidth={2} dot={{r:3}} name="Top set"/>
              <Line type="monotone" dataKey="e1rm" stroke={C.orange} strokeWidth={2} dot={{r:3}} name="Est 1RM"/>
            </LineChart>
          </ResponsiveContainer>
        )}
        <div style={{display:"flex",gap:16,padding:"4px 12px 8px",fontSize:11,color:C.muted}}>
          <span><span style={{color:C.upper}}>●</span> Top set weight</span>
          <span><span style={{color:C.orange}}>●</span> Estimated 1RM</span>
        </div>
      </div>
    </div>
  );
}

// ---------- SETTINGS TAB ----------
function SettingsTab({store}){
  const big=["bench","squat","deadlift","ohp","bbRow","weightedPull"];
  const [confirm,setConfirm]=useState(false);
  return (
    <div style={{padding:"16px"}}>
      <div style={{fontFamily:F.head,fontWeight:900,fontSize:26,textTransform:"uppercase",marginBottom:4}}>Settings</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Override your starting weights if the estimates don't match where you're at. These apply until you log that lift, then progression takes over.</div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:16}}>
        <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,fontFamily:F.head,fontWeight:700,fontSize:15,textTransform:"uppercase"}}>Starting Weights</div>
        {big.map(k=>(
          <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:14}}>{EXERCISES[k].name}</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input inputMode="numeric" defaultValue={store.overrides[k]??EXERCISES[k].start}
                onBlur={ev=>store.saveOverride(k,Number(ev.target.value))}
                style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"6px 8px",fontSize:15,width:70,textAlign:"center"}}/>
              <span style={{fontSize:12,color:C.muted}}>lbs</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
        <div style={{fontFamily:F.head,fontWeight:700,fontSize:15,textTransform:"uppercase",marginBottom:6}}>Reset</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:12}}>Clear all logged workouts and overrides. This can't be undone.</div>
        {!confirm?(
          <button onClick={()=>setConfirm(true)} style={{background:"transparent",color:C.orange,border:`1px solid ${C.orangeMid}`,borderRadius:8,padding:"10px 16px",fontSize:14,cursor:"pointer",width:"100%"}}>Reset all data</button>
        ):(
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{store.resetAll();setConfirm(false);}} style={{flex:1,background:C.orange,color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Yes, reset</button>
            <button onClick={()=>setConfirm(false)} style={{flex:1,background:C.card,color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px",fontSize:14,cursor:"pointer"}}>Cancel</button>
          </div>
        )}
      </div>

      <div style={{fontSize:11,color:C.muted,marginTop:16,lineHeight:1.5}}>
        Data saves to this device's browser storage. It stays put between sessions but lives only on this device. Progression rule: hit all your target reps across every set → next session suggests +weight; miss any → it holds you at the same weight.
      </div>
    </div>
  );
}

// ---------- BOTTOM NAV ----------
function BottomNav({tab,setTab}){
  const items=[["train","🏋️","Train"],["progress","📈","Progress"],["settings","⚙️","Settings"]];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:50}}>
      {items.map(([id,icon,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"none",border:"none",padding:"10px 4px 8px",cursor:"pointer",color:tab===id?C.orange:C.muted,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:20}}>{icon}</span>
          <span style={{fontFamily:F.head,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
        </button>
      ))}
    </div>
  );
}
