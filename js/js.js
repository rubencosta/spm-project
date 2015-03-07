var captionOn = false;
var docPath = location.pathname;
docPath = docPath.substr(0,docPath.length-10);
var carta=-1;
var categoria = new Array();
var tamanhoBaralho;
var intervalo;
var captionOn;
var modoFuncionamento;
var arrayActividades;
var actividadeActual;
var geolocationWatchTimer;
var temposIniciais = new Object;
$.ui.ready(
    function () {
        AppMobi.device.setRotateOrientation("portrait"); // or landscape
        //$.ui.removeFooterMenu();//disable the footer menu on load
        $.ui.disableSideMenu();//disable the side menu on load
        $.ui.backButtonText='Voltar';
        $(".accordion").accordion({time:"0.2s"});
       
         //$.ui.popup(categorias.length);
        //$.ui.popup("Hoje é "+Date());  
        //var tamanho = $.getJSON(
        //$.ui.popup(tamanho);
        //Função que lê o swipe na carta
        modoFuncionamento=intel.xdk.cache.getCookie("modoFuncionamento");
        if(modoFuncionamento!=undefined){
            switch(modoFuncionamento){
                    case "sugestivo":
                        iniciaModo1();
                    break;
                    case "normal":
                    iniciaModo2();
                        $.ui.loadContent("modo2",false,false,"pop");
                    break;
                    case "intrusivo":
                    iniciaModo3();
                        $.ui.loadContent("modo3",false,false,"pop");
                    break;
            }
        }
        $("#afui #content .carta").swipeRight(function(){
            stopTimer();
            if(modoFuncionamento=="sugestivo"){
                leDados("anterior");
            }
            else{
                if(carta>0) {
                    leDados("anterior");
                    
                }
                else if(carta==0) {
                    carta=tamanhoBaralho+1;
                    leDados("anterior");
                
                }
            }
            toggleCaption("off");
        return;
        });
        $("#afui #content .carta").swipeLeft(function(){
           stopTimer();
            if(modoFuncionamento=="sugestivo"){
                leDados("aleatorio");
            }
            else{
                if(carta<tamanhoBaralho){
                    leDados("proxima");
                    return;
                }
                 else if(carta==tamanhoBaralho) {
                    carta=-1;
                    leDados("proxima");
                    return;
                }
            }
             toggleCaption("off");
            return;
        });
            //função para tirar o caption quando o homeButton é carregado
            $("#voltar").tap(function(){
                toggleCaption("off");
				//stopTimer();
                return;
            });
            //função para abrir o caption quando a carta se faz tap na carta
            $("#afui #content .linkCarta").tap(function(){
                toggleCaption("");
                return;
            });      
    }
);

reset = function(){
    intel.xdk.cache.clearAllCookies();
    return;
}

leDados=function(proxima){
    var aleat;
    toggleCaption("off");
   
        if(proxima=="proxima"){
            carta++;
            titulo = categoria[carta].titulo;
            img = docPath+categoria[carta].img;
            sugestao = categoria[carta].descricao;   
            $.refreshCarta(titulo,img,sugestao);
           } 
        else if(proxima=="anterior"){
            carta--;
            titulo = categoria[carta].titulo;
            img = docPath+categoria[carta].img;
            sugestao = categoria[carta].descricao;
            $.refreshCarta(titulo,img,sugestao);
           }
        else{
            aleat=Math.floor((Math.random()*tamanhoBaralho)+1)
            while(aleat==carta)
                aleat=Math.floor((Math.random()*tamanhoBaralho)+1)
            carta = aleat;
            titulo = categoria[carta].titulo;
            img = docPath+categoria[carta].img;
            sugestao = categoria[carta].descricao;
            $.refreshCarta(titulo,img,sugestao);
        } 
           
}

