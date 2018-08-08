/**
 * Created by xiangyong on 2016/9/17.
 */
var c1;
var c2;
var c3=0;
var c1Name;
var c2Name;
var c3Name;
var sort;
var offset;
var filterType;
var count;
var flage=false;
var flushflag=false;
var key;
var backFlag=true;
var GoodFlag=true;
var nosearchFlag=true;//判断添加推荐热搜词样式
$(window).load(function(){
    pageLoadStatistics("类目结果页加载");

    if(document.referrer.length >0 && document.referrer.indexOf('/showSearch')>-1){//详情页跳转

        sendConsumeTime("searchToCategoryResult","点击搜索跳转类目结果");

    }
});
$(function () {
    var slideTime = 150;
    var scrollAfter=0,scrollBefore=0;
    var scrollNavShow = true;
    $("body").on("scroll touchend", ".mui-scroll", _throttle(function () {
        var a = getListContainerIndex();
        scrollAfter=a;
        console.info(scrollAfter)
        /*滚屏操作*/
        if(scrollAfter<-20&&scrollNavShow && scrollBefore>=scrollAfter+10&&$("#thelist dl").size()>6) {//向下浏览
            console.log("向上浏览")
            scrollNavShow = false;
            if($("#list_bar").is("dl")){
                $(".newlist_s_filter").slideTo(slideTime,{"margin-top": -0.44+"rem"});
                $("#category_tab").slideTo(slideTime,{"margin-top": -0.88+"rem"});
            }else{
                $("#category_tab").slideTo(slideTime,{"margin-top": -0.44+"rem"});
            }
            $("#wapper").slideTo(slideTime,{"margin-top": -0.5+"rem"});
            $(".index_new_top").slideTo(slideTime,{"margin-top": -0.44+"rem"});

        }else if(scrollAfter<-20&&!scrollNavShow && scrollBefore<=scrollAfter-10){
            console.log("向下浏览")
            scrollNavShow = true;
            $(".index_new_top").slideTo(slideTime,{"margin-top": 0+"rem"});
            $("#category_tab").slideTo(slideTime,{"margin-top": 0.44+"px"});
            $(".newlist_s_filter").slideTo(slideTime,{"margin-top": 0+"rem"});
            $("#wapper").slideTo(slideTime,{"margin-top": 0+"rem"});
        }else if(a>10){
            scrollNavShow = true;
            $(".index_new_top").slideTo(slideTime,{"margin-top": 0+"rem"});
            $("#category_tab").slideTo(slideTime,{"margin-top": 0.44+"px"});
            $(".newlist_s_filter").slideTo(slideTime,{"margin-top": 0+"rem"});
            $("#wapper").slideTo(slideTime,{"margin-top": 0+"rem"});
            if($("#list_bar").is("dl")) {
                $("#thelist").css("padding-top", '0.9rem')
            }
        }

        setTimeout(function(){scrollBefore = scrollAfter;},0);
        /*滚屏操作 end*/

        if (a < -300) {
            $("#goBackTop").show();
        } else {
            $("#goBackTop").hide();
        }
    }, 100, 100));
    /*第三方app隐藏*/
    if(isApp()){
        appObj.isShowAppAction("0123", '0');
    }else{
        if($("#list_bar").is("dl")){
            $("#thelist").css("padding-top","1.4rem");
        }
    }
    if($("#openAppArea").length == 0 ||$("#openAppArea").is(":hidden")){
        $("#category_top").css("top", 0);
        $("#category_tab").css("margin-top",  0.44);
        $(".newlist_s_list .category").css("margin-top", 0.44);
        if($("#list_bar").is("dl")){
            $(".category_list").css("padding-top", "1.4rem");
        }else{
            $(".category_list").css("padding-top", "0.9rem");
        }
    }
    /*******************/


    c1Name=$("#c1Name").val();
    c2Name=$("#c2Name").val();
    c3Name=$("#c3Name").val();
    c1=$("#c1sysno").val();
    c2 = $("#c2sysno").val();
    deleteCookie("c2");
    deleteCookie("c3");
    sessionStorage.removeItem("c2");
    sessionStorage.removeItem("c3");
    if(isLocalStorageSupported()){
        var sessionc2=sessionStorage.getItem("c2");
        var sessionc3=sessionStorage.getItem("c3");
    }else{
        var sessionc2=getCookie("c2");
        var sessionc3=getCookie("c3");
    }

    $("a[id^=smalltype]").each(function () {
        if ($(this).attr("class") == 'on') {
            c3 = $(this).attr("data-c3");
        }
        if(sessionc2>0&&$(this).attr("data-sysno")==sessionc2){
            $(this).addClass("on");$("#smalltype_0").removeClass("on")
            backFlag=false;
        }
        if(sessionc3>0&&$(this).attr("data-sysno")==sessionc3){
            $(this).addClass("on");$("#smalltype_0").removeClass("on")
            backFlag=false;
        }

    });
    if($("#cName").val()==""){
        key=$("#searchkey").attr("data-seach")
    }
    if(key){$('#query').val(key);}
    if(c1<0){
        flage=true;
        c1=c2;
        c2=c3;
    }
    if(c1==undefined){
        c1=$("#c1").val();
    }
    if(c2== undefined){
        c2=$("#c2").val();
    }
    if(c3== undefined||c3==0){
        c3=$("#c3").val();
    }
    if(backFlag){
        showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key);
    }else{
        showlist(c1Name,c2Name,c3Name,c1,sessionc2, sessionc3, sort, offset,filterType,key);
    }
    //分类搜索列表

    // $("#search").click(function () {
    //     window.location.href = cityRoot + "/showSearch";
    // });

    var wd = 0;
    $("a[id^=smalltype]").each(function () {
        if ($(this).attr("class") == 'on') {
            c3 = $(this).attr("data-c3");
        }
        wd = $(this).width() + wd;
    });
    var size = $("#scorwd").attr("data-size");
    wd = wd + size * 12;
    $("#scorwd").width(wd);
    if($("#list_bar").is("dl")){
        $("#list_bar").scrollLeft($("#scorwd .on").offset().left-$("#scorwd").offset().left-10 );
    }


    $("a[id^=smalltype]").click(function () {
        c3=$(this).attr("data-sysno");
        if(flage){
            c2=c3;
            c3=-999999;
        }
        $("a[name=choose]").removeClass("on");
        $(this).addClass("on").attr("name","choose");
        var sysno=$(this).attr("data-sysno");
        $("a[id^=morechoose]").each(function(){
            if($(this).attr("data-sysno")==sysno){
                $("a[name=morechoose]").removeClass("on");
                $(this).addClass("on").attr("name","morechoose");
            }
        })
        $("#list_bar").scrollLeft($("#scorwd .on").offset().left-$("#scorwd").offset().left-10 );
        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();
        if(flushflag){
            showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType)
        }
        flushflag=false;
        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);
        if(isLocalStorageSupported()){
            sessionStorage.setItem("c2",c2); sessionStorage.setItem("c3",c3);
        }else{
            setCookie("c2",c2);setCookie("c3",c3);
        }


    })

    $("a[id^=morechoose]").click(function(){
        c3=$(this).attr("data-sysno");
        if(flage){
            c2=c3;
            c3=-999999;
        }
        $("a[name=morechoose]").removeClass("on");
        $(this).addClass("on").attr("name","morechoose");
        $(".newlist_s_filter_on").hide();
        $(".newlist_s_filter").show();
        $(".cg").hide();
        var sysno=$(this).attr("data-sysno");
        $("a[id^=smalltype]").each(function(){
            if($(this).attr("data-sysno")==sysno){
                $("a[name=choose]").removeClass("on");
                $(this).addClass("on").attr("name","choose");
                $("#list_bar").scrollLeft($("#scorwd .on").offset().left-$("#scorwd").offset().left-10 );
            }
        });
        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();

        showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType)
        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);
        if(isLocalStorageSupported()){
            sessionStorage.setItem("c2",c2); sessionStorage.setItem("c3",c3);
        }else{
            setCookie("c2",c2);setCookie("c3",c3);
        }

    });

    //*******************************

    //菜单
    $(".more").click(function () {
        $(".newlist_s_filter_on").show();
        $(".newlist_s_filter").hide();
        $(".cg").show();
        $(".morecategory").click(function () {
            $(".newlist_s_filter_on").hide();
            $(".newlist_s_filter").show();
            $(".cg").hide();
        });
    });


    $(".moremenu").click(function () {
        $(this).parent().next().toggle();
    });
    //************************

    //排序
    $("#sortsale").click(function () {
        $("#titlezh").removeClass('on');
        $("#titlezh").css("color",'#abd13e')
        $("#sortprice").removeClass("on price")
        $("#titlezh").html("销量")
        $("a[id^=sort]").each(function () {
            $(this).removeClass("on");
        });

        /*$(this).addClass('on');*/
        sort = 8;
        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();
        var key=$("#searchkey").attr("data-seach")
        if(flushflag){
            showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key)
        }
        flushflag=false;
        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);
    })
    $("#sortzh").click(function () {
        $("#sortprice").removeClass("on price")
        $("#titlezh").html("综合")
        $("a[id^=sort]").each(function () {
            $(this).removeClass("on");
        });
        /* $(this).addClass('on');*/
        $("#titlezh").removeClass('on');
        $("#titlezh").css("color",'#abd13e')
        sort = 0;
        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();
        var key=$("#searchkey").attr("data-seach")
        if(flushflag){
            showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key)
        }
        flushflag=false;
        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);
    })

    $("#titlezh").click(function(){
        //$(this).addClass("on")
        //$("#sortprice").removeClass("on price");
        $("#titlezh").addClass("all on");
        $("#titlezh").css("color","#666")
        $("#sortzh").removeClass("on");
        $('#otherSort').toggle()
    });

    $("#sortcommon").click(function () {
        $("#titlezh").removeClass('on');
        $("#titlezh").css("color",'#abd13e')
        $("#sortprice").removeClass("on price")
        $("#titlezh").html("评论")
        $("a[id^=sort]").each(function () {
            $(this).removeClass("on");
        });
        /* $(this).addClass('on');*/
        sort = 6;
        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();
        var key=$("#searchkey").attr("data-seach")
        if(flushflag){
            showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key)
        }
        flushflag=false;
        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);

    })

    $("#sortprice").click(function () {
        $("#titlezh").removeClass("on");
        $("#titlezh").css("color","#666")
        sort = $(this).attr("data-sort")
        if (sort==4) {
            $(this).attr("data-sort", 3).addClass("on price");
        }else{
            $(this).attr("data-sort", 4).removeClass("on price");
            $(this).addClass("price")
        }
        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();
        var key=$("#searchkey").attr("data-seach")
        if(flushflag){
            showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key)
        }
        flushflag=false;
        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);
    });

    $("#promotion").click(function(){
        try {
            //看促销埋点
            if ($(this).parents("label").attr("class") == 'on') {
                //取消看促销
                _xwq.push(['trackEvent', 'product', 'clickPromotion', {is_check: 0, fromPage: document.referrer}]);
            } else {
                //选择看促销
                _xwq.push(['trackEvent', 'product', 'clickPromotion', {is_check: 1, fromPage: document.referrer}]);
            }
        } catch (e) {}

        count=0;
        $(this).parent().toggleClass("on");
        $(this).parent().next().removeClass("on")
        if($(this).parent().attr("class")=="on"){
            filterType=1;
            $("#Tipnewproduct").hide();
        }else{
            filterType=0
            $("#Tippromite").hide().attr("name","nochoose");
        }
        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();
        var key=$("#searchkey").attr("data-seach")
        if(flushflag){
            showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key)
        }
        flushflag=false;



        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);
    });

    $("#newProduct").click(function(){
        //看新品埋点
        try{
            if($(this).parents("label").attr("class")=='on'){
                //取消看新品
                _xwq.push(['trackEvent','product','clickNewProduct',{is_check:0,fromPage:document.referrer}]);
            }else{
                //选择看新品
                _xwq.push(['trackEvent','product','clickNewProduct',{is_check:1,fromPage:document.referrer}]);
            }
        }catch (e){}

        count=0;
        $(this).parent().toggleClass("on");
        $(this).parent().prev().removeClass("on")
        if($(this).parent().attr("class")=="on"){
            filterType=2;
            $("#Tippromite").hide()
        }else{
            filterType=0
            $("#Tipnewproduct").hide().attr("name","nochoose");

        }

        $("#thelist").children("dl").fadeOut(1000)
        $("#thelist").empty();
        var key=$("#searchkey").attr("data-seach")
        if(flushflag){
            showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key)
        }
        flushflag=false;

        mui('#wapper').pullRefresh().refresh(true);
        mui('#wapper').pullRefresh().endPullupToRefresh(false);

    });
    //**********************

    $("#goBackTop").click(function(){
        goBackTop();
        $(this).hide();
    });

    //调用gps定位
    if(!isApp()){
        if(getCookie("DeliverySysNo")==null||getCookie("DeliverySysNo")==""){
            getGpsForSiteStatusSearch();
        }else{
            var isNeedGps="";
            try{
                isNeedGps =getCookie("isNeedGps");
                //isNeedGps =window.sessionStorage.getItem("isNeedGps");
            }catch (e){}
            if(isNeedGps=="1"||isNeedGps==""||isNeedGps==null){
                getGpsForSiteStatusSearch();
            }
        }
    }


})

