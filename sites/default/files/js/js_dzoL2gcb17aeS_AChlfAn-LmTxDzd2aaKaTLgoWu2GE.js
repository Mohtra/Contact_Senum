/*
 * Shadowbox.js, version 3.0.3
 * http://shadowbox-js.com/
 *
 * Copyright 2007-2010, Michael J. I. Jackson
 * Date: 2011-05-14 06:47:02 +0000
 */
(function(window,undefined){var S={version:"3.0.3"};var ua=navigator.userAgent.toLowerCase();if(ua.indexOf("windows")>-1||ua.indexOf("win32")>-1){S.isWindows=true}else{if(ua.indexOf("macintosh")>-1||ua.indexOf("mac os x")>-1){S.isMac=true}else{if(ua.indexOf("linux")>-1){S.isLinux=true}}}S.isIE=ua.indexOf("msie")>-1;S.isIE6=ua.indexOf("msie 6")>-1;S.isIE7=ua.indexOf("msie 7")>-1;S.isGecko=ua.indexOf("gecko")>-1&&ua.indexOf("safari")==-1;S.isWebKit=ua.indexOf("applewebkit/")>-1;var inlineId=/#(.+)$/,galleryName=/^(light|shadow)box\[(.*?)\]/i,inlineParam=/\s*([a-z_]*?)\s*=\s*(.+)\s*/,fileExtension=/[0-9a-z]+$/i,scriptPath=/(.+\/)shadowbox\.js/i;var open=false,initialized=false,lastOptions={},slideDelay=0,slideStart,slideTimer;S.current=-1;S.dimensions=null;S.ease=function(state){return 1+Math.pow(state-1,3)};S.errorInfo={fla:{name:"Flash",url:"http://www.adobe.com/products/flashplayer/"},qt:{name:"QuickTime",url:"http://www.apple.com/quicktime/download/"},wmp:{name:"Windows Media Player",url:"http://www.microsoft.com/windows/windowsmedia/"},f4m:{name:"Flip4Mac",url:"http://www.flip4mac.com/wmv_download.htm"}};S.gallery=[];S.onReady=noop;S.path=null;S.player=null;S.playerId="sb-player";S.options={animate:true,animateFade:true,autoplayMovies:true,continuous:false,enableKeys:true,flashParams:{bgcolor:"#000000",allowfullscreen:true},flashVars:{},flashVersion:"9.0.115",handleOversize:"resize",handleUnsupported:"link",onChange:noop,onClose:noop,onFinish:noop,onOpen:noop,showMovieControls:true,skipSetup:false,slideshowDelay:0,viewportPadding:20};S.getCurrent=function(){return S.current>-1?S.gallery[S.current]:null};S.hasNext=function(){return S.gallery.length>1&&(S.current!=S.gallery.length-1||S.options.continuous)};S.isOpen=function(){return open};S.isPaused=function(){return slideTimer=="pause"};S.applyOptions=function(options){lastOptions=apply({},S.options);apply(S.options,options)};S.revertOptions=function(){apply(S.options,lastOptions)};S.init=function(options,callback){if(initialized){return}initialized=true;if(S.skin.options){apply(S.options,S.skin.options)}if(options){apply(S.options,options)}if(!S.path){var path,scripts=document.getElementsByTagName("script");for(var i=0,len=scripts.length;i<len;++i){path=scriptPath.exec(scripts[i].src);if(path){S.path=path[1];break}}}if(callback){S.onReady=callback}bindLoad()};S.open=function(obj){if(open){return}var gc=S.makeGallery(obj);S.gallery=gc[0];S.current=gc[1];obj=S.getCurrent();if(obj==null){return}S.applyOptions(obj.options||{});filterGallery();if(S.gallery.length){obj=S.getCurrent();if(S.options.onOpen(obj)===false){return}open=true;S.skin.onOpen(obj,load)}};S.close=function(){if(!open){return}open=false;if(S.player){S.player.remove();S.player=null}if(typeof slideTimer=="number"){clearTimeout(slideTimer);slideTimer=null}slideDelay=0;listenKeys(false);S.options.onClose(S.getCurrent());S.skin.onClose();S.revertOptions()};S.play=function(){if(!S.hasNext()){return}if(!slideDelay){slideDelay=S.options.slideshowDelay*1000}if(slideDelay){slideStart=now();slideTimer=setTimeout(function(){slideDelay=slideStart=0;S.next()},slideDelay);if(S.skin.onPlay){S.skin.onPlay()}}};S.pause=function(){if(typeof slideTimer!="number"){return}slideDelay=Math.max(0,slideDelay-(now()-slideStart));if(slideDelay){clearTimeout(slideTimer);slideTimer="pause";if(S.skin.onPause){S.skin.onPause()}}};S.change=function(index){if(!(index in S.gallery)){if(S.options.continuous){index=(index<0?S.gallery.length+index:0);if(!(index in S.gallery)){return}}else{return}}S.current=index;if(typeof slideTimer=="number"){clearTimeout(slideTimer);slideTimer=null;slideDelay=slideStart=0}S.options.onChange(S.getCurrent());load(true)};S.next=function(){S.change(S.current+1)};S.previous=function(){S.change(S.current-1)};S.setDimensions=function(height,width,maxHeight,maxWidth,topBottom,leftRight,padding,preserveAspect){var originalHeight=height,originalWidth=width;var extraHeight=2*padding+topBottom;if(height+extraHeight>maxHeight){height=maxHeight-extraHeight}var extraWidth=2*padding+leftRight;if(width+extraWidth>maxWidth){width=maxWidth-extraWidth}var changeHeight=(originalHeight-height)/originalHeight,changeWidth=(originalWidth-width)/originalWidth,oversized=(changeHeight>0||changeWidth>0);if(preserveAspect&&oversized){if(changeHeight>changeWidth){width=Math.round((originalWidth/originalHeight)*height)}else{if(changeWidth>changeHeight){height=Math.round((originalHeight/originalWidth)*width)}}}S.dimensions={height:height+topBottom,width:width+leftRight,innerHeight:height,innerWidth:width,top:Math.floor((maxHeight-(height+extraHeight))/2+padding),left:Math.floor((maxWidth-(width+extraWidth))/2+padding),oversized:oversized};return S.dimensions};S.makeGallery=function(obj){var gallery=[],current=-1;if(typeof obj=="string"){obj=[obj]}if(typeof obj.length=="number"){each(obj,function(i,o){if(o.content){gallery[i]=o}else{gallery[i]={content:o}}});current=0}else{if(obj.tagName){var cacheObj=S.getCache(obj);obj=cacheObj?cacheObj:S.makeObject(obj)}if(obj.gallery){gallery=[];var o;for(var key in S.cache){o=S.cache[key];if(o.gallery&&o.gallery==obj.gallery){if(current==-1&&o.content==obj.content){current=gallery.length}gallery.push(o)}}if(current==-1){gallery.unshift(obj);current=0}}else{gallery=[obj];current=0}}each(gallery,function(i,o){gallery[i]=apply({},o)});return[gallery,current]};S.makeObject=function(link,options){var obj={content:link.href,title:link.getAttribute("title")||"",link:link};if(options){options=apply({},options);each(["player","title","height","width","gallery"],function(i,o){if(typeof options[o]!="undefined"){obj[o]=options[o];delete options[o]}});obj.options=options}else{obj.options={}}if(!obj.player){obj.player=S.getPlayer(obj.content)}var rel=link.getAttribute("rel");if(rel){var match=rel.match(galleryName);if(match){obj.gallery=escape(match[2])}each(rel.split(";"),function(i,p){match=p.match(inlineParam);if(match){obj[match[1]]=match[2]}})}return obj};S.getPlayer=function(content){if(content.indexOf("#")>-1&&content.indexOf(document.location.href)==0){return"inline"}var q=content.indexOf("?");if(q>-1){content=content.substring(0,q)}var ext,m=content.match(fileExtension);if(m){ext=m[0].toLowerCase()}if(ext){if(S.img&&S.img.ext.indexOf(ext)>-1){return"img"}if(S.swf&&S.swf.ext.indexOf(ext)>-1){return"swf"}if(S.flv&&S.flv.ext.indexOf(ext)>-1){return"flv"}if(S.qt&&S.qt.ext.indexOf(ext)>-1){if(S.wmp&&S.wmp.ext.indexOf(ext)>-1){return"qtwmp"}else{return"qt"}}if(S.wmp&&S.wmp.ext.indexOf(ext)>-1){return"wmp"}}return"iframe"};function filterGallery(){var err=S.errorInfo,plugins=S.plugins,obj,remove,needed,m,format,replace,inlineEl,flashVersion;for(var i=0;i<S.gallery.length;++i){obj=S.gallery[i];remove=false;needed=null;switch(obj.player){case"flv":case"swf":if(!plugins.fla){needed="fla"}break;case"qt":if(!plugins.qt){needed="qt"}break;case"wmp":if(S.isMac){if(plugins.qt&&plugins.f4m){obj.player="qt"}else{needed="qtf4m"}}else{if(!plugins.wmp){needed="wmp"}}break;case"qtwmp":if(plugins.qt){obj.player="qt"}else{if(plugins.wmp){obj.player="wmp"}else{needed="qtwmp"}}break}if(needed){if(S.options.handleUnsupported=="link"){switch(needed){case"qtf4m":format="shared";replace=[err.qt.url,err.qt.name,err.f4m.url,err.f4m.name];break;case"qtwmp":format="either";replace=[err.qt.url,err.qt.name,err.wmp.url,err.wmp.name];break;default:format="single";replace=[err[needed].url,err[needed].name]}obj.player="html";obj.content='<div class="sb-message">'+sprintf(S.lang.errors[format],replace)+"</div>"}else{remove=true}}else{if(obj.player=="inline"){m=inlineId.exec(obj.content);if(m){inlineEl=get(m[1]);if(inlineEl){obj.content=inlineEl.innerHTML}else{remove=true}}else{remove=true}}else{if(obj.player=="swf"||obj.player=="flv"){flashVersion=(obj.options&&obj.options.flashVersion)||S.options.flashVersion;if(S.flash&&!S.flash.hasFlashPlayerVersion(flashVersion)){obj.width=310;obj.height=177}}}}if(remove){S.gallery.splice(i,1);if(i<S.current){--S.current}else{if(i==S.current){S.current=i>0?i-1:i}}--i}}}function listenKeys(on){if(!S.options.enableKeys){return}(on?addEvent:removeEvent)(document,"keydown",handleKey)}function handleKey(e){if(e.metaKey||e.shiftKey||e.altKey||e.ctrlKey){return}var code=keyCode(e),handler;switch(code){case 81:case 88:case 27:handler=S.close;break;case 37:handler=S.previous;break;case 39:handler=S.next;break;case 32:handler=typeof slideTimer=="number"?S.pause:S.play;break}if(handler){preventDefault(e);handler()}}function load(changing){listenKeys(false);var obj=S.getCurrent();var player=(obj.player=="inline"?"html":obj.player);if(typeof S[player]!="function"){throw"unknown player "+player}if(changing){S.player.remove();S.revertOptions();S.applyOptions(obj.options||{})}S.player=new S[player](obj,S.playerId);if(S.gallery.length>1){var next=S.gallery[S.current+1]||S.gallery[0];if(next.player=="img"){var a=new Image();a.src=next.content}var prev=S.gallery[S.current-1]||S.gallery[S.gallery.length-1];if(prev.player=="img"){var b=new Image();b.src=prev.content}}S.skin.onLoad(changing,waitReady)}function waitReady(){if(!open){return}if(typeof S.player.ready!="undefined"){var timer=setInterval(function(){if(open){if(S.player.ready){clearInterval(timer);timer=null;S.skin.onReady(show)}}else{clearInterval(timer);timer=null}},10)}else{S.skin.onReady(show)}}function show(){if(!open){return}S.player.append(S.skin.body,S.dimensions);S.skin.onShow(finish)}function finish(){if(!open){return}if(S.player.onLoad){S.player.onLoad()}S.options.onFinish(S.getCurrent());if(!S.isPaused()){S.play()}listenKeys(true)}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(obj,from){var len=this.length>>>0;from=from||0;if(from<0){from+=len}for(;from<len;++from){if(from in this&&this[from]===obj){return from}}return -1}}function now(){return(new Date).getTime()}function apply(original,extension){for(var property in extension){original[property]=extension[property]}return original}function each(obj,callback){var i=0,len=obj.length;for(var value=obj[0];i<len&&callback.call(value,i,value)!==false;value=obj[++i]){}}function sprintf(str,replace){return str.replace(/\{(\w+?)\}/g,function(match,i){return replace[i]})}function noop(){}function get(id){return document.getElementById(id)}function remove(el){el.parentNode.removeChild(el)}var supportsOpacity=true,supportsFixed=true;function checkSupport(){var body=document.body,div=document.createElement("div");supportsOpacity=typeof div.style.opacity==="string";div.style.position="fixed";div.style.margin=0;div.style.top="20px";body.appendChild(div,body.firstChild);supportsFixed=div.offsetTop==20;body.removeChild(div)}S.getStyle=(function(){var opacity=/opacity=([^)]*)/,getComputedStyle=document.defaultView&&document.defaultView.getComputedStyle;return function(el,style){var ret;if(!supportsOpacity&&style=="opacity"&&el.currentStyle){ret=opacity.test(el.currentStyle.filter||"")?(parseFloat(RegExp.$1)/100)+"":"";return ret===""?"1":ret}if(getComputedStyle){var computedStyle=getComputedStyle(el,null);if(computedStyle){ret=computedStyle[style]}if(style=="opacity"&&ret==""){ret="1"}}else{ret=el.currentStyle[style]}return ret}})();S.appendHTML=function(el,html){if(el.insertAdjacentHTML){el.insertAdjacentHTML("BeforeEnd",html)}else{if(el.lastChild){var range=el.ownerDocument.createRange();range.setStartAfter(el.lastChild);var frag=range.createContextualFragment(html);el.appendChild(frag)}else{el.innerHTML=html}}};S.getWindowSize=function(dimension){if(document.compatMode==="CSS1Compat"){return document.documentElement["client"+dimension]}return document.body["client"+dimension]};S.setOpacity=function(el,opacity){var style=el.style;if(supportsOpacity){style.opacity=(opacity==1?"":opacity)}else{style.zoom=1;if(opacity==1){if(typeof style.filter=="string"&&(/alpha/i).test(style.filter)){style.filter=style.filter.replace(/\s*[\w\.]*alpha\([^\)]*\);?/gi,"")}}else{style.filter=(style.filter||"").replace(/\s*[\w\.]*alpha\([^\)]*\)/gi,"")+" alpha(opacity="+(opacity*100)+")"}}};S.clearOpacity=function(el){S.setOpacity(el,1)};function getTarget(e){return e.target}function getPageXY(e){return[e.pageX,e.pageY]}function preventDefault(e){e.preventDefault()}function keyCode(e){return e.keyCode}function addEvent(el,type,handler){jQuery(el).bind(type,handler)}function removeEvent(el,type,handler){jQuery(el).unbind(type,handler)}jQuery.fn.shadowbox=function(options){return this.each(function(){var el=jQuery(this);var opts=jQuery.extend({},options||{},jQuery.metadata?el.metadata():jQuery.meta?el.data():{});var cls=this.className||"";opts.width=parseInt((cls.match(/w:(\d+)/)||[])[1])||opts.width;opts.height=parseInt((cls.match(/h:(\d+)/)||[])[1])||opts.height;Shadowbox.setup(el,opts)})};var loaded=false,DOMContentLoaded;if(document.addEventListener){DOMContentLoaded=function(){document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);S.load()}}else{if(document.attachEvent){DOMContentLoaded=function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",DOMContentLoaded);S.load()}}}}function doScrollCheck(){if(loaded){return}try{document.documentElement.doScroll("left")}catch(e){setTimeout(doScrollCheck,1);return}S.load()}function bindLoad(){if(document.readyState==="complete"){return S.load()}if(document.addEventListener){document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);window.addEventListener("load",S.load,false)}else{if(document.attachEvent){document.attachEvent("onreadystatechange",DOMContentLoaded);window.attachEvent("onload",S.load);var topLevel=false;try{topLevel=window.frameElement===null}catch(e){}if(document.documentElement.doScroll&&topLevel){doScrollCheck()}}}}S.load=function(){if(loaded){return}if(!document.body){return setTimeout(S.load,13)}loaded=true;checkSupport();S.onReady();if(!S.options.skipSetup){S.setup()}S.skin.init()};S.plugins={};if(navigator.plugins&&navigator.plugins.length){var names=[];each(navigator.plugins,function(i,p){names.push(p.name)});names=names.join(",");var f4m=names.indexOf("Flip4Mac")>-1;S.plugins={fla:names.indexOf("Shockwave Flash")>-1,qt:names.indexOf("QuickTime")>-1,wmp:!f4m&&names.indexOf("Windows Media")>-1,f4m:f4m}}else{var detectPlugin=function(name){var axo;try{axo=new ActiveXObject(name)}catch(e){}return !!axo};S.plugins={fla:detectPlugin("ShockwaveFlash.ShockwaveFlash"),qt:detectPlugin("QuickTime.QuickTime"),wmp:detectPlugin("wmplayer.ocx"),f4m:false}}var relAttr=/^(light|shadow)box/i,expando="shadowboxCacheKey",cacheKey=1;S.cache={};S.select=function(selector){var links=[];if(!selector){var rel;each(document.getElementsByTagName("a"),function(i,el){rel=el.getAttribute("rel");if(rel&&relAttr.test(rel)){links.push(el)}})}else{var length=selector.length;if(length){if(typeof selector=="string"){if(S.find){links=S.find(selector)}}else{if(length==2&&typeof selector[0]=="string"&&selector[1].nodeType){if(S.find){links=S.find(selector[0],selector[1])}}else{for(var i=0;i<length;++i){links[i]=selector[i]}}}}else{links.push(selector)}}return links};S.setup=function(selector,options){each(S.select(selector),function(i,link){S.addCache(link,options)})};S.teardown=function(selector){each(S.select(selector),function(i,link){S.removeCache(link)})};S.addCache=function(link,options){var key=link[expando];if(key==undefined){key=cacheKey++;link[expando]=key;addEvent(link,"click",handleClick)}S.cache[key]=S.makeObject(link,options)};S.removeCache=function(link){removeEvent(link,"click",handleClick);delete S.cache[link[expando]];link[expando]=null};S.getCache=function(link){var key=link[expando];return(key in S.cache&&S.cache[key])};S.clearCache=function(){for(var key in S.cache){S.removeCache(S.cache[key].link)}S.cache={}};function handleClick(e){S.open(this);if(S.gallery.length){preventDefault(e)}}
/*
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 *
 * Modified for inclusion in Shadowbox.js
 */
S.find=(function(){var chunker=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,done=0,toString=Object.prototype.toString,hasDuplicate=false,baseHasDuplicate=true;[0,0].sort(function(){baseHasDuplicate=false;return 0});var Sizzle=function(selector,context,results,seed){results=results||[];var origContext=context=context||document;if(context.nodeType!==1&&context.nodeType!==9){return[]}if(!selector||typeof selector!=="string"){return results}var parts=[],m,set,checkSet,extra,prune=true,contextXML=isXML(context),soFar=selector;while((chunker.exec(""),m=chunker.exec(soFar))!==null){soFar=m[3];parts.push(m[1]);if(m[2]){extra=m[3];break}}if(parts.length>1&&origPOS.exec(selector)){if(parts.length===2&&Expr.relative[parts[0]]){set=posProcess(parts[0]+parts[1],context)}else{set=Expr.relative[parts[0]]?[context]:Sizzle(parts.shift(),context);while(parts.length){selector=parts.shift();if(Expr.relative[selector]){selector+=parts.shift()}set=posProcess(selector,set)}}}else{if(!seed&&parts.length>1&&context.nodeType===9&&!contextXML&&Expr.match.ID.test(parts[0])&&!Expr.match.ID.test(parts[parts.length-1])){var ret=Sizzle.find(parts.shift(),context,contextXML);context=ret.expr?Sizzle.filter(ret.expr,ret.set)[0]:ret.set[0]}if(context){var ret=seed?{expr:parts.pop(),set:makeArray(seed)}:Sizzle.find(parts.pop(),parts.length===1&&(parts[0]==="~"||parts[0]==="+")&&context.parentNode?context.parentNode:context,contextXML);set=ret.expr?Sizzle.filter(ret.expr,ret.set):ret.set;if(parts.length>0){checkSet=makeArray(set)}else{prune=false}while(parts.length){var cur=parts.pop(),pop=cur;if(!Expr.relative[cur]){cur=""}else{pop=parts.pop()}if(pop==null){pop=context}Expr.relative[cur](checkSet,pop,contextXML)}}else{checkSet=parts=[]}}if(!checkSet){checkSet=set}if(!checkSet){throw"Syntax error, unrecognized expression: "+(cur||selector)}if(toString.call(checkSet)==="[object Array]"){if(!prune){results.push.apply(results,checkSet)}else{if(context&&context.nodeType===1){for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&(checkSet[i]===true||checkSet[i].nodeType===1&&contains(context,checkSet[i]))){results.push(set[i])}}}else{for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&checkSet[i].nodeType===1){results.push(set[i])}}}}}else{makeArray(checkSet,results)}if(extra){Sizzle(extra,origContext,results,seed);Sizzle.uniqueSort(results)}return results};Sizzle.uniqueSort=function(results){if(sortOrder){hasDuplicate=baseHasDuplicate;results.sort(sortOrder);if(hasDuplicate){for(var i=1;i<results.length;i++){if(results[i]===results[i-1]){results.splice(i--,1)}}}}return results};Sizzle.matches=function(expr,set){return Sizzle(expr,null,null,set)};Sizzle.find=function(expr,context,isXML){var set,match;if(!expr){return[]}for(var i=0,l=Expr.order.length;i<l;i++){var type=Expr.order[i],match;if((match=Expr.leftMatch[type].exec(expr))){var left=match[1];match.splice(1,1);if(left.substr(left.length-1)!=="\\"){match[1]=(match[1]||"").replace(/\\/g,"");set=Expr.find[type](match,context,isXML);if(set!=null){expr=expr.replace(Expr.match[type],"");break}}}}if(!set){set=context.getElementsByTagName("*")}return{set:set,expr:expr}};Sizzle.filter=function(expr,set,inplace,not){var old=expr,result=[],curLoop=set,match,anyFound,isXMLFilter=set&&set[0]&&isXML(set[0]);while(expr&&set.length){for(var type in Expr.filter){if((match=Expr.match[type].exec(expr))!=null){var filter=Expr.filter[type],found,item;anyFound=false;if(curLoop===result){result=[]}if(Expr.preFilter[type]){match=Expr.preFilter[type](match,curLoop,inplace,result,not,isXMLFilter);if(!match){anyFound=found=true}else{if(match===true){continue}}}if(match){for(var i=0;(item=curLoop[i])!=null;i++){if(item){found=filter(item,match,i,curLoop);var pass=not^!!found;if(inplace&&found!=null){if(pass){anyFound=true}else{curLoop[i]=false}}else{if(pass){result.push(item);anyFound=true}}}}}if(found!==undefined){if(!inplace){curLoop=result}expr=expr.replace(Expr.match[type],"");if(!anyFound){return[]}break}}}if(expr===old){if(anyFound==null){throw"Syntax error, unrecognized expression: "+expr}else{break}}old=expr}return curLoop};var Expr=Sizzle.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(elem){return elem.getAttribute("href")}},relative:{"+":function(checkSet,part){var isPartStr=typeof part==="string",isTag=isPartStr&&!/\W/.test(part),isPartStrNotTag=isPartStr&&!isTag;if(isTag){part=part.toLowerCase()}for(var i=0,l=checkSet.length,elem;i<l;i++){if((elem=checkSet[i])){while((elem=elem.previousSibling)&&elem.nodeType!==1){}checkSet[i]=isPartStrNotTag||elem&&elem.nodeName.toLowerCase()===part?elem||false:elem===part}}if(isPartStrNotTag){Sizzle.filter(part,checkSet,true)}},">":function(checkSet,part){var isPartStr=typeof part==="string";if(isPartStr&&!/\W/.test(part)){part=part.toLowerCase();for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){var parent=elem.parentNode;checkSet[i]=parent.nodeName.toLowerCase()===part?parent:false}}}else{for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){checkSet[i]=isPartStr?elem.parentNode:elem.parentNode===part}}if(isPartStr){Sizzle.filter(part,checkSet,true)}}},"":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!/\W/.test(part)){var nodeCheck=part=part.toLowerCase();checkFn=dirNodeCheck}checkFn("parentNode",part,doneName,checkSet,nodeCheck,isXML)},"~":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!/\W/.test(part)){var nodeCheck=part=part.toLowerCase();checkFn=dirNodeCheck}checkFn("previousSibling",part,doneName,checkSet,nodeCheck,isXML)}},find:{ID:function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?[m]:[]}},NAME:function(match,context){if(typeof context.getElementsByName!=="undefined"){var ret=[],results=context.getElementsByName(match[1]);for(var i=0,l=results.length;i<l;i++){if(results[i].getAttribute("name")===match[1]){ret.push(results[i])}}return ret.length===0?null:ret}},TAG:function(match,context){return context.getElementsByTagName(match[1])}},preFilter:{CLASS:function(match,curLoop,inplace,result,not,isXML){match=" "+match[1].replace(/\\/g,"")+" ";if(isXML){return match}for(var i=0,elem;(elem=curLoop[i])!=null;i++){if(elem){if(not^(elem.className&&(" "+elem.className+" ").replace(/[\t\n]/g," ").indexOf(match)>=0)){if(!inplace){result.push(elem)}}else{if(inplace){curLoop[i]=false}}}}return false},ID:function(match){return match[1].replace(/\\/g,"")},TAG:function(match,curLoop){return match[1].toLowerCase()},CHILD:function(match){if(match[1]==="nth"){var test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2]==="even"&&"2n"||match[2]==="odd"&&"2n+1"||!/\D/.test(match[2])&&"0n+"+match[2]||match[2]);match[2]=(test[1]+(test[2]||1))-0;match[3]=test[3]-0}match[0]=done++;return match},ATTR:function(match,curLoop,inplace,result,not,isXML){var name=match[1].replace(/\\/g,"");if(!isXML&&Expr.attrMap[name]){match[1]=Expr.attrMap[name]}if(match[2]==="~="){match[4]=" "+match[4]+" "}return match},PSEUDO:function(match,curLoop,inplace,result,not){if(match[1]==="not"){if((chunker.exec(match[3])||"").length>1||/^\w/.test(match[3])){match[3]=Sizzle(match[3],null,null,curLoop)}else{var ret=Sizzle.filter(match[3],curLoop,inplace,true^not);if(!inplace){result.push.apply(result,ret)}return false}}else{if(Expr.match.POS.test(match[0])||Expr.match.CHILD.test(match[0])){return true}}return match},POS:function(match){match.unshift(true);return match}},filters:{enabled:function(elem){return elem.disabled===false&&elem.type!=="hidden"},disabled:function(elem){return elem.disabled===true},checked:function(elem){return elem.checked===true},selected:function(elem){elem.parentNode.selectedIndex;return elem.selected===true},parent:function(elem){return !!elem.firstChild},empty:function(elem){return !elem.firstChild},has:function(elem,i,match){return !!Sizzle(match[3],elem).length},header:function(elem){return/h\d/i.test(elem.nodeName)},text:function(elem){return"text"===elem.type},radio:function(elem){return"radio"===elem.type},checkbox:function(elem){return"checkbox"===elem.type},file:function(elem){return"file"===elem.type},password:function(elem){return"password"===elem.type},submit:function(elem){return"submit"===elem.type},image:function(elem){return"image"===elem.type},reset:function(elem){return"reset"===elem.type},button:function(elem){return"button"===elem.type||elem.nodeName.toLowerCase()==="button"},input:function(elem){return/input|select|textarea|button/i.test(elem.nodeName)}},setFilters:{first:function(elem,i){return i===0},last:function(elem,i,match,array){return i===array.length-1},even:function(elem,i){return i%2===0},odd:function(elem,i){return i%2===1},lt:function(elem,i,match){return i<match[3]-0},gt:function(elem,i,match){return i>match[3]-0},nth:function(elem,i,match){return match[3]-0===i},eq:function(elem,i,match){return match[3]-0===i}},filter:{PSEUDO:function(elem,match,i,array){var name=match[1],filter=Expr.filters[name];if(filter){return filter(elem,i,match,array)}else{if(name==="contains"){return(elem.textContent||elem.innerText||getText([elem])||"").indexOf(match[3])>=0}else{if(name==="not"){var not=match[3];for(var i=0,l=not.length;i<l;i++){if(not[i]===elem){return false}}return true}else{throw"Syntax error, unrecognized expression: "+name}}}},CHILD:function(elem,match){var type=match[1],node=elem;switch(type){case"only":case"first":while((node=node.previousSibling)){if(node.nodeType===1){return false}}if(type==="first"){return true}node=elem;case"last":while((node=node.nextSibling)){if(node.nodeType===1){return false}}return true;case"nth":var first=match[2],last=match[3];if(first===1&&last===0){return true}var doneName=match[0],parent=elem.parentNode;if(parent&&(parent.sizcache!==doneName||!elem.nodeIndex)){var count=0;for(node=parent.firstChild;node;node=node.nextSibling){if(node.nodeType===1){node.nodeIndex=++count}}parent.sizcache=doneName}var diff=elem.nodeIndex-last;if(first===0){return diff===0}else{return(diff%first===0&&diff/first>=0)}}},ID:function(elem,match){return elem.nodeType===1&&elem.getAttribute("id")===match},TAG:function(elem,match){return(match==="*"&&elem.nodeType===1)||elem.nodeName.toLowerCase()===match},CLASS:function(elem,match){return(" "+(elem.className||elem.getAttribute("class"))+" ").indexOf(match)>-1},ATTR:function(elem,match){var name=match[1],result=Expr.attrHandle[name]?Expr.attrHandle[name](elem):elem[name]!=null?elem[name]:elem.getAttribute(name),value=result+"",type=match[2],check=match[4];return result==null?type==="!=":type==="="?value===check:type==="*="?value.indexOf(check)>=0:type==="~="?(" "+value+" ").indexOf(check)>=0:!check?value&&result!==false:type==="!="?value!==check:type==="^="?value.indexOf(check)===0:type==="$="?value.substr(value.length-check.length)===check:type==="|="?value===check||value.substr(0,check.length+1)===check+"-":false},POS:function(elem,match,i,array){var name=match[2],filter=Expr.setFilters[name];if(filter){return filter(elem,i,match,array)}}}};var origPOS=Expr.match.POS;for(var type in Expr.match){Expr.match[type]=new RegExp(Expr.match[type].source+/(?![^\[]*\])(?![^\(]*\))/.source);Expr.leftMatch[type]=new RegExp(/(^(?:.|\r|\n)*?)/.source+Expr.match[type].source)}var makeArray=function(array,results){array=Array.prototype.slice.call(array,0);if(results){results.push.apply(results,array);return results}return array};try{Array.prototype.slice.call(document.documentElement.childNodes,0)}catch(e){makeArray=function(array,results){var ret=results||[];if(toString.call(array)==="[object Array]"){Array.prototype.push.apply(ret,array)}else{if(typeof array.length==="number"){for(var i=0,l=array.length;i<l;i++){ret.push(array[i])}}else{for(var i=0;array[i];i++){ret.push(array[i])}}}return ret}}var sortOrder;if(document.documentElement.compareDocumentPosition){sortOrder=function(a,b){if(!a.compareDocumentPosition||!b.compareDocumentPosition){if(a==b){hasDuplicate=true}return a.compareDocumentPosition?-1:1}var ret=a.compareDocumentPosition(b)&4?-1:a===b?0:1;if(ret===0){hasDuplicate=true}return ret}}else{if("sourceIndex" in document.documentElement){sortOrder=function(a,b){if(!a.sourceIndex||!b.sourceIndex){if(a==b){hasDuplicate=true}return a.sourceIndex?-1:1}var ret=a.sourceIndex-b.sourceIndex;if(ret===0){hasDuplicate=true}return ret}}else{if(document.createRange){sortOrder=function(a,b){if(!a.ownerDocument||!b.ownerDocument){if(a==b){hasDuplicate=true}return a.ownerDocument?-1:1}var aRange=a.ownerDocument.createRange(),bRange=b.ownerDocument.createRange();aRange.setStart(a,0);aRange.setEnd(a,0);bRange.setStart(b,0);bRange.setEnd(b,0);var ret=aRange.compareBoundaryPoints(Range.START_TO_END,bRange);if(ret===0){hasDuplicate=true}return ret}}}}function getText(elems){var ret="",elem;for(var i=0;elems[i];i++){elem=elems[i];if(elem.nodeType===3||elem.nodeType===4){ret+=elem.nodeValue}else{if(elem.nodeType!==8){ret+=getText(elem.childNodes)}}}return ret}(function(){var form=document.createElement("div"),id="script"+(new Date).getTime();form.innerHTML="<a name='"+id+"'/>";var root=document.documentElement;root.insertBefore(form,root.firstChild);if(document.getElementById(id)){Expr.find.ID=function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?m.id===match[1]||typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id").nodeValue===match[1]?[m]:undefined:[]}};Expr.filter.ID=function(elem,match){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return elem.nodeType===1&&node&&node.nodeValue===match}}root.removeChild(form);root=form=null})();(function(){var div=document.createElement("div");div.appendChild(document.createComment(""));if(div.getElementsByTagName("*").length>0){Expr.find.TAG=function(match,context){var results=context.getElementsByTagName(match[1]);if(match[1]==="*"){var tmp=[];for(var i=0;results[i];i++){if(results[i].nodeType===1){tmp.push(results[i])}}results=tmp}return results}}div.innerHTML="<a href='#'></a>";if(div.firstChild&&typeof div.firstChild.getAttribute!=="undefined"&&div.firstChild.getAttribute("href")!=="#"){Expr.attrHandle.href=function(elem){return elem.getAttribute("href",2)}}div=null})();if(document.querySelectorAll){(function(){var oldSizzle=Sizzle,div=document.createElement("div");div.innerHTML="<p class='TEST'></p>";if(div.querySelectorAll&&div.querySelectorAll(".TEST").length===0){return}Sizzle=function(query,context,extra,seed){context=context||document;if(!seed&&context.nodeType===9&&!isXML(context)){try{return makeArray(context.querySelectorAll(query),extra)}catch(e){}}return oldSizzle(query,context,extra,seed)};for(var prop in oldSizzle){Sizzle[prop]=oldSizzle[prop]}div=null})()}(function(){var div=document.createElement("div");div.innerHTML="<div class='test e'></div><div class='test'></div>";if(!div.getElementsByClassName||div.getElementsByClassName("e").length===0){return}div.lastChild.className="e";if(div.getElementsByClassName("e").length===1){return}Expr.order.splice(1,0,"CLASS");Expr.find.CLASS=function(match,context,isXML){if(typeof context.getElementsByClassName!=="undefined"&&!isXML){return context.getElementsByClassName(match[1])}};div=null})();function dirNodeCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break}if(elem.nodeType===1&&!isXML){elem.sizcache=doneName;elem.sizset=i}if(elem.nodeName.toLowerCase()===cur){match=elem;break}elem=elem[dir]}checkSet[i]=match}}}function dirCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break}if(elem.nodeType===1){if(!isXML){elem.sizcache=doneName;elem.sizset=i}if(typeof cur!=="string"){if(elem===cur){match=true;break}}else{if(Sizzle.filter(cur,[elem]).length>0){match=elem;break}}}elem=elem[dir]}checkSet[i]=match}}}var contains=document.compareDocumentPosition?function(a,b){return a.compareDocumentPosition(b)&16}:function(a,b){return a!==b&&(a.contains?a.contains(b):true)};var isXML=function(elem){var documentElement=(elem?elem.ownerDocument||elem:0).documentElement;return documentElement?documentElement.nodeName!=="HTML":false};var posProcess=function(selector,context){var tmpSet=[],later="",match,root=context.nodeType?[context]:context;while((match=Expr.match.PSEUDO.exec(selector))){later+=match[0];selector=selector.replace(Expr.match.PSEUDO,"")}selector=Expr.relative[selector]?selector+"*":selector;for(var i=0,l=root.length;i<l;i++){Sizzle(selector,root[i],tmpSet)}return Sizzle.filter(later,tmpSet)};return Sizzle})();
/*
 * SWFObject v2.1 <http://code.google.com/p/swfobject/>
 * Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
 * This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 * Modified for inclusion in Shadowbox.js
 */
S.flash=(function(){var swfobject=function(){var UNDEF="undefined",OBJECT="object",SHOCKWAVE_FLASH="Shockwave Flash",SHOCKWAVE_FLASH_AX="ShockwaveFlash.ShockwaveFlash",FLASH_MIME_TYPE="application/x-shockwave-flash",EXPRESS_INSTALL_ID="SWFObjectExprInst",win=window,doc=document,nav=navigator,domLoadFnArr=[],regObjArr=[],objIdArr=[],listenersArr=[],script,timer=null,storedAltContent=null,storedAltContentId=null,isDomLoaded=false,isExpressInstallActive=false;var ua=function(){var w3cdom=typeof doc.getElementById!=UNDEF&&typeof doc.getElementsByTagName!=UNDEF&&typeof doc.createElement!=UNDEF,playerVersion=[0,0,0],d=null;if(typeof nav.plugins!=UNDEF&&typeof nav.plugins[SHOCKWAVE_FLASH]==OBJECT){d=nav.plugins[SHOCKWAVE_FLASH].description;if(d&&!(typeof nav.mimeTypes!=UNDEF&&nav.mimeTypes[FLASH_MIME_TYPE]&&!nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)){d=d.replace(/^.*\s+(\S+\s+\S+$)/,"$1");playerVersion[0]=parseInt(d.replace(/^(.*)\..*$/,"$1"),10);playerVersion[1]=parseInt(d.replace(/^.*\.(.*)\s.*$/,"$1"),10);playerVersion[2]=/r/.test(d)?parseInt(d.replace(/^.*r(.*)$/,"$1"),10):0}}else{if(typeof win.ActiveXObject!=UNDEF){var a=null,fp6Crash=false;try{a=new ActiveXObject(SHOCKWAVE_FLASH_AX+".7")}catch(e){try{a=new ActiveXObject(SHOCKWAVE_FLASH_AX+".6");playerVersion=[6,0,21];a.AllowScriptAccess="always"}catch(e){if(playerVersion[0]==6){fp6Crash=true}}if(!fp6Crash){try{a=new ActiveXObject(SHOCKWAVE_FLASH_AX)}catch(e){}}}if(!fp6Crash&&a){try{d=a.GetVariable("$version");if(d){d=d.split(" ")[1].split(",");playerVersion=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10)]}}catch(e){}}}}var u=nav.userAgent.toLowerCase(),p=nav.platform.toLowerCase(),webkit=/webkit/.test(u)?parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,ie=false,windows=p?/win/.test(p):/win/.test(u),mac=p?/mac/.test(p):/mac/.test(u);
/*@cc_on
			ie = true;
			@if (@_win32)
				windows = true;
			@elif (@_mac)
				mac = true;
			@end
		@*/
return{w3cdom:w3cdom,pv:playerVersion,webkit:webkit,ie:ie,win:windows,mac:mac}}();var onDomLoad=function(){if(!ua.w3cdom){return}addDomLoadEvent(main);if(ua.ie&&ua.win){try{doc.write("<script id=__ie_ondomload defer=true src=//:><\/script>");script=getElementById("__ie_ondomload");if(script){addListener(script,"onreadystatechange",checkReadyState)}}catch(e){}}if(ua.webkit&&typeof doc.readyState!=UNDEF){timer=setInterval(function(){if(/loaded|complete/.test(doc.readyState)){callDomLoadFunctions()}},10)}if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("DOMContentLoaded",callDomLoadFunctions,null)}addLoadEvent(callDomLoadFunctions)}();function checkReadyState(){if(script.readyState=="complete"){script.parentNode.removeChild(script);callDomLoadFunctions()}}function callDomLoadFunctions(){if(isDomLoaded){return}if(ua.ie&&ua.win){var s=createElement("span");try{var t=doc.getElementsByTagName("body")[0].appendChild(s);t.parentNode.removeChild(t)}catch(e){return}}isDomLoaded=true;if(timer){clearInterval(timer);timer=null}var dl=domLoadFnArr.length;for(var i=0;i<dl;i++){domLoadFnArr[i]()}}function addDomLoadEvent(fn){if(isDomLoaded){fn()}else{domLoadFnArr[domLoadFnArr.length]=fn}}function addLoadEvent(fn){if(typeof win.addEventListener!=UNDEF){win.addEventListener("load",fn,false)}else{if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("load",fn,false)}else{if(typeof win.attachEvent!=UNDEF){addListener(win,"onload",fn)}else{if(typeof win.onload=="function"){var fnOld=win.onload;win.onload=function(){fnOld();fn()}}else{win.onload=fn}}}}}function main(){var rl=regObjArr.length;for(var i=0;i<rl;i++){var id=regObjArr[i].id;if(ua.pv[0]>0){var obj=getElementById(id);if(obj){regObjArr[i].width=obj.getAttribute("width")?obj.getAttribute("width"):"0";regObjArr[i].height=obj.getAttribute("height")?obj.getAttribute("height"):"0";if(hasPlayerVersion(regObjArr[i].swfVersion)){if(ua.webkit&&ua.webkit<312){fixParams(obj)}setVisibility(id,true)}else{if(regObjArr[i].expressInstall&&!isExpressInstallActive&&hasPlayerVersion("6.0.65")&&(ua.win||ua.mac)){showExpressInstall(regObjArr[i])}else{displayAltContent(obj)}}}}else{setVisibility(id,true)}}}function fixParams(obj){var nestedObj=obj.getElementsByTagName(OBJECT)[0];if(nestedObj){var e=createElement("embed"),a=nestedObj.attributes;if(a){var al=a.length;for(var i=0;i<al;i++){if(a[i].nodeName=="DATA"){e.setAttribute("src",a[i].nodeValue)}else{e.setAttribute(a[i].nodeName,a[i].nodeValue)}}}var c=nestedObj.childNodes;if(c){var cl=c.length;for(var j=0;j<cl;j++){if(c[j].nodeType==1&&c[j].nodeName=="PARAM"){e.setAttribute(c[j].getAttribute("name"),c[j].getAttribute("value"))}}}obj.parentNode.replaceChild(e,obj)}}function showExpressInstall(regObj){isExpressInstallActive=true;var obj=getElementById(regObj.id);if(obj){if(regObj.altContentId){var ac=getElementById(regObj.altContentId);if(ac){storedAltContent=ac;storedAltContentId=regObj.altContentId}}else{storedAltContent=abstractAltContent(obj)}if(!(/%$/.test(regObj.width))&&parseInt(regObj.width,10)<310){regObj.width="310"}if(!(/%$/.test(regObj.height))&&parseInt(regObj.height,10)<137){regObj.height="137"}doc.title=doc.title.slice(0,47)+" - Flash Player Installation";var pt=ua.ie&&ua.win?"ActiveX":"PlugIn",dt=doc.title,fv="MMredirectURL="+win.location+"&MMplayerType="+pt+"&MMdoctitle="+dt,replaceId=regObj.id;if(ua.ie&&ua.win&&obj.readyState!=4){var newObj=createElement("div");replaceId+="SWFObjectNew";newObj.setAttribute("id",replaceId);obj.parentNode.insertBefore(newObj,obj);obj.style.display="none";var fn=function(){obj.parentNode.removeChild(obj)};addListener(win,"onload",fn)}createSWF({data:regObj.expressInstall,id:EXPRESS_INSTALL_ID,width:regObj.width,height:regObj.height},{flashvars:fv},replaceId)}}function displayAltContent(obj){if(ua.ie&&ua.win&&obj.readyState!=4){var el=createElement("div");obj.parentNode.insertBefore(el,obj);el.parentNode.replaceChild(abstractAltContent(obj),el);obj.style.display="none";var fn=function(){obj.parentNode.removeChild(obj)};addListener(win,"onload",fn)}else{obj.parentNode.replaceChild(abstractAltContent(obj),obj)}}function abstractAltContent(obj){var ac=createElement("div");if(ua.win&&ua.ie){ac.innerHTML=obj.innerHTML}else{var nestedObj=obj.getElementsByTagName(OBJECT)[0];if(nestedObj){var c=nestedObj.childNodes;if(c){var cl=c.length;for(var i=0;i<cl;i++){if(!(c[i].nodeType==1&&c[i].nodeName=="PARAM")&&!(c[i].nodeType==8)){ac.appendChild(c[i].cloneNode(true))}}}}}return ac}function createSWF(attObj,parObj,id){var r,el=getElementById(id);if(el){if(typeof attObj.id==UNDEF){attObj.id=id}if(ua.ie&&ua.win){var att="";for(var i in attObj){if(attObj[i]!=Object.prototype[i]){if(i.toLowerCase()=="data"){parObj.movie=attObj[i]}else{if(i.toLowerCase()=="styleclass"){att+=' class="'+attObj[i]+'"'}else{if(i.toLowerCase()!="classid"){att+=" "+i+'="'+attObj[i]+'"'}}}}}var par="";for(var j in parObj){if(parObj[j]!=Object.prototype[j]){par+='<param name="'+j+'" value="'+parObj[j]+'" />'}}el.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+att+">"+par+"</object>";objIdArr[objIdArr.length]=attObj.id;r=getElementById(attObj.id)}else{if(ua.webkit&&ua.webkit<312){var e=createElement("embed");e.setAttribute("type",FLASH_MIME_TYPE);for(var k in attObj){if(attObj[k]!=Object.prototype[k]){if(k.toLowerCase()=="data"){e.setAttribute("src",attObj[k])}else{if(k.toLowerCase()=="styleclass"){e.setAttribute("class",attObj[k])}else{if(k.toLowerCase()!="classid"){e.setAttribute(k,attObj[k])}}}}}for(var l in parObj){if(parObj[l]!=Object.prototype[l]){if(l.toLowerCase()!="movie"){e.setAttribute(l,parObj[l])}}}el.parentNode.replaceChild(e,el);r=e}else{var o=createElement(OBJECT);o.setAttribute("type",FLASH_MIME_TYPE);for(var m in attObj){if(attObj[m]!=Object.prototype[m]){if(m.toLowerCase()=="styleclass"){o.setAttribute("class",attObj[m])}else{if(m.toLowerCase()!="classid"){o.setAttribute(m,attObj[m])}}}}for(var n in parObj){if(parObj[n]!=Object.prototype[n]&&n.toLowerCase()!="movie"){createObjParam(o,n,parObj[n])}}el.parentNode.replaceChild(o,el);r=o}}}return r}function createObjParam(el,pName,pValue){var p=createElement("param");p.setAttribute("name",pName);p.setAttribute("value",pValue);el.appendChild(p)}function removeSWF(id){var obj=getElementById(id);if(obj&&(obj.nodeName=="OBJECT"||obj.nodeName=="EMBED")){if(ua.ie&&ua.win){if(obj.readyState==4){removeObjectInIE(id)}else{win.attachEvent("onload",function(){removeObjectInIE(id)})}}else{obj.parentNode.removeChild(obj)}}}function removeObjectInIE(id){var obj=getElementById(id);if(obj){for(var i in obj){if(typeof obj[i]=="function"){obj[i]=null}}obj.parentNode.removeChild(obj)}}function getElementById(id){var el=null;try{el=doc.getElementById(id)}catch(e){}return el}function createElement(el){return doc.createElement(el)}function addListener(target,eventType,fn){target.attachEvent(eventType,fn);listenersArr[listenersArr.length]=[target,eventType,fn]}function hasPlayerVersion(rv){var pv=ua.pv,v=rv.split(".");v[0]=parseInt(v[0],10);v[1]=parseInt(v[1],10)||0;v[2]=parseInt(v[2],10)||0;return(pv[0]>v[0]||(pv[0]==v[0]&&pv[1]>v[1])||(pv[0]==v[0]&&pv[1]==v[1]&&pv[2]>=v[2]))?true:false}function createCSS(sel,decl){if(ua.ie&&ua.mac){return}var h=doc.getElementsByTagName("head")[0],s=createElement("style");s.setAttribute("type","text/css");s.setAttribute("media","screen");if(!(ua.ie&&ua.win)&&typeof doc.createTextNode!=UNDEF){s.appendChild(doc.createTextNode(sel+" {"+decl+"}"))}h.appendChild(s);if(ua.ie&&ua.win&&typeof doc.styleSheets!=UNDEF&&doc.styleSheets.length>0){var ls=doc.styleSheets[doc.styleSheets.length-1];if(typeof ls.addRule==OBJECT){ls.addRule(sel,decl)}}}function setVisibility(id,isVisible){var v=isVisible?"visible":"hidden";if(isDomLoaded&&getElementById(id)){getElementById(id).style.visibility=v}else{createCSS("#"+id,"visibility:"+v)}}function urlEncodeIfNecessary(s){var regex=/[\\\"<>\.;]/;var hasBadChars=regex.exec(s)!=null;return hasBadChars?encodeURIComponent(s):s}var cleanup=function(){if(ua.ie&&ua.win){window.attachEvent("onunload",function(){var ll=listenersArr.length;for(var i=0;i<ll;i++){listenersArr[i][0].detachEvent(listenersArr[i][1],listenersArr[i][2])}var il=objIdArr.length;for(var j=0;j<il;j++){removeSWF(objIdArr[j])}for(var k in ua){ua[k]=null}ua=null;for(var l in swfobject){swfobject[l]=null}swfobject=null})}}();return{registerObject:function(objectIdStr,swfVersionStr,xiSwfUrlStr){if(!ua.w3cdom||!objectIdStr||!swfVersionStr){return}var regObj={};regObj.id=objectIdStr;regObj.swfVersion=swfVersionStr;regObj.expressInstall=xiSwfUrlStr?xiSwfUrlStr:false;regObjArr[regObjArr.length]=regObj;setVisibility(objectIdStr,false)},getObjectById:function(objectIdStr){var r=null;if(ua.w3cdom){var o=getElementById(objectIdStr);if(o){var n=o.getElementsByTagName(OBJECT)[0];if(!n||(n&&typeof o.SetVariable!=UNDEF)){r=o}else{if(typeof n.SetVariable!=UNDEF){r=n}}}}return r},embedSWF:function(swfUrlStr,replaceElemIdStr,widthStr,heightStr,swfVersionStr,xiSwfUrlStr,flashvarsObj,parObj,attObj){if(!ua.w3cdom||!swfUrlStr||!replaceElemIdStr||!widthStr||!heightStr||!swfVersionStr){return}widthStr+="";heightStr+="";if(hasPlayerVersion(swfVersionStr)){setVisibility(replaceElemIdStr,false);var att={};if(attObj&&typeof attObj===OBJECT){for(var i in attObj){if(attObj[i]!=Object.prototype[i]){att[i]=attObj[i]}}}att.data=swfUrlStr;att.width=widthStr;att.height=heightStr;var par={};if(parObj&&typeof parObj===OBJECT){for(var j in parObj){if(parObj[j]!=Object.prototype[j]){par[j]=parObj[j]}}}if(flashvarsObj&&typeof flashvarsObj===OBJECT){for(var k in flashvarsObj){if(flashvarsObj[k]!=Object.prototype[k]){if(typeof par.flashvars!=UNDEF){par.flashvars+="&"+k+"="+flashvarsObj[k]}else{par.flashvars=k+"="+flashvarsObj[k]}}}}addDomLoadEvent(function(){createSWF(att,par,replaceElemIdStr);if(att.id==replaceElemIdStr){setVisibility(replaceElemIdStr,true)}})}else{if(xiSwfUrlStr&&!isExpressInstallActive&&hasPlayerVersion("6.0.65")&&(ua.win||ua.mac)){isExpressInstallActive=true;setVisibility(replaceElemIdStr,false);addDomLoadEvent(function(){var regObj={};regObj.id=regObj.altContentId=replaceElemIdStr;regObj.width=widthStr;regObj.height=heightStr;regObj.expressInstall=xiSwfUrlStr;showExpressInstall(regObj)})}}},getFlashPlayerVersion:function(){return{major:ua.pv[0],minor:ua.pv[1],release:ua.pv[2]}},hasFlashPlayerVersion:hasPlayerVersion,createSWF:function(attObj,parObj,replaceElemIdStr){if(ua.w3cdom){return createSWF(attObj,parObj,replaceElemIdStr)}else{return undefined}},removeSWF:function(objElemIdStr){if(ua.w3cdom){removeSWF(objElemIdStr)}},createCSS:function(sel,decl){if(ua.w3cdom){createCSS(sel,decl)}},addDomLoadEvent:addDomLoadEvent,addLoadEvent:addLoadEvent,getQueryParamValue:function(param){var q=doc.location.search||doc.location.hash;if(param==null){return urlEncodeIfNecessary(q)}if(q){var pairs=q.substring(1).split("&");for(var i=0;i<pairs.length;i++){if(pairs[i].substring(0,pairs[i].indexOf("="))==param){return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(isExpressInstallActive&&storedAltContent){var obj=getElementById(EXPRESS_INSTALL_ID);if(obj){obj.parentNode.replaceChild(storedAltContent,obj);if(storedAltContentId){setVisibility(storedAltContentId,true);if(ua.ie&&ua.win){storedAltContent.style.display="block"}}storedAltContent=null;storedAltContentId=null;isExpressInstallActive=false}}}}}();return swfobject})();S.lang={code:"fr",of:"de",loading:"chargement",cancel:"Annuler",next:"Suivant",previous:"Précédent",play:"Lire",pause:"Pause",close:"Fermer",errors:{single:'Vous devez installer le plugin <a href="{0}">{1}</a> pour afficher ce contenu.',shared:'Vous devez installer les plugins <a href="{0}">{1}</a> et <a href="{2}">{3}</a> pour afficher ce contenu.',either:'Vous devez installer le plugin <a href="{0}">{1}</a> ou <a href="{2}">{3}</a> pour afficher ce contenu.'}};var pre,proxyId="sb-drag-proxy",dragData,dragProxy,dragTarget;function resetDrag(){dragData={x:0,y:0,startX:null,startY:null}}function updateProxy(){var dims=S.dimensions;apply(dragProxy.style,{height:dims.innerHeight+"px",width:dims.innerWidth+"px"})}function enableDrag(){resetDrag();var style=["position:absolute","cursor:"+(S.isGecko?"-moz-grab":"move"),"background-color:"+(S.isIE?"#fff;filter:alpha(opacity=0)":"transparent")].join(";");S.appendHTML(S.skin.body,'<div id="'+proxyId+'" style="'+style+'"></div>');dragProxy=get(proxyId);updateProxy();addEvent(dragProxy,"mousedown",startDrag)}function disableDrag(){if(dragProxy){removeEvent(dragProxy,"mousedown",startDrag);remove(dragProxy);dragProxy=null}dragTarget=null}function startDrag(e){preventDefault(e);var xy=getPageXY(e);dragData.startX=xy[0];dragData.startY=xy[1];dragTarget=get(S.player.id);addEvent(document,"mousemove",positionDrag);addEvent(document,"mouseup",endDrag);if(S.isGecko){dragProxy.style.cursor="-moz-grabbing"}}function positionDrag(e){var player=S.player,dims=S.dimensions,xy=getPageXY(e);var moveX=xy[0]-dragData.startX;dragData.startX+=moveX;dragData.x=Math.max(Math.min(0,dragData.x+moveX),dims.innerWidth-player.width);var moveY=xy[1]-dragData.startY;dragData.startY+=moveY;dragData.y=Math.max(Math.min(0,dragData.y+moveY),dims.innerHeight-player.height);apply(dragTarget.style,{left:dragData.x+"px",top:dragData.y+"px"})}function endDrag(){removeEvent(document,"mousemove",positionDrag);removeEvent(document,"mouseup",endDrag);if(S.isGecko){dragProxy.style.cursor="-moz-grab"}}S.img=function(obj,id){this.obj=obj;this.id=id;this.ready=false;var self=this;pre=new Image();pre.onload=function(){self.height=obj.height?parseInt(obj.height,10):pre.height;self.width=obj.width?parseInt(obj.width,10):pre.width;self.ready=true;pre.onload=null;pre=null};pre.src=obj.content};S.img.ext=["bmp","gif","jpg","jpeg","png"];S.img.prototype={append:function(body,dims){var img=document.createElement("img");img.id=this.id;img.src=this.obj.content;img.style.position="absolute";var height,width;if(dims.oversized&&S.options.handleOversize=="resize"){height=dims.innerHeight;width=dims.innerWidth}else{height=this.height;width=this.width}img.setAttribute("height",height);img.setAttribute("width",width);body.appendChild(img)},remove:function(){var el=get(this.id);if(el){remove(el)}disableDrag();if(pre){pre.onload=null;pre=null}},onLoad:function(){var dims=S.dimensions;if(dims.oversized&&S.options.handleOversize=="drag"){enableDrag()}},onWindowResize:function(){var dims=S.dimensions;switch(S.options.handleOversize){case"resize":var el=get(this.id);el.height=dims.innerHeight;el.width=dims.innerWidth;break;case"drag":if(dragTarget){var top=parseInt(S.getStyle(dragTarget,"top")),left=parseInt(S.getStyle(dragTarget,"left"));if(top+this.height<dims.innerHeight){dragTarget.style.top=dims.innerHeight-this.height+"px"}if(left+this.width<dims.innerWidth){dragTarget.style.left=dims.innerWidth-this.width+"px"}updateProxy()}break}}};S.iframe=function(obj,id){this.obj=obj;this.id=id;var overlay=get("sb-overlay");this.height=obj.height?parseInt(obj.height,10):overlay.offsetHeight;this.width=obj.width?parseInt(obj.width,10):overlay.offsetWidth};S.iframe.prototype={append:function(body,dims){var html='<iframe id="'+this.id+'" name="'+this.id+'" height="100%" width="100%" frameborder="0" marginwidth="0" marginheight="0" style="visibility:hidden" onload="this.style.visibility=\'visible\'" scrolling="auto"';if(S.isIE){html+=' allowtransparency="true"';if(S.isIE6){html+=" src=\"javascript:false;document.write('');\""}}html+="></iframe>";body.innerHTML=html},remove:function(){var el=get(this.id);if(el){remove(el);if(S.isGecko){delete window.frames[this.id]}}},onLoad:function(){var win=S.isIE?get(this.id).contentWindow:window.frames[this.id];win.location.href=this.obj.content}};S.html=function(obj,id){this.obj=obj;this.id=id;this.height=obj.height?parseInt(obj.height,10):300;this.width=obj.width?parseInt(obj.width,10):500};S.html.prototype={append:function(body,dims){var div=document.createElement("div");div.id=this.id;div.className="html";div.innerHTML=this.obj.content;body.appendChild(div)},remove:function(){var el=get(this.id);if(el){remove(el)}}};S.swf=function(obj,id){this.obj=obj;this.id=id;this.height=obj.height?parseInt(obj.height,10):300;this.width=obj.width?parseInt(obj.width,10):300};S.swf.ext=["swf"];S.swf.prototype={append:function(body,dims){var tmp=document.createElement("div");tmp.id=this.id;body.appendChild(tmp);var height=dims.innerHeight,width=dims.innerWidth,swf=this.obj.content,version=S.options.flashVersion,express=S.path+"expressInstall.swf",flashvars=S.options.flashVars,params=S.options.flashParams;S.flash.embedSWF(swf,this.id,width,height,version,express,flashvars,params)},remove:function(){S.flash.expressInstallCallback();S.flash.removeSWF(this.id)},onWindowResize:function(){var dims=S.dimensions,el=get(this.id);el.height=dims.innerHeight;el.width=dims.innerWidth}};var jwControllerHeight=20;S.flv=function(obj,id){this.obj=obj;this.id=id;this.height=obj.height?parseInt(obj.height,10):300;if(S.options.showMovieControls){this.height+=jwControllerHeight}this.width=obj.width?parseInt(obj.width,10):300};S.flv.ext=["flv","m4v"];S.flv.prototype={append:function(body,dims){var tmp=document.createElement("div");tmp.id=this.id;body.appendChild(tmp);var height=dims.innerHeight,width=dims.innerWidth,swf=S.path+"player.swf",version=S.options.flashVersion,express=S.path+"expressInstall.swf",flashvars=apply({file:this.obj.content,height:height,width:width,autostart:(S.options.autoplayMovies?"true":"false"),controlbar:(S.options.showMovieControls?"bottom":"none"),backcolor:"0x000000",frontcolor:"0xCCCCCC",lightcolor:"0x557722"},S.options.flashVars),params=S.options.flashParams;S.flash.embedSWF(swf,this.id,width,height,version,express,flashvars,params)},remove:function(){S.flash.expressInstallCallback();S.flash.removeSWF(this.id)},onWindowResize:function(){var dims=S.dimensions,el=get(this.id);el.height=dims.innerHeight;el.width=dims.innerWidth}};var qtControllerHeight=16;S.qt=function(obj,id){this.obj=obj;this.id=id;this.height=obj.height?parseInt(obj.height,10):300;if(S.options.showMovieControls){this.height+=qtControllerHeight}this.width=obj.width?parseInt(obj.width,10):300};S.qt.ext=["dv","mov","moov","movie","mp4","avi","mpg","mpeg"];S.qt.prototype={append:function(body,dims){var opt=S.options,autoplay=String(opt.autoplayMovies),controls=String(opt.showMovieControls);var html="<object",movie={id:this.id,name:this.id,height:this.height,width:this.width,kioskmode:"true"};if(S.isIE){movie.classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";movie.codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0"}else{movie.type="video/quicktime";movie.data=this.obj.content}for(var m in movie){html+=" "+m+'="'+movie[m]+'"'}html+=">";var params={src:this.obj.content,scale:"aspect",controller:controls,autoplay:autoplay};for(var p in params){html+='<param name="'+p+'" value="'+params[p]+'">'}html+="</object>";body.innerHTML=html},remove:function(){try{document[this.id].Stop()}catch(e){}var el=get(this.id);if(el){remove(el)}}};var wmpControllerHeight=(S.isIE?70:45);S.wmp=function(obj,id){this.obj=obj;this.id=id;this.height=obj.height?parseInt(obj.height,10):300;if(S.options.showMovieControls){this.height+=wmpControllerHeight}this.width=obj.width?parseInt(obj.width,10):300};S.wmp.ext=["asf","avi","mpg","mpeg","wm","wmv"];S.wmp.prototype={append:function(body,dims){var opt=S.options,autoplay=opt.autoplayMovies?1:0;var movie='<object id="'+this.id+'" name="'+this.id+'" height="'+this.height+'" width="'+this.width+'"',params={autostart:opt.autoplayMovies?1:0};if(S.isIE){movie+=' classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6"';params.url=this.obj.content;params.uimode=opt.showMovieControls?"full":"none"}else{movie+=' type="video/x-ms-wmv"';movie+=' data="'+this.obj.content+'"';params.showcontrols=opt.showMovieControls?1:0}movie+=">";for(var p in params){movie+='<param name="'+p+'" value="'+params[p]+'">'}movie+="</object>";body.innerHTML=movie},remove:function(){if(S.isIE){try{window[this.id].controls.stop();window[this.id].URL="movie"+now()+".wmv";window[this.id]=function(){}}catch(e){}}var el=get(this.id);if(el){setTimeout(function(){remove(el)},10)}}};var overlayOn=false,visibilityCache=[],pngIds=["sb-nav-close","sb-nav-next","sb-nav-play","sb-nav-pause","sb-nav-previous"],container,overlay,wrapper,doWindowResize=true;function animate(el,property,to,duration,callback){var isOpacity=(property=="opacity"),anim=isOpacity?S.setOpacity:function(el,value){el.style[property]=""+value+"px"};if(duration==0||(!isOpacity&&!S.options.animate)||(isOpacity&&!S.options.animateFade)){anim(el,to);if(callback){callback()}return}var from=parseFloat(S.getStyle(el,property))||0;var delta=to-from;if(delta==0){if(callback){callback()}return}duration*=1000;var begin=now(),ease=S.ease,end=begin+duration,time;var interval=setInterval(function(){time=now();if(time>=end){clearInterval(interval);interval=null;anim(el,to);if(callback){callback()}}else{anim(el,from+ease((time-begin)/duration)*delta)}},10)}function setSize(){container.style.height=S.getWindowSize("Height")+"px";container.style.width=S.getWindowSize("Width")+"px"}function setPosition(){container.style.top=document.documentElement.scrollTop+"px";container.style.left=document.documentElement.scrollLeft+"px"}function toggleTroubleElements(on){if(on){each(visibilityCache,function(i,el){el[0].style.visibility=el[1]||""})}else{visibilityCache=[];each(S.options.troubleElements,function(i,tag){each(document.getElementsByTagName(tag),function(j,el){visibilityCache.push([el,el.style.visibility]);el.style.visibility="hidden"})})}}function toggleNav(id,on){var el=get("sb-nav-"+id);if(el){el.style.display=on?"":"none"}}function toggleLoading(on,callback){var loading=get("sb-loading"),playerName=S.getCurrent().player,anim=(playerName=="img"||playerName=="html");if(on){S.setOpacity(loading,0);loading.style.display="block";var wrapped=function(){S.clearOpacity(loading);if(callback){callback()}};if(anim){animate(loading,"opacity",1,S.options.fadeDuration,wrapped)}else{wrapped()}}else{var wrapped=function(){loading.style.display="none";S.clearOpacity(loading);if(callback){callback()}};if(anim){animate(loading,"opacity",0,S.options.fadeDuration,wrapped)}else{wrapped()}}}function buildBars(callback){var obj=S.getCurrent();get("sb-title-inner").innerHTML=obj.title||"";var close,next,play,pause,previous;if(S.options.displayNav){close=true;var len=S.gallery.length;if(len>1){if(S.options.continuous){next=previous=true}else{next=(len-1)>S.current;previous=S.current>0}}if(S.options.slideshowDelay>0&&S.hasNext()){pause=!S.isPaused();play=!pause}}else{close=next=play=pause=previous=false}toggleNav("close",close);toggleNav("next",next);toggleNav("play",play);toggleNav("pause",pause);toggleNav("previous",previous);var counter="";if(S.options.displayCounter&&S.gallery.length>1){var len=S.gallery.length;if(S.options.counterType=="skip"){var i=0,end=len,limit=parseInt(S.options.counterLimit)||0;if(limit<len&&limit>2){var h=Math.floor(limit/2);i=S.current-h;if(i<0){i+=len}end=S.current+(limit-h);if(end>len){end-=len}}while(i!=end){if(i==len){i=0}counter+='<a onclick="Shadowbox.change('+i+');"';if(i==S.current){counter+=' class="sb-counter-current"'}counter+=">"+(++i)+"</a>"}}else{counter=[S.current+1,S.lang.of,len].join(" ")}}get("sb-counter").innerHTML=counter;callback()}function showBars(callback){var titleInner=get("sb-title-inner"),infoInner=get("sb-info-inner"),duration=0.35;titleInner.style.visibility=infoInner.style.visibility="";if(titleInner.innerHTML!=""){animate(titleInner,"marginTop",0,duration)}animate(infoInner,"marginTop",0,duration,callback)}function hideBars(anim,callback){var title=get("sb-title"),info=get("sb-info"),titleHeight=title.offsetHeight,infoHeight=info.offsetHeight,titleInner=get("sb-title-inner"),infoInner=get("sb-info-inner"),duration=(anim?0.35:0);animate(titleInner,"marginTop",titleHeight,duration);animate(infoInner,"marginTop",infoHeight*-1,duration,function(){titleInner.style.visibility=infoInner.style.visibility="hidden";callback()})}function adjustHeight(height,top,anim,callback){var wrapperInner=get("sb-wrapper-inner"),duration=(anim?S.options.resizeDuration:0);animate(wrapper,"top",top,duration);animate(wrapperInner,"height",height,duration,callback)}function adjustWidth(width,left,anim,callback){var duration=(anim?S.options.resizeDuration:0);animate(wrapper,"left",left,duration);animate(wrapper,"width",width,duration,callback)}function setDimensions(height,width){var bodyInner=get("sb-body-inner"),height=parseInt(height),width=parseInt(width),topBottom=wrapper.offsetHeight-bodyInner.offsetHeight,leftRight=wrapper.offsetWidth-bodyInner.offsetWidth,maxHeight=overlay.offsetHeight,maxWidth=overlay.offsetWidth,padding=parseInt(S.options.viewportPadding)||20,preserveAspect=(S.player&&S.options.handleOversize!="drag");return S.setDimensions(height,width,maxHeight,maxWidth,topBottom,leftRight,padding,preserveAspect)}var K={};K.markup='<div id="sb-container"><div id="sb-overlay"></div><div id="sb-wrapper"><div id="sb-title"><div id="sb-title-inner"></div></div><div id="sb-wrapper-inner"><div id="sb-body"><div id="sb-body-inner"></div><div id="sb-loading"><div id="sb-loading-inner"><span>{loading}</span></div></div></div></div><div id="sb-info"><div id="sb-info-inner"><div id="sb-counter"></div><div id="sb-nav"><a id="sb-nav-close" title="{close}" onclick="Shadowbox.close()"></a><a id="sb-nav-next" title="{next}" onclick="Shadowbox.next()"></a><a id="sb-nav-play" title="{play}" onclick="Shadowbox.play()"></a><a id="sb-nav-pause" title="{pause}" onclick="Shadowbox.pause()"></a><a id="sb-nav-previous" title="{previous}" onclick="Shadowbox.previous()"></a></div></div></div></div></div>';K.options={animSequence:"sync",counterLimit:10,counterType:"default",displayCounter:true,displayNav:true,fadeDuration:0.35,initialHeight:160,initialWidth:320,modal:false,overlayColor:"#000",overlayOpacity:0.5,resizeDuration:0.35,showOverlay:true,troubleElements:["select","object","embed","canvas"]};K.init=function(){S.appendHTML(document.body,sprintf(K.markup,S.lang));K.body=get("sb-body-inner");container=get("sb-container");overlay=get("sb-overlay");wrapper=get("sb-wrapper");if(!supportsFixed){container.style.position="absolute"}if(!supportsOpacity){var el,m,re=/url\("(.*\.png)"\)/;each(pngIds,function(i,id){el=get(id);if(el){m=S.getStyle(el,"backgroundImage").match(re);if(m){el.style.backgroundImage="none";el.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="+m[1]+",sizingMethod=scale);"}}})}var timer;addEvent(window,"resize",function(){if(timer){clearTimeout(timer);timer=null}if(open){timer=setTimeout(K.onWindowResize,10)}})};K.onOpen=function(obj,callback){doWindowResize=false;container.style.display="block";setSize();var dims=setDimensions(S.options.initialHeight,S.options.initialWidth);adjustHeight(dims.innerHeight,dims.top);adjustWidth(dims.width,dims.left);if(S.options.showOverlay){overlay.style.backgroundColor=S.options.overlayColor;S.setOpacity(overlay,0);if(!S.options.modal){addEvent(overlay,"click",S.close)}overlayOn=true}if(!supportsFixed){setPosition();addEvent(window,"scroll",setPosition)}toggleTroubleElements();container.style.visibility="visible";if(overlayOn){animate(overlay,"opacity",S.options.overlayOpacity,S.options.fadeDuration,callback)}else{callback()}};K.onLoad=function(changing,callback){toggleLoading(true);while(K.body.firstChild){remove(K.body.firstChild)}hideBars(changing,function(){if(!open){return}if(!changing){wrapper.style.visibility="visible"}buildBars(callback)})};K.onReady=function(callback){if(!open){return}var player=S.player,dims=setDimensions(player.height,player.width);var wrapped=function(){showBars(callback)};switch(S.options.animSequence){case"hw":adjustHeight(dims.innerHeight,dims.top,true,function(){adjustWidth(dims.width,dims.left,true,wrapped)});break;case"wh":adjustWidth(dims.width,dims.left,true,function(){adjustHeight(dims.innerHeight,dims.top,true,wrapped)});break;default:adjustWidth(dims.width,dims.left,true);adjustHeight(dims.innerHeight,dims.top,true,wrapped)}};K.onShow=function(callback){toggleLoading(false,callback);doWindowResize=true};K.onClose=function(){if(!supportsFixed){removeEvent(window,"scroll",setPosition)}removeEvent(overlay,"click",S.close);wrapper.style.visibility="hidden";var callback=function(){container.style.visibility="hidden";container.style.display="none";toggleTroubleElements(true)};if(overlayOn){animate(overlay,"opacity",0,S.options.fadeDuration,callback)}else{callback()}};K.onPlay=function(){toggleNav("play",false);toggleNav("pause",true)};K.onPause=function(){toggleNav("pause",false);toggleNav("play",true)};K.onWindowResize=function(){if(!doWindowResize){return}setSize();var player=S.player,dims=setDimensions(player.height,player.width);adjustWidth(dims.width,dims.left);adjustHeight(dims.innerHeight,dims.top);if(player.onWindowResize){player.onWindowResize()}};S.skin=K;window.Shadowbox=S})(window);;
(function ($) {

// Check that shadowbox library is available
if (typeof Shadowbox === 'undefined') return;

Drupal.behaviors.shadowbox = {
  attach: function(context, settings) { 
    Shadowbox.init(Drupal.settings.shadowbox);
    if ($('iframe#sb-player', top.document).length == 0) {
      if (settings.shadowbox.auto_enable_all_images == 1) {
        $("a[href$='.jpg'], a[href$='.png'], a[href$='.gif'], a[href$='.jpeg'], a[href$='.bmp'], a[href$='.JPG'], a[href$='.PNG'], a[href$='.GIF'], a[href$='.JPEG'], a[href$='.BMP']").each(function() {
          if ($(this).attr('rel') == '') {
            if (settings.shadowbox.auto_gallery == 1) {
              $(this).attr('rel', 'shadowbox[gallery]');
            }
            else {
              $(this).attr('rel', 'shadowbox');
            }
          }
        });
      }
    }
    Shadowbox.clearCache();
    Shadowbox.setup();
  }
};

})(jQuery);

;
/*! jquery.cookie v1.4.1 | MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(require("jquery")):a(jQuery)}(function(a){function b(a){return h.raw?a:encodeURIComponent(a)}function c(a){return h.raw?a:decodeURIComponent(a)}function d(a){return b(h.json?JSON.stringify(a):String(a))}function e(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return a=decodeURIComponent(a.replace(g," ")),h.json?JSON.parse(a):a}catch(b){}}function f(b,c){var d=h.raw?b:e(b);return a.isFunction(c)?c(d):d}var g=/\+/g,h=a.cookie=function(e,g,i){if(void 0!==g&&!a.isFunction(g)){if(i=a.extend({},h.defaults,i),"number"==typeof i.expires){var j=i.expires,k=i.expires=new Date;k.setTime(+k+864e5*j)}return document.cookie=[b(e),"=",d(g),i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}for(var l=e?void 0:{},m=document.cookie?document.cookie.split("; "):[],n=0,o=m.length;o>n;n++){var p=m[n].split("="),q=c(p.shift()),r=p.join("=");if(e&&e===q){l=f(r,g);break}e||void 0===(r=f(r))||(l[q]=r)}return l};h.defaults={},a.removeCookie=function(b,c){return void 0===a.cookie(b)?!1:(a.cookie(b,"",a.extend({},c,{expires:-1})),!a.cookie(b))}});;
/*!
 * jQuery Form Plugin
 * version: 4.2.1
 * Requires jQuery v1.7 or later
 * Copyright 2017 Kevin Morris
 * Copyright 2006 M. Alsup
 * Project repository: https://github.com/jquery-form/form
 * Dual licensed under the MIT and LGPLv3 licenses.
 * https://github.com/jquery-form/form#license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";function b(b){var c=b.data;b.isDefaultPrevented()||(b.preventDefault(),a(b.target).closest("form").ajaxSubmit(c))}function c(b){var c=b.target,d=a(c);if(!d.is("[type=submit],[type=image]")){var e=d.closest("[type=submit]");if(0===e.length)return;c=e[0]}var f=c.form;if(f.clk=c,"image"===c.type)if(void 0!==b.offsetX)f.clk_x=b.offsetX,f.clk_y=b.offsetY;else if("function"==typeof a.fn.offset){var g=d.offset();f.clk_x=b.pageX-g.left,f.clk_y=b.pageY-g.top}else f.clk_x=b.pageX-c.offsetLeft,f.clk_y=b.pageY-c.offsetTop;setTimeout(function(){f.clk=f.clk_x=f.clk_y=null},100)}function d(){if(a.fn.ajaxSubmit.debug){var b="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(b):window.opera&&window.opera.postError&&window.opera.postError(b)}}var e={};e.fileapi=void 0!==a('<input type="file">').get(0).files,e.formdata=void 0!==window.FormData;var f=!!a.fn.prop;a.fn.attr2=function(){if(!f)return this.attr.apply(this,arguments);var a=this.prop.apply(this,arguments);return a&&a.jquery||"string"==typeof a?a:this.attr.apply(this,arguments)},a.fn.ajaxSubmit=function(b,c,g,h){function i(c){var d,e,f=a.param(c,b.traditional).split("&"),g=f.length,h=[];for(d=0;d<g;d++)f[d]=f[d].replace(/\+/g," "),e=f[d].split("="),h.push([decodeURIComponent(e[0]),decodeURIComponent(e[1])]);return h}function j(c){for(var d=new FormData,e=0;e<c.length;e++)d.append(c[e].name,c[e].value);if(b.extraData){var f=i(b.extraData);for(e=0;e<f.length;e++)f[e]&&d.append(f[e][0],f[e][1])}b.data=null;var g=a.extend(!0,{},a.ajaxSettings,b,{contentType:!1,processData:!1,cache:!1,type:l||"POST"});b.uploadProgress&&(g.xhr=function(){var c=a.ajaxSettings.xhr();return c.upload&&c.upload.addEventListener("progress",function(a){var c=0,d=a.loaded||a.position,e=a.total;a.lengthComputable&&(c=Math.ceil(d/e*100)),b.uploadProgress(a,d,e,c)},!1),c}),g.data=null;var h=g.beforeSend;return g.beforeSend=function(a,c){b.formData?c.data=b.formData:c.data=d,h&&h.call(this,a,c)},a.ajax(g)}function k(c){function e(a){var b=null;try{a.contentWindow&&(b=a.contentWindow.document)}catch(a){d("cannot get iframe.contentWindow document: "+a)}if(b)return b;try{b=a.contentDocument?a.contentDocument:a.document}catch(c){d("cannot get iframe.contentDocument: "+c),b=a.document}return b}function g(){function b(){try{var a=e(q).readyState;d("state = "+a),a&&"uninitialized"===a.toLowerCase()&&setTimeout(b,50)}catch(a){d("Server abort: ",a," (",a.name,")"),h(2),w&&clearTimeout(w),w=void 0}}var c=o.attr2("target"),f=o.attr2("action"),g=o.attr("enctype")||o.attr("encoding")||"multipart/form-data";x.setAttribute("target",n),l&&!/post/i.test(l)||x.setAttribute("method","POST"),f!==k.url&&x.setAttribute("action",k.url),k.skipEncodingOverride||l&&!/post/i.test(l)||o.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),k.timeout&&(w=setTimeout(function(){v=!0,h(1)},k.timeout));var i=[];try{if(k.extraData)for(var j in k.extraData)k.extraData.hasOwnProperty(j)&&(a.isPlainObject(k.extraData[j])&&k.extraData[j].hasOwnProperty("name")&&k.extraData[j].hasOwnProperty("value")?i.push(a('<input type="hidden" name="'+k.extraData[j].name+'">',z).val(k.extraData[j].value).appendTo(x)[0]):i.push(a('<input type="hidden" name="'+j+'">',z).val(k.extraData[j]).appendTo(x)[0]));k.iframeTarget||p.appendTo(A),q.attachEvent?q.attachEvent("onload",h):q.addEventListener("load",h,!1),setTimeout(b,15);try{x.submit()}catch(a){var m=document.createElement("form").submit;m.apply(x)}}finally{x.setAttribute("action",f),x.setAttribute("enctype",g),c?x.setAttribute("target",c):o.removeAttr("target"),a(i).remove()}}function h(b){if(!r.aborted&&!F){if(E=e(q),E||(d("cannot access response document"),b=2),1===b&&r)return r.abort("timeout"),void y.reject(r,"timeout");if(2===b&&r)return r.abort("server abort"),void y.reject(r,"error","server abort");if(E&&E.location.href!==k.iframeSrc||v){q.detachEvent?q.detachEvent("onload",h):q.removeEventListener("load",h,!1);var c,f="success";try{if(v)throw"timeout";var g="xml"===k.dataType||E.XMLDocument||a.isXMLDoc(E);if(d("isXml="+g),!g&&window.opera&&(null===E.body||!E.body.innerHTML)&&--G)return d("requeing onLoad callback, DOM not available"),void setTimeout(h,250);var i=E.body?E.body:E.documentElement;r.responseText=i?i.innerHTML:null,r.responseXML=E.XMLDocument?E.XMLDocument:E,g&&(k.dataType="xml"),r.getResponseHeader=function(a){return{"content-type":k.dataType}[a.toLowerCase()]},i&&(r.status=Number(i.getAttribute("status"))||r.status,r.statusText=i.getAttribute("statusText")||r.statusText);var j=(k.dataType||"").toLowerCase(),l=/(json|script|text)/.test(j);if(l||k.textarea){var n=E.getElementsByTagName("textarea")[0];if(n)r.responseText=n.value,r.status=Number(n.getAttribute("status"))||r.status,r.statusText=n.getAttribute("statusText")||r.statusText;else if(l){var o=E.getElementsByTagName("pre")[0],s=E.getElementsByTagName("body")[0];o?r.responseText=o.textContent?o.textContent:o.innerText:s&&(r.responseText=s.textContent?s.textContent:s.innerText)}}else"xml"===j&&!r.responseXML&&r.responseText&&(r.responseXML=H(r.responseText));try{D=J(r,j,k)}catch(a){f="parsererror",r.error=c=a||f}}catch(a){d("error caught: ",a),f="error",r.error=c=a||f}r.aborted&&(d("upload aborted"),f=null),r.status&&(f=r.status>=200&&r.status<300||304===r.status?"success":"error"),"success"===f?(k.success&&k.success.call(k.context,D,"success",r),y.resolve(r.responseText,"success",r),m&&a.event.trigger("ajaxSuccess",[r,k])):f&&(void 0===c&&(c=r.statusText),k.error&&k.error.call(k.context,r,f,c),y.reject(r,"error",c),m&&a.event.trigger("ajaxError",[r,k,c])),m&&a.event.trigger("ajaxComplete",[r,k]),m&&!--a.active&&a.event.trigger("ajaxStop"),k.complete&&k.complete.call(k.context,r,f),F=!0,k.timeout&&clearTimeout(w),setTimeout(function(){k.iframeTarget?p.attr("src",k.iframeSrc):p.remove(),r.responseXML=null},100)}}}var i,j,k,m,n,p,q,r,t,u,v,w,x=o[0],y=a.Deferred();if(y.abort=function(a){r.abort(a)},c)for(j=0;j<s.length;j++)i=a(s[j]),f?i.prop("disabled",!1):i.removeAttr("disabled");k=a.extend(!0,{},a.ajaxSettings,b),k.context=k.context||k,n="jqFormIO"+(new Date).getTime();var z=x.ownerDocument,A=o.closest("body");if(k.iframeTarget?(p=a(k.iframeTarget,z),u=p.attr2("name"),u?n=u:p.attr2("name",n)):(p=a('<iframe name="'+n+'" src="'+k.iframeSrc+'" />',z),p.css({position:"absolute",top:"-1000px",left:"-1000px"})),q=p[0],r={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(b){var c="timeout"===b?"timeout":"aborted";d("aborting upload... "+c),this.aborted=1;try{q.contentWindow.document.execCommand&&q.contentWindow.document.execCommand("Stop")}catch(a){}p.attr("src",k.iframeSrc),r.error=c,k.error&&k.error.call(k.context,r,c,b),m&&a.event.trigger("ajaxError",[r,k,c]),k.complete&&k.complete.call(k.context,r,c)}},m=k.global,m&&0==a.active++&&a.event.trigger("ajaxStart"),m&&a.event.trigger("ajaxSend",[r,k]),k.beforeSend&&k.beforeSend.call(k.context,r,k)===!1)return k.global&&a.active--,y.reject(),y;if(r.aborted)return y.reject(),y;(t=x.clk)&&(u=t.name)&&!t.disabled&&(k.extraData=k.extraData||{},k.extraData[u]=t.value,"image"===t.type&&(k.extraData[u+".x"]=x.clk_x,k.extraData[u+".y"]=x.clk_y));var B=a("meta[name=csrf-token]").attr("content"),C=a("meta[name=csrf-param]").attr("content");C&&B&&(k.extraData=k.extraData||{},k.extraData[C]=B),k.forceSync?g():setTimeout(g,10);var D,E,F,G=50,H=a.parseXML||function(a,b){return window.ActiveXObject?(b=new ActiveXObject("Microsoft.XMLDOM"),b.async="false",b.loadXML(a)):b=(new DOMParser).parseFromString(a,"text/xml"),b&&b.documentElement&&"parsererror"!==b.documentElement.nodeName?b:null},I=a.parseJSON||function(a){return window.eval("("+a+")")},J=function(b,c,d){var e=b.getResponseHeader("content-type")||"",f=("xml"===c||!c)&&e.indexOf("xml")>=0,g=f?b.responseXML:b.responseText;return f&&"parsererror"===g.documentElement.nodeName&&a.error&&a.error("parsererror"),d&&d.dataFilter&&(g=d.dataFilter(g,c)),"string"==typeof g&&(("json"===c||!c)&&e.indexOf("json")>=0?g=I(g):("script"===c||!c)&&e.indexOf("javascript")>=0&&a.globalEval(g)),g};return y}if(!this.length)return d("ajaxSubmit: skipping submit process - no element selected"),this;var l,m,n,o=this;"function"==typeof b?b={success:b}:"string"==typeof b||b===!1&&arguments.length>0?(b={url:b,data:c,dataType:g},"function"==typeof h&&(b.success=h)):void 0===b&&(b={}),l=b.method||b.type||this.attr2("method"),m=b.url||this.attr2("action"),n="string"==typeof m?a.trim(m):"",n=n||window.location.href||"",n&&(n=(n.match(/^([^#]+)/)||[])[1]),b=a.extend(!0,{url:n,success:a.ajaxSettings.success,type:l||a.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},b);var p={};if(this.trigger("form-pre-serialize",[this,b,p]),p.veto)return d("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(b.beforeSerialize&&b.beforeSerialize(this,b)===!1)return d("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var q=b.traditional;void 0===q&&(q=a.ajaxSettings.traditional);var r,s=[],t=this.formToArray(b.semantic,s,b.filtering);if(b.data){var u=a.isFunction(b.data)?b.data(t):b.data;b.extraData=u,r=a.param(u,q)}if(b.beforeSubmit&&b.beforeSubmit(t,this,b)===!1)return d("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[t,this,b,p]),p.veto)return d("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var v=a.param(t,q);r&&(v=v?v+"&"+r:r),"GET"===b.type.toUpperCase()?(b.url+=(b.url.indexOf("?")>=0?"&":"?")+v,b.data=null):b.data=v;var w=[];if(b.resetForm&&w.push(function(){o.resetForm()}),b.clearForm&&w.push(function(){o.clearForm(b.includeHidden)}),!b.dataType&&b.target){var x=b.success||function(){};w.push(function(c,d,e){var f=arguments,g=b.replaceTarget?"replaceWith":"html";a(b.target)[g](c).each(function(){x.apply(this,f)})})}else b.success&&(a.isArray(b.success)?a.merge(w,b.success):w.push(b.success));if(b.success=function(a,c,d){for(var e=b.context||this,f=0,g=w.length;f<g;f++)w[f].apply(e,[a,c,d||o,o])},b.error){var y=b.error;b.error=function(a,c,d){var e=b.context||this;y.apply(e,[a,c,d,o])}}if(b.complete){var z=b.complete;b.complete=function(a,c){var d=b.context||this;z.apply(d,[a,c,o])}}var A=a("input[type=file]:enabled",this).filter(function(){return""!==a(this).val()}),B=A.length>0,C="multipart/form-data",D=o.attr("enctype")===C||o.attr("encoding")===C,E=e.fileapi&&e.formdata;d("fileAPI :"+E);var F,G=(B||D)&&!E;b.iframe!==!1&&(b.iframe||G)?b.closeKeepAlive?a.get(b.closeKeepAlive,function(){F=k(t)}):F=k(t):F=(B||D)&&E?j(t):a.ajax(b),o.removeData("jqxhr").data("jqxhr",F);for(var H=0;H<s.length;H++)s[H]=null;return this.trigger("form-submit-notify",[this,b]),this},a.fn.ajaxForm=function(e,f,g,h){if(("string"==typeof e||e===!1&&arguments.length>0)&&(e={url:e,data:f,dataType:g},"function"==typeof h&&(e.success=h)),e=e||{},e.delegation=e.delegation&&a.isFunction(a.fn.on),!e.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!a.isReady&&i.s?(d("DOM not ready, queuing ajaxForm"),a(function(){a(i.s,i.c).ajaxForm(e)}),this):(d("terminating; zero elements found by selector"+(a.isReady?"":" (DOM not ready)")),this)}return e.delegation?(a(document).off("submit.form-plugin",this.selector,b).off("click.form-plugin",this.selector,c).on("submit.form-plugin",this.selector,e,b).on("click.form-plugin",this.selector,e,c),this):this.ajaxFormUnbind().on("submit.form-plugin",e,b).on("click.form-plugin",e,c)},a.fn.ajaxFormUnbind=function(){return this.off("submit.form-plugin click.form-plugin")},a.fn.formToArray=function(b,c,d){var f=[];if(0===this.length)return f;var g,h=this[0],i=this.attr("id"),j=b||void 0===h.elements?h.getElementsByTagName("*"):h.elements;if(j&&(j=a.makeArray(j)),i&&(b||/(Edge|Trident)\//.test(navigator.userAgent))&&(g=a(':input[form="'+i+'"]').get(),g.length&&(j=(j||[]).concat(g))),!j||!j.length)return f;a.isFunction(d)&&(j=a.map(j,d));var k,l,m,n,o,p,q;for(k=0,p=j.length;k<p;k++)if(o=j[k],(m=o.name)&&!o.disabled)if(b&&h.clk&&"image"===o.type)h.clk===o&&(f.push({name:m,value:a(o).val(),type:o.type}),f.push({name:m+".x",value:h.clk_x},{name:m+".y",value:h.clk_y}));else if((n=a.fieldValue(o,!0))&&n.constructor===Array)for(c&&c.push(o),l=0,q=n.length;l<q;l++)f.push({name:m,value:n[l]});else if(e.fileapi&&"file"===o.type){c&&c.push(o);var r=o.files;if(r.length)for(l=0;l<r.length;l++)f.push({name:m,value:r[l],type:o.type});else f.push({name:m,value:"",type:o.type})}else null!==n&&void 0!==n&&(c&&c.push(o),f.push({name:m,value:n,type:o.type,required:o.required}));if(!b&&h.clk){var s=a(h.clk),t=s[0];m=t.name,m&&!t.disabled&&"image"===t.type&&(f.push({name:m,value:s.val()}),f.push({name:m+".x",value:h.clk_x},{name:m+".y",value:h.clk_y}))}return f},a.fn.formSerialize=function(b){return a.param(this.formToArray(b))},a.fn.fieldSerialize=function(b){var c=[];return this.each(function(){var d=this.name;if(d){var e=a.fieldValue(this,b);if(e&&e.constructor===Array)for(var f=0,g=e.length;f<g;f++)c.push({name:d,value:e[f]});else null!==e&&void 0!==e&&c.push({name:this.name,value:e})}}),a.param(c)},a.fn.fieldValue=function(b){for(var c=[],d=0,e=this.length;d<e;d++){var f=this[d],g=a.fieldValue(f,b);null===g||void 0===g||g.constructor===Array&&!g.length||(g.constructor===Array?a.merge(c,g):c.push(g))}return c},a.fieldValue=function(b,c){var d=b.name,e=b.type,f=b.tagName.toLowerCase();if(void 0===c&&(c=!0),c&&(!d||b.disabled||"reset"===e||"button"===e||("checkbox"===e||"radio"===e)&&!b.checked||("submit"===e||"image"===e)&&b.form&&b.form.clk!==b||"select"===f&&b.selectedIndex===-1))return null;if("select"===f){var g=b.selectedIndex;if(g<0)return null;for(var h=[],i=b.options,j="select-one"===e,k=j?g+1:i.length,l=j?g:0;l<k;l++){var m=i[l];if(m.selected&&!m.disabled){var n=m.value;if(n||(n=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),j)return n;h.push(n)}}return h}return a(b).val().replace(/\r?\n/g,"\r\n")},a.fn.clearForm=function(b){return this.each(function(){a("input,select,textarea",this).clearFields(b)})},a.fn.clearFields=a.fn.clearInputs=function(b){var c=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var d=this.type,e=this.tagName.toLowerCase();c.test(d)||"textarea"===e?this.value="":"checkbox"===d||"radio"===d?this.checked=!1:"select"===e?this.selectedIndex=-1:"file"===d?/MSIE/.test(navigator.userAgent)?a(this).replaceWith(a(this).clone(!0)):a(this).val(""):b&&(b===!0&&/hidden/.test(d)||"string"==typeof b&&a(this).is(b))&&(this.value="")})},a.fn.resetForm=function(){return this.each(function(){var b=a(this),c=this.tagName.toLowerCase();switch(c){case"input":this.checked=this.defaultChecked;case"textarea":return this.value=this.defaultValue,!0;case"option":case"optgroup":var d=b.parents("select");return d.length&&d[0].multiple?"option"===c?this.selected=this.defaultSelected:b.find("option").resetForm():d.resetForm(),!0;case"select":return b.find("option").each(function(a){if(this.selected=this.defaultSelected,this.defaultSelected&&!b[0].multiple)return b[0].selectedIndex=a,!1}),!0;case"label":var e=a(b.attr("for")),f=b.find("input,select,textarea");return e[0]&&f.unshift(e[0]),f.resetForm(),!0;case"form":return("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset(),!0;default:return b.find("form,input,label,select,textarea").resetForm(),!0}})},a.fn.enable=function(a){return void 0===a&&(a=!0),this.each(function(){this.disabled=!a})},a.fn.selected=function(b){return void 0===b&&(b=!0),this.each(function(){var c=this.type;if("checkbox"===c||"radio"===c)this.checked=b;else if("option"===this.tagName.toLowerCase()){var d=a(this).parent("select");b&&d[0]&&"select-one"===d[0].type&&d.find("option").selected(!1),this.selected=b}})},a.fn.ajaxSubmit.debug=!1});
;
(function ($) {

/**
 * Provides Ajax page updating via jQuery $.ajax (Asynchronous JavaScript and XML).
 *
 * Ajax is a method of making a request via JavaScript while viewing an HTML
 * page. The request returns an array of commands encoded in JSON, which is
 * then executed to make any changes that are necessary to the page.
 *
 * Drupal uses this file to enhance form elements with #ajax['path'] and
 * #ajax['wrapper'] properties. If set, this file will automatically be included
 * to provide Ajax capabilities.
 */

Drupal.ajax = Drupal.ajax || {};

Drupal.settings.urlIsAjaxTrusted = Drupal.settings.urlIsAjaxTrusted || {};

/**
 * Attaches the Ajax behavior to each Ajax form element.
 */
Drupal.behaviors.AJAX = {
  attach: function (context, settings) {
    // Load all Ajax behaviors specified in the settings.
    for (var base in settings.ajax) {
      if (!$('#' + base + '.ajax-processed').length) {
        var element_settings = settings.ajax[base];

        if (typeof element_settings.selector == 'undefined') {
          element_settings.selector = '#' + base;
        }
        $(element_settings.selector).each(function () {
          element_settings.element = this;
          Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
        });

        $('#' + base).addClass('ajax-processed');
      }
    }

    // Bind Ajax behaviors to all items showing the class.
    $('.use-ajax:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};
      // Clicked links look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.
      if ($(this).attr('href')) {
        element_settings.url = $(this).attr('href');
        element_settings.event = 'click';
      }
      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });

    // This class means to submit the form to the action using Ajax.
    $('.use-ajax-submit:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};

      // Ajax submits specified in this manner automatically submit to the
      // normal form action.
      element_settings.url = $(this.form).attr('action');
      // Form submit button clicks need to tell the form what was clicked so
      // it gets passed in the POST request.
      element_settings.setClick = true;
      // Form buttons use the 'click' event rather than mousedown.
      element_settings.event = 'click';
      // Clicked form buttons look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });
  }
};

/**
 * Ajax object.
 *
 * All Ajax objects on a page are accessible through the global Drupal.ajax
 * object and are keyed by the submit button's ID. You can access them from
 * your module's JavaScript file to override properties or functions.
 *
 * For example, if your Ajax enabled button has the ID 'edit-submit', you can
 * redefine the function that is called to insert the new content like this
 * (inside a Drupal.behaviors attach block):
 * @code
 *    Drupal.behaviors.myCustomAJAXStuff = {
 *      attach: function (context, settings) {
 *        Drupal.ajax['edit-submit'].commands.insert = function (ajax, response, status) {
 *          new_content = $(response.data);
 *          $('#my-wrapper').append(new_content);
 *          alert('New content was appended to #my-wrapper');
 *        }
 *      }
 *    };
 * @endcode
 */
Drupal.ajax = function (base, element, element_settings) {
  var defaults = {
    url: 'system/ajax',
    event: 'mousedown',
    keypress: true,
    selector: '#' + base,
    effect: 'none',
    speed: 'none',
    method: 'replaceWith',
    progress: {
      type: 'throbber',
      message: Drupal.t('Please wait...')
    },
    submit: {
      'js': true
    }
  };

  $.extend(this, defaults, element_settings);

  this.element = element;
  this.element_settings = element_settings;

  // Replacing 'nojs' with 'ajax' in the URL allows for an easy method to let
  // the server detect when it needs to degrade gracefully.
  // There are five scenarios to check for:
  // 1. /nojs/
  // 2. /nojs$ - The end of a URL string.
  // 3. /nojs? - Followed by a query (with clean URLs enabled).
  //      E.g.: path/nojs?destination=foobar
  // 4. /nojs& - Followed by a query (without clean URLs enabled).
  //      E.g.: ?q=path/nojs&destination=foobar
  // 5. /nojs# - Followed by a fragment.
  //      E.g.: path/nojs#myfragment
  this.url = element_settings.url.replace(/\/nojs(\/|$|\?|&|#)/g, '/ajax$1');
  // If the 'nojs' version of the URL is trusted, also trust the 'ajax' version.
  if (Drupal.settings.urlIsAjaxTrusted[element_settings.url]) {
    Drupal.settings.urlIsAjaxTrusted[this.url] = true;
  }

  this.wrapper = '#' + element_settings.wrapper;

  // If there isn't a form, jQuery.ajax() will be used instead, allowing us to
  // bind Ajax to links as well.
  if (this.element.form) {
    this.form = $(this.element.form);
  }

  // Set the options for the ajaxSubmit function.
  // The 'this' variable will not persist inside of the options object.
  var ajax = this;
  ajax.options = {
    url: Drupal.sanitizeAjaxUrl(ajax.url),
    data: ajax.submit,
    beforeSerialize: function (element_settings, options) {
      return ajax.beforeSerialize(element_settings, options);
    },
    beforeSubmit: function (form_values, element_settings, options) {
      ajax.ajaxing = true;
      return ajax.beforeSubmit(form_values, element_settings, options);
    },
    beforeSend: function (xmlhttprequest, options) {
      ajax.ajaxing = true;
      return ajax.beforeSend(xmlhttprequest, options);
    },
    success: function (response, status, xmlhttprequest) {
      // Sanity check for browser support (object expected).
      // When using iFrame uploads, responses must be returned as a string.
      if (typeof response == 'string') {
        response = $.parseJSON(response);
      }

      // Prior to invoking the response's commands, verify that they can be
      // trusted by checking for a response header. See
      // ajax_set_verification_header() for details.
      // - Empty responses are harmless so can bypass verification. This avoids
      //   an alert message for server-generated no-op responses that skip Ajax
      //   rendering.
      // - Ajax objects with trusted URLs (e.g., ones defined server-side via
      //   #ajax) can bypass header verification. This is especially useful for
      //   Ajax with multipart forms. Because IFRAME transport is used, the
      //   response headers cannot be accessed for verification.
      if (response !== null && !Drupal.settings.urlIsAjaxTrusted[ajax.url]) {
        if (xmlhttprequest.getResponseHeader('X-Drupal-Ajax-Token') !== '1') {
          var customMessage = Drupal.t("The response failed verification so will not be processed.");
          return ajax.error(xmlhttprequest, ajax.url, customMessage);
        }
      }

      return ajax.success(response, status);
    },
    complete: function (xmlhttprequest, status) {
      ajax.ajaxing = false;
      if (status == 'error' || status == 'parsererror') {
        return ajax.error(xmlhttprequest, ajax.url);
      }
    },
    dataType: 'json',
    jsonp: false,
    type: 'POST'
  };

  // For multipart forms (e.g., file uploads), jQuery Form targets the form
  // submission to an iframe instead of using an XHR object. The initial "src"
  // of the iframe, prior to the form submission, is set to options.iframeSrc.
  // "about:blank" is the semantically correct, standards-compliant, way to
  // initialize a blank iframe; however, some old IE versions (possibly only 6)
  // incorrectly report a mixed content warning when iframes with an
  // "about:blank" src are added to a parent document with an https:// origin.
  // jQuery Form works around this by defaulting to "javascript:false" instead,
  // but that breaks on Chrome 83, so here we force the semantically correct
  // behavior for all browsers except old IE.
  // @see https://www.drupal.org/project/drupal/issues/3143016
  // @see https://github.com/jquery-form/form/blob/df9cb101b9c9c085c8d75ad980c7ff1cf62063a1/jquery.form.js#L68
  // @see https://bugs.chromium.org/p/chromium/issues/detail?id=1084874
  // @see https://html.spec.whatwg.org/multipage/browsers.html#creating-browsing-contexts
  // @see https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
  if (navigator.userAgent.indexOf("MSIE") === -1) {
    ajax.options.iframeSrc = 'about:blank';
  }

  // Bind the ajaxSubmit function to the element event.
  $(ajax.element).bind(element_settings.event, function (event) {
    if (!Drupal.settings.urlIsAjaxTrusted[ajax.url] && !Drupal.urlIsLocal(ajax.url)) {
      throw new Error(Drupal.t('The callback URL is not local and not trusted: !url', {'!url': ajax.url}));
    }
    return ajax.eventResponse(this, event);
  });

  // If necessary, enable keyboard submission so that Ajax behaviors
  // can be triggered through keyboard input as well as e.g. a mousedown
  // action.
  if (element_settings.keypress) {
    $(ajax.element).keypress(function (event) {
      return ajax.keypressResponse(this, event);
    });
  }

  // If necessary, prevent the browser default action of an additional event.
  // For example, prevent the browser default action of a click, even if the
  // AJAX behavior binds to mousedown.
  if (element_settings.prevent) {
    $(ajax.element).bind(element_settings.prevent, false);
  }
};

/**
 * Handle a key press.
 *
 * The Ajax object will, if instructed, bind to a key press response. This
 * will test to see if the key press is valid to trigger this event and
 * if it is, trigger it for us and prevent other keypresses from triggering.
 * In this case we're handling RETURN and SPACEBAR keypresses (event codes 13
 * and 32. RETURN is often used to submit a form when in a textfield, and 
 * SPACE is often used to activate an element without submitting. 
 */
Drupal.ajax.prototype.keypressResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Detect enter key and space bar and allow the standard response for them,
  // except for form elements of type 'text' and 'textarea', where the 
  // spacebar activation causes inappropriate activation if #ajax['keypress'] is 
  // TRUE. On a text-type widget a space should always be a space.
  if (event.which == 13 || (event.which == 32 && element.type != 'text' && element.type != 'textarea')) {
    $(ajax.element_settings.element).trigger(ajax.element_settings.event);
    return false;
  }
};

/**
 * Handle an event that triggers an Ajax response.
 *
 * When an event that triggers an Ajax response happens, this method will
 * perform the actual Ajax call. It is bound to the event using
 * bind() in the constructor, and it uses the options specified on the
 * ajax object.
 */
Drupal.ajax.prototype.eventResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Do not perform another ajax command if one is already in progress.
  if (ajax.ajaxing) {
    return false;
  }

  try {
    if (ajax.form) {
      // If setClick is set, we must set this to ensure that the button's
      // value is passed.
      if (ajax.setClick) {
        // Mark the clicked button. 'form.clk' is a special variable for
        // ajaxSubmit that tells the system which element got clicked to
        // trigger the submit. Without it there would be no 'op' or
        // equivalent.
        element.form.clk = element;
      }

      ajax.form.ajaxSubmit(ajax.options);
    }
    else {
      ajax.beforeSerialize(ajax.element, ajax.options);
      $.ajax(ajax.options);
    }
  }
  catch (e) {
    // Unset the ajax.ajaxing flag here because it won't be unset during
    // the complete response.
    ajax.ajaxing = false;
    alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message);
  }

  // For radio/checkbox, allow the default event. On IE, this means letting
  // it actually check the box.
  if (typeof element.type != 'undefined' && (element.type == 'checkbox' || element.type == 'radio')) {
    return true;
  }
  else {
    return false;
  }

};

/**
 * Handler for the form serialization.
 *
 * Runs before the beforeSend() handler (see below), and unlike that one, runs
 * before field data is collected.
 */
Drupal.ajax.prototype.beforeSerialize = function (element, options) {
  // Allow detaching behaviors to update field values before collecting them.
  // This is only needed when field values are added to the POST data, so only
  // when there is a form such that this.form.ajaxSubmit() is used instead of
  // $.ajax(). When there is no form and $.ajax() is used, beforeSerialize()
  // isn't called, but don't rely on that: explicitly check this.form.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.detachBehaviors(this.form, settings, 'serialize');
  }

  // Prevent duplicate HTML ids in the returned markup.
  // @see drupal_html_id()
  options.data['ajax_html_ids[]'] = [];
  $('[id]').each(function () {
    options.data['ajax_html_ids[]'].push(this.id);
  });

  // Allow Drupal to return new JavaScript and CSS files to load without
  // returning the ones already loaded.
  // @see ajax_base_page_theme()
  // @see drupal_get_css()
  // @see drupal_get_js()
  options.data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme;
  options.data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token;
  for (var key in Drupal.settings.ajaxPageState.css) {
    options.data['ajax_page_state[css][' + key + ']'] = 1;
  }
  for (var key in Drupal.settings.ajaxPageState.js) {
    options.data['ajax_page_state[js][' + key + ']'] = 1;
  }
};

/**
 * Modify form values prior to form submission.
 */
Drupal.ajax.prototype.beforeSubmit = function (form_values, element, options) {
  // This function is left empty to make it simple to override for modules
  // that wish to add functionality here.
};

/**
 * Prepare the Ajax request before it is sent.
 */
Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
  // For forms without file inputs, the jQuery Form plugin serializes the form
  // values, and then calls jQuery's $.ajax() function, which invokes this
  // handler. In this circumstance, options.extraData is never used. For forms
  // with file inputs, the jQuery Form plugin uses the browser's normal form
  // submission mechanism, but captures the response in a hidden IFRAME. In this
  // circumstance, it calls this handler first, and then appends hidden fields
  // to the form to submit the values in options.extraData. There is no simple
  // way to know which submission mechanism will be used, so we add to extraData
  // regardless, and allow it to be ignored in the former case.
  if (this.form) {
    options.extraData = options.extraData || {};

    // Let the server know when the IFRAME submission mechanism is used. The
    // server can use this information to wrap the JSON response in a TEXTAREA,
    // as per http://jquery.malsup.com/form/#file-upload.
    options.extraData.ajax_iframe_upload = '1';

    // The triggering element is about to be disabled (see below), but if it
    // contains a value (e.g., a checkbox, textfield, select, etc.), ensure that
    // value is included in the submission. As per above, submissions that use
    // $.ajax() are already serialized prior to the element being disabled, so
    // this is only needed for IFRAME submissions.
    var v = $.fieldValue(this.element);
    if (v !== null) {
      options.extraData[this.element.name] = Drupal.checkPlain(v);
    }
  }

  // Disable the element that received the change to prevent user interface
  // interaction while the Ajax request is in progress. ajax.ajaxing prevents
  // the element from triggering a new request, but does not prevent the user
  // from changing its value.
  $(this.element).addClass('progress-disabled').attr('disabled', true);

  // Insert progressbar or throbber.
  if (this.progress.type == 'bar') {
    var progressBar = new Drupal.progressBar('ajax-progress-' + this.element.id, eval(this.progress.update_callback), this.progress.method, eval(this.progress.error_callback));
    if (this.progress.message) {
      progressBar.setProgress(-1, this.progress.message);
    }
    if (this.progress.url) {
      progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
    }
    this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar');
    this.progress.object = progressBar;
    $(this.element).after(this.progress.element);
  }
  else if (this.progress.type == 'throbber') {
    this.progress.element = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
    if (this.progress.message) {
      $('.throbber', this.progress.element).after('<div class="message">' + this.progress.message + '</div>');
    }
    $(this.element).after(this.progress.element);
  }
};

/**
 * Handler for the form redirection completion.
 */
Drupal.ajax.prototype.success = function (response, status) {
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');

  Drupal.freezeHeight();

  for (var i in response) {
    if (response.hasOwnProperty(i) && response[i]['command'] && this.commands[response[i]['command']]) {
      this.commands[response[i]['command']](this, response[i], status);
    }
  }

  // Reattach behaviors, if they were detached in beforeSerialize(). The
  // attachBehaviors() called on the new content from processing the response
  // commands is not sufficient, because behaviors from the entire form need
  // to be reattached.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }

  Drupal.unfreezeHeight();

  // Remove any response-specific settings so they don't get used on the next
  // call by mistake.
  this.settings = null;
};

/**
 * Build an effect object which tells us how to apply the effect when adding new HTML.
 */
Drupal.ajax.prototype.getEffect = function (response) {
  var type = response.effect || this.effect;
  var speed = response.speed || this.speed;

  var effect = {};
  if (type == 'none') {
    effect.showEffect = 'show';
    effect.hideEffect = 'hide';
    effect.showSpeed = '';
  }
  else if (type == 'fade') {
    effect.showEffect = 'fadeIn';
    effect.hideEffect = 'fadeOut';
    effect.showSpeed = speed;
  }
  else {
    effect.showEffect = type + 'Toggle';
    effect.hideEffect = type + 'Toggle';
    effect.showSpeed = speed;
  }

  return effect;
};

/**
 * Handler for the form redirection error.
 */
Drupal.ajax.prototype.error = function (xmlhttprequest, uri, customMessage) {
  Drupal.displayAjaxError(Drupal.ajaxError(xmlhttprequest, uri, customMessage));
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  // Undo hide.
  $(this.wrapper).show();
  // Re-enable the element.
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');
  // Reattach behaviors, if they were detached in beforeSerialize().
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }
};

