var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > 0 ? true : false;
var isIOS = ua.indexOf("ipad") > 0 ? true : ua.indexOf("iphone") > 0 ? true : false;
var isNotPC = isAndroid || isIOS;
var isPreview = false;
var previewRange = 100;
var intBrowserW = 0;
var intBrowserH = 0;
var pageDirection = "left";
var isTwoPage = false;
var nowPage = 0;
var intTotalPage = 0;
var intPreloadPage = 100;
var intSliderTotalPage = 0;
var SliderCurrPageX = 0;
var onScrollEndTimer;
var loadZoomImageTimer;
var intWaitTime = 150;
var intTransPageTime = 500;
var isPreloadAll = false;
var preloadAllTimer;
var intPreloadAll = 0;
var intPreloadAllInterval = 500;
var intPreloadAllQuality = 0;
var zoomInterTimer;
var preloadTimer;
var preloadPage;
var preImgLoadingCounter = 0;
var u_width = 0;
var u_height = 0;
var minPageW = 0;
var minPageH = 0;
var last_width;
var nowScale = 1;
var scale = 1.25;
var zoomSuccess = false;
var arrPageObj = new Array();
var dicMediaAnnot = null;
var isAction = true;
var intPreventTime = 30;
var prepareAjax = null;
var urls = {};
var pages;
var pagePositions;
var pageTime = 0;
var pageTimer = null;
var readTimer = null;
var readTimeS;
var readTimeE;
var readTime = 0;
var turnPages = 0;
var _HashMap = [[0, 3, 5, 7, 8, 2, 9, 6, 1, 4], [9, 5, 8, 4, 6, 7, 2, 1, 0, 3], [6, 9, 5, 0, 2, 1, 4, 3, 7, 8], [8, 7, 3, 0, 5, 4, 9, 1, 2, 6], [8, 1, 7, 5, 0, 3, 2, 4, 6, 9], [3, 8, 2, 9, 1, 0, 4, 6, 7, 5], [7, 1, 9, 6, 0, 4, 8, 2, 3, 5], [7, 4, 1, 6, 2, 0, 9, 3, 5, 8], [5, 3, 1, 6, 9, 7, 0, 2, 8, 4], [1, 4, 6, 7, 2, 5, 9, 8, 0, 3]];
function iScrollLoaded() {}
function initReader() {
    var page = getCookie("goToPage") ? parseInt(getCookie("goToPage")) : -1;
    if (page != -1) {
        setCookie("nowISBN", strISBN, 1);
        setCookie("nowPage", page, 1);
        nowPage = page;
        delCookie("goToPage");
    }
    if (document.documentElement) {
        intBrowserW = document.documentElement.clientWidth;
        intBrowserH = document.documentElement.clientHeight;
    } else {
        intBrowserW = document.body.clientWidth;
        intBrowserH = document.body.clientHeight;
    }
    var isFullScreenMode = true;
    if ('standalone'in navigator && !navigator.standalone && (/iphone|ipod|ipad/gi).test(navigator.platform) && (/Safari/i).test(navigator.appVersion)) {
        isFullScreenMode = false;
    }
    if ((/iphone/gi).test(navigator.appVersion) && !isFullScreenMode) {
        window.scrollTo(0, 1);
        intBrowserH += 60;
    }
    $("#background").css({
        "width": intBrowserW,
        "height": intBrowserH
    });
    getNowTwoPage();
    pageDirection = bookData.direction;
    $("#readingDirection").css({
        "top": (intBrowserH - 75) / 2,
        "left": (intBrowserW - 196) / 2
    });
    document.getElementById("booktitle").innerHTML = bookData.title;
    intTotalPage = bookData.pageCount;
    $("#intPageTotal").html(" / " + (intTotalPage - 1));
    if (isTwoPage) {
        intSliderTotalPage = Math.ceil((bookData.pageCount - 1) / 2) + 1;
    } else {
        intSliderTotalPage = intTotalPage;
    }
    $("#slider-fill").slider();
    $("#slider-fill").slider("option", "max", intSliderTotalPage - 1);
    if (isTwoPage) {
        $("#scroller-Zoom").html('<div><div id="zoomPageL" class="pageL smoothL"></div><div id="zoomPageR" class="pageR smoothR"></div></div>');
        $("#zoomPageL").css({
            "height": intBrowserH - 8
        });
        $("#zoomPageR").css({
            "height": intBrowserH - 8
        });
    } else {
        $("#scroller-Zoom").html('<div id="zoomPageS" class="pageS"></div>');
        $("#zoomPageS").css({
            "height": intBrowserH - 8
        });
    }
    var strHTML = "";
    var blankdiv_num = (isTwoPage) ? Math.ceil((bookData.pageCount - 1) / 2) + 1 : bookData.pageCount;
    var sub_strHTML = "<div id=\"scroller-page\" style=\"position: relative\">";
    if (isTwoPage) {
        sub_strHTML += "<div id=\"pageL\" class=\"pageL smoothL\"></div>";
        sub_strHTML += "<div id=\"pageR\" class=\"pageR smoothR\"></div>";
    } else {
        sub_strHTML += "<div id=\"pageS\" class=\"pageS smoothS\"></div>";
    }
    sub_strHTML += "</div>";
    if (pageDirection == "left") {
        strHTML += sub_strHTML;
    } else {
        strHTML = sub_strHTML + strHTML;
    }
    $("#scroller-FlipZoom").html(strHTML);
    $("#scroller-FlipZoom div").css({
        "width": intBrowserW,
        "height": intBrowserH
    });
    if (isTwoPage) {
        $(".page-cover").css({
            "width": intBrowserW / 2 - 4,
            "height": intBrowserH - 8
        });
    } else {
        $(".page-cover").css({
            "width": intBrowserW - 8,
            "height": intBrowserH - 8
        });
    }
    $(".pageL").css({
        "width": intBrowserW / 2 - 4,
        "height": intBrowserH - 8
    });
    $(".pageR").css({
        "width": intBrowserW / 2 - 4,
        "height": intBrowserH - 8
    });
    $(".pageS").css({
        "width": intBrowserW - 8,
        "height": intBrowserH - 8
    });
    $("#scroller-FlipZoom div").css("background-color", "white");
    $(".page-cover").css("background-color", "white");
    $(".pageL").css("background-color", "white");
    $(".pageR").css("background-color", "white");
    $(".pageS").css("background-color", "white");
    if (navigator.appName == "Microsoft Internet Explorer" && ($.browser.version == "7.0" || $.browser.version == "8.0")) {
        $(".pageS").css("behavior", "url(css/PIE.htc)");
        $(".pageL").css("behavior", "url(css/PIE.htc)");
        $(".pageR").css("behavior", "url(css/PIE.htc)");
    }
    $("#wrapper-Zoom").css({
        "width": intBrowserW,
        "height": intBrowserH - 4
    });
    $("#scroller-Zoom").css({
        "width": intBrowserW,
        "height": intBrowserH
    });
    $("#wrapper-FlipZoom").css({
        "width": intBrowserW,
        "height": intBrowserH - 4
    });
    $("#scroller-FlipZoom").css({
        "width": intBrowserW - 4
    });
    $("#scroller-FlipZoom").height(intBrowserH - 4);
    $("#TOCResult").css({
        "height": intBrowserH - 60
    });
    $("#searchResultScroll").css({
        "height": intBrowserH - 60
    });
    $("#mediaResultScroll").css({
        "height": intBrowserH - 60
    });
    $("#scroller-FlipZoom").css("overflow", "hidden");
    $("#scroller-FlipZoom").css("position", "relative");
    if (isPreloadAll) {
        var intPreloadEndPage = 0;
        if (isPreview) {
            intPreloadEndPage = Math.ceil(intTotalPage / 1);
        } else {
            intPreloadEndPage = intTotalPage;
        }
        preloadAllTimer = setInterval(function() {
            if (intPreloadAll >= intPreloadEndPage) {
                if (intPreloadAllQuality < 3) {
                    intPreloadAll = 0;
                    intPreloadAllQuality = 3;
                    return;
                }
                clearInterval(preloadAllTimer);
                preloadAllTimer = null;
                return;
            }
            preLoadPageImage(intPreloadAll, intPreloadAllQuality);
            intPreloadAll += 1;
            setCookie("intPreloadAll", intPreloadAll, 1);
        }, intPreloadAllInterval * intPreloadAllQuality);
    }
}
function loadPageLoadingImage(intPage) {
    if (arrPageObj[intPage] != undefined) {
        return;
    }
    var id = "";
    if (!isNaN(intPage)) {
        if (isTwoPage) {
            if (pageDirection == "left") {
                if (nowPage == intPage) {
                    id = "#pageL";
                } else {
                    id = "#pageR";
                }
            } else {
                if (nowPage == intPage) {
                    id = "#pageR";
                } else {
                    id = "#pageL";
                }
            }
        } else {
            id = "#pageS";
        }
    } else {
        id = "#" + intPage;
    }
    var left = $(id).width() / 2;
    if (left == 0) {
        left = $(id).parent().width();
    }
    var top = $(id).height() / 2;
    if (top == 0) {
        top = $(id).parent().height();
    }
    $(id).stop(true, true).block({
        message: "<img src='images/icon_loading.gif' style='height:400px;' />",
        css: {
            width: "400px",
            height: "400px",
            border: "none",
            background: "transparent"
        },
        overlayCSS: {
            backgroundColor: "#bbb",
            opacity: "0"
        },
        baseZ: 1000,
        showOverlay: false,
        timeout: 0,
        onBlock: function() {
            if ($(this).css("left") == "0px" || $(this).css("top") == "0px") {
                $(this).hide();
            }
        }
    });
}
function preLoadPageImage(preloadPage, preloadQuality) {
    bookData.getPageManifest(preloadPage, true, function(response) {
        arrPageObj[preloadPage] = response;
        return;
        for (var r = 0; r < response.imgSet.length; r++) {
            if (r == 0) {
                initPageImg($("#page" + preloadPage), response, true);
            } else {
                return;
                for (var i = 0; i < response.imgSet[r].images.length; i++) {
                    for (var j = 0; j < response.imgSet[r].images[i].length; j++) {
                        preImgLoadingCounter++;
                        var img = $("<img>").attr("id", response.imgSet[r].images[i][j]).attr("src", bookData.getPageImage(response.imgSet[r].images[i][j])).load(function() {
                            preImgLoadingCounter--;
                            $(this).attr("src", "").remove();
                        }).unload(function() {
                            preImgLoadingCounter--;
                            $(this).remove();
                        }).error(function() {
                            preImgLoadingCounter--;
                            $(this).remove();
                        });
                        $("#preloadImage").append($(img));
                        if (preloadQuality <= r) {
                            return;
                        }
                    }
                }
            }
        }
    });
}
function loadPageImage(intPage, isPreload, isLowQuaility) {
    if (intPage < 0) {
        intPage = 0;
    } else if (intPage >= bookData.pageCount) {
        intPage = bookData.pageCount - 1;
    }
    if (checkPreview(intPage) == false) {
        return;
    }
    prepare(strISBN, intPage, isPreload, isLowQuaility);
    return;
    urls[intPage] = ['GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=0&Row=0&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=1&Row=0&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=1&Row=0&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=1&Row=1&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=1&Row=1&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=0&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=0&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=0&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=0&Col=3', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=1&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=1&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=1&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=1&Col=3', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=2&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=2&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=2&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=2&Col=3', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=3&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=3&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=3&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + intPage + '&Set=2&Row=3&Col=3'];
    urls[intPage + 1] = ['GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=0&Row=0&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=1&Row=0&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=1&Row=0&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=1&Row=1&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=1&Row=1&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=0&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=0&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=0&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=0&Col=3', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=1&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=1&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=1&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=1&Col=3', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=2&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=2&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=2&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=2&Col=3', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=3&Col=0', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=3&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=3&Col=2', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (intPage + 1) + '&Set=2&Row=3&Col=3'];
    prepareCallBack(intPage, isPreload, isLowQuaility);
    return;
    prepare(strISBN, intPage);
    bookData.getPageManifest(intPage, true, function(response) {
        arrPageObj[intPage] = response;
        if (isTwoPage) {
            if (pageDirection == "left") {
                initPageImg($("#pageL"), response, isLowQuaility);
            } else {
                initPageImg($("#pageR"), response, isLowQuaility);
            }
        } else {
            initPageImg($("#pageS"), response, isLowQuaility);
        }
        if (isTwoPage) {
            if (intPage == 0) {
                if (pageDirection == "left") {
                    $("#pageR").hide();
                    $("#pageL").css("visibility", "visible");
                    $("#pageL").addClass("page-cover");
                    changeOffest($("#pageL"));
                } else {
                    $("#pageL").hide();
                    $("#pageR").css("visibility", "visible");
                    $("#pageR").addClass("page-cover");
                    changeOffest($("#pageR"));
                }
            } else if (bookData.pageCount > intPage + 1) {
                if (pageDirection == "left") {
                    $("#pageL").removeClass("page-cover");
                    $("#pageR").show();
                    $("#pageR").css("visibility", "visible");
                    changeOffest($("#pageL"));
                    changeOffest($("#pageR"));
                    bookData.getPageManifest((intPage + 1), true, function(response) {
                        arrPageObj[intPage + 1] = response;
                        initPageImg($("#pageR"), response, isLowQuaility);
                    });
                } else {
                    $("#pageR").removeClass("page-cover");
                    $("#pageL").show();
                    $("#pageL").css("visibility", "visible");
                    changeOffest($("#pageL"));
                    changeOffest($("#pageR"));
                    bookData.getPageManifest((intPage + 1), true, function(response) {
                        arrPageObj[intPage + 1] = response;
                        initPageImg($("#pageL"), response, isLowQuaility);
                    });
                }
            } else {
                if (pageDirection == "left") {
                    $("#pageR").css("visibility", "hidden");
                } else {
                    $("#pageL").css("visibility", "hidden");
                }
            }
        }
    });
    if (isPreload) {
        var strNow = "";
        var strNext = "";
        if (isTwoPage) {
            if (pageDirection == "left") {
                strNow = "#pageL";
                strNext = "#pageR";
            } else {
                strNow = "#pageR";
                strNext = "#pageL";
            }
        } else {
            strNow = "#pageS";
        }
        LoadMediaAnnot(intPage, $(strNow));
        if (isTwoPage && bookData.pageCount > intPage + 1) {
            LoadMediaAnnot(intPage + 1, $(strNext));
        }
    }
    $("#scroller-FlipZoom").scrollLeft($("#scroller-FlipZoom").data('scrollLeft'));
    $("#scroller-FlipZoom").scrollTop($("#scroller-FlipZoom").data('scrollTop'));
    if (isPreload) {
        if (preloadTimer != null) {
            clearInterval(preloadTimer);
        }
        preloadPage = intPage;
        preloadTimer = setInterval(function() {
            try {
                if (preloadPage < intPage) {
                    if (preloadPage < (intPage - intPreloadPage) || preloadPage < 0) {
                        clearInterval(preloadTimer);
                        preloadTimer = null;
                    } else {
                        preLoadPageImage(preloadPage);
                        preloadPage--
                    }
                } else {
                    preloadPage++;
                    if (preloadPage <= intPage + intPreloadPage && preloadPage < bookData.pageCount) {
                        preLoadPageImage(preloadPage);
                    } else {
                        preloadPage = intPage - 1;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, intWaitTime);
    }
}
function getNowTwoPage() {
    if (getCookie("isTwoPage") != null) {
        isTwoPage = getCookie("isTwoPage") == "true" ? true : false;
    } else {
        if (intBrowserW > intBrowserH) {
            isTwoPage = true;
        } else {
            isTwoPage = false;
        }
    }
}
function setNowTwoPage(isTwoPage) {
    setCookie("isTwoPage", isTwoPage, 1);
}
function getNowPage() {
    if (getCookie("nowISBN") != strISBN) {
        nowPage = 0;
    } else {
        nowPage = getCookie("nowPage") ? getCookie("nowPage") : 0;
    }
    nowPage = parseInt(nowPage, 10);
}
function setNowPage() {
    setCookie("nowISBN", strISBN);
    setCookie("nowPage", nowPage, 1);
    turnPages += 1;
}
function getNowSliderPage() {
    var currPage = 0;
    if (isTwoPage) {
        if (pageDirection == "left") {
            currPage = nowPage / 2;
        } else {
            currPage = (intTotalPage - nowPage + 1) / 2 - 1;
        }
    } else {
        if (pageDirection == "left") {
            currPage = nowPage;
        } else {
            currPage = intTotalPage - nowPage - 1;
        }
    }
    return Math.ceil(currPage);
}
function goToNowPage() {
    getNowPage();
    var currPage = getNowSliderPage();
    scrollToPage(currPage);
}
function jump(jumpPage) {
    jumpPage = parseInt(jumpPage, 10);
    if (jumpPage < 0) {
        jumpPage = 0;
    }
    if (jumpPage > bookData.pageCount - 1) {
        jumpPage = bookData.pageCount - 1;
    }
    if (checkPreview(jumpPage) == false) {
        return;
    }
    if (isTwoPage) {
        if (jumpPage % 2 == 0) {
            nowPage = jumpPage - 1;
        } else {
            nowPage = jumpPage;
        }
    } else {
        nowPage = jumpPage;
    }
    setNowPage();
    goToNowPage();
}
function jumpPage(e, isVEnter) {
    var text = document.getElementById("pageNum").value;
    var key = window.event ? e.keyCode : e.which;
    if (key == 13 || isVEnter) {
        if (text.Trim() == "") {
            return;
        }
        if (isNaN(text.Trim())) {
            return;
        }
        if (parseInt(text.Trim(), 10) < 0) {
            return;
        }
        document.activeElement.blur();
        $("input").blur();
        jump(text.Trim());
    }
}
function bindTOC() {
    var strHTML = "";
    strHtml = GetBookMarkHtml(bookData.navPoint, 0);
    $("#TOCResultScroll").html(strHtml);
    $("[id^='TOC-']").click(function() {
        jump($(this).attr("id").replace("TOC-", ""));
        setTimeout(function() {
            $("#page-TOC .back").click();
        }, 500);
    });
}
function GetBookMarkHtml(bookmark, level) {
    var strHtml = "";
    if (bookmark == null) {
        return "";
    }
    for (var i = 0; i < bookmark.length; i++) {
        strHtml += "<div id=\"TOC-" + bookmark[i].page + "\" class=\"searchResult-s ui-block-a\">";
        for (var j = 0; j < level; j++) {
            strHtml += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        strHtml += bookmark[i].Title + "</div>";
        if (bookmark[i].BookMarkData != null && bookmark[i].BookMarkData.length > 0) {
            strHtml += GetBookMarkHtml(bookmark[i].BookMarkData, level + 1);
        }
    }
    return strHtml;
}
function SearchTextCallBack(text, startPage, searchPage, searchResult) {
    for (var i = 0; i < searchResult.length; i++) {
        var div = $("<div>").attr("id", "Search-" + searchResult[i].page).addClass((i % 2 == 0) ? "ui-block-a searchResult-s" : "ui-block-a searchResult-d").css("text-overflow", "ellipsis").html("<b>第" + searchResult[i].page + "頁</b>&nbsp;&nbsp;" + searchResult[i].text.replace(text, "<font color='red'>" + text + "</font>")).click(function() {
            jump($(this).attr("id").replace("Search-", ""));
        });
        $("#searchResult").append(div);
    }
    if ((startPage + searchPage) < bookData.pageCount) {
        bookData.searchText(text, startPage + searchPage, searchPage, SearchTextCallBack);
    } else {
        $("#searchWaitText").hide();
        if (document.getElementById("searchResult").innerHTML == "") {
            document.getElementById("searchResult").innerHTML += "<div class=\"ui-block-a searchResult-s\">查無符合結果。</div>";
        }
    }
}
function searchText(e, isVEnter) {
    var text = document.getElementById("txtSearch").value;
    var key = window.event ? e.keyCode : e.which;
    if (key == 13 || isVEnter) {
        if (text.Trim() == "") {
            document.getElementById("searchResult").innerHTML = "";
            return;
        }
        document.activeElement.blur();
        $("input").blur();
        $("#searchWaitText").stop(true, true).show();
        document.getElementById("searchResult").innerHTML = "";
        bookData.searchText(text, 1, 20, SearchTextCallBack);
    }
}
function checkPreview(PageNumber) {
    if (!isPreview) {
        return true;
    }
    if (typeof PageNumber == "undefined") {
        PageNumber = nowPage;
    }
    if (PageNumber > Math.ceil(bookData.pageCount * previewRange / 1)) {
        alert("試閱服務僅提供前 " + previewRange + "% 內容試閱哈哈哈哈！");
        setTimeout(function() {
            goToNowPage();
        }, 500);
        return false;
    }
    return true;
}
function playAudio(obj, e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    } else {
        window.event.cancelBubble = true;
    }
    $("#audioPlay").jPlayer("destroy");
    $("#audioPlay").jPlayer({
        ready: function() {
            $(this).jPlayer("setMedia", {
                mp3: obj
            }).jPlayer("play");
        },
        cssSelectorAncestor: "#audioPlayer",
        swfPath: "js",
        supplied: "mp3",
        wmode: "window",
        smoothPlayBar: true,
        keyEnabled: true
    });
    $("#audioPlayer").css({
        "position": "absolute",
        "z-index": 10000,
        left: (intBrowserW - $("#audioPlayer").width()) / 2 + "px",
        top: (intBrowserH - $("#audioPlayer").height()) - 50 + "px"
    });
    $("#audioPlayer").stop(true, true).show("fade");
    $("#audioPlayer").draggable({
        containment: "window"
    });
    $(".jp-progress").mouseup(function() {
        $("#audioPlayer").draggable("enable")
    }).mousedown(function() {
        $("#audioPlayer").draggable("disable")
    });
    $(".closeAudio").one("click", function(e) {
        $("#audioPlay").jPlayer("destroy");
        $("#audioPlayer").hide();
    });
}
function playVideo(obj, e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    } else {
        window.event.cancelBubble = true;
    }
    $("#videoPlay").jPlayer("destroy");
    $("#videoPlay").jPlayer({
        ready: function() {
            $(this).jPlayer("setMedia", {
                m4v: obj
            }).jPlayer("play");
        },
        cssSelectorAncestor: "#videoPlayer",
        solution: "flash, html",
        swfPath: "js",
        supplied: "m4v",
        size: {
            width: "640px",
            height: "360px",
            cssClass: "jp-video-360p"
        },
        smoothPlayBar: true,
        keyEnabled: true
    });
    $("#videoPlayer").css({
        "position": "absolute",
        "z-index": 10000,
        left: (intBrowserW - $("#videoPlayer").width()) / 2 + "px",
        top: (intBrowserH - $("#videoPlayer").height()) / 2 + "px"
    });
    $("#videoPlayer").stop(true, true).show("fade");
    $("#videoPlayer").draggable({
        containment: "window"
    });
    $(".jp-progress").mouseup(function() {
        $("#videoPlayer").draggable("enable")
    }).mousedown(function() {
        $("#videoPlayer").draggable("disable")
    });
    $(".closeVideo").one("click", function() {
        $("#videoPlay").jPlayer("destroy");
        $("#videoPlayer").hide();
    });
}
$(document).ready(function() {
    $(document).bind("ajaxStart", function() {
        $(document).data("ajaxStart", true);
    }).bind("ajaxStop", function() {
        $(document).data("ajaxStart", false);
    });
    initReader();
    goToNowPage();
    $("#content").mousewheel(function(event, delta) {
        if (delta > 0) {
            SmoothZoomIn();
        } else {
            SmoothZoomOut();
        }
        return false;
    });
    $("#scroller-FlipZoom").mousedown(function(event) {
        $(this).data('down', true).data('x', event.clientX).data('y', event.clientY).data('scrollLeft', this.scrollLeft).data('scrollTop', this.scrollTop);
        return false;
    }).mouseup(function(event) {
        $(this).data('down', false).data('scrollLeft', this.scrollLeft).data('scrollTop', this.scrollTop);
        savePageTime();
    }).mousemove(function(event) {
        if ($(this).data('down') == true) {
            event.preventDefault();
            this.scrollLeft = $(this).data('scrollLeft') + $(this).data('x') - event.clientX;
            this.scrollTop = $(this).data('scrollTop') + $(this).data('y') - event.clientY;
        }
        $(this).data('mouseX', event.clientX - this.scrollLeft).data('mouseY', event.clientY - this.scrollTop);
    }).mouseleave(function() {
        $(this).data('down', false).data('scrollLeft', this.scrollLeft).data('scrollTop', this.scrollTop);
    });
    $("#scroller-FlipZoom").click(function(event) {
        setTimeout(function() {
            $("#page-TOC .back").click();
        }, 500);
        setTimeout(function() {
            $("#page-search .back").click();
        }, 500);
        if (nowScale <= 1) {
            var left = $(window).width() / 4;
            var right = $(window).width() * 3 / 4;
            if (event.clientX < left) {
                $("#previous_page").click();
            } else if (event.clientX > right) {
                $("#next_page").click();
            }
        }
    });
    $("#next_page").click(function() {
        if (isAction) {
            isAction = false;
            var scrollpage = getScrollpage();
            scrollToPage(scrollpage + 1, true);
            setTimeout(function() {
                isAction = true;
            }, intPreventTime);
        }
    });
    $("#previous_page").click(function() {
        if (isAction) {
            isAction = false;
            var scrollpage = getScrollpage();
            scrollToPage(scrollpage - 1, true);
            setTimeout(function() {
                isAction = true;
            }, intPreventTime);
        }
    });
    $("#slider-fill").on("slide", function(event, ui) {
        if (isTwoPage) {
            nowPage = ui.value * 2 - 1;
            if (nowPage < 0) {
                $("#pageNum").val(0);
            } else if (nowPage >= bookData.pageCount) {
                $("#pageNum").val(bookData.pageCount - 1);
            } else {
                $("#pageNum").val(nowPage);
            }
        } else {
            nowPage = ui.value;
            $("#pageNum").val(nowPage);
        }
        var strChapter = bookData.getPageTitle(nowPage);
        $("#intPage").text(strChapter);
    });
    $("#slider-fill").on("slidestop", function(event) {
        if (checkPreview() == true) {
            setNowPage();
            goToNowPage();
        }
    });
    bindTOC();
    $("#btn_menu").click(function() {
        $("#page-TOC").stop(true, true).show("slide", {
            direction: "left"
        }, intTransPageTime);
    });
    $("#page-TOC .back").click(function() {
        $("#page-TOC").hide("slide", {
            direction: "left"
        }, intTransPageTime);
    });
    $("#page-TOC").hide();
    $("#btn_search").click(function() {
        $("#page-search").stop(true, true).show("slide", {
            direction: "right"
        }, intTransPageTime);
    });
    $("#page-search .back").click(function() {
        $("#page-search").hide("slide", {
            direction: "right"
        }, intTransPageTime);
    });
    $("#page-search").hide();
    $("#btn_audio").hide();
    $("#btn_video").hide();
    $("#mediaWaitText").stop(true, true).show();
    $.ajax({
        contentType: 'application/x-www-form-urlencoded',
        url: 'GetBookMediaAnnot',
        data: 'ISBN=' + strISBN,
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            dicMediaAnnot = response;
            if (dicMediaAnnot == null || dicMediaAnnot == '' || dicMediaAnnot == {}) {
                return;
            }
            var values = Object.keys(dicMediaAnnot).map(function(key) {
                return dicMediaAnnot[key]
            })
            if ([].concat.apply([], values).filter(function(x) {
                return x.Type == 'audio'
            }).length > 0) {
                $("#btn_audio").show();
            }
            if ([].concat.apply([], values).filter(function(x) {
                return x.Type == 'video'
            }).length > 0) {
                $("#btn_video").show();
            }
            $("#mediaWaitText").hide();
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    $("#btn_audio, #btn_video").click(function(event) {
        $("#mediaResult").html("");
        var object = event.target;
        var mediaType = object.id == "btn_audio" ? "audio" : "video";
        $("#page-media").stop(true, true).show("slide", {
            direction: "right"
        }, intTransPageTime);
        $("#page-media").data("mediaType", mediaType);
        var pages = Object.keys(dicMediaAnnot);
        $.each(pages, function(indexPage, page) {
            var mediaAnnots = dicMediaAnnot[page];
            $.each(mediaAnnots.filter(function(x) {
                return x.Type == mediaType
            }), function(index, mediaAnnot) {
                var mediaName = mediaAnnot.ID.split("\\")[mediaAnnot.ID.split("\\").length - 1];
                var div = $("<div>").attr("id", "Search-" + mediaAnnot.ID).data("Media", mediaAnnot.ID).data("Page", page).data("MediaType", mediaAnnot.Type).addClass(($("#mediaResult").children().length % 2 == 0) ? "ui-block-a searchResult-s" : "ui-block-a searchResult-d").css("text-overflow", "ellipsis").html("<b>第" + page + "頁</b>&nbsp;&nbsp;" + mediaName).click(function() {
                    jump($(this).data("Page"));
                    $(".closeAudio").click();
                    $(".closeVideo").click();
                    if (isPreview && page > Math.ceil(bookData.pageCount * previewRange / 1)) {
                        return;
                    }
                    if ($(this).data("MediaType") == "audio") {
                        playAudio(bookData.getMedia($(this).data("Media")), event);
                    } else {
                        playVideo(bookData.getMedia($(this).data("Media")), event);
                    }
                });
                $("#mediaResult").append(div);
            });
        });
    });
    $("#page-media .back").click(function() {
        $("#page-media").hide("slide", {
            direction: "right"
        }, intTransPageTime);
    });
    $("#page-media").hide();
    $("#txtSearch").blur(function() {
        $("#page-TOC").css("left", "0px");
    });
    if (document.referrer.indexOf(location.href) < 0) {
        setCookie("nowPage", 0, 1);
    }
    if (document.body.clientHeight > document.body.clientWidth || document.documentElement.clientHeight > document.documentElement.clientWidth) {
        document.getElementById("btn_dp").onclick = null;
        document.getElementById("btn_dp").ontouchstart = null;
    }
    if (pageDirection == "left") {
        document.getElementById("readingDirection").src = "images/reading_direction_right.png";
    } else {
        document.getElementById("readingDirection").src = "images/reading_direction_left.png";
    }
    setTimeout(function() {
        if (document.getElementById("theme-drawer").style.display != "none") {
            drawerToggler();
        }
        document.getElementById("readingDirection").style.display = "none";
    }, 3000);
    $.ajax({
        url: '../Viewer/GetPreviewRangeByISBN',
        type: 'POST',
        data: {
            'strISBN': strISBN
        },
        async: false,
        cache: false,
        success: function(response) {
            previewRange = response;
        },
        error: function(xhr, textStatus, errorThrown) {
            previewRange = 100;
        }
    });
    if (checkPreview(parseInt(document.getElementById("pageNum").value)) == false) {
        jump(0);
    }
});
$(window).resize(function() {
    if (Math.abs(intBrowserW - $(window).width()) <= 18) {
        return;
    }
    if (!(/iphone/gi).test(navigator.appVersion)) {
        setTimeout(function() {
            last_width = 0;
            minPageW = 0;
            minPageH = 0;
            initReader();
            goToNowPage();
        }, 200);
    }
});
$(window).bind("orientationchange", function(e) {
    setTimeout(function() {
        last_width = 0;
        initReader();
        goToNowPage();
    }, 200);
});
$(document).keyup(function(event) {
    if (!event)
        event = window.event;
    var key = event.which ? event.which : event.keyCode;
    if (key == 33) {
        if (pageDirection == "left") {
            $("#previous_page").click();
        } else {
            $("#next_page").click();
        }
    }
    if (key == 34) {
        if (pageDirection == "left") {
            $("#next_page").click();
        } else {
            $("#previous_page").click();
        }
    }
    if (key == 107 || key == 187) {
        SmoothZoomIn();
    }
    if (key == 109 || key == 189) {
        SmoothZoomOut();
    }
    if (key == 38) {
        var top = $("#scroller-FlipZoom").scrollTop() - 50;
        $("#scroller-FlipZoom").scrollTop(top);
    }
    if (key == 40) {
        var top = $("#scroller-FlipZoom").scrollTop() + 50;
        $("#scroller-FlipZoom").scrollTop(top);
    }
    if (key == 37) {
        var left = $("#scroller-FlipZoom").scrollLeft() - 50;
        $("#scroller-FlipZoom").scrollLeft(left);
    }
    if (key == 39) {
        var left = $("#scroller-FlipZoom").scrollLeft() + 50;
        $("#scroller-FlipZoom").scrollLeft(left);
    }
});
$(document).keydown(function(event) {
    if (!event)
        event = window.event;
    var key = event.which ? event.which : event.keyCode;
    if (key == 36) {
        nowPage = 0;
        setNowPage();
        goToNowPage();
    }
    if (key == 35) {
        nowPage = bookData.pageCount;
        setNowPage();
        goToNowPage();
    }
});
function goHome() {
    window.open("../index.aspx");
}
function initPageImg(destDiv, pageObj, isLowQuaility) {
    u_height = pageObj.u_height;
    u_width = pageObj.u_width;
    if ($(destDiv).width() / $(destDiv).height() > u_width / u_height) {
        $(destDiv).width($(destDiv).height() * (u_width / u_height));
    } else {
        $(destDiv).height($(destDiv).width() * (u_height / u_width));
    }
    $(destDiv).data("PageObj", pageObj);
    if ($(destDiv).find("#" + pageObj.imgSet[0].id).length == 0) {
        changeImg($(destDiv), pageObj.imgSet[0], $(destDiv).width(), $(destDiv).height());
    }
    changeSize($(destDiv), pageObj, 1, last_width);
    changeOffest($(destDiv));
}
function prepare(ISBN, intPage, isPreload, isLowQuaility) {
    urls[intPage] = ['GetPageImage?ISBN=' + ISBN + '&PageNum=' + intPage, 'GetPageImage?ISBN=' + ISBN + '&PageNum=' + intPage, 'GetPageImage?ISBN=' + ISBN + '&PageNum=' + intPage];
    urls[intPage + 1] = ['GetPageImage?ISBN=' + ISBN + '&PageNum=' + (intPage + 1), 'GetPageImage?ISBN=' + ISBN + '&PageNum=' + (intPage + 1), 'GetPageImage?ISBN=' + ISBN + '&PageNum=' + (intPage + 1)];
    prepareCallBack(intPage, isPreload, isLowQuaility);
    return;
    if ((urls[intPage] && urls[intPage].length > 0) && (urls[intPage + 1] && urls[intPage + 1].length > 0)) {
        prepareCallBack(intPage, isPreload, isLowQuaility);
        return;
    }
    if (prepareAjax != null) {
        prepareAjax.abort();
    }
    loadPageLoadingImage(intPage);
    prepareAjax = $.ajax({
        url: 'prepare/' + ISBN + '/' + intPage,
        type: 'GET',
        async: true,
        dataType: 'json',
        beforeSend: function(request) {
            request.setRequestHeader('Connection', 'Keep-Alive');
        },
        success: function(response) {
            urls[intPage] = response.slice(0, 21);
            urls[intPage + 1] = response.slice(21, 42);
            prepareCallBack(intPage, isPreload, isLowQuaility);
        }
    });
}
function prepareCallBack(intPage, isPreload, isLowQuaility) {
    bookData.getPageManifest(intPage, true, function(response) {
        arrPageObj[intPage] = response;
        if (isTwoPage) {
            if (pageDirection == "left") {
                initPageImg($("#pageL"), response, isLowQuaility);
            } else {
                initPageImg($("#pageR"), response, isLowQuaility);
            }
        } else {
            initPageImg($("#pageS"), response, isLowQuaility);
        }
        if (isTwoPage) {
            if (intPage == 0) {
                if (pageDirection == "left") {
                    $("#pageR").hide();
                    $("#pageL").css("visibility", "visible");
                    $("#pageL").addClass("page-cover");
                    changeOffest($("#pageL"));
                } else {
                    $("#pageL").hide();
                    $("#pageR").css("visibility", "visible");
                    $("#pageR").addClass("page-cover");
                    changeOffest($("#pageR"));
                }
            } else if (bookData.pageCount > intPage + 1) {
                if (pageDirection == "left") {
                    $("#pageL").removeClass("page-cover");
                    $("#pageR").show();
                    $("#pageR").css("visibility", "visible");
                    changeOffest($("#pageL"));
                    changeOffest($("#pageR"));
                    bookData.getPageManifest((intPage + 1), true, function(response) {
                        arrPageObj[intPage + 1] = response;
                        initPageImg($("#pageR"), response, isLowQuaility);
                    });
                } else {
                    $("#pageR").removeClass("page-cover");
                    $("#pageL").show();
                    $("#pageL").css("visibility", "visible");
                    changeOffest($("#pageL"));
                    changeOffest($("#pageR"));
                    bookData.getPageManifest((intPage + 1), true, function(response) {
                        arrPageObj[intPage + 1] = response;
                        initPageImg($("#pageL"), response, isLowQuaility);
                    });
                }
            } else {
                if (pageDirection == "left") {
                    $("#pageR").css("visibility", "hidden");
                } else {
                    $("#pageL").css("visibility", "hidden");
                }
            }
        }
    });
    if (isPreload) {
        var strNow = "";
        var strNext = "";
        if (isTwoPage) {
            if (pageDirection == "left") {
                strNow = "#pageL";
                strNext = "#pageR";
            } else {
                strNow = "#pageR";
                strNext = "#pageL";
            }
        } else {
            strNow = "#pageS";
        }
        setTimeout(function() {
            LoadMediaAnnot(intPage, $(strNow));
        }, 500);
        if (isTwoPage && bookData.pageCount > intPage + 1) {
            setTimeout(function() {
                LoadMediaAnnot(intPage + 1, $(strNext));
            }, 500);
        }
    }
    $("#scroller-FlipZoom").scrollLeft($("#scroller-FlipZoom").data('scrollLeft'));
    $("#scroller-FlipZoom").scrollTop($("#scroller-FlipZoom").data('scrollTop'));
    if (isPreload) {
        if (preloadTimer != null) {
            clearInterval(preloadTimer);
        }
        preloadPage = intPage;
        preloadTimer = setInterval(function() {
            try {
                if (preloadPage < intPage) {
                    if (preloadPage < (intPage - intPreloadPage) || preloadPage < 0) {
                        clearInterval(preloadTimer);
                        preloadTimer = null;
                    } else {
                        preLoadPageImage(preloadPage);
                        preloadPage--
                    }
                } else {
                    preloadPage++;
                    if (preloadPage <= intPage + intPreloadPage && preloadPage < bookData.pageCount) {
                        preLoadPageImage(preloadPage);
                    } else {
                        preloadPage = intPage - 1;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, intWaitTime);
    }
    prepareAjax = null;
}
var ajaxRequests = [];
function reqToServer(destDiv, sourceImgObj, width, height, i, j) {
    var AjaxSucceeded = function(i, j) {
        var id = "part" + sourceImgObj.id.slice(-1);
        var num = parseInt(sourceImgObj.id.split("_")[0]);
        var imgID = sourceImgObj.id.slice(-1) + "_" + i + "_" + j;
        if (pageDirection == "left") {
            id = nowPage == num ? "L" + id : "R" + id;
            imgID = nowPage == num ? "L" + imgID : "R" + imgID;
        } else {
            id = nowPage == num ? "R" + id : "L" + id;
            imgID = nowPage == num ? "R" + imgID : "L" + imgID;
        }
        if ($("#" + imgID).length > 0) {
            $("#" + imgID).attr("src", bookData.getPageImage(sourceImgObj.images[i][j])).load(function() {
                $(this).show();
                if ($(this).parent().data("isTopDiv") && $(this).parent().find("img:hidden").length == 0) {
                    $(destDiv).unblock();
                }
            });
            if (i == 0) {
                $(img).addClass("topimg");
            }
            return;
        }
        var img = $("<img>").attr("id", imgID).attr("src", bookData.getPageImage(sourceImgObj.images[i][j])).css("display", "none").css("position", "absolute").css("width", width).css("height", height).css("left", j * width + "px").css("top", i * height + "px").css("-webkit-transform", "translate3d(0,0,0)").data("i", i).data("j", j).load(function() {
            $(this).show();
            if ($(this).parent().data("isTopDiv") && $(this).parent().find("img:hidden").length == 0) {
                $(destDiv).unblock();
            }
        }).error(function() {
            alert("error");
            return;
            $(this).error = null;
            if ($(this).attr('src').indexOf("ImageHandler") < 0) {
                return;
            }
            $(this).hide();
            console.log("load error:" + $(this).attr("src"));
            var imgSrc = $(this).attr('src') + "?rand=" + Math.floor(Math.random() * 10000);
            $(this).attr('src', imgSrc);
        });
        if ($.browser.msie && $.browser.version <= 8) {
            $(img).css("display", "");
            $(destDiv).unblock();
        }
        if (i == 0) {
            $(img).addClass("topimg");
        }
        var div = $("#" + id);
        $(div).append(img);
    }(i, j);
    return $.ajax({
        url: bookData.getPageImage(sourceImgObj.images[i][j]),
        type: 'GET',
        async: true,
        cache: true,
        beforeSend: function(R) {
            R.setRequestHeader('Connection', 'Keep-Alive');
        },
        success: AjaxSucceeded,
        error: function(xhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
function changeImg(destDiv, sourceImgObj, width, height) {
    var r = parseInt(sourceImgObj.id.slice(-1)) - 1;
    var id = "part1";
    var num = parseInt(sourceImgObj.id.split("_")[0]);
    loadPageLoadingImage(num);
    if (pageDirection == "left") {
        id = nowPage == num ? "L" + id : "R" + id;
    } else {
        id = nowPage == num ? "R" + id : "L" + id;
    }
    var div = $("<div>").attr("id", id).data("id", sourceImgObj.id);
    $(div).css("z-index", r).data("isTopDiv", true);
    if ($(destDiv).find("#" + id).length <= 0) {
        $(destDiv).append(div);
    } else {
        $("#" + id).data("id", sourceImgObj.id);
    }
    $(destDiv).find("div").not("#" + id).each(function() {
        if ($(this).hasClass("blockUI")) {
            return;
        } else if ($(this).find("img").length == 1 && sourceImgObj.images.length != 1) {
            $(this).css("z-index", -1).data("isTopDiv", false);
        } else {
            $(this).remove();
        }
    });
    for (var i = 0; i < sourceImgObj.images.length; i++) {
        for (var j = 0; j < sourceImgObj.images[i].length; j++) {
            var imgID = sourceImgObj.id.slice(-1) + "_" + i + "_" + j;
            if (pageDirection == "left") {
                imgID = nowPage == num ? "L" + imgID : "R" + imgID;
            } else {
                imgID = nowPage == num ? "R" + imgID : "L" + imgID;
            }
            var index = 0;
            index = 2;
            var imgDecode = new Image();
            imgDecode.onload = function() {
                if ($("#" + imgID) && $("#" + imgID).length > 0) {
                    if ($("#" + imgID).attr("src") != urls[num][index]) {
                        $("#" + imgID).unbind("load").load(function() {
                            $(destDiv).unblock({
                                fadeOut: 0
                            });
                            $(this).show();
                            if ($(this).parent().data("isTopDiv") && $(this).parent().find("img:hidden").length == 0) {
                                $(destDiv).unblock();
                            }
                        }).error(function() {}).attr("src", imgDecode.src);
                        if ($.browser.msie && $.browser.version <= 8) {
                            $("#" + imgID).css("display", "");
                            $(destDiv).unblock();
                        }
                        if (i == 0) {
                            $(img).addClass("topimg");
                        }
                    } else {
                        $(destDiv).unblock();
                    }
                } else {
                    var img = $("<img>").attr("id", imgID).css("width", width).css("height", height).css("-webkit-transform", "translate3d(0,0,0)").data("i", i).data("j", j).load(function() {
                        $(destDiv).unblock({
                            fadeOut: 0
                        });
                        $(this).show();
                        if ($(this).parent().data("isTopDiv") && $(this).parent().find("img:hidden").length == 0) {
                            $(destDiv).unblock();
                        }
                    }).error(function() {
                        return;
                    }).attr("src", imgDecode.src);
                    if ($.browser.msie && $.browser.version <= 8) {
                        $(img).css("display", "");
                        $(destDiv).unblock();
                    }
                    if (i == 0) {
                        $(img).addClass("topimg");
                    }
                    $(div).append(img);
                }
            }
            imgDecode.src = urls[num][index];
            return;
            var imgEncode = new Image();
            imgEncode.onload = function() {
                if ($("#" + imgID) && $("#" + imgID).length > 0) {
                    if ($("#" + imgID).attr("src") != urls[num][index]) {
                        $("#" + imgID).css("display", "none").unbind("load").load(function() {
                            $(destDiv).unblock({
                                fadeOut: 0
                            });
                            $(this).show();
                            if ($(this).parent().data("isTopDiv") && $(this).parent().find("img:hidden").length == 0) {
                                $(destDiv).unblock();
                            }
                        }).error(function() {}).attr("src", imgEncode.src);
                        if ($.browser.msie && $.browser.version <= 8) {
                            $("#" + imgID).css("display", "");
                            $(destDiv).unblock();
                        }
                        if (i == 0) {
                            $(img).addClass("topimg");
                        }
                    } else {
                        $(destDiv).unblock();
                    }
                } else {
                    var img = $("<img>").attr("id", imgID).css("display", "none").css("width", width).css("height", height).css("-webkit-transform", "translate3d(0,0,0)").data("i", i).data("j", j).load(function() {
                        $(destDiv).unblock({
                            fadeOut: 0
                        });
                        $(this).show();
                        if ($(this).parent().data("isTopDiv") && $(this).parent().find("img:hidden").length == 0) {
                            $(destDiv).unblock();
                        }
                    }).error(function() {
                        return;
                        $(this).error = null;
                        if ($(this).attr('src').indexOf("ImageHandler") < 0) {
                            return;
                        }
                        $(this).hide();
                        console.log("load error:" + $(this).attr("src"));
                        var imgSrc = $(this).attr('src') + "?rand=" + Math.floor(Math.random() * 10000);
                        $(this).attr('src', imgSrc);
                    }).attr("src", imgEncode.src);
                    if ($.browser.msie && $.browser.version <= 8) {
                        $(img).css("display", "");
                        $(destDiv).unblock();
                    }
                    if (i == 0) {
                        $(img).addClass("topimg");
                    }
                    $(div).append(img);
                }
            }
            imgEncode.src = urls[num][index];
        }
    }
    return;
    for (var i = 0; i < sourceImgObj.images.length; i++) {
        for (var j = 0; j < sourceImgObj.images[i].length; j++) {
            ajaxRequests.push(reqToServer(destDiv, sourceImgObj, width, height, i, j));
        }
    }
    var defer = $.when.apply($, ajaxRequests);
    defer.done(function(args) {});
    return;
    for (var i = 0; i < sourceImgObj.images.length; i++) {
        for (var j = 0; j < sourceImgObj.images[i].length; j++) {
            var AjaxSucceeded = function(i, j) {
                var img = $("<img>").css("display", "none").css("position", "absolute").css("width", width).css("height", height).css("left", j * width + "px").css("top", i * height + "px").css("-webkit-transform", "translate3d(0,0,0)").data("i", i).data("j", j).load(function() {
                    $(this).show();
                    if ($(this).parent().data("isTopDiv") && $(this).parent().find("img:hidden").length == 0) {
                        $(destDiv).unblock();
                    }
                }).error(function() {
                    alert("error");
                    return;
                    $(this).error = null;
                    if ($(this).attr('src').indexOf("ImageHandler") < 0) {
                        return;
                    }
                    $(this).hide();
                    console.log("load error:" + $(this).attr("src"));
                    var imgSrc = $(this).attr('src') + "?rand=" + Math.floor(Math.random() * 10000);
                    $(this).attr('src', imgSrc);
                }).attr("src", bookData.getPageImage(sourceImgObj.images[i][j]));
                if ($.browser.msie && $.browser.version <= 8) {
                    $(img).css("display", "");
                    $(destDiv).unblock();
                }
                if (i == 0) {
                    $(img).addClass("topimg");
                }
                $(div).append(img);
            }(i, j);
            $.ajax({
                url: bookData.getPageImage(sourceImgObj.images[i][j]),
                type: 'GET',
                async: true,
                cache: true,
                beforeSend: function(R) {
                    R.setRequestHeader('Connection', 'Keep-Alive');
                },
                success: AjaxSucceeded,
                error: function(xhr, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
        }
    }
    $(div).css("z-index", 1).data("isTopDiv", true);
    $(destDiv).append(div);
    img = null;
    div = null;
    $(destDiv).find("div").not("#" + sourceImgObj.id).each(function() {
        if ($(this).hasClass("blockUI")) {
            return;
        } else if ($(this).find("img").length == 1 && sourceImgObj.images.length != 1) {
            $(this).css("z-index", -1).data("isTopDiv", false);
        } else {
            $(this).remove();
        }
    });
}
function changeSize(destDiv, pageObj, detScale, detWidth) {
    var cur_width, cur_height;
    var org_width = destDiv.width();
    cur_width = org_width * detScale;
    var org_height = destDiv.height();
    cur_height = org_height * detScale;
    cur_width = Math.round(cur_width);
    cur_height = Math.round(cur_height);
    if (detWidth > 0) {
        cur_width = detWidth;
        cur_height = cur_width * (pageObj.u_height / pageObj.u_width);
    } else {
        this.last_width = cur_width;
    }
    if (cur_width >= pageObj.u_width) {
        return false;
    }
    var p_index = Math.round(cur_width / u_width);
    if (p_index >= pageObj.imgSet.length) {
        p_index = pageObj.imgSet.length - 1;
        if ($(destDiv).find("#" + pageObj.imgSet[p_index].id).length > 0 && (cur_width / pageObj.imgSet[p_index].images[0].length) > pageObj.u_width) {
            return false;
        }
    }
    var p_width, p_height;
    if (!isNotPC) {
        $(destDiv).find("div").each(function() {
            var imgSet = getImgSetById(pageObj, $(this).data("id"));
            if (imgSet != null) {
                p_width = cur_width / imgSet.images[0].length;
                p_height = cur_height / imgSet.images.length;
                p_width = p_width.toFixed();
                p_height = p_height.toFixed();
                $(this).find("img").each(function() {
                    $(this).width(p_width);
                    $(this).height(p_height);
                });
            }
        });
    }
    $(destDiv).width(cur_width);
    $(destDiv).height(cur_height);
    if (minPageW == 0) {
        minPageW = cur_width;
    }
    changeOffest($(destDiv));
    if ($(destDiv).find("div[id$='part" + (p_index + 1) + "']").length == 0) {
        if (isNotPC) {
            p_width = org_width / pageObj.imgSet[p_index].images[0].length;
            p_height = org_height / pageObj.imgSet[p_index].images.length;
        } else {
            p_width = cur_width / pageObj.imgSet[p_index].images[0].length;
            p_height = cur_height / pageObj.imgSet[p_index].images.length;
        }
    } else {
        savePageTime();
        return true;
    }
    p_width = p_width.toFixed();
    p_height = p_height.toFixed();
    changeImg(destDiv, pageObj.imgSet[p_index], p_width, p_height);
    return true;
}
function changeOffest(destDiv) {
    var parent = $(destDiv).parent();
    $(parent).css("position", "relative");
    if ($(destDiv).hasClass("pageS") || $(destDiv).hasClass("page-cover")) {
        $(parent).width($(destDiv).width());
        var left = ($(window).width() - $(parent).width()) / 2;
        if (left < 0) {
            left = 0;
        }
        $(parent).css("left", left + "px");
        var top = ($(window).height() - $(destDiv).height()) / 2;
        if (top < 0) {
            top = 0;
        }
        $(parent).css("top", top + "px");
    } else {
        if (pageDirection == "left") {
            $(parent).children(".smoothR").width($(parent).children(".smoothL").width());
        } else {
            $(parent).children(".smoothL").width($(parent).children(".smoothR").width());
        }
        $(parent).width($(parent).children(".smoothL").width() * 2);
        var left = ($(window).width() - $(parent).width()) / 2;
        if (left < 0) {
            left = 0;
        }
        $(parent).css("left", left + "px");
        var top = ($(window).height() - $(destDiv).height()) / 2;
        if (top < 0) {
            top = 0;
        }
        $(parent).css("top", top + "px");
    }
}
function getImgSetById(pageObj, imgSet_id) {
    for (var i in pageObj.imgSet) {
        if (pageObj.imgSet[i].id == imgSet_id && typeof (imgSet_id) != "undefined") {
            return pageObj.imgSet[i];
        }
    }
    return null;
}
function LoadMediaAnnot(intPage, destDiv) {
    $(destDiv).children("div[id$='_media']").remove();
    bookData.getPageMediaAnnot(intPage, function(mediaAnnots) {
        $(destDiv).data("mediaAnnots", mediaAnnots);
        SetMediaAnnot(mediaAnnots, destDiv, intPage);
    });
    if (strISBN == 'EBK10200011193') {
        $.ajax({
            async: true,
            contentType: 'application/x-www-form-urlencoded',
            url: 'EBK10200011193.txt',
            type: 'GET',
            error: function() {},
            success: function(response) {
                var arrRow = response.split('\n');
                $.each(arrRow, function(index, row) {
                    var arrCol = row.split(',');
                    if (arrCol[0] == intPage + 1) {
                        var strCourseXY = arrCol[1];
                        var strCourseURL = arrCol[2];
                        var strMovieURL = arrCol[3];
                        if (strCourseURL.trim() != '') {
                            var divCourse = $('<div/>');
                            var intCourseY = $(destDiv).height() / 10 * (strCourseXY.substring(0, 1) - 1);
                            var intCourseH = strCourseXY.indexOf('-') > -1 ? $(destDiv).height() / 10 * 2 : $(destDiv).height() / 10 * 1;
                            var inputCourse = $('<input>').attr('type', 'image').css('position', 'absolute').css('opacity', '0').css('filter', 'alpha(opacity=0)').width($(destDiv).width() / 10 * 2).height(intCourseH).css('left', $(destDiv).width() / 10 * 0.5 + 'px').css('top', intCourseY + 'px').data('Media', strCourseURL).data('MediaType', 'CourseURL').click(function(e) {
                                window.open($(this).data('Media'));
                                e.preventDefault();
                                return false;
                            });
                            $(divCourse).append($(inputCourse));
                            setTimeout(function() {
                                $(destDiv).append($(divCourse));
                            }, 500);
                        }
                        if (strMovieURL.trim() != '') {
                            var divMovie = $('<div/>');
                            var inputMovie = $('<input>').attr('type', 'image').css('position', 'absolute').css('opacity', '0').css('filter', 'alpha(opacity=0)').width($(destDiv).width() / 10 * 3.5).height($(destDiv).height() / 10 * 3).css('left', $(destDiv).width() / 10 * 6 + 'px').css('top', $(destDiv).height() / 10 * 2 + 'px').data('Media', strMovieURL).data('MediaType', 'MovieURL').click(function(e) {
                                window.open($(this).data('Media'));
                                e.preventDefault();
                                return false;
                            });
                            $(divMovie).append($(inputMovie));
                            setTimeout(function() {
                                $(destDiv).append($(divMovie));
                            }, 500);
                        }
                    }
                });
            }
        });
    }
    return;
    $(destDiv).children("#" + intPage + "_media").remove();
    if (typeof ($(destDiv).data("mediaAnnots")) == "undefined" || $(destDiv).data("mediaAnnots") == null) {
        bookData.getPageMediaAnnot(intPage, function(mediaAnnots) {
            $(destDiv).data("mediaAnnots", mediaAnnots);
            SetMediaAnnot(mediaAnnots, destDiv, intPage);
        });
    } else {
        SetMediaAnnot($(destDiv).data("mediaAnnots"), destDiv, intPage);
    }
}
function SetMediaAnnot(mediaAnnots, destDiv, intPage) {
    if (mediaAnnots == null) {
        return;
    }
    var div = $('<div/>');
    $(div).attr("id", intPage + "_media").css("z-index", 2);
    for (var index = 0; index < mediaAnnots.length; index++) {
        var mediaobj = mediaAnnots[index];
        var rataW = $(destDiv).width() / mediaobj.pagewidth;
        var rataH = $(destDiv).height() / mediaobj.pageheight;
        var rata = $(destDiv).width() / mediaobj.pagewidth;
        var input = $("<input>").attr("type", "image").attr("src", (mediaobj.icon != null) ? "data:image/jpeg;base64," + mediaobj.icon : (mediaobj.type == "audio") ? "images/audio.png" : "images/video.png").css("position", "absolute").css("opacity", "0").css("filter", "alpha(opacity=0)").width(mediaobj.rect.Width * rataW).height(mediaobj.rect.Height * rataH).css("left", mediaobj.rect.Left * rataW + "px").css("top", mediaobj.rect.Top * rataH + "px").data("Media", mediaobj.id).data("MediaType", mediaobj.type).click(function(e) {
            if ($(this).data("MediaType") == "audio") {
                playAudio(bookData.getMedia($(this).data("Media")), e);
            } else {
                playVideo(bookData.getMedia($(this).data("Media")), e);
            }
            e.preventDefault();
            return false;
        });
        $(div).append($(input));
    }
    $(destDiv).append($(div));
}
function SmoothZoomIn() {
    zoom(scale);
}
function SmoothZoomOut() {
    zoom(1 / scale);
}
function zoom(detScale) {
    nowScale = detScale;
    var predict_width = 0;
    var predict_height = 0;
    var org_width = 0;
    var org_height = 0;
    if (isTwoPage) {
        org_width = $("#pageL").width() + $("#pageR").width();
        if (nowPage == 0) {
            org_width = pageDirection == "left" ? $("#pageL").width() : $("#pageR").width();
        }
    } else {
        org_width = $("#pageS").width();
    }
    org_height = isTwoPage ? pageDirection == "left" ? $("#pageL").height() : $("#pageR").height() : $("#pageS").height();
    predict_width = org_width * detScale;
    predict_height = org_height * detScale;
    var maxWidth = isTwoPage && nowPage != 0 ? u_width * 2 : u_width * 1;
    var minWidth = isTwoPage && nowPage != 0 ? minPageW * 2 : minPageW;
    if (org_width < maxWidth && predict_width > maxWidth) {
        predict_width = maxWidth;
        predict_height = predict_height * maxWidth / predict_width;
        detScale = predict_width / org_width;
    }
    if (org_width > minWidth && predict_width < minWidth) {
        predict_width = minWidth;
        predict_height = predict_height * minWidth / predict_width;
        detScale = predict_width / org_width;
    }
    if (detScale > 1 || predict_width / $(window).width() > detScale || predict_height / $(window).height() > detScale) {
        if (predict_width <= maxWidth && zoomInterTimer == null) {
            zoomInterTimer = setInterval(function() {
                bookData.getPageManifest(nowPage, true, function(response) {
                    var strNow = "";
                    var strNext = "";
                    if (isTwoPage) {
                        if (pageDirection == "left") {
                            strNow = "#pageL";
                            strNext = "#pageR";
                        } else {
                            strNow = "#pageR";
                            strNext = "#pageL";
                        }
                    } else {
                        strNow = "#pageS";
                    }
                    zoomSuccess = changeSize($(strNow), response, detScale);
                    if (zoomSuccess && nowPage != 0 && isTwoPage) {
                        bookData.getPageManifest((nowPage + 1), true, function(response) {
                            changeSize($(strNext), response, detScale, $(strNow).width());
                            LoadMediaAnnot(nowPage + 1, $(strNext));
                        });
                    }
                    LoadMediaAnnot(nowPage, $(strNow));
                });
                clearInterval(zoomInterTimer);
                zoomInterTimer = null;
                if (zoomSuccess) {
                    var last_scrollleft = (predict_width - org_width) / 2 + $("#scroller-FlipZoom").scrollLeft();
                    var last_scrolltop = (predict_height - org_height) / 2 + $("#scroller-FlipZoom").scrollTop();
                    if (last_scrollleft < 0 || predict_width < intBrowserW)
                        last_scrollleft = 0;
                    if (last_scrolltop < 0 || predict_height < intBrowserH)
                        last_scrolltop = 0;
                    $("#scroller-FlipZoom").scrollLeft(last_scrollleft);
                    $("#scroller-FlipZoom").scrollTop(last_scrolltop);
                    $("#scroller-FlipZoom").data('scrollLeft', last_scrollleft);
                    $("#scroller-FlipZoom").data('scrollTop', last_scrolltop);
                }
                if (zoomSuccess) {
                    try {
                        for (var i = 1; i <= intPreloadPage; i++) {
                            var prepage = nowPage + i;
                            if (isTwoPage && nowPage != 0) {
                                prepage++;
                            }
                            if (prepage > bookData.pageCount) {
                                break;
                            }
                        }
                    } catch (err) {}
                    try {
                        for (var i = 1; i <= intPreloadPage; i++) {
                            var prepage = nowPage - i;
                            if (prepage < 0) {
                                break;
                            }
                        }
                    } catch (err) {}
                }
            }, 50);
        }
    }
}
function getScrollpage() {
    if (pageDirection == "left") {
        return $("#slider-fill").slider("option", "value");
    } else {
        return intSliderTotalPage - $("#slider-fill").slider("option", "value") - 1;
    }
}
function scrollToPage(scrollpage, IsStopPending) {
    console.log("scrollToPage : %d", scrollpage);
    var width;
    var height;
    var left;
    $("#previous_page").stop(true, true).show();
    $("#next_page").stop(true, true).show();
    if (scrollpage <= 0) {
        scrollpage = 0;
        $("#previous_page").hide();
    } else if (scrollpage >= intSliderTotalPage - 1) {
        scrollpage = intSliderTotalPage - 1;
        $("#next_page").hide();
    }
    if (pageDirection == "left") {
        $("#slider-fill").slider("option", "value", scrollpage);
    } else {
        $("#slider-fill").slider("option", "value", intSliderTotalPage - scrollpage - 1);
    }
    clearTimeout(onScrollEndTimer);
    onScrollEndTimer = null;
    clearTimeout(loadZoomImageTimer);
    loadZoomImageTimer = null;
    if (isTwoPage) {
        if (pageDirection == "left") {
            nowPage = scrollpage * 2 - 1;
        } else {
            nowPage = intTotalPage - (scrollpage) * 2 - 1;
        }
    } else {
        if (pageDirection == "left") {
            nowPage = scrollpage;
        } else {
            nowPage = intTotalPage - scrollpage - 1;
        }
    }
    if (nowPage < 0) {
        nowPage = 0;
    }
    $("#pageNum").val(nowPage);
    if (checkPreview() == false) {
        return;
    }
    width = $("#pageL").width();
    height = $("#pageR").height();
    left = $("[id^='scroller-page-']:visible").css("left");
    $("[id^='scroller-page-'] [id^='page']").width(width).height(height);
    $("#scroller-page-" + scrollpage).css("left", left);
    $("#scroller-page-" + scrollpage).show();
    loadPageLoadingImage(nowPage);
    if (arrPageObj[nowPage] != undefined) {} else {
        $("#pageL").width(width);
        $("#pageL").height(height);
    }
    if (isTwoPage) {
        loadPageLoadingImage(nowPage + 1);
        if (arrPageObj[nowPage + 1] != undefined) {} else {
            $("#pageR").width(width);
            $("#pageR").height(height);
        }
    }
    setNowPage();
    onScrollEndTimer = setTimeout(function() {
        loadPageImage(nowPage, true);
        $("[id^='scroller-page-']:hidden [id^='page']").each(function() {
            $(this).find("div").not("div:first").each(function() {
                $(this).find("img").attr("src", "");
                $(this).remove();
            });
        });
        onScrollEndTimer = null;
    }, intTransPageTime);
    savePageTime();
}
function savePageTime() {
    if (pageTimer) {
        pageTimeStop();
    }
    if (!isTwoPage || nowPage == 0 || intTotalPage <= nowPage + 1) {
        pages = nowPage;
        var basisPage;
        if (!isTwoPage) {
            basisPage = "#pageS";
        } else {
            if (pageDirection == "left") {
                basisPage = "#pageL";
            } else {
                basisPage = "#pageR";
            }
        }
        var parentTop = isNaN(parseFloat($('#scroller-page').css('top'))) ? 0 : parseFloat($('#scroller-page').css('top'));
        var w1 = $(basisPage).width();
        var h1 = $(basisPage).height();
        var x1 = $(basisPage).offset().left > 0 ? 0 : -$(basisPage).offset().left;
        var y1 = $(basisPage).offset().top > 0 ? 0 : -($(basisPage).offset().top - parentTop);
        var vw1 = intBrowserW > w1 ? w1 : intBrowserW;
        var vh1 = intBrowserH > h1 ? h1 : intBrowserH;
        pagePositions = w1 + "-" + h1 + "-" + x1 + "-" + y1 + "-" + vw1 + "-" + vh1;
    } else if (intTotalPage > nowPage + 1) {
        var basisPageL = "#pageL";
        var basisPageR = "#pageR";
        if (pageDirection == "left") {
            pages = nowPage + "|" + (nowPage + 1);
        } else {
            pages = (nowPage + 1) + "|" + nowPage;
        }
        var parentTop = isNaN(parseFloat($('#scroller-page').css('top'))) ? 0 : parseFloat($('#scroller-page').css('top'));
        var w1 = $(basisPageL).width();
        var w2 = $(basisPageR).width();
        var h1 = $(basisPageL).height();
        var h2 = $(basisPageR).height();
        var x1 = $(basisPageL).offset().left > 0 ? 0 : -$(basisPageL).offset().left;
        var x2 = $(basisPageR).offset().left > 0 ? 0 : -$(basisPageR).offset().left;
        var y1 = $(basisPageL).offset().top > 0 ? 0 : -($(basisPageL).offset().top - parentTop);
        var y2 = $(basisPageR).offset().top > 0 ? 0 : -($(basisPageR).offset().top - parentTop);
        var vw1, vw2;
        if (intBrowserW >= w1 + w2) {
            vw1 = w1;
            vw2 = w2;
        } else {
            vw1 = $(basisPageR).offset().left;
            vw2 = intBrowserW - $(basisPageR).offset().left;
        }
        var vh1, vh2;
        if (intBrowserH >= h1) {
            vh1 = h1;
            vh2 = h2;
        } else {
            vh1 = intBrowserH;
            vh2 = intBrowserH;
        }
        pagePositions = w1 + "-" + h1 + "-" + x1 + "-" + y1 + "-" + vw1 + "-" + vh1 + "|" + w2 + "-" + h2 + "-" + x2 + "-" + y2 + "-" + vw2 + "-" + vh2;
    }
    pageTimeCount();
}
function pageTimeCount() {
    pageTime = parseInt(pageTime) + 1;
    pageTimer = setTimeout(function() {
        pageTimeCount()
    }, 1000);
}
function pageTimeStop() {
    clearTimeout(pageTimer);
    if (pageTime < 2) {
        pageTime = 0;
        return;
    }
    $.ajax({
        url: 'SavePageTime',
        type: 'POST',
        data: {
            'ISBN': strISBN,
            'pageDirection': pageDirection,
            'pages': pages,
            'pagePositions': pagePositions,
            'pageTime': pageTime
        },
        async: true,
        cache: false,
        success: function(response) {},
        error: function(xhr, textStatus, errorThrown) {}
    });
    pageTime = 0;
}
var appendBuffer = function(buffer1, buffer2) {
    var returnBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    returnBuffer.set(new Uint8Array(buffer1), 0);
    returnBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
    return returnBuffer.buffer;
};
function blobtoDataURL(blob, callback) {
    var fr = new FileReader();
    fr.onload = function(e) {
        callback(e.target.result);
    }
    ;
    fr.readAsDataURL(blob);
}