iniciaModo1 = function (){
    if(modoFuncionamento==undefined)
                    intel.xdk.cache.setCookie("modoFuncionamento","sugestivo",-1);
    $("#afui #content .carta").attr("data-header","header_1");
    categoria = [];
    for(var i=0;i<categorias.length;i++){
       categoria = categoria.concat(categorias[i]);
    }
    tamanhoBaralho = categoria.length;
    leDados("aleatorio");
    return;
}

iniciaModo2 = function (cat){
    if(modoFuncionamento==undefined)
                    intel.xdk.cache.setCookie("modoFuncionamento","normal",-1);
    $("#afui #content .carta").attr("data-header","header_normal");
    categoria = categorias[cat];
    tamanhoBaralho = categoria.length;
    leDados("aleatorio");
    return;
}

iniciaModo3 = function(){
    if(modoFuncionamento==undefined)
                    intel.xdk.cache.setCookie("modoFuncionamento","intrusivo",-1);
    $("#afui #content .carta").attr("data-header","header_intrusivo");
       arrayActividades = [{nome:"desporto",tipo:"lazer",sentado:false,ecra:false,pe:true,fisico:true,comer:true},
                       {nome:"percurso",tipo:"lazer",sentado:false,ecra:false,pe:true,fisico:true,comer:true},
                       {nome:"montanhismo",tipo:"lazer",sentado:false,ecra:false,pe:true,fisico:true,comer:true},
                       {nome:"estudar",tipo:"trabalho",sentado:true,ecra:false,pe:false,fisico:false,comer:true},
                       {nome:"programar",tipo:"trabalho",sentado:true,ecra:true,pe:false,fisico:false,comer:true},
                       {nome:"secretaria",tipo:"trabalho",sentado:true,ecra:true,pe:false,fisico:false,comer:true}
                      ]; //arrayActividades = new Array();
    /*actividadeActual = intel.xdk.cache.getCookie("actividadeActual");
    if(actividadeActual != undefined){
        //Continuar a actividade????
        confirm("Continuar a actividade :"+actividadeActual);
    }*/
return;
}
escondeTimers = function(){
 $(".timer").css("display","none");
 return;
}
iniciaActividade = function(){
   escondeTimers();
    var actividadeActual = document.getElementById("listaActividades");
    actividadeActual= actividadeActual.options[actividadeActual.selectedIndex].value;  
    console.log(actividadeActual);
    if(intel.xdk.cache.getCookie("actividadeActual")==undefined)
                    intel.xdk.cache.setCookie("actividadeActual",actividadeActual,-1); 
    else{
        intel.xdk.cache.removeCookie("actividadeActual"); 
        intel.xdk.cache.setCookie("actividadeActual",actividadeActual,-1); 
    }
    for(var i=0;i<arrayActividades.length;i++){
        if(arrayActividades[i].nome==actividadeActual){
            $(".timerActividade").css("display","block");
            if(arrayActividades[i].tipo=="lazer"){
               categoria=categorias[0];
            }
            else if(arrayActividades[i].tipo=="trabalho"){
                categoria=categorias[2];
            }
            if(arrayActividades[i].sentado)
                startWatchSentado();
            if(arrayActividades[i].ecra)
                startWatchEcra();
            if(arrayActividades[i].pe)
                startWatchPe();
            if(arrayActividades[i].comer)
                startWatchComer();
            tamanhoBaralho = categoria.length;
            //$(".tituloActividade").html("Tempo "+actividadeActual);
            temposIniciais.actividade=new Date();
            //leDados("aleatorio");
            $.ui.loadContent("actividade",false,false,"left");
            console.log(temposIniciais);
            setInterval('timerGeral("'+actividadeActual+'")',500);
        }
    }
    
return;
}