function goproduct(sysno,e){
    //var urlNow=window.location.href;
    try{
        var position="";
        var arr=$(e).parent().attr("id").split("_");
        if(arr.length>1){
            position= parseInt(arr[1])+1;
        }
        var key=$.BENLAI.getQueryValue("key");
        var c1_name=$.BENLAI.storage.get("c1_name");
        var c2_name=$.BENLAI.storage.get("c2_name");
        var c3_name=$.BENLAI.storage.get("c3_name");
        if(key!=""){
            _xwq.push(['trackEvent', 'productlist', 'clickProduct', {
                keyword:key,
                c1_name:"",
                c2_name:"",
                c3_name:"",
                sku:sysno
            }]);
            _xwq.push(['trackEvent', 'productlist', 'clickProduct', {keyword:key,"sku":sysno,"type":"search","position":position}]);
        }else{
            _xwq.push(['trackEvent', 'productlist', 'clickProduct', {
                keyword: key,
                c1_name: c1_name,
                c2_name: c2_name,
                c3_name:c3_name,
                sku:sysno
            }]);
            _xwq.push(['trackEvent', 'productlist', 'clickProduct', {keyword:"","sku":sysno,"type":"sort","position":position}]);
        }
    }catch (e){}

    window.location.href=webRoot+"/bj/product/"+sysno;
}

