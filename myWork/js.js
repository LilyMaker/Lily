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
    push(
        "#threadindex > div > h3",
        {
            type:"div",
            textContent:"上次看到:"+localStorage.getItem('上次看到'),
            style:" color: red !important;font-size: 20px !important ;"
        }
    ) 
    e.style.display=e.style.display=="block"? "none":"block";
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
//修改ajaxget的功能
function hook(){
    window.AjaxGet=ajaxget;
    ajaxget=function(...params){
        window.AjaxGet(...params);
        window.memu();
        document.querySelectorAll("#threadindex li").forEach(function(element) {

            if (element.onclick && element.getAttribute('onclick').includes(params[0])) {
                localStorage.setItem("上次看到",element.textContent);
            }
        }); 
    }
}
const api="https://lily-seven.vercel.app";
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
            style:" color: white !important;font-size: 20px !important ;"
        }
    ) 
    hook();
   }
}
start();