criarActividade = function () {
       
        
    $.ui.popup({title:"Nome da actividade: ",
                message:' <input type = "text" id = "novaActividade" > ',
                cancelText:"Cancelar",
                cancelCallback: function(){console.log("cancelled");},
                doneText:"OK",
                doneCallback: function()
                    {   
                        var novaActividade = document.getElementById("novaActividade").value;
                        if(novaActividade == ""){
                                           $.ui.popup("ERRO, Tem de escrever um nome para a Actividade!")
                                       }else{
                        console.log(novaActividade);
                        arrayActividades.push(new actividade(novaActividade));
                        console.log(arrayActividades);
                        var comboNome = document.getElementById("listaActividades");
                        var posicao = comboNome.length;
                        comboNome.options[posicao] = new Option(novaActividade,novaActividade);
                        resetConfigActividade();
                        $.ui.loadContent("#configActividade",false,false,"pop");
                        $.ui.setTitle(novaActividade);
                                       }
                    },
                cancelOnly:false
               });
   
    return;
}

resetConfigActividade = function (){
    document.getElementById("sentado").checked=false;
    document.getElementById("ecra").checked=false;
    document.getElementById("fisico").checked=false;
    document.getElementById("comer").checked=false;
    document.getElementById("pe").checked=false;
    document.getElementById("tipolazer").checked=false;
    document.getElementById("tipotrabalho").checked=false;
    return;
}

actividade = function (nome) {
    this.nome=nome;
    this.sentado=false;
    this.ecra=false;
    this.pe=false;
    this.fisico=false;
    this.comer=false;
    return;
}
concluirConfigActividade = function(){
   var sentado = document.getElementById("sentado").checked;
   var ecra = document.getElementById("ecra").checked;
   var fisico = document.getElementById("fisico").checked;
   var comer = document.getElementById("comer").checked;
   var pe = document.getElementById("pe").checked;
   if(pe && sentado){
        $.ui.popup("Apenas pode selecionar uma das opções: Passa muito tempo sentado ou em pé");
   }
   else{
   if(sentado)
       arrayActividades[arrayActividades.length-1].sentado=true;
   if(ecra)
       arrayActividades[arrayActividades.length-1].ecra=true;
   if(fisico)
       arrayActividades[arrayActividades.length-1].fisico=true;
   if(comer)
       arrayActividades[arrayActividades.length-1].comer=true;
   if(pe)
       arrayActividades[arrayActividades.length-1].pe=true;
   if(document.getElementById("tipolazer").checked){
       arrayActividades[arrayActividades.length-1].tipo = "lazer";
   }
   if(document.getElementById("tipotrabalho").checked){
       arrayActividades[arrayActividades.length-1].tipo = "trabalho";
   }
       $.ui.loadContent("#modo3",false,false,"right");
   }
   //alert(valor);
    return;
}

$.refreshCarta = function(titulo,img,sugestao){         
            if($("#afui #content #carta2").attr("escondida")=="escondida"){
                $("#afui #content #carta2 .linkCarta").css("background-image",'url('+img+')');
                $.ui.updateContentDiv("#caption",sugestao);
                $.ui.loadContent("carta2",false,false,"pop");
                $.ui.setTitle(titulo);
                $("#afui #content #carta2").attr("escondida","visivel");
                $("#afui #content #carta1").attr("escondida","escondida");
            }
            //Se for a 2 a visivel
            else{
                $("#afui #content #carta1 .linkCarta").css("background-image",'url('+img+')');
                $.ui.updateContentDiv("#caption",sugestao);
                $.ui.loadContent("carta1",false,false,"pop");
                $.ui.setTitle(titulo);
                $("#afui #content #carta1").attr("escondida","visivel");
                $("#afui #content #carta2").attr("escondida","escondida");
            }   
           return;
        }

popupActividade = function(){

    
    return;

}

toggleCaption = function(on){
    if(on=="off"){ 
        if(captionOn)
            $.ui.hideModal("#caption","down");
        captionOn=false;
    }
    else if(on=="on"){
        if(!captionOn)
            $.ui.showModal("#caption","up");
        captionOn=true;
    }
    else if(on==""){
        if (captionOn){
            $.ui.hideModal("#caption","down");
        captionOn=false;
        }else{
            $.ui.showModal("#caption","up");
        captionOn=true;
        }
    }
    return;
}