function goBackTop(){
    mui('.mui-scroll-wrapper').pullRefresh().scrollTo(0, 0, 300);//滚动到顶部
    window.scrollTo(0, 00);
    mui('#wapper').pullRefresh().refresh(true);
    mui('#wapper').pullRefresh().endPullupToRefresh(false);
    if($("#list_bar").is("dl")) {
        $("#thelist").css("padding-top", '0.5rem')
    }
}
var skuCount=0;
var firstFlag=1;
var sysNoList=[];
function showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterTypes,key) {
    var pageName="";
    if(document.referrer.indexOf("/showCategory/search")>-1){
        pageName="list";
    }else if(document.referrer.indexOf("/showCategory")>-1){
        pageName="sort";
    }else{
        pageName="home";
    }
    $(".ind_gift_none").hide();
    offset = $("#thelist").children("dl").size();
    $.BENLAI.ajax({
        url: webRoot + "/showCategory/search/more",
        type: "post",
        data: {"c1":c1,"c2": c2, "sort": sort, "offset": offset, "c3": c3,"filterType":filterTypes,"key":key,"c1Name":c1Name,"c2Name":c2Name,"c3Name":c3Name},
        timeout: 5000,
        beforeSend: function () {
            if($("#thelist").children().is("dl")){
                $("#loading").hide();
            }else{
                if($("#SxNone").is(":hidden")){
                    $("#loading").show();
                }

            }

        },
        success: function (data) {
            $("#loading").hide();
            flushflag=true;
            var result = eval("(" + data + ")");
            if($("#searchkey").val()==undefined||$("#searchkey").val()==""||$("#searchkey").val()==null){
                $("#searchkey").val(result.newkeyWords);
                if($("#searchTitle").text().split("-").length<=2){
                    $("#searchTitle").text(result.newkeyWords+" – 商品搜索 - 本来生活网");
                }
            }

            try{
                //var key=$.BENLAI.getQueryValue("key");
                if(key!=undefined){
                    _xwq.push(['trackEvent', 'productlist', 'pageTurning', {keyword:key,"type":"search"}]);
                }else{
                    _xwq.push(['trackEvent', 'productlist', 'pageTurning', {keyword:"","type":"sort"}]);
                }
                if(typeof result.productList === 'undefined'&&firstFlag==1){
                    if(key != undefined) {
                        _xwq.push(['trackEvent', 'search', 'finishSearch', {
                            fromPage:pageName,
                            siteSearchKeyword: key,
                            siteSearchSkuCount: 0,
                            siteSearchTopSku: 0
                        }]);
                    }
                }
                if(result.isRecommentSearch=="true"&&$("#hotlist_nosearch ol").length==0){
                    if(result.recommentWordList.length>1){
                        $("<ol>没有找到相应的商品，为您推荐<label id='relSearch'></label>下的搜索结果。您也可以试试</ol>").appendTo($("#hotlist_nosearch"));
                        $("<ul></ul>").appendTo($("#hotlist_nosearch"));
                        $.each(result.recommentWordList, function (i, values) {
                            $("<a href='"+webRoot+"/showCategory/search.html?key="+values+"'>" + values + "</a>").appendTo($("#hotlist_nosearch ul"));
                        })
                    }else{
                        $("<ol>没有找到相应的商品，为您推荐<label id='relSearch'></label>下的搜索结果</ol>").appendTo($("#hotlist_nosearch"));
                    }
                    $.each(result.recommentWordList, function (i, values) {
                        if(i==0){
                            $("<span>“" + values + "”</span>").appendTo($("#relSearch"));
                        }else{
                            $("<em>及</em>").appendTo($("#relSearch"));
                            $("<span>“" + values + "”</span>").appendTo($("#relSearch"));
                        }

                    })
                    //添加新样式
                    $("#hotlist_nosearch").show();
                }
                if($("#hotlist_nosearch").length!=0&&nosearchFlag){
                    nosearchFlag=false;
                    var torem=$("#hotlist_nosearch").height()/pxTorem();
                    var oldrem=parseFloat($("#thelist").css("padding-top"));
                    if(isNumber(torem)&&isNumber(oldrem)){
                        $("#thelist").css("padding-top",(torem+oldrem)+"rem")
                    }
                }
                if(result.productList.length>0){
                    mui('#wapper').pullRefresh().endPullupToRefresh(false);
                    if(filterTypes==1||filterTypes==2||filterTypes==3){
                        $("#Tippromite").hide().attr("name","nochoose");
                        $("#Tipnewproduct").hide().attr("name","nochoose");
                        mui('#wapper').pullRefresh().refresh(true);
                        mui('#wapper').pullRefresh().endPullupToRefresh(false);
                    }

                    $.each(result.productList, function (n, value) {
                        if(key != undefined&&firstFlag==1&&sysNoList.length<10){
                            sysNoList.push(value.sysNo);
                        }
                        var n = n + offset;

                        //添加购物车图标
                        if (value.status != -1&&value.isInventory == true&&value.isCanDelivery==true&&value.status != 0) {
                            $("<dl id='list_" + n + "' ></dl>").appendTo($("#thelist"));
                            $("<a href='javascript:;' onclick="+"addProductToCart("+value.sysNo+",0,1,addCartType.categoryList)"+" class='btn'></a>").appendTo($("dl[id=list_" + n + "]"))
                        }else {
                            $("<dl id='list_" + n + "' class='no_sku'></dl>").appendTo($("#thelist"));
                            $("<a href='javascript:void(0);' class='btn'></a>").appendTo($("dl[id=list_" + n + "]"))

                        }
                        //第二个<a>标签
                        $("<a onclick='goproduct("+value.sysNo+",this)' href='javascript:void(0)'>" +
                            "<dt id='mlist_" + n + "'>" +
                            "</dt><dd id='mmlist_" + n + "'><div class='box' id='dblist_"+ n + "'></div></dd></a>").appendTo($("dl[id=list_" + n + "]"))
                        //添加服务标签到<dt>
                        /*if(value.productTagImg!=null&&value.productTagImg!=""&&(value.productTagImg.length>1)&&value.productTagImg[1]!=null&&value.productTagImg[1]!=""){
                            $("<s><img src=\""+value.productTagImg[1]+"\"></s>").appendTo($("dt[id=mlist_" + n + "]"))
                        }*/
                        /*1、无法送达2、敬请期待3、已抢光4、今夜达*/
                        if(value.isCanDelivery != true){
                            $("<em class=\"expect\">无法送达</em>").appendTo($("dt[id=mlist_" + n + "]"))
                        }else if(value.status != 1){
                            $("<em class=\"expect\">敬请期待</em>").appendTo($("dt[id=mlist_" + n + "]"))
                        }else if(value.isInventory != true){
                            $("<em class=\"expect\">已抢光</em>").appendTo($("dt[id=mlist_" + n + "]"))
                        }else if(value.isArrivalDay==true){
                            $("<em class=\"today\">今夜达</em>").appendTo($("dt[id=mlist_" + n + "]"))
                        }
                        //添加大图标到<dt>
                        if(value.productTag2Imgs != null&&value.productTag2Imgs != ""&&(value.productTag2Imgs.length>0)&&value.productTag2Imgs[0]!=null&&value.productTag2Imgs[0]!=""){
                            $("<p><img src=\""+value.productTag2Imgs[0]+"\"/></p>").appendTo($("dt[id=mlist_" + n + "]"))
                        }
                        //添加商品图片到<dt>
                        $(" <img class='lazy'  src='//image1.benlailife.com/wap/images/placeholder/place_holder_p_b.png' data-original='" + $.BENLAI.ImageUtil.optimizeURL(value.imageUrl) + "'/>").appendTo($("dt[id=mlist_" + n + "]"))

                        //添加属性标签到<p>标签
                        if(value.productTag2Imgs != ""&&value.productTag2Imgs!=null&&(value.productTag2Imgs.length>1)&&value.productTag2Imgs[1]!=null&&value.productTag2Imgs[1]!=""){//添加图片属性标签
                            //把<p>标签追加上去
                            $("<p id='productSname_" + n + "'>"+"<em class='pic'><img src='"+ value.productTag2Imgs[1] +"'/></em>"+value.productName+"</p>").appendTo($("div[id=dblist_" + n + "]"));
                            //  $("<em class='pic'><img src='"+ value.productTag2Imgs[1] +"'/></em>"+value.productName).appendTo($("p[id=productSname_" + n + "]"));
                        }else if(value.productTag!=""&&value.productTag!=null){//添加文字属性标签
                            $("<p id='productSname_" + n + "'>"+"<em>"+value.productTag+"</em>"+value.productName+"</p>").appendTo($("div[id=dblist_" + n + "]"));
                            // $("<em>"+value.productTag+"</em>"+value.productName).appendTo($("p[id=productSname_" + n + "]"));
                        }else{
                            $("<p id='productSname_" + n + "'>" + value.productName +"</p>").appendTo($("div[id=dblist_" + n + "]"));
                        }
                        $("p[id=productSname_" + n + "]").addClass("name");

                        if (value.promotionWord != "" && typeof(value.promotionWord) != 'undefined') {
                            $("<p class='text'>" + value.promotionWord + "</p>").appendTo($("div[id=dblist_" + n + "]"));
                        }else{
                            $("p[id=productSname_" + n + "]").addClass("name2")
                        }
                        //克数计量
                        /*if (value.specification != "" && typeof(value.specification) != 'undefined') {
                            $("<p class='text'>" + value.specification + "</p>").appendTo($("dd[id=mmlist_" + n + "]"));
                        }*/


                        $("<p class='ico01' id='promotionsTag_"+ n+"'></p>").appendTo($("div[id=dblist_" + n + "]"));

                        $.each(value.promotionsTags, function (i, values) {
                            $("<span>" + values[0] + "</span>").appendTo($("p[id=promotionsTag_" + n +"]"));
                        })

                        /*var span_span=$.each(value.promotionsTags, function (i, values) {
                            $("<span>" + values[0] + "</span>");
                        })*/
                        /*  $("<p class='ico01'>" + span_span + "</p>").appendTo($("dd[id=mmlist_" + n + "]"));*/
                        /* $.each(value.promotionsTags, function (i, values) {
                             $("<p class='ico01'><span>" + values[0] + "</span></p>").appendTo($("dd[id=mmlist_" + n + "]"));
                         })*/

                        $("<p  class='price'id='price_" + n + "'></p>").appendTo($("dd[id=mmlist_" + n + "]"));
                        $("<span>¥" + value.price.price + "</span>").appendTo($("p[id=price_" + n + "]"));
                        if (value.price.hasOrigPrice == true && value.price.price != value.price.origPrice) {
                            $("<font>¥" + value.price.origPrice + "</font>").appendTo($("p[id=price_" + n + "]"));
                        }
                        $("<p class='comment' id='comment_" + n + "'>" + value.review + "</p>").appendTo($("dd[id=mmlist_" + n + "]"));
                        $("<span>" + value.favorableRate + "</span>").appendTo($("p[id=comment_" + n + "]"))
                    });
                    if( key != undefined){
                        skuCount+=result.productList.length;
                        //搜索栏搜索事件埋点
                        _xwq.push(['trackEvent', 'search', 'finishSearch', {
                            fromPage:pageName,
                            siteSearchKeyword:key,
                            siteSearchSkuCount:skuCount,
                            siteSearchTopSku:sysNoList.join('|')}
                        ]);
                    }
                }else{
                    if(offset>0){
                        $(".ind_gift_none").hide();
                    }else{
                        $(".ind_gift_none").show();
                    }
                    if(filterTypes==1&&count<1){
                        $("#Tippromite").attr("name","choose");
                        if($("#openAppArea").is(":hidden")){
                            //$("#thelist").css("padding-top","1.2rem");
                        }else{
                            //$("#thelist").css("padding-top","1.6rem");
                        }

                    } if(filterTypes==2&&count<1){
                        $("#Tipnewproduct").attr("name","choose");
                        if($("#openAppArea").is(":hidden")){
                            //$("#thelist").css("padding-top","1.2rem");
                        }else{
                            //$("#thelist").css("padding-top","1.6rem");
                        }
                    }if(filterTypes==3){
                        $(".ind_gift_none").hide();
                        $("#Tippromite").attr("name","nochoose");
                        $("#Tipnewproduct").attr("name","nochoose");
                        mui('#wapper').pullRefresh().endPullupToRefresh(true);
                    }else{
                        mui('#wapper').pullRefresh().endPullupToRefresh(true);
                    }



                }
            }catch(e){
                if(offset>0){
                    $(".ind_gift_none").hide();
                }else{
                    if(!$("#list_bar").is("dl")){
                        if($("#SxNone").is(":hidden")){
                            $("#wapper").hide();
                            $("#SxNone").show()
                            getHotkey();
                            getGoddList();
                            getGoddListImg();
                        }
                    }else{
                        $(".ind_gift_none").show();
                    }
                }
            }



            $("img.lazy").lazyload({
                effect : "fadeIn",
                threshold :1000
            });
            if( $("#Tippromite").attr("name")=="choose"||$("#Tipnewproduct").attr("name")=="choose"){
                filterType=3
                showlist(c1Name,c2Name,c3Name,c1,c2, c3, sort, offset,filterType,key);

            }


            if(result.productList==undefined){
                mui('#wapper').pullRefresh().endPullupToRefresh(true);
                mui('#wapper').pullRefresh().refresh(false);
            }

            firstFlag=0;
        },
        error: function (jqXHR, textStatus) {
            if (textStatus == 'timeout') {
                message.info = "请求超时"
                message.hide = "true";

                showMsg(message);
            } else {
                message.info = "数据加载异常"
                message.hide = "true";
                showMsg(message);
            }

        }
    });
}


