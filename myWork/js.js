function loadCss(url) {
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    // 添加到head标签中
    head.appendChild(link);
}
function loadScript(url) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    //script.id="js";
    // 添加到head标签中
    head.appendChild(script);
}
function createElement(data){
    let e = document.createElement(data.type);
    for(let index in data){
        if(index=="type"||index=="children") continue;
        e[index]=data[index];
    }
    for(let index in data["children"]){
        e.appendChild(createElement(data["children"][index]));
    }
    
    return e;
    
}
function push(id,child){
    try{
        document.querySelector(id).appendChild(createElement(child));
    }catch(e){

    }
    
}
window.memu=function(){
    let e= document.getElementById("threadindex");
    if(!e){
        alert("没有找到菜单");
        return;
    }
    (e.style.display=e.style.display=="block"? "none":"block");
    if(!document.getElementById("last")){
       push(
        "#threadindex > div > h3",
        {
            type:"div",
            textContent:"上次看到:"+localStorage.getItem('上次看到'),
            style:" color: red !important;font-size: 20px !important ;",
            id:"last"
        }
        )  
    }
    let lastTimeId="lastTime"+Date.now();
    document.querySelectorAll("#threadindex li").forEach(function(element) {
        if (element.textContent==localStorage.getItem('上次看到')) {
            element.id=lastTimeId;
            element.style.backgroundColor="aqua";
        }
    }); 
   
    if(e.style.display=="block"){
        window.location.hash="#"+lastTimeId;
        setTimeout(()=>{
            window.location.hash="";
        },1000);
    }
}
window.goRead=function(){
    // 创建一个URL对象
    let url = new URL(document.URL);

    // 获取并解析查询字符串
    let searchParams = new URLSearchParams(url.search);
   
    // 将查询参数转换为对象
    let queryParamsObject = Object.fromEntries(searchParams.entries());
    queryParamsObject["mobile"]="no";
    queryParamsObject=Object.entries(queryParamsObject);
    let query=queryParamsObject.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    let go="https://"+url.host+"?"+query; 
    window.location.href=go;
   
    
}
function uri(queryData){
    let url = new URL(document.URL);

    // 获取并解析查询字符串
    let searchParams = new URLSearchParams(url.search);
   
    // 将查询参数转换为对象
    let queryParamsObject = Object.fromEntries(searchParams.entries());
    queryParamsObject={
        ...queryParamsObject,
        ...queryData
    }
    queryParamsObject=Object.entries(queryParamsObject);
    let query=queryParamsObject.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    let go="https://"+url.host+"?"+query; 
    return go;
}
function queryMap(){
    let url = new URL(document.URL);

    // 获取并解析查询字符串
    let searchParams = new URLSearchParams(url.search);
   
    // 将查询参数转换为对象
    let queryParamsObject = Object.fromEntries(searchParams.entries());
    return queryParamsObject;
}
function queryMapToUrl(query){
    let url = new URL(document.URL);
    url=url.href.substring(0,url.href.indexOf("?")+1);
    query=Object.entries(query);
    let str=query.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    return url+str;
}
//清除回复
function reply(){
   let message=document.getElementsByClassName("message");
   for(let i=0;i<message.length;i++){
        if(message[i].querySelectorAll(".quote blockquote").length>0){
            message[i].style.display="none";
        }
    }
}
window.purest=function(){
    let key="purest";
    let b=sessionStorage.getItem(key);
    if(b=="true"){
        sessionStorage.setItem(key,false);
        location.reload(true);
    }else{
       sessionStorage.setItem(key,true);
       document.querySelectorAll(".txtlist a").forEach((currentValue, index, array) => {
        if(currentValue.textContent=="只看楼主"){
            window.location.href=currentValue.href;
        }
       
       });
       
    }
}
//修改ajaxget的功能
function hook(){
    window.AjaxGet=ajaxget;
    ajaxget=function(...params){
        document.querySelectorAll("#threadindex li").forEach(function(element) {

            if (element.onclick && element.getAttribute('onclick').includes(params[0])) {
                localStorage.setItem("上次看到",element.textContent);
            }
        }); 
        window.AjaxGet(...params);
        window.memu();
       
    }
}
const api="http://127.0.0.1:5500";
//const api="https://whimsical-platypus-73f612.netlify.app";
const readModel=api+'/myWork/Yuri300.css';
const js=api+'/myWork/yuri300.js';
const start=function(){
   if(document.URL.indexOf("bbs.yamibo.com")>=0){
    loadCss(api+"/myWork/Yuri300Main.css");
    loadScript(js);
    loadCss(api+"/myWork/nav.css");
    loadCss(api+"/myWork/top.css"); 
    push(
        "#scrolltop",
        {
            type:"span",
            children:[
                {
                    type:"a",
                    href:"javascript:window.memu();",
                    textContent:"目录"
                }
            ]
        }
    )
    push(
        ".header.cl .my",
        {
            type:"a",
            href:"javascript:window.goRead();",
            textContent:"阅读模式",
            style:" color: white !important;"
        }
    );
    push(
        ".header.cl .my",
        {
            type:"a",
            href:"javascript:window.purest();",
            textContent:sessionStorage.getItem("purest")=="true"?"关闭":"纯净模式",
            style:" color: white !important;",
            id:"purest"
        }
    ) 
    if(sessionStorage.getItem("purest")=="true"){
        document.querySelectorAll(".txtlist a").forEach((currentValue, index, array) => {
            if(currentValue.textContent=="只看楼主"){
                window.location.href=currentValue.href;
            }
           
        });
        loadCss(api+"/myWork/purest.css");
        reply();
    }
    hook();
   }
}
start();