//TIMERS
toggleTimer = function(){
   
   if(timerOn){
       timerOn=false;
   }else{
        timerOn=true;
   }
    return;
}
stopTimer = function(){
    clearInterval(intervalo);
    return;
}

timerGeral = function(actividade){
    for(var i=0;i<arrayActividades.length;i++){
        if(arrayActividades[i].nome==actividade){
            $(".tempoActividade").html(tempoPassado(temposIniciais.actividade)+" nesta actividade");  
            if(arrayActividades[i].ecra){
                $(".tempoEcra").html(tempoPassado(temposIniciais.ecra)+" a olhar para o ecrã");    
            }
            if(arrayActividades[i].pe){
                $(".tempoPe").html(tempoPassado(temposIniciais.pe)+" em pé no mesmo sítio");    
            }
            if(arrayActividades[i].sentado){
                $(".tempoSentado").html(tempoPassado(temposIniciais.sentado)+" sentado");    
            }
            if(arrayActividades[i].comer){
                $(".tempoComer").html(tempoPassado(temposIniciais.comer)+" sem comer");    
            }
        }
    }
    return;
}

tempoPassado = function(tempoInicial){
    var ms = new Date() - tempoInicial;
    var s = ms/1000;
    var m = s    / 60 ;
    s    = acrescentaZero(Math.floor(s    % 60));
    var h   =  acrescentaZero(Math.floor(m / 60 ));
    m = acrescentaZero(Math.floor(m % 60));
    return h+":"+m+":"+s;

}

acrescentaZero = function (i){
    if (i<10)
      {
      i="0" + i;
      }
    return i;
}

startWatchEcra = function(){
    temposIniciais.ecra = new Date();
    $(".timerEcra").css("display","block");
    //document.getElementById("tempoEcra")
    return;
}

startWatchSentado = function(){
    temposIniciais.sentado = new Date();
   $(".timerSentado").css("display","block");
    //document.getElementById("tempoEcra")
    return;
}

startWatchPe = function(){
    temposIniciais.pe = new Date();
    $(".timerPe").css("display","block");
    //document.getElementById("tempoEcra")
    return;
}

startWatchComer = function(){
    temposIniciais.comer = new Date();
    $(".timerComer").css("display","block");
    //document.getElementById("tempoEcra")
    return;
}

setLocation = function() 
{
    var suc = function(p){
        var lUser = prompt("Onde está?");
        if (p.coords.latitude != undefined)
        {
            currentLatitude = p.coords.latitude;
            currentLongitude = p.coords.longitude;
        }
       $.ui.popup("Local gravado <br>" + lUser + ": "+currentLatitude+" ,"+currentLongitude); 

    };
    var fail = function(){ 
        alert("geolocation failed"); 
        getLocation();
    };

    intel.xdk.geolocation.getCurrentPosition(suc,fail);
}

watchLocation = function(){
    //This array holds the options for the command
    var options = {timeout: 10000, maximumAge: 11000, enableHighAccuracy: true };
    //This function is called on every iteration of the watch Position command that fails
    var fail = function(){
        $.ui.popup("Geolocation failed. \nPlease enable GPS in Settings.");
    }

    //This function is called on every iteration of the watchPosition command that is a success
    var suc = function(p){
      //$.ui.popup("Moved To: Latitude:" + p.coords.latitude + "Longitude:" + p.coords.longitude);
       //reset watchSentado 
    }
   
    //This command starts watching the geolocation
    if(geolocationWatchTimer==undefined)
        geolocationWatchTimer = intel.xdk.geolocation.watchPosition(suc,fail,options);
    
}
//Call the stopGeolocation function to stop the geolocation watch
    
stopWatchLocation = function(){
        intel.xdk.geolocation.clearWatch(geolocationWatchTimer);
    }  
   