//使用mui进行上拉加载
mui.init({
    pullRefresh : {
        container:"#wapper",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
            height:20,//可选.默认50.触发上拉加载拖动距离

            callback :pullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        indicators:false
    }
});


$(function () {
    mui('.shop-content,.mui-table-view,.shop-category-container,.mui-bar,.mui-scroll,.mui-content').on('tap', 'a', function (e) {
        if (!this.classList.contains('mui-disabled')) {
            var a = this;
            a.click();
            /*  mui.openWindow({
                  url: this.getAttribute('href'),
                  id: 'info'
              });*/
        }
        else {
            mui.preventDefault(e);
            mui.stopPropagation(e);
        }
    });
    $("a[id^='key_']").live("click",function(){
        var query=$(this).text();
        searchActionPro(query);
    })
    //下拉
    $(window).scroll(function () {
        var scrollHeight = $(document).height();//文档的总高度
        var scrollTop = $(this).scrollTop();//滚动条在Y轴上的滚动距离
        var windowHeight = $(this).height();//浏览器视口的高度
        if (scrollTop >= scrollHeight - windowHeight&&GoodFlag) {
            GoodFlag=false;
            getGoddList();
        }
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop
        if(scrollTop>=400){
            $("#goBackTop").show();
        }else{
            $("#goBackTop").hide();
        }
    });
});