/**
 * Provide a series of commands that the server can request the client perform.
 */
Drupal.ajax.prototype.commands = {
  /**
   * Command to insert new content into the DOM.
   */
  insert: function (ajax, response, status) {
    // Get information from the response. If it is not there, default to
    // our presets.
    var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
    var method = response.method || ajax.method;
    var effect = ajax.getEffect(response);

    // We don't know what response.data contains: it might be a string of text
    // without HTML, so don't rely on jQuery correctly iterpreting
    // $(response.data) as new HTML rather than a CSS selector. Also, if
    // response.data contains top-level text nodes, they get lost with either
    // $(response.data) or $('<div></div>').replaceWith(response.data).
    var new_content_wrapped = $('<div></div>').html(response.data);
    var new_content = new_content_wrapped.contents();

    // For legacy reasons, the effects processing code assumes that new_content
    // consists of a single top-level element. Also, it has not been
    // sufficiently tested whether attachBehaviors() can be successfully called
    // with a context object that includes top-level text nodes. However, to
    // give developers full control of the HTML appearing in the page, and to
    // enable Ajax content to be inserted in places where DIV elements are not
    // allowed (e.g., within TABLE, TR, and SPAN parents), we check if the new
    // content satisfies the requirement of a single top-level element, and
    // only use the container DIV created above when it doesn't. For more
    // information, please see http://drupal.org/node/736066.
    if (new_content.length != 1 || new_content.get(0).nodeType != 1) {
      new_content = new_content_wrapped;
    }

    // If removing content from the wrapper, detach behaviors first.
    switch (method) {
      case 'html':
      case 'replaceWith':
      case 'replaceAll':
      case 'empty':
      case 'remove':
        var settings = response.settings || ajax.settings || Drupal.settings;
        Drupal.detachBehaviors(wrapper, settings);
    }

    // Add the new content to the page.
    wrapper[method](new_content);

    // Immediately hide the new content if we're using any effects.
    if (effect.showEffect != 'show') {
      new_content.hide();
    }

    // Determine which effect to use and what content will receive the
    // effect, then show the new content.
    if ($('.ajax-new-content', new_content).length > 0) {
      $('.ajax-new-content', new_content).hide();
      new_content.show();
      $('.ajax-new-content', new_content)[effect.showEffect](effect.showSpeed);
    }
    else if (effect.showEffect != 'show') {
      new_content[effect.showEffect](effect.showSpeed);
    }

    // Attach all JavaScript behaviors to the new content, if it was successfully
    // added to the page, this if statement allows #ajax['wrapper'] to be
    // optional.
    if (new_content.parents('html').length > 0) {
      // Apply any settings from the returned JSON if available.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(new_content, settings);
    }
  },

  /**
   * Command to remove a chunk from the page.
   */
  remove: function (ajax, response, status) {
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.detachBehaviors($(response.selector), settings);
    $(response.selector).remove();
  },

  /**
   * Command to mark a chunk changed.
   */
  changed: function (ajax, response, status) {
    if (!$(response.selector).hasClass('ajax-changed')) {
      $(response.selector).addClass('ajax-changed');
      if (response.asterisk) {
        $(response.selector).find(response.asterisk).append(' <span class="ajax-changed">*</span> ');
      }
    }
  },

  /**
   * Command to provide an alert.
   */
  alert: function (ajax, response, status) {
    alert(response.text, response.title);
  },

  /**
   * Command to provide the jQuery css() function.
   */
  css: function (ajax, response, status) {
    $(response.selector).css(response.argument);
  },

  /**
   * Command to set the settings that will be used for other commands in this response.
   */
  settings: function (ajax, response, status) {
    if (response.merge) {
      $.extend(true, Drupal.settings, response.settings);
    }
    else {
      ajax.settings = response.settings;
    }
  },

  /**
   * Command to attach data using jQuery's data API.
   */
  data: function (ajax, response, status) {
    $(response.selector).data(response.name, response.value);
  },

  /**
   * Command to apply a jQuery method.
   */
  invoke: function (ajax, response, status) {
    var $element = $(response.selector);
    $element[response.method].apply($element, response.arguments);
  },

  /**
   * Command to restripe a table.
   */
  restripe: function (ajax, response, status) {
    // :even and :odd are reversed because jQuery counts from 0 and
    // we count from 1, so we're out of sync.
    // Match immediate children of the parent element to allow nesting.
    $('> tbody > tr:visible, > tr:visible', $(response.selector))
      .removeClass('odd even')
      .filter(':even').addClass('odd').end()
      .filter(':odd').addClass('even');
  },

  /**
   * Command to add css.
   *
   * Uses the proprietary addImport method if available as browsers which
   * support that method ignore @import statements in dynamically added
   * stylesheets.
   */
  add_css: function (ajax, response, status) {
    // Add the styles in the normal way.
    $('head').prepend(response.data);
    // Add imports in the styles using the addImport method if available.
    var match, importMatch = /^@import url\("(.*)"\);$/igm;
    if (document.styleSheets[0].addImport && importMatch.test(response.data)) {
      importMatch.lastIndex = 0;
      while (match = importMatch.exec(response.data)) {
        document.styleSheets[0].addImport(match[1]);
      }
    }
  },

  /**
   * Command to update a form's build ID.
   */
  updateBuildId: function(ajax, response, status) {
    $('input[name="form_build_id"][value="' + response['old'] + '"]').val(response['new']);
  }
};

})(jQuery);
;
(function (D) {
  var beforeSerialize = D.ajax.prototype.beforeSerialize;
  D.ajax.prototype.beforeSerialize = function (element, options) {
    beforeSerialize.call(this, element, options);
    options.data['ajax_page_state[jquery_version]'] = D.settings.ajaxPageState.jquery_version;
  }
})(Drupal);
;
