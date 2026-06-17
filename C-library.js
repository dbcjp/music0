<script>
document.write(`
<div id="gamenA">
<div id="listA"></div>
<div id="menuA" class="choises"></div>
</div>
<div id="gamenB"></div>
`);
var data_a=[],data_b=[],data_c=[],data_m=[],data_t=[],data_c2=[];

//=================================

var gamenA=document.getElementById('gamenA');
var gamenB=document.getElementById('gamenB');
var listA=document.getElementById('listA');
var menuA=document.getElementById('menuA');

var urlA=[],nameB=[],nameC=[],nameC2=[];
var k=0,htmlindexP="",htmlindexC="",htmlindexT="";
var p_width=0;
var db=[],current=[],k2=0,k2max=0;

function addData(url,title,name,sortname,time = []){
    data_a.push(url);
    data_b.push(title);
    data_c.push(name);
    data_c2.push(sortname);
    data_t.push(time);
}

function buildData(){
    //配列を合体させdata_cの演奏者の名前を全て入れる
    for (var i=0;i<data_a.length;i++){
        var dataA=data_a[i].split(',');
        if (data_b[i]){
            var dataB=data_b[i].split('/');
        } else {
            var dataB=data_b[0].split('/');
        }
        urlA=[...urlA,...dataA];
        nameB=[...nameB,...dataB];
        for (var j=0;j<dataA.length;j++){
            nameC[k]=data_c[i];
            nameC2[k]=data_c2[i];
            k++;
        }
    }
    
//url.forEach(item => item+',');
//url.join(',');//上と同じ
//nameB.join('/');

    for (var i=0;i<urlA.length;i++){
        if (nameB[i].startsWith('*')){
            if (i>0){
                db.push({
                    catalog:catalog,
                    title:nameTitle,
                    subtitle:nameSubtitle,
                    parts:parts,
                    performer:performer,
                    sortperformer:performer2,
                    search:search
            });
            }
            var parts=[];
            //var catalog=normalizeCatalog(nameB[i].slice(nameB[i].indexOf('BWV '),nameB[i].indexOf('BWV ')+8));
            var catalog=normalizeCatalog(nameB[i].slice(nameB[i].indexOf(',@')+2));
            nameB[i]=nameB[i].slice(1);
            //var nameTitle=nameB[i].slice(0,nameB[i].indexOf(',@BWV'));
            var nameTitle=nameB[i].slice(0,nameB[i].indexOf(':'));
            var nameSubtitle='Shéhérazade';
            var performer=nameC[i];
            var performer2=nameC2[i];
            var search=catalog+" "+nameTitle+" "+nameSubtitle+" "+performer;
        }
        if (nameC[i].endsWith('*')){
            catalog=catalog.slice(0,catalog.indexOf('_'));
            var numberC = data_c.indexOf(nameC[i]);
            if (k2max==0){ k2max=data_t[numberC].length;k2=0;}
            var timesArr=data_t[numberC][k2].split(',');
            var namesArr=nameB[i].split('_');
            for (var j=0;j<timesArr.length;j++){
              var t=[];
              t[0]=timesArr[j];
              if (j<timesArr.length-1){
                  t[1]=timesArr[j+1];
              }
              parts.push({
                name: namesArr[j].slice(0,namesArr[j].indexOf(',@')).trim(),
                url: urlA[i],
                times: t
              });
            }
            nameC[i]=nameC[i].slice(0,-1);
            k2++;
            if (k2>=k2max){k2max=0;}
        } else {
            parts.push({
              name: nameB[i].slice(0,nameB[i].indexOf(',@')).trim(),
              url: urlA[i]
            });
        }
    }
    
    db.push({
        catalog:catalog,
        title:nameTitle,
        parts:parts,
        performer:performer,
        sortperformer:performer2,
        search:search
    });
}
//検索用データベース
function setIndex(){
    let indexCatalog =[...new Set(db.map(v => v.catalog))];
    let indexTitle =[];
    indexCatalog=indexCatalog.sort((a,b)=>
        a.localeCompare(b,undefined,{numeric:true}));
    htmlIndexC=`<h5>=== Catalog Number ===</h5>`,title="";
    indexCatalog.forEach((c, n) =>{
      //title=db.find(v => v.catalog === c )?.title;
      indexTitle[n]=db.find(v => v.catalog === c )?.title;
      htmlIndexC+=`
      <div>${n+1} <button onclick="showIndex('${c}',0)">${c} (${indexTitle[n]})</button></div>
      `;
    });
    
    indexTitle=indexTitle.sort((a,b)=>
        a.localeCompare(b,undefined,{numeric:true, sensitivity:"base"}));
    htmlIndexT=`<h5>=== Title ===</h5>`,title="";
    indexTitle.forEach((c, n) =>{
      catalog=db.find(v => v.title === c )?.catalog;
      htmlIndexT+=`
      <div>${n+1} <button onclick="showIndex('${c}',1)">${c} (${catalog})</button></div>
      `;
    });    
    
    db=db.sort((a,b)=> a.sortperformer.localeCompare(b.sortperformer,undefined,{numeric:true, sensitivity:"base"}));

    let indexPerformer =[...new Set(db.map(v => v.performer))];
    htmlIndexP=`<h5>=== Performer ===</h5>`;
    indexPerformer.forEach((p, n) =>{
      htmlIndexP+=`
      <div>${n+1} <button onclick="showIndex('${p}',2)">${p}</button></div>
      `;
    });
}