function pxTorem() {
    var deviceWidth = document.documentElement.clientWidth;
    if (deviceWidth > 640) {
        deviceWidth = 640;
    }
    if (deviceWidth < 320) {
        deviceWidth = 320;
    }
    return deviceWidth/3.75;
}

function isNumber(value) {         //验证是否为数字
    var patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}

function getGoddListImg() {
    $.ajax({
        type: 'post',
        cache: false,
        url: webRoot + '/api/forward/ICouponActivity/LoadErpConfig',
        data:{"placeSysNo":201},
        success: function (res) {
            if (res.error == 0&&res.data.picList.length>0&&res.data.picList[0].picUrl!="") {
                $("#hotlistImg").attr("src",res.data.picList[0].picUrl);
            }
        }
    })
}
function pullupRefresh() {
    if(isLocalStorageSupported()){
        var sessionc2=sessionStorage.getItem("c2");
        var sessionc3=sessionStorage.getItem("c3");
    }else{
        var sessionc2=getCookie("c2");
        var sessionc3=getCookie("c3");
    }

    if(flushflag) {
        flushflag = false;
        if (key != "" && key != null) {
            showlist(c1Name, c2Name, c3Name, c1, c2, c3, sort, offset, filterType, key)
            count = count + 1;
        } else if (sessionc2 != null && sessionc3 != null) {
            showlist(c1Name, c2Name, c3Name, c1, sessionc2, sessionc3, sort, offset, filterType)
            count = count + 1;
        }
        else {
            showlist(c1Name, c2Name, c3Name, c1, c2, c3, sort, offset, filterType)
            count = count + 1;
        }
    }

};