//buildData()
setIndex();
current=[...db];
choices();


//gamenA.innerHTML="<pre>" +db.map(v => format(v)).join("\n\n") +"</pre>";

function choices(){
  let html=`
    <button class="choice" onclick="showBdata(htmlIndexC)">番号</button>
    <button class="choice" onclick="showBdata(htmlIndexT)">曲名</button>
    <button class="choice" onclick="showBdata(htmlIndexP)">奏者</button>
    `;

  menuA.innerHTML=html;
}

/*
    <button class="choice" onclick="sortA()">番順</button>
    <button class="choice" onclick="sortB()">番逆</button>
    <button class="choice" onclick="abc('title')">曲順</button>
    <button class="choice" onclick="abc('performer')">奏順</button>
    <button class="choice" onclick="chooseData('BWV1006')">BWV1006</button>
    <button class="choice" onclick="getMovement('BWV1006',2)">BWV1006gavott</button>
*/

function showData(){
  let html="";
  current.forEach((work, n) =>{
    html+=`
    <div>${n+1} <button onclick="tosideB('${n}')">${work.title}${work.performer}</button></div>
    `;
  });
  //<div>${n+1} ${work.catalog} ${work.title} / <button onclick="tosideB('${n}')">${work.performer}</button></div>
  //listA.innerHTML='<h2>'+db[0].performer+'</h2>'+html+`
  listA.innerHTML=`
  <h5><button onclick="showParts('${current[0].catalog}')">${current[0].catalog} ${current[0].title}</button></h5>
  `+html;
}

function showBdata(data){
    listA.innerHTML=data;
}

function showIndex(data,data2){
    current=[...db].filter(v => v.search.toLowerCase().includes(data.toLowerCase()));
    let html="";
    
    if (data2 < 2) {
        html=`<h5><button onclick="showParts('${current[0].catalog}')">${current[0].catalog} ${current[0].title}</button></h5>`;
        current.forEach((work, n) =>{
              html+=`
              <div>${n+1} <button onclick="tosideB('${n}')">${work.performer}</button></div>
              `;
        });
    } else {
        html=`<h5>${current[0].performer}</h5>`;
        current.forEach((work, n) =>{
              html+=`
              <div>${n+1} <button onclick="tosideB('${n}')">${work.catalog} ${work.title}</button></div>
              `;
        });
    }

    listA.innerHTML=html;
    //listA.innerHTML=html;
    //showData();
}

function sortA(){
    //current=current.sort((a,b)=>a.catalog-b.catalog);
    current=[...db].sort((a,b)=>
      a.catalog.localeCompare(b.catalog,undefined,{numeric:true}));
    showData();
}

function sortB(){
    //current=[...db].sort((a,b)=>b.catalog-a.catalog);
    current=[...db].sort((a,b)=>
      b.catalog.localeCompare(a.catalog,undefined,{numeric:true}));
      //文字列で比較
    showData();
}

function chooseTitle(){
    current=[...db]
        .filter(v =>
          v.catalog == catalog &&
          v.parts[num]
        )
        .map(v => ({
          catalog:v.catalog,
          title:v.title,
          performer:v.performer,
          soortperformer:v.sortperformer,
          movement:num+1,
          parts:[v.parts[num]]
        }));
    showData();
}

function chooseData(data){
    //gamenA.innerHTML="OK";
    current=[...db].filter(v =>v.catalog == data);
    showData();
}

function showParts(catalog){
  title=db.find(v => v.catalog === catalog )?.title;
  //current=[...db].find(v =>v.catalog == catalog).parts.map(v => v.name);
  let current = [...db].find(v => v.catalog == catalog)?.parts?.map(v => v.name) ?? [];
  let html="";
  current.forEach((work, n) =>{
    html+=`
    <div>${n+1} <button onclick="getMovement('${catalog}','${n}')">${work}</button></div>
    `;
  });

  listA.innerHTML=`
  <h2>${catalog} ${title}</h2>
  `+html;
  shouBdata(html);
}

function getMovement(catalog, num){
  let current2=[...db]
    .filter(v =>
      v.catalog == catalog &&
      v.parts[num]
    )
    .map(v => ({
      catalog:v.catalog,
      performer:v.performer,
      title:v.title,
      movement:num+1,
      name:v.parts[num].name,
      url:v.parts[num].url,
      times:v.parts[num].times
    }));
    
    gamenA.style.display = "none";
    gamenB.style.display = "block";
    
    let urlAll = current2.filter(a => !a.performer.endsWith('*')).map(a => a.url).join(',');
    //gamenB.innerHTML=urlAll;
    
    let html=`
    <div class="box1">
    <div class="title"><h5>${current2[0].catalog}<br>${current2[0].title}<br>${current2[0].name}</h5></div>
    <div><button onclick="goplay('${urlAll}')">▶ Listen All</button></div>
    <br>
    `;
    
    for (var i=0;i<current2.length;i++){
        var startend="";
        if (current2[i].performer.endsWith('*')){
            if (current2[i].times.length == 1){
                startend="&start="+current2[i].times[0];
            }else{
                startend="&start="+current2[i].times[0]+"&end="+current2[i].times[1];
            }
        }
        html+=`
        <div class="part">
        <button onclick="goplay('${current2[i].url+startend}')" >
        ▶ Listen
        </button>
        ${i+1}. ${current2[i].performer}
        </div>
        `;
    }
    html+="</div>";
    gamenB.innerHTML+=`
    <div>
    <iframe id="player" src="https://www.youtube.com/embed?playlist=${urlAll}"></iframe>
    </div>
    <div><button onclick="changePwidth()">▶ </button>  <button onclick="tosideA()">▶ 選択へ戻る</button></div>
    <div class="listB">
    `+html+`
    <br><br></div>
    `;
    let elm=document.getElementById('player');
    (p_width==0)? elm.style.width="100%" : elm.style.width="50%";
    
}

function abc(data){
    if (data=="title"){
        current=[...db].sort((a,b)=>
          a.title.localeCompare(b.title,undefined,{numeric:true}));//文字も数字も比較
    }else if (data=="performer"){
        current=[...db].sort((a,b)=>
          a.performer.localeCompare(b.performer,undefined,{numeric:true}));
    }
    showData();
}

function normalizeCatalog(str){
  return str
    .toUpperCase()
    .replace(/\s/g,"")
    .replace(/\./g,"")
    .replace(/^KV/,"K");
}

function shuffle(a){
 for(let i=a.length-1;i>0;i--){
  let j=Math.floor(Math.random()*(i+1));
  [a[i],a[j]]=[a[j],a[i]];
 }
 return a;
}

gamenA.style.display = "block";
gamenB.style.display = "none";

function tosideA(){
    gamenB.innerHTML="";
    gamenA.style.display = "block";
    gamenB.style.display = "none";
}

function tosideB(n){
    gamenA.style.display = "none";
    gamenB.style.display = "block";
    
    let data = current[n].parts.map(p => p.url).join(',');
    let urlAll = [...new Set(data.split(","))].join(",");//重複がなくなる

    let html=`
    <div class="box1">
    <div class="title"><h5>${current[n].catalog}<br>${current[n].title}<br>${current[n].performer}</h5></div>
    <div><button onclick="goplay('${urlAll}')">▶ Listen All</button></div>
    <br>
    `;
    
    for (var i=0;i<current[n].parts.length;i++){
        var startend="";
        if (current[n].parts[i].times){
            if (current[n].parts[i].times.length == 1){
                startend="&start="+current[n].parts[i].times[0];
            }else{
                startend="&start="+current[n].parts[i].times[0]+"&end="+current[n].parts[i].times[1];
            }
        }
        html+=`
        <div class="part">
        <button onclick="goplay('${current[n].parts[i].url+startend}')" >
        ▶ Listen
        </button>
        ${i+1}. ${current[n].parts[i].name}
        </div>
        `;
    }
    html+="</div>";
    gamenB.innerHTML+=`
    <div>
    <iframe id="player" src="https://www.youtube.com/embed?playlist=${urlAll}"></iframe>
    </div>
    <div><button onclick="changePwidth()">▶ </button> <button onclick="tosideA()">▶ 選択へ戻る</button></div>
    <div class="listB">
    `+html+`
    <br><br></div>
    `;
    let elm=document.getElementById('player');
    (p_width==0)? elm.style.width="100%" : elm.style.width="50%";
}

function changePwidth(){
  let elm=document.getElementById('player');
  (p_width == 0) ? p_width=1 : p_width=0;
  (p_width == 0) ? elm.style.width="100%" : elm.style.width="50%"
//  elm.classList.toggle('b');
}

function goplay(data){
  document.getElementById("player").src =
    `https://www.youtube.com/embed?playlist=${data}&autoplay=1`;
}



//↓ここから追加 
function format(obj){

  let txt = `{
  "catalog":"${obj.catalog}",
  "title":"${obj.title}",
  "parts":[
`;
  txt += obj.parts.map(p =>
    "    " + JSON.stringify(p)
  ).join(",\n");
  txt += `
  ],
  "performer":"${obj.performer}"
  "search":"${obj.search}"
}`;
  return txt;
}
/*

//JSONファイル形式にしてパソコンのダウンロードに入れるプログラム
const json = JSON.stringify(db, null, 2);
gamen.innerHTML = "<pre>" + json + "</pre>";
gamen.insertAdjacentHTML('beforeend','<button id="btn">DATA UP</button>');

button=document.getElementById('btn');
button.onclick = () => {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = "bach.json";
  a.click();
  
  URL.revokeObjectURL(url);
  gamen.insertAdjacentHTML('beforeend','Finished');
};
*/
</script>