function getListContainerIndex(){
    var a = $(".mui-scroll").css("transform").split(",")[1];
    a = a.substr(0,a.length-2);
    return Number(a);
}

/*获取搜索列表热搜词*/
function getHotkey(){
    /*$.ajax({
        type: 'get',
        cache: true,
        url: webRoot+"/home/getDefaultKey",
        success: function (data) {
            var tmpl       = '',
                data       = JSON.parse(data),
                hotKeys    = data.hotKeys,
                defaultKey = data.defaultKey;
            $("#query").attr('placeholder',defaultKey);
            if(hotKeys && hotKeys.length > 0){
                var isHighLight;
                for (var i=0; i<hotKeys.length; i++){
                    isHighLight = hotKeys[i].isHighLight=="true"?"class=\"on\"":"";
                    if(hotKeys[i].linkType == "1"){
                        tmpl += '<a href="javascript:;" rel="nofollow" id="key_'+hotKeys[i].keyWord+'"  '+isHighLight+'  target="_self" data-linktype="' + hotKeys[i].linkType + '">'+hotKeys[i].keyWord+'</a>';
                    }else{
                        tmpl += '<a href="'+hotKeys[i].linkValue+'" rel="nofollow" '+isHighLight+'  target="_self" data-linktype="' + hotKeys[i].linkType + '" data-linkvalue="' + hotKeys[i].linkValue + '">'+hotKeys[i].keyWord+'</a>';
                    }
                }
                $('.newlist_nosearch ul').empty();
                $('.newlist_nosearch ul').append(tmpl);
            }
        }
    })*/
}

/*获取推荐商品*/
function getGoddList(){
    var Url = "/IProductList/ProductHotList";
    var params={offset:$(".cartnew_hotlist dl").size(),size:20}
    apiPost(Url, params, function (data) {
        if (data&&data.productList.length>0) {
            var product=""
            var ClassStyle="",promotionsTags="",no_sku="",servetag="",emtag="";
            for(var i=0;i<data.productList.length;i++){
                no_sku="";
                servetag="";
                emtag="";
                if(i%2==0){
                    ClassStyle="left"
                }else{
                    ClassStyle="right"
                }

                /*商品促销标签*/
                if(data.productList[i].promotionsTags.length>0){
                    promotionsTags=""
                    for(var tag=data.productList[i].promotionsTags, j=0;j<data.productList[i].promotionsTags.length;j++){
                        for(var c=tag[j], k=0;k<tag[j].length;k++){
                            if(k==0){
                                promotionsTags+="<span>"+c[0]+"</span>"
                            }
                        }

                    }
                }
                if(data.productList[i].productTag!=null)
                    $("index-"+$(".cartnew_hotlist dl").size()+" #a-"+i+"").append("<img src='"+data.productList[i].productTag+"'>")

                if(data.productList[i].productPropertyImg!=null)
                    $("#b-"+i+"").append("<img src='"+data.productList[i].productPropertyImg+"'>")


                /*商品是否可以购买*/
                if(data.productList[i].isCanDelivery&&data.productList[i].isInventory&&data.productList[i].status==1){
                    var productClass="btn"
                    var buy="addProductToCart("+data.productList[i].sysNo+",0,1,addCartType.categoryList)";
                }else{
                    buy="";
                    productClass="btn no";
                    no_sku="no_sku";
                }
                if(!data.productList[i].isCanDelivery){
                    servetag="<em class=\"expect\">无法送达</em>";
                }else if(data.productList[i].status!=1){
                    servetag="<em class=\"expect\">敬请期待</em>";
                }else if(!data.productList[i].isInventory){
                    servetag="<em class=\"expect\">已抢光</em>";
                }else if(data.productList[i].isArrivalDay){
                    servetag="<em class=\"today\">今夜达</em>";
                }

                /*<em v-if="good.productTag2Imgs.length>1&&good.productTag2Imgs[1]!=''" class="pic"><img :src="good.productTag2Imgs[1]"></em>
                        <em v-if="good.productTag">{{good.productTag}}</em>*/
                if(data.productList[i].productTag2Imgs.length>1&&(data.productList[i].productTag2Imgs[1]!="")){
                    emtag='<em class="pic"><img src="'+data.productList[i].productTag2Imgs[1]+'"></em>';
                }else if(data.productList[i].productTag!=""){
                    emtag='<em>'+data.productList[i].productTag+'</em>';
                }

                product+='   <dl  class="'+ClassStyle+' '+no_sku+'">\n' +
                    '                <a id="buy-'+i+'-'+$(".cartnew_hotlist dl").size()+'" href="javascript:void(0)" class="'+productClass+'" onclick="'+buy+'" ></a>\n' +
                    '                <a href="'+webRoot+'/bj/product/'+data.productList[i].sysNo+'">\n' +
                    '                    <dt>'+servetag+'<p id="b-'+i+'-'+$(".cartnew_hotlist dl").size()+'"></p><img src="'+data.productList[i].imageUrl+'"></dt>\n' +
                    '                    <dd>\n' +
                    '                        <div class="box"><p class="name">'+emtag+data.productList[i].productName+'</p>\n' +
                    '                        <p class="text">'+data.productList[i].promotionWord+'</p>\n' +
                    '                        <p class="ico01">'+promotionsTags+'</p>\n' +
                    '                        </div><p class="price">¥<span>'+data.productList[i].price.price+'</span><font>¥'+data.productList[i].price.origPrice+'</font></p>\n' +
                    '                    </dd>\n' +
                    '                </a>\n' +
                    '            </dl>'
            }
            $(".cartnew_hotlist").append(product)
            GoodFlag=true;
        }else{
            $("#GoodList").show();
            GoodFlag=false;
        }
    },true);
}
function getGpsForSiteStatusSearch() {
    setCookie2("isNeedGps","0");
    /*try{
        window.sessionStorage.setItem("isNeedGps","0");
    }catch (e){}*/
    try{
        var map, geolocation;//加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 3000       //超时后停止定位，默认：无穷大
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', getGpsSucSearch);//返回定位信息
            AMap.event.addListener(geolocation, 'error', getGpsErrorSearch);//返回定位出错信息
        });
    }catch(e){
    }

}


function getGpsErrorSearch(){

}
function getGpsSucSearch(data) {
    var latitude = data.position.getLat();
    var longitude = data.position.getLng();
    if(getCookie("DeliverySysNo")==null||getCookie("DeliverySysNo")==""){
        isFirstVisit=true;
    }else{
        isFirstVisit=false;
    }
    var params = {
        latitude:latitude,
        longitude:longitude
    }
    showSitePromptSearch(params);
}
function showSitePromptSearch(params) {
    $.ajax({
        type: 'get',
        url:"/api/forward/IAccount/LoadGpsCity",
        data:params,
        async:false,
        success:function(res){
            if(res!=null && "0" == res.error&&res.data!=null&&res.data!="") {
                //var resdata = JSON.parse(res.data);
                var resdata = res.data;
                if(resdata.isGetSysNoSuccess==true){
                    var LastGpsCity=getCookie("LastGpsCity");
                    //先判断cookie里面是否有上一次gps定位的城市，有：判断前后两次是否发生了变化，
                    // 没有：判断gps城市和cookie保存的城市是否一致
                    if(LastGpsCity==null||LastGpsCity==""){
                        setCookie("LastGpsCity", resdata.deliverySysNo);
                    }else{
                        if(LastGpsCity!=resdata.deliverySysNo){
                            setCookie("LastGpsCity", resdata.deliverySysNo);
                        }
                    }
                    if(getCookie("DeliverySysNo")==null||getCookie("DeliverySysNo")==""){//新用户切站逻辑
                        reSetCity(resdata.deliverySysNo);
                        return false;
                    }else{
                        if(LastGpsCity==null||LastGpsCity==""){//老用户，如果没有最后定位信息，取cookie里面的城市信息
                            LastGpsCity=getCookie("DeliverySysNo");
                        }
                        if(LastGpsCity!=resdata.deliverySysNo){//判断gps城市和上次定位的城市是否一致，不一致弹出切站框
                            var cityName = resdata.city;
                            var citySysNo = resdata.deliverySysNo;
                            $("#city_prompt").hide();
                            $("#sitePrompt").show();
                            $("#sitePromptMask").show();
                            $("#locCity").html(cityName);
                            $("#cookieSiteNo").val(getCookie("WebSiteSysNo"));
                            $("#backUrl").val(window.location.href);
                            $("#locCityText").html("是否更改城市为" + cityName + "？");
                            $("#locCity").attr("data-number", citySysNo);
                            //GPS弹窗埋点
                            var _cookieSiteSno=getCookie("WebSiteSysNo");
                            var urlKey=$.BENLAI.getQueryValue("site");
                            if(urlKey!=""){
                                GPSPopup_BuriedPoint("","",_cookieSiteSno,cityName,"搜索页面",1);
                            }else{
                                GPSPopup_BuriedPoint("","",_cookieSiteSno,cityName,"列表页",1);
                            }

                        }
                    }

                }else{//api根据经纬度没有找到相对应的城市
                    var oldCity=decodeURIComponent(getCookie("city").replace(/\*/ig,'%'));
                    var urlKey=$.BENLAI.getQueryValue("site");
                    var cookiesno=getCookie("WebSiteSysNo");
                    if(oldCity==""){
                        oldCity="北京";
                    }
                    Prompter.AlertDialog.builder({
                        title: "检测到你的位置为"+resdata.city+"，暂时未开通，将停留在"+oldCity+"，敬请谅解",
                        positiveButton: {
                            name: "确定", handler: function () {
                                if(urlKey!=""){
                                    GPSPopup_BuriedPoint(1,"",cookiesno,resdata.city,"搜索页面",1);
                                }else{
                                    GPSPopup_BuriedPoint(1,"",cookiesno,resdata.city,"列表页",1);
                                }
                                $(this).hide();
                            }
                        },
                        negativeButton :{name:"取消", handler: function(){

                            if(urlKey!=""){
                                GPSPopup_BuriedPoint(2,"",cookiesno,resdata.city,"搜索页面",1);
                            }else{
                                GPSPopup_BuriedPoint(2,"",cookiesno,resdata.city,"列表页",1);
                            }
                            $(this).hide();
                        }
                        }
                    });
                    if(urlKey!=""){
                        GPSPopup_BuriedPoint("","",cookiesno,resdata.city,"搜索页面",1);
                    }else{
                        GPSPopup_BuriedPoint("","",cookiesno,resdata.city,"列表页",1);
                    }
                }
            }else{//定位失败
                getGpsErrorSearch();
            }
        }
    });
}
