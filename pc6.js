var ua = navigator["userAgent"]["toLowerCase"](),
    isAndroid = ua['indexOf']('android') > 0 ? true : false,
    isIOS = ua["indexOf"]('ipad') > 0 ? true : ua["indexOf"]("iphone") > 0 ? true : false,
    isNotPC = isAndroid || isIOS,
    previewRange = 10,
    intBrowserW = 0,
    intBrowserH = 0,
    pageDirection = 'left',
    isTwoPage = false,
    nowPage = 0,
    intTotalPage = 0,
    intPreloadPage = 10,
    intSliderTotalPage = 0,
    onScrollEndTimer,
    loadZoomImageTimer,
    intWaitTime = 150,
    intTransPageTime = 500,
    zoomInterTimer,
    preloadTimer,
    preloadPage,
    preImgLoadingCounter = 0,
    u_width = 0,
    u_height = 0,
    minPageW = 0,
    minPageH = 0,
    last_width,
    nowScale = 1,
    scale = 1.25,
    zoomSuccess = false,
    arrPageObj = new Array(),
    dicMediaAnnot = null,
    isAction = true,
    intPreventTime = 30,
    prepareAjax = null,
    urls = {},
    pages,
    pagePositions,
    pageTime = 0,
    pageTimer = null,
    turnPages = 0;

function iScrollLoaded() {}

function initReader() {
  var _0x587181 = getCookie('goToPage') ? parseInt(getCookie("goToPage")) : -1;

  _0x587181 != -1 && (setCookie("nowISBN", strISBN, 1), setCookie('nowPage', _0x587181, 1), nowPage = _0x587181, delCookie('goToPage'));
  document["documentElement"] ? (intBrowserW = document["documentElement"]["clientWidth"], intBrowserH = document["documentElement"]["clientHeight"]) : (intBrowserW = document["body"]["clientWidth"], intBrowserH = document["body"]["clientHeight"]);
  var _0x2e84f3 = true;
  "standalone" in navigator && !navigator["standalone"] && /iphone|ipod|ipad/gi['test'](navigator["platform"]) && /Safari/i["test"](navigator["appVersion"]) && (_0x2e84f3 = false);
  /iphone/gi["test"](navigator['appVersion']) && !_0x2e84f3 && (window['scrollTo'](0, 1), intBrowserH += 60);
  $("#background")["css"]({
    'width': intBrowserW,
    'height': intBrowserH
  });
  getNowTwoPage();
  pageDirection = bookData['direction'];
  $("#readingDirection")["css"]({
    'top': (intBrowserH - 75) / 2,
    'left': (intBrowserW - 196) / 2
  });
  document["getElementById"]('booktitle')["innerHTML"] = bookData["title"];
  intTotalPage = bookData["pageCount"];
  $("#intPageTotal")["html"](" / " + (intTotalPage - 1));
  isTwoPage ? intSliderTotalPage = Math["ceil"]((bookData["pageCount"] - 1) / 2) + 1 : intSliderTotalPage = intTotalPage;
  $("#slider-fill")["slider"]();
  $("#slider-fill")['slider']("option", 'max', intSliderTotalPage - 1);
  isTwoPage ? ($("#scroller-Zoom")["html"]("<div><div id=\"zoomPageL\" class=\"pageL smoothL\"></div><div id=\"zoomPageR\" class=\"pageR smoothR\"></div></div>"), $('#zoomPageL')["css"]({
    'height': intBrowserH - 8
  }), $('#zoomPageR')["css"]({
    'height': intBrowserH - 8
  })) : ($("#scroller-Zoom")['html']("<div id=\"zoomPageS\" class=\"pageS\"></div>"), $("#zoomPageS")["css"]({
    'height': intBrowserH - 8
  }));
  var _0x5c1152 = '',
      _0xae9b1 = "<div id=\"scroller-page\" style=\"position: relative\">";
  isTwoPage ? (_0xae9b1 += "<div id=\"pageL\" class=\"pageL smoothL\"></div>", _0xae9b1 += "<div id=\"pageR\" class=\"pageR smoothR\"></div>") : _0xae9b1 += "<div id=\"pageS\" class=\"pageS smoothS\"></div>";
  _0xae9b1 += "</div>";
  pageDirection == "left" ? _0x5c1152 += _0xae9b1 : _0x5c1152 = _0xae9b1 + _0x5c1152;
  $("#scroller-FlipZoom")["html"](_0x5c1152);
  $("#scroller-FlipZoom div")["css"]({
    'width': intBrowserW,
    'height': intBrowserH
  });
  isTwoPage ? $(".page-cover")["css"]({
    'width': intBrowserW / 2 - 4,
    'height': intBrowserH - 8
  }) : $(".page-cover")["css"]({
    'width': intBrowserW - 8,
    'height': intBrowserH - 8
  });
  $(".pageL")["css"]({
    'width': intBrowserW / 2 - 4,
    'height': intBrowserH - 8
  });
  $(".pageR")['css']({
    'width': intBrowserW / 2 - 4,
    'height': intBrowserH - 8
  });
  $(".pageS")["css"]({
    'width': intBrowserW - 8,
    'height': intBrowserH - 8
  });
  $("#scroller-FlipZoom div")['css']("background-color", "white");
  $(".page-cover")['css']("background-color", 'white');
  $(".pageL")['css']("background-color", 'white');
  $('.pageR')["css"]("background-color", "white");
  $('.pageS')["css"]('background-color', 'white');
  navigator["appName"] == "Microsoft Internet Explorer" && ($["browser"]["version"] == '7.0' || $["browser"]["version"] == "8.0") && ($(".pageS")["css"]('behavior', "url(css/PIE.htc)"), $('.pageL')["css"]("behavior", "url(css/PIE.htc)"), $('.pageR')['css']('behavior', "url(css/PIE.htc)"));
  $('#wrapper-Zoom')['css']({
    'width': intBrowserW,
    'height': intBrowserH - 4
  });
  $('#scroller-Zoom')["css"]({
    'width': intBrowserW,
    'height': intBrowserH
  });
  $("#wrapper-FlipZoom")["css"]({
    'width': intBrowserW,
    'height': intBrowserH - 4
  });
  $("#scroller-FlipZoom")["css"]({
    'width': intBrowserW - 4
  });
  $("#scroller-FlipZoom")["height"](intBrowserH - 4);
  $("#TOCResult")["css"]({
    'height': intBrowserH - 60
  });
  $("#searchResultScroll")["css"]({
    'height': intBrowserH - 60
  });
  $("#mediaResultScroll")["css"]({
    'height': intBrowserH - 60
  });
  $("#scroller-FlipZoom")["css"]("overflow", "hidden");
  $("#scroller-FlipZoom")["css"]("position", "relative");
}

function loadPageLoadingImage(_0x1e8d16) {
  if (arrPageObj[_0x1e8d16] != undefined) {
    return;
  }

  var _0x175029 = '';
  !isNaN(_0x1e8d16) ? isTwoPage ? pageDirection == "left" ? nowPage == _0x1e8d16 ? _0x175029 = "#pageL" : _0x175029 = '#pageR' : nowPage == _0x1e8d16 ? _0x175029 = "#pageR" : _0x175029 = "#pageL" : _0x175029 = "#pageS" : _0x175029 = '#' + _0x1e8d16;

  var _0x1ebc5b = $(_0x175029)["width"]() / 2;

  _0x1ebc5b == 0 && (_0x1ebc5b = $(_0x175029)['parent']()["width"]());

  var _0x3cf911 = $(_0x175029)['height']() / 2;

  _0x3cf911 == 0 && (_0x3cf911 = $(_0x175029)["parent"]()['height']());
  $(_0x175029)["stop"](true, true)["block"]({
    'message': "<img src='images/icon_loading.gif' style='height:400px;' />",
    'css': {
      'width': "400px",
      'height': "400px",
      'border': "none",
      'background': "transparent"
    },
    'overlayCSS': {
      'backgroundColor': "#bbb",
      'opacity': '0'
    },
    'baseZ': 1000,
    'showOverlay': false,
    'timeout': 0,
    'onBlock': function () {
      ($(this)["css"]('left') == "0px" || $(this)["css"]('top') == "0px") && $(this)["hide"]();
    }
  });
}

function preLoadPageImage(_0x2e0c62, _0x317106) {
  bookData["getPageManifest"](_0x2e0c62, true, function (_0x15d7f0) {
    arrPageObj[_0x2e0c62] = _0x15d7f0;
    return;

    for (var _0x5a175a = 0; _0x5a175a < _0x15d7f0["imgSet"]["length"]; _0x5a175a++) {
      if (_0x5a175a == 0) {
        initPageImg($("#page" + _0x2e0c62), _0x15d7f0, true);
      } else {
        return;

        for (var _0x5a3554 = 0; _0x5a3554 < _0x15d7f0["imgSet"][_0x5a175a]["images"]["length"]; _0x5a3554++) {
          for (var _0x4e4d44 = 0; _0x4e4d44 < _0x15d7f0["imgSet"][_0x5a175a]['images'][_0x5a3554]["length"]; _0x4e4d44++) {
            preImgLoadingCounter++;

            var _0x32eca2 = $('<img>')["attr"]('id', _0x15d7f0['imgSet'][_0x5a175a]["images"][_0x5a3554][_0x4e4d44])['attr']('src', bookData["getPageImage"](_0x15d7f0["imgSet"][_0x5a175a]["images"][_0x5a3554][_0x4e4d44]))["load"](function () {
              preImgLoadingCounter--;
              $(this)["attr"]("src", '')["remove"]();
            })["unload"](function () {
              preImgLoadingCounter--;
              $(this)["remove"]();
            })['error'](function () {
              preImgLoadingCounter--;
              $(this)["remove"]();
            });

            $("#preloadImage")['append']($(_0x32eca2));

            if (_0x317106 <= _0x5a175a) {
              return;
            }
          }
        }
      }
    }
  });
}

function loadPageImage(_0x17ae7a, _0x42cbeb, _0x37c6d7) {
  if (_0x17ae7a < 0) {
    _0x17ae7a = 0;
  } else {
    _0x17ae7a >= bookData["pageCount"] && (_0x17ae7a = bookData["pageCount"] - 1);
  }

  if (checkPreview(_0x17ae7a) == false) {
    return;
  }

  prepare(strISBN, _0x17ae7a, _0x42cbeb, _0x37c6d7);
  return;
  urls[_0x17ae7a] = ['GetImage/?ISBN=' + strISBN + "&PageNum=" + _0x17ae7a + "&Set=0&Row=0&Col=0", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + "&Set=1&Row=0&Col=0", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + "&Set=1&Row=0&Col=1", 'GetImage/?ISBN=' + strISBN + "&PageNum=" + _0x17ae7a + "&Set=1&Row=1&Col=0", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + '&Set=1&Row=1&Col=1', "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + "&Set=2&Row=0&Col=0", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + "&Set=2&Row=0&Col=1", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + "&Set=2&Row=0&Col=2", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + '&Set=2&Row=0&Col=3', 'GetImage/?ISBN=' + strISBN + "&PageNum=" + _0x17ae7a + "&Set=2&Row=1&Col=0", "GetImage/?ISBN=" + strISBN + '&PageNum=' + _0x17ae7a + "&Set=2&Row=1&Col=1", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + '&Set=2&Row=1&Col=2', "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + "&Set=2&Row=1&Col=3", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + "&Set=2&Row=2&Col=0", 'GetImage/?ISBN=' + strISBN + "&PageNum=" + _0x17ae7a + "&Set=2&Row=2&Col=1", "GetImage/?ISBN=" + strISBN + "&PageNum=" + _0x17ae7a + '&Set=2&Row=2&Col=2', "GetImage/?ISBN=" + strISBN + '&PageNum=' + _0x17ae7a + "&Set=2&Row=2&Col=3", "GetImage/?ISBN=" + strISBN + '&PageNum=' + _0x17ae7a + "&Set=2&Row=3&Col=0", "GetImage/?ISBN=" + strISBN + '&PageNum=' + _0x17ae7a + "&Set=2&Row=3&Col=1", "GetImage/?ISBN=" + strISBN + '&PageNum=' + _0x17ae7a + "&Set=2&Row=3&Col=2", 'GetImage/?ISBN=' + strISBN + "&PageNum=" + _0x17ae7a + '&Set=2&Row=3&Col=3'];
  urls[_0x17ae7a + 1] = ["GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + "&Set=0&Row=0&Col=0", "GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + '&Set=1&Row=0&Col=0', "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=1&Row=0&Col=1", "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=1&Row=1&Col=0", 'GetImage/?ISBN=' + strISBN + "&PageNum=" + (_0x17ae7a + 1) + '&Set=1&Row=1&Col=1', 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (_0x17ae7a + 1) + "&Set=2&Row=0&Col=0", "GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + "&Set=2&Row=0&Col=1", "GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + "&Set=2&Row=0&Col=2", "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=2&Row=0&Col=3", "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + '&Set=2&Row=1&Col=0', "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=2&Row=1&Col=1", "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=2&Row=1&Col=2", 'GetImage/?ISBN=' + strISBN + '&PageNum=' + (_0x17ae7a + 1) + '&Set=2&Row=1&Col=3', "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=2&Row=2&Col=0", 'GetImage/?ISBN=' + strISBN + "&PageNum=" + (_0x17ae7a + 1) + '&Set=2&Row=2&Col=1', "GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + '&Set=2&Row=2&Col=2', "GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + '&Set=2&Row=2&Col=3', "GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + "&Set=2&Row=3&Col=0", 'GetImage/?ISBN=' + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=2&Row=3&Col=1", "GetImage/?ISBN=" + strISBN + '&PageNum=' + (_0x17ae7a + 1) + "&Set=2&Row=3&Col=2", "GetImage/?ISBN=" + strISBN + "&PageNum=" + (_0x17ae7a + 1) + "&Set=2&Row=3&Col=3"];
  prepareCallBack(_0x17ae7a, _0x42cbeb, _0x37c6d7);
  return;
  prepare(strISBN, _0x17ae7a);
  bookData["getPageManifest"](_0x17ae7a, true, function (_0x177e37) {
    arrPageObj[_0x17ae7a] = _0x177e37;
    isTwoPage ? pageDirection == 'left' ? initPageImg($("#pageL"), _0x177e37, _0x37c6d7) : initPageImg($("#pageR"), _0x177e37, _0x37c6d7) : initPageImg($("#pageS"), _0x177e37, _0x37c6d7);

    if (isTwoPage) {
      if (_0x17ae7a == 0) {
        pageDirection == "left" ? ($("#pageR")["hide"](), $("#pageL")["css"]("visibility", "visible"), $("#pageL")["addClass"]('page-cover'), changeOffest($('#pageL'))) : ($("#pageL")["hide"](), $("#pageR")["css"]("visibility", "visible"), $('#pageR')["addClass"]("page-cover"), changeOffest($("#pageR")));
      } else {
        bookData['pageCount'] > _0x17ae7a + 1 ? pageDirection == "left" ? ($("#pageL")["removeClass"]("page-cover"), $('#pageR')["show"](), $("#pageR")['css']("visibility", "visible"), changeOffest($("#pageL")), changeOffest($("#pageR")), bookData["getPageManifest"](_0x17ae7a + 1, true, function (_0x43f460) {
          arrPageObj[_0x17ae7a + 1] = _0x43f460;
          initPageImg($("#pageR"), _0x43f460, _0x37c6d7);
        })) : ($('#pageR')["removeClass"]("page-cover"), $('#pageL')["show"](), $("#pageL")["css"]('visibility', "visible"), changeOffest($('#pageL')), changeOffest($('#pageR')), bookData["getPageManifest"](_0x17ae7a + 1, true, function (_0x2e9599) {
          arrPageObj[_0x17ae7a + 1] = _0x2e9599;
          initPageImg($("#pageL"), _0x2e9599, _0x37c6d7);
        })) : pageDirection == "left" ? $("#pageR")["css"]("visibility", "hidden") : $("#pageL")["css"]("visibility", "hidden");
      }
    }
  });

  if (_0x42cbeb) {
    var _0x4bb3fc = '',
        _0x40fab2 = '';
    isTwoPage ? pageDirection == 'left' ? (_0x4bb3fc = "#pageL", _0x40fab2 = "#pageR") : (_0x4bb3fc = '#pageR', _0x40fab2 = "#pageL") : _0x4bb3fc = "#pageS";
    LoadMediaAnnot(_0x17ae7a, $(_0x4bb3fc));
    isTwoPage && bookData["pageCount"] > _0x17ae7a + 1 && LoadMediaAnnot(_0x17ae7a + 1, $(_0x40fab2));
  }

  $("#scroller-FlipZoom")['scrollLeft']($("#scroller-FlipZoom")["data"]("scrollLeft"));
  $('#scroller-FlipZoom')["scrollTop"]($("#scroller-FlipZoom")['data']("scrollTop"));
  _0x42cbeb && (preloadTimer != null && clearInterval(preloadTimer), preloadPage = _0x17ae7a, preloadTimer = setInterval(function () {
    try {
      preloadPage < _0x17ae7a ? preloadPage < _0x17ae7a - intPreloadPage || preloadPage < 0 ? (clearInterval(preloadTimer), preloadTimer = null) : (preLoadPageImage(preloadPage), preloadPage--) : (preloadPage++, preloadPage <= _0x17ae7a + intPreloadPage && preloadPage < bookData['pageCount'] ? preLoadPageImage(preloadPage) : preloadPage = _0x17ae7a - 1);
    } catch (_0x3683e2) {
      console["log"](_0x3683e2);
    }
  }, intWaitTime));
}

function getNowTwoPage() {
  getCookie('isTwoPage') != null ? isTwoPage = getCookie("isTwoPage") == 'true' ? true : false : intBrowserW > intBrowserH ? isTwoPage = true : isTwoPage = false;
}

function setNowTwoPage(_0xa29ae1) {
  setCookie('isTwoPage', _0xa29ae1, 1);
}

function getNowPage() {
  getCookie("nowISBN") != strISBN ? nowPage = 0 : nowPage = getCookie("nowPage") ? getCookie("nowPage") : 0;
  nowPage = parseInt(nowPage, 10);
}

function setNowPage() {
  setCookie("nowISBN", strISBN);
  setCookie("nowPage", nowPage, 1);
  turnPages += 1;
}

function getNowSliderPage() {
  var _0x1b9222 = 0;
  isTwoPage ? pageDirection == "left" ? _0x1b9222 = nowPage / 2 : _0x1b9222 = (intTotalPage - nowPage + 1) / 2 - 1 : pageDirection == "left" ? _0x1b9222 = nowPage : _0x1b9222 = intTotalPage - nowPage - 1;
  return Math["ceil"](_0x1b9222);
}

function goToNowPage() {
  getNowPage();

  var _0x371257 = getNowSliderPage();

  scrollToPage(_0x371257);
}

function jump(_0x73661a) {
  _0x73661a = parseInt(_0x73661a, 10);
  _0x73661a < 0 && (_0x73661a = 0);
  _0x73661a > bookData["pageCount"] - 1 && (_0x73661a = bookData["pageCount"] - 1);

  if (checkPreview(_0x73661a) == false) {
    return;
  }

  isTwoPage ? _0x73661a % 2 == 0 ? nowPage = _0x73661a - 1 : nowPage = _0x73661a : nowPage = _0x73661a;
  setNowPage();
  goToNowPage();
}

function jumpPage(_0x5ed1aa, _0x415b73) {
  var _0x3631ff = document["getElementById"]('pageNum')["value"],
      _0x29f40f = window["event"] ? _0x5ed1aa['keyCode'] : _0x5ed1aa['which'];

  if (_0x29f40f == 13 || _0x415b73) {
    if (_0x3631ff['Trim']() == '') {
      return;
    }

    if (isNaN(_0x3631ff["Trim"]())) {
      return;
    }

    if (parseInt(_0x3631ff["Trim"](), 10) < 0) {
      return;
    }

    document["activeElement"]["blur"]();
    $("input")["blur"]();
    jump(_0x3631ff["Trim"]());
  }
}

function bindTOC() {
  strHtml = GetBookMarkHtml(bookData["navPoint"], 0);
  $("#TOCResultScroll")["html"](strHtml);
  $("[id^='TOC-']")["click"](function () {
    jump($(this)["attr"]('id')["replace"]("TOC-", ''));
    setTimeout(function () {
      $("#page-TOC .back")['click']();
    }, 500);
  });
}

function GetBookMarkHtml(_0x2b25b9, _0x45385e) {
  var _0x48fff6 = '';

  if (_0x2b25b9 == null) {
    return '';
  }

  for (var _0x4872bd = 0; _0x4872bd < _0x2b25b9["length"]; _0x4872bd++) {
    _0x48fff6 += "<div id=\"TOC-" + _0x2b25b9[_0x4872bd]["page"] + "\" class=\"searchResult-s ui-block-a\">";

    for (var _0x5904f3 = 0; _0x5904f3 < _0x45385e; _0x5904f3++) {
      _0x48fff6 += '&nbsp;&nbsp;&nbsp;&nbsp;';
    }

    _0x48fff6 += _0x2b25b9[_0x4872bd]['Title'] + "</div>";
    _0x2b25b9[_0x4872bd]["BookMarkData"] != null && _0x2b25b9[_0x4872bd]["BookMarkData"]['length'] > 0 && (_0x48fff6 += GetBookMarkHtml(_0x2b25b9[_0x4872bd]['BookMarkData'], _0x45385e + 1));
  }

  return _0x48fff6;
}

function SearchTextCallBack(_0x32a695, _0x11a22d, _0x260c9c, _0x139046) {
  for (var _0x182aab = 0; _0x182aab < _0x139046["length"]; _0x182aab++) {
    var _0x19a173 = $("<div>")['attr']('id', 'Search-' + _0x139046[_0x182aab]['page'])['addClass'](_0x182aab % 2 == 0 ? "ui-block-a searchResult-s" : "ui-block-a searchResult-d")["css"]("text-overflow", 'ellipsis')["html"]("<b>第" + _0x139046[_0x182aab]['page'] + "頁</b>&nbsp;&nbsp;" + _0x139046[_0x182aab]["text"]["replace"](_0x32a695, "<font color='red'>" + _0x32a695 + "</font>"))["click"](function () {
      jump($(this)['attr']('id')['replace']("Search-", ''));
    });

    $("#searchResult")["append"](_0x19a173);
  }

  _0x11a22d + _0x260c9c < bookData['pageCount'] ? bookData["searchText"](_0x32a695, _0x11a22d + _0x260c9c, _0x260c9c, SearchTextCallBack) : ($("#searchWaitText")["hide"](), document["getElementById"]("searchResult")["innerHTML"] == '' && (document["getElementById"]("searchResult")["innerHTML"] += "<div class=\"ui-block-a searchResult-s\">查無符合結果。</div>"));
}

function searchText(_0x12c203, _0x12feae) {
  var _0x78e562 = document["getElementById"]("txtSearch")["value"],
      _0x93ca7b = window["event"] ? _0x12c203["keyCode"] : _0x12c203['which'];

  if (_0x93ca7b == 13 || _0x12feae) {
    if (_0x78e562['Trim']() == '') {
      document["getElementById"]('searchResult')["innerHTML"] = '';
      return;
    }

    document['activeElement']["blur"]();
    $("input")['blur']();
    $('#searchWaitText')["stop"](true, true)["show"]();
    document["getElementById"]("searchResult")["innerHTML"] = '';
    bookData["searchText"](_0x78e562, 1, 20, SearchTextCallBack);
  }
}

function checkPreview(_0x22f8c5) {
  return true;
  typeof _0x22f8c5 == "undefined" && (_0x22f8c5 = nowPage);

  if (_0x22f8c5 > Math['ceil'](bookData["pageCount"] * previewRange / 100)) {
    alert("提供前 " + previewRange + "% 內容完整，謝謝！");
    setTimeout(function () {
      goToNowPage();
    }, 500);
    return false;
  }

  return true;
}

function playAudio(_0x4962ba, _0x841920) {
  _0x841920 && _0x841920["stopPropagation"] ? _0x841920["stopPropagation"]() : window["event"]["cancelBubble"] = true;
  $("#audioPlay")['jPlayer']("destroy");
  $('#audioPlay')["jPlayer"]({
    'ready': function () {
      $(this)['jPlayer']("setMedia", {
        'mp3': _0x4962ba
      })["jPlayer"]("play");
    },
    'cssSelectorAncestor': '#audioPlayer',
    'swfPath': 'js',
    'supplied': "mp3",
    'wmode': 'window',
    'smoothPlayBar': true,
    'keyEnabled': true
  });
  $('#audioPlayer')["css"]({
    'position': 'absolute',
    'z-index': 10000,
    'left': (intBrowserW - $("#audioPlayer")["width"]()) / 2 + 'px',
    'top': intBrowserH - $('#audioPlayer')['height']() - 50 + 'px'
  });
  $('#audioPlayer')['stop'](true, true)["show"]("fade");
  $("#audioPlayer")["draggable"]({
    'containment': 'window'
  });
  $('.jp-progress')["mouseup"](function () {
    $("#audioPlayer")["draggable"]("enable");
  })['mousedown'](function () {
    $("#audioPlayer")["draggable"]('disable');
  });
  $(".closeAudio")["one"]("click", function (_0x2b8ee7) {
    $('#audioPlay')["jPlayer"]('destroy');
    $('#audioPlayer')["hide"]();
  });
}

function playVideo(_0x240077, _0x58d89a) {
  _0x58d89a && _0x58d89a["stopPropagation"] ? _0x58d89a["stopPropagation"]() : window["event"]["cancelBubble"] = true;
  $("#videoPlay")["jPlayer"]('destroy');
  $("#videoPlay")["jPlayer"]({
    'ready': function () {
      $(this)['jPlayer']("setMedia", {
        'm4v': _0x240077
      })["jPlayer"]("play");
    },
    'cssSelectorAncestor': '#videoPlayer',
    'solution': "flash, html",
    'swfPath': 'js',
    'supplied': 'm4v',
    'size': {
      'width': "640px",
      'height': "360px",
      'cssClass': "jp-video-360p"
    },
    'smoothPlayBar': true,
    'keyEnabled': true
  });
  $("#videoPlayer")["css"]({
    'position': 'absolute',
    'z-index': 10000,
    'left': (intBrowserW - $("#videoPlayer")["width"]()) / 2 + 'px',
    'top': (intBrowserH - $('#videoPlayer')["height"]()) / 2 + 'px'
  });
  $('#videoPlayer')["stop"](true, true)['show']("fade");
  $("#videoPlayer")["draggable"]({
    'containment': 'window'
  });
  $(".jp-progress")["mouseup"](function () {
    $("#videoPlayer")["draggable"]("enable");
  })["mousedown"](function () {
    $("#videoPlayer")["draggable"]('disable');
  });
  $(".closeVideo")["one"]("click", function () {
    $("#videoPlay")["jPlayer"]('destroy');
    $('#videoPlayer')["hide"]();
  });
}

$(document)["ready"](function () {
  $(document)["bind"]('ajaxStart', function () {
    $(document)["data"]("ajaxStart", true);
  })['bind']('ajaxStop', function () {
    $(document)['data']('ajaxStart', false);
  });
  initReader();
  goToNowPage();
  $("#content")["mousewheel"](function (_0x2b9f76, _0x210c12) {
    _0x210c12 > 0 ? SmoothZoomIn() : SmoothZoomOut();
    return false;
  });
  $("#scroller-FlipZoom")["mousedown"](function (_0x51a470) {
    $(this)["data"]("down", true)["data"]('x', _0x51a470["clientX"])["data"]('y', _0x51a470["clientY"])["data"]("scrollLeft", this["scrollLeft"])["data"]("scrollTop", this['scrollTop']);
    return false;
  })['mouseup'](function (_0x2661b6) {
    $(this)["data"]('down', false)['data']("scrollLeft", this['scrollLeft'])['data']("scrollTop", this["scrollTop"]);
    savePageTime();
  })['mousemove'](function (_0x1b1a4f) {
    $(this)["data"]("down") == true && (_0x1b1a4f["preventDefault"](), this['scrollLeft'] = $(this)['data']("scrollLeft") + $(this)['data']('x') - _0x1b1a4f['clientX'], this["scrollTop"] = $(this)["data"]("scrollTop") + $(this)["data"]('y') - _0x1b1a4f["clientY"]);
    $(this)["data"]("mouseX", _0x1b1a4f["clientX"] - this["scrollLeft"])['data']("mouseY", _0x1b1a4f["clientY"] - this["scrollTop"]);
  })['mouseleave'](function () {
    $(this)["data"]("down", false)["data"]("scrollLeft", this["scrollLeft"])["data"]("scrollTop", this["scrollTop"]);
  });
  $("#scroller-FlipZoom")['click'](function (_0x507446) {
    setTimeout(function () {
      $("#page-TOC .back")["click"]();
    }, 500);
    setTimeout(function () {
      $("#page-search .back")["click"]();
    }, 500);

    if (nowScale <= 1) {
      var _0x22a2a9 = $(window)["width"]() / 4,
          _0x581325 = $(window)["width"]() * 3 / 4;

      if (_0x507446["clientX"] < _0x22a2a9) {
        $("#previous_page")['click']();
      } else {
        _0x507446['clientX'] > _0x581325 && $("#next_page")["click"]();
      }
    }
  });
  $("#next_page")['click'](function () {
    if (isAction) {
      isAction = false;

      var _0x228406 = getScrollpage();

      scrollToPage(_0x228406 + 1, true);
      setTimeout(function () {
        isAction = true;
      }, intPreventTime);
    }
  });
  $('#previous_page')["click"](function () {
    if (isAction) {
      isAction = false;

      var _0x2c94c9 = getScrollpage();

      scrollToPage(_0x2c94c9 - 1, true);
      setTimeout(function () {
        isAction = true;
      }, intPreventTime);
    }
  });
  $("#slider-fill")['on']("slide", function (_0x3f8f00, _0x35f150) {
    if (isTwoPage) {
      nowPage = _0x35f150['value'] * 2 - 1;

      if (nowPage < 0) {
        $("#pageNum")["val"](0);
      } else {
        nowPage >= bookData["pageCount"] ? $("#pageNum")["val"](bookData['pageCount'] - 1) : $("#pageNum")["val"](nowPage);
      }
    } else {
      nowPage = _0x35f150["value"];
      $("#pageNum")["val"](nowPage);
    }

    var _0x3467b1 = bookData['getPageTitle'](nowPage);

    $("#intPage")["text"](_0x3467b1);
  });
  $('#slider-fill')['on']('slidestop', function (_0x1eee1e) {
    checkPreview() == true && (setNowPage(), goToNowPage());
  });
  bindTOC();
  $('#btn_menu')["click"](function () {
    $("#page-TOC")["stop"](true, true)["show"]("slide", {
      'direction': 'left'
    }, intTransPageTime);
  });
  $("#page-TOC .back")["click"](function () {
    $("#page-TOC")["hide"]("slide", {
      'direction': "left"
    }, intTransPageTime);
  });
  $("#page-TOC")["hide"]();
  $("#btn_search")["click"](function () {
    $("#page-search")["stop"](true, true)["show"]("slide", {
      'direction': "right"
    }, intTransPageTime);
  });
  $("#page-search .back")["click"](function () {
    $("#page-search")["hide"]("slide", {
      'direction': "right"
    }, intTransPageTime);
  });
  $("#page-search")["hide"]();
  $('#btn_audio')["hide"]();
  $('#btn_video')["hide"]();
  $("#mediaWaitText")['stop'](true, true)["show"]();
  $["ajax"]({
    'contentType': "application/x-www-form-urlencoded",
    'url': "GetBookMediaAnnot",
    'data': 'ISBN=' + strISBN,
    'type': 'POST',
    'dataType': 'json',
    'success': function (_0x17b63f) {
      dicMediaAnnot = _0x17b63f;

      if (dicMediaAnnot == null || dicMediaAnnot == '' || dicMediaAnnot == {}) {
        return;
      }

      var _0x34f243 = Object['keys'](dicMediaAnnot)["map"](function (_0x1ca37e) {
        return dicMediaAnnot[_0x1ca37e];
      });

      []["concat"]["apply"]([], _0x34f243)["filter"](function (_0xbb6a46) {
        return _0xbb6a46["Type"] == "audio";
      })["length"] > 0 && $("#btn_audio")["show"]();
      []["concat"]["apply"]([], _0x34f243)['filter'](function (_0x5f4b2d) {
        return _0x5f4b2d["Type"] == "video";
      })['length'] > 0 && $("#btn_video")["show"]();
      $('#mediaWaitText')["hide"]();
    },
    'error': function (_0x1ab06f, _0x39329a, _0x382905) {
      console["log"](_0x382905);
    }
  });
  $("#btn_audio, #btn_video")['click'](function (_0x4ff1a5) {
    $('#mediaResult')["html"]('');

    var _0x162c9e = _0x4ff1a5['target'],
        _0x54ddc1 = _0x162c9e['id'] == "btn_audio" ? "audio" : 'video';

    $("#page-media")["stop"](true, true)["show"]("slide", {
      'direction': 'right'
    }, intTransPageTime);
    $('#page-media')["data"]("mediaType", _0x54ddc1);

    var _0x53d54a = Object["keys"](dicMediaAnnot);

    $['each'](_0x53d54a, function (_0x592d77, _0x2485fd) {
      var _0x3cebd3 = dicMediaAnnot[_0x2485fd];
      $["each"](_0x3cebd3["filter"](function (_0x592816) {
        return _0x592816["Type"] == _0x54ddc1;
      }), function (_0x3dd8e7, _0x19dda0) {
        var _0x75081f = _0x19dda0['ID']['split']("\\")[_0x19dda0['ID']["split"]("\\")["length"] - 1],
            _0xc12cb2 = $("<div>")["attr"]('id', "Search-" + _0x19dda0['ID'])["data"]("Media", _0x19dda0['ID'])["data"]("Page", _0x2485fd)["data"]("MediaType", _0x19dda0["Type"])["addClass"]($("#mediaResult")['children']()['length'] % 2 == 0 ? "ui-block-a searchResult-s" : "ui-block-a searchResult-d")["css"]('text-overflow', "ellipsis")['html']('<b>第' + _0x2485fd + "頁</b>&nbsp;&nbsp;" + _0x75081f)["click"](function () {
          jump($(this)['data']("Page"));
          $(".closeAudio")["click"]();
          $(".closeVideo")['click']();
          $(this)["data"]("MediaType") == "audio" ? playAudio(bookData["getMedia"]($(this)["data"]("Media")), _0x4ff1a5) : playVideo(bookData["getMedia"]($(this)["data"]("Media")), _0x4ff1a5);
        });

        $('#mediaResult')["append"](_0xc12cb2);
      });
    });
  });
  $("#page-media .back")["click"](function () {
    $("#page-media")['hide']('slide', {
      'direction': "right"
    }, intTransPageTime);
  });
  $("#page-media")["hide"]();
  $("#txtSearch")['blur'](function () {
    $("#page-TOC")['css']("left", '0px');
  });
  document['referrer']["indexOf"](location["href"]) < 0 && setCookie("nowPage", 0, 1);
  (document["body"]["clientHeight"] > document["body"]["clientWidth"] || document["documentElement"]["clientHeight"] > document['documentElement']["clientWidth"]) && (document["getElementById"]("btn_dp")["onclick"] = null, document["getElementById"]('btn_dp')['ontouchstart'] = null);
  pageDirection == 'left' ? document["getElementById"]("readingDirection")["src"] = "images/reading_direction_right.png" : document["getElementById"]("readingDirection")["src"] = 'images/reading_direction_left.png';
  setTimeout(function () {
    document["getElementById"]("theme-drawer")["style"]['display'] != "none" && drawerToggler();
    document["getElementById"]("readingDirection")['style']["display"] = "none";
  }, 3000);
  $["ajax"]({
    'url': '../Viewer/GetPreviewRangeByISBN',
    'type': 'POST',
    'data': {
      'strISBN': strISBN
    },
    'async': false,
    'cache': false,
    'success': function (_0x17e6f2) {
      previewRange = _0x17e6f2;

      if (previewRange == '') {
        previewRange = 10;
      }
    },
    'error': function (_0x1ca6af, _0xf64ee8, _0x5a763b) {
      previewRange = 10;
    }
  });
  checkPreview(parseInt(document["getElementById"]("pageNum")["value"])) == false && jump(0);
});
$(window)["resize"](function () {
  if (Math['abs'](intBrowserW - $(window)["width"]()) <= 18) {
    return;
  }

  !/iphone/gi["test"](navigator["appVersion"]) && setTimeout(function () {
    last_width = 0;
    minPageW = 0;
    minPageH = 0;
    initReader();
    goToNowPage();
  }, 200);
});
$(window)["bind"]("orientationchange", function (_0x8dec8a) {
  setTimeout(function () {
    last_width = 0;
    initReader();
    goToNowPage();
  }, 200);
});
$(document)["keyup"](function (_0x378b84) {
  if (!_0x378b84) {
    _0x378b84 = window["event"];
  }

  var _0x5ea415 = _0x378b84['which'] ? _0x378b84["which"] : _0x378b84["keyCode"];

  _0x5ea415 == 33 && (pageDirection == "left" ? $('#previous_page')['click']() : $("#next_page")["click"]());
  _0x5ea415 == 34 && (pageDirection == "left" ? $("#next_page")["click"]() : $("#previous_page")["click"]());
  (_0x5ea415 == 107 || _0x5ea415 == 187) && SmoothZoomIn();
  (_0x5ea415 == 109 || _0x5ea415 == 189) && SmoothZoomOut();

  if (_0x5ea415 == 38) {
    var _0x1172e6 = $("#scroller-FlipZoom")["scrollTop"]() - 50;

    $("#scroller-FlipZoom")["scrollTop"](_0x1172e6);
  }

  if (_0x5ea415 == 40) {
    var _0x1172e6 = $('#scroller-FlipZoom')['scrollTop']() + 50;

    $("#scroller-FlipZoom")['scrollTop'](_0x1172e6);
  }

  if (_0x5ea415 == 37) {
    var _0x27ec93 = $("#scroller-FlipZoom")["scrollLeft"]() - 50;

    $("#scroller-FlipZoom")['scrollLeft'](_0x27ec93);
  }

  if (_0x5ea415 == 39) {
    var _0x27ec93 = $("#scroller-FlipZoom")["scrollLeft"]() + 50;

    $("#scroller-FlipZoom")["scrollLeft"](_0x27ec93);
  }
});
$(document)['keydown'](function (_0x38b10c) {
  if (!_0x38b10c) {
    _0x38b10c = window["event"];
  }

  var _0xe79e30 = _0x38b10c["which"] ? _0x38b10c["which"] : _0x38b10c["keyCode"];

  _0xe79e30 == 36 && (nowPage = 0, setNowPage(), goToNowPage());
  _0xe79e30 == 35 && (nowPage = bookData["pageCount"], setNowPage(), goToNowPage());
});

function goHome() {
  window["open"]("../index.aspx");
}

function initPageImg(_0x3ce740, _0x1cc58c, _0x1cab1f) {
  u_height = _0x1cc58c["u_height"];
  u_width = _0x1cc58c["u_width"];
  $(_0x3ce740)["width"]() / $(_0x3ce740)["height"]() > u_width / u_height ? $(_0x3ce740)["width"]($(_0x3ce740)["height"]() * (u_width / u_height)) : $(_0x3ce740)["height"]($(_0x3ce740)["width"]() * (u_height / u_width));
  $(_0x3ce740)["data"]("PageObj", _0x1cc58c);
  $(_0x3ce740)["find"]('#' + _0x1cc58c['imgSet'][0]['id'])['length'] == 0 && changeImg($(_0x3ce740), _0x1cc58c["imgSet"][0], $(_0x3ce740)['width'](), $(_0x3ce740)['height']());
  changeSize($(_0x3ce740), _0x1cc58c, 1, last_width);
  changeOffest($(_0x3ce740));
}

function prepare(_0x20592b, _0x3797b3, _0x1cd057, _0x242934) {
  urls[_0x3797b3] = ['GetPageImage?ISBN=' + _0x20592b + '&PageNum=' + _0x3797b3, "GetPageImage?ISBN=" + _0x20592b + "&PageNum=" + _0x3797b3, "GetPageImage?ISBN=" + _0x20592b + '&PageNum=' + _0x3797b3];
  urls[_0x3797b3 + 1] = ["GetPageImage?ISBN=" + _0x20592b + '&PageNum=' + (_0x3797b3 + 1), "GetPageImage?ISBN=" + _0x20592b + "&PageNum=" + (_0x3797b3 + 1), "GetPageImage?ISBN=" + _0x20592b + "&PageNum=" + (_0x3797b3 + 1)];
  prepareCallBack(_0x3797b3, _0x1cd057, _0x242934);
  return;

  if (urls[_0x3797b3] && urls[_0x3797b3]["length"] > 0 && urls[_0x3797b3 + 1] && urls[_0x3797b3 + 1]["length"] > 0) {
    prepareCallBack(_0x3797b3, _0x1cd057, _0x242934);
    return;
  }

  prepareAjax != null && prepareAjax["abort"]();
  loadPageLoadingImage(_0x3797b3);
  prepareAjax = $["ajax"]({
    'url': "prepare/" + _0x20592b + '/' + _0x3797b3,
    'type': "GET",
    'async': true,
    'dataType': 'json',
    'beforeSend': function (_0x17705d) {
      _0x17705d["setRequestHeader"]("Connection", "Keep-Alive");
    },
    'success': function (_0x29d102) {
      urls[_0x3797b3] = _0x29d102["slice"](0, 21);
      urls[_0x3797b3 + 1] = _0x29d102["slice"](21, 42);
      prepareCallBack(_0x3797b3, _0x1cd057, _0x242934);
    }
  });
}

function prepareCallBack(_0x43c395, _0x4ace2b, _0x49cf7d) {
  bookData["getPageManifest"](_0x43c395, true, function (_0x143bef) {
    arrPageObj[_0x43c395] = _0x143bef;
    isTwoPage ? pageDirection == "left" ? initPageImg($("#pageL"), _0x143bef, _0x49cf7d) : initPageImg($("#pageR"), _0x143bef, _0x49cf7d) : initPageImg($('#pageS'), _0x143bef, _0x49cf7d);

    if (isTwoPage) {
      if (_0x43c395 == 0) {
        pageDirection == "left" ? ($("#pageR")["hide"](), $('#pageL')['css']("visibility", "visible"), $("#pageL")["addClass"]("page-cover"), changeOffest($('#pageL'))) : ($("#pageL")["hide"](), $('#pageR')["css"]("visibility", "visible"), $("#pageR")['addClass']("page-cover"), changeOffest($("#pageR")));
      } else {
        bookData["pageCount"] > _0x43c395 + 1 ? pageDirection == "left" ? ($("#pageL")["removeClass"]('page-cover'), $("#pageR")["show"](), $("#pageR")['css']('visibility', "visible"), changeOffest($("#pageL")), changeOffest($('#pageR')), bookData["getPageManifest"](_0x43c395 + 1, true, function (_0x322823) {
          arrPageObj[_0x43c395 + 1] = _0x322823;
          initPageImg($("#pageR"), _0x322823, _0x49cf7d);
        })) : ($("#pageR")["removeClass"]("page-cover"), $('#pageL')["show"](), $("#pageL")["css"]("visibility", 'visible'), changeOffest($("#pageL")), changeOffest($("#pageR")), bookData['getPageManifest'](_0x43c395 + 1, true, function (_0x59e10a) {
          arrPageObj[_0x43c395 + 1] = _0x59e10a;
          initPageImg($("#pageL"), _0x59e10a, _0x49cf7d);
        })) : pageDirection == "left" ? $("#pageR")["css"]("visibility", "hidden") : $("#pageL")["css"]("visibility", "hidden");
      }
    }
  });

  if (_0x4ace2b) {
    var _0x20423a = '',
        _0x197a0a = '';
    isTwoPage ? pageDirection == "left" ? (_0x20423a = "#pageL", _0x197a0a = '#pageR') : (_0x20423a = '#pageR', _0x197a0a = "#pageL") : _0x20423a = "#pageS";
    setTimeout(function () {
      LoadMediaAnnot(_0x43c395, $(_0x20423a));
    }, 500);
    isTwoPage && bookData["pageCount"] > _0x43c395 + 1 && setTimeout(function () {
      LoadMediaAnnot(_0x43c395 + 1, $(_0x197a0a));
    }, 500);
  }

  $("#scroller-FlipZoom")['scrollLeft']($('#scroller-FlipZoom')["data"]("scrollLeft"));
  $('#scroller-FlipZoom')["scrollTop"]($("#scroller-FlipZoom")["data"]("scrollTop"));
  _0x4ace2b && (preloadTimer != null && clearInterval(preloadTimer), preloadPage = _0x43c395, preloadTimer = setInterval(function () {
    try {
      preloadPage < _0x43c395 ? preloadPage < _0x43c395 - intPreloadPage || preloadPage < 0 ? (clearInterval(preloadTimer), preloadTimer = null) : (preLoadPageImage(preloadPage), preloadPage--) : (preloadPage++, preloadPage <= _0x43c395 + intPreloadPage && preloadPage < bookData["pageCount"] ? preLoadPageImage(preloadPage) : preloadPage = _0x43c395 - 1);
    } catch (_0xd9f7af) {
      console["log"](_0xd9f7af);
    }
  }, intWaitTime));
  prepareAjax = null;
}

var ajaxRequests = [];

function reqToServer(_0x5af199, _0x508c21, _0xb5bf88, _0x4bc5ad, _0x10942a, _0x27a678) {
  var _0x46a0a7 = function (_0x3bcf4b, _0x3f4010) {
    var _0x3b2ed9 = 'part' + _0x508c21['id']['slice'](-1),
        _0x23de15 = parseInt(_0x508c21['id']["split"]('_')[0]),
        _0x2f73db = _0x508c21['id']['slice'](-1) + '_' + _0x3bcf4b + '_' + _0x3f4010;

    pageDirection == "left" ? (_0x3b2ed9 = nowPage == _0x23de15 ? 'L' + _0x3b2ed9 : 'R' + _0x3b2ed9, _0x2f73db = nowPage == _0x23de15 ? 'L' + _0x2f73db : 'R' + _0x2f73db) : (_0x3b2ed9 = nowPage == _0x23de15 ? 'R' + _0x3b2ed9 : 'L' + _0x3b2ed9, _0x2f73db = nowPage == _0x23de15 ? 'R' + _0x2f73db : 'L' + _0x2f73db);

    if ($('#' + _0x2f73db)['length'] > 0) {
      $('#' + _0x2f73db)["attr"]("src", bookData["getPageImage"](_0x508c21["images"][_0x3bcf4b][_0x3f4010]))['load'](function () {
        $(this)['show']();
        $(this)["parent"]()["data"]("isTopDiv") && $(this)["parent"]()["find"]("img:hidden")["length"] == 0 && $(_0x5af199)["unblock"]();
      });
      _0x3bcf4b == 0 && $(_0x39799d)["addClass"]("topimg");
      return;
    }

    var _0x39799d = $('<img>')["attr"]('id', _0x2f73db)["attr"]('src', bookData["getPageImage"](_0x508c21['images'][_0x3bcf4b][_0x3f4010]))['css']("display", "none")["css"]("position", 'absolute')["css"]("width", _0xb5bf88)["css"]('height', _0x4bc5ad)["css"]("left", _0x3f4010 * _0xb5bf88 + 'px')["css"]("top", _0x3bcf4b * _0x4bc5ad + 'px')['css']('-webkit-transform', "translate3d(0,0,0)")["data"]('i', _0x3bcf4b)["data"]('j', _0x3f4010)['load'](function () {
      $(this)["show"]();
      $(this)["parent"]()["data"]("isTopDiv") && $(this)['parent']()['find']("img:hidden")["length"] == 0 && $(_0x5af199)["unblock"]();
    })['error'](function () {
      alert('error');
      return;
      $(this)['error'] = null;

      if ($(this)['attr']("src")["indexOf"]("ImageHandler") < 0) {
        return;
      }

      $(this)["hide"]();
      console["log"]("load error:" + $(this)["attr"]("src"));

      var _0x22e0b2 = $(this)['attr']('src') + '?rand=' + Math["floor"](Math["random"]() * 10000);

      $(this)["attr"]("src", _0x22e0b2);
    });

    $["browser"]["msie"] && $["browser"]["version"] <= 8 && ($(_0x39799d)["css"]("display", ''), $(_0x5af199)['unblock']());
    _0x3bcf4b == 0 && $(_0x39799d)["addClass"]("topimg");

    var _0xeb2ec6 = $('#' + _0x3b2ed9);

    $(_0xeb2ec6)["append"](_0x39799d);
  }(_0x10942a, _0x27a678);

  return $["ajax"]({
    'url': bookData['getPageImage'](_0x508c21['images'][_0x10942a][_0x27a678]),
    'type': "GET",
    'async': true,
    'cache': true,
    'beforeSend': function (_0x3a8853) {
      _0x3a8853["setRequestHeader"]('Connection', "Keep-Alive");
    },
    'success': _0x46a0a7,
    'error': function (_0x512320, _0x1f9b43, _0x273be6) {
      alert(_0x273be6);
    }
  });
}

function changeImg(_0x3a08c1, _0x571343, _0x4bc5f6, _0x1c04d9) {
  var _0x487eb4 = parseInt(_0x571343['id']["slice"](-1)) - 1,
      _0x1ae28d = "part1",
      _0x2a9fb3 = parseInt(_0x571343['id']["split"]('_')[0]);

  loadPageLoadingImage(_0x2a9fb3);
  pageDirection == 'left' ? _0x1ae28d = nowPage == _0x2a9fb3 ? 'L' + _0x1ae28d : 'R' + _0x1ae28d : _0x1ae28d = nowPage == _0x2a9fb3 ? 'R' + _0x1ae28d : 'L' + _0x1ae28d;

  var _0x54dca8 = $("<div>")['attr']('id', _0x1ae28d)['data']('id', _0x571343['id']);

  $(_0x54dca8)["css"]("z-index", _0x487eb4)['data']("isTopDiv", true);
  $(_0x3a08c1)["find"]('#' + _0x1ae28d)["length"] <= 0 ? $(_0x3a08c1)["append"](_0x54dca8) : $('#' + _0x1ae28d)["data"]('id', _0x571343['id']);
  $(_0x3a08c1)["find"]("div")["not"]('#' + _0x1ae28d)["each"](function () {
    if ($(this)["hasClass"]('blockUI')) {
      return;
    } else {
      $(this)["find"]("img")["length"] == 1 && _0x571343['images']["length"] != 1 ? $(this)['css']("z-index", -1)["data"]("isTopDiv", false) : $(this)['remove']();
    }
  });

  for (var _0x41e965 = 0; _0x41e965 < _0x571343["images"]["length"]; _0x41e965++) {
    for (var _0x44409e = 0; _0x44409e < _0x571343["images"][_0x41e965]['length']; _0x44409e++) {
      var _0x526897 = _0x571343['id']["slice"](-1) + '_' + _0x41e965 + '_' + _0x44409e;

      pageDirection == "left" ? _0x526897 = nowPage == _0x2a9fb3 ? 'L' + _0x526897 : 'R' + _0x526897 : _0x526897 = nowPage == _0x2a9fb3 ? 'R' + _0x526897 : 'L' + _0x526897;
      var _0x5a60b1 = 0;
      _0x5a60b1 = 2;

      var _0x4c7f17 = new Image();

      _0x4c7f17["onload"] = function () {
        if ($('#' + _0x526897) && $('#' + _0x526897)['length'] > 0) {
          $('#' + _0x526897)["attr"]("src") != urls[_0x2a9fb3][_0x5a60b1] ? ($('#' + _0x526897)['unbind']("load")["load"](function () {
            $(_0x3a08c1)["unblock"]({
              'fadeOut': 0
            });
            $(this)["show"]();
            $(this)['parent']()['data']("isTopDiv") && $(this)["parent"]()["find"]('img:hidden')["length"] == 0 && $(_0x3a08c1)["unblock"]();
          })["error"](function () {})["attr"]('src', _0x4c7f17['src']), $["browser"]["msie"] && $["browser"]['version'] <= 8 && ($('#' + _0x526897)["css"]("display", ''), $(_0x3a08c1)["unblock"]()), _0x41e965 == 0 && $(_0x5c3424)["addClass"]('topimg')) : $(_0x3a08c1)["unblock"]();
        } else {
          var _0x5c3424 = $("<img>")["attr"]('id', _0x526897)["css"]("width", _0x4bc5f6)['css']("height", _0x1c04d9)["css"]("-webkit-transform", "translate3d(0,0,0)")["data"]('i', _0x41e965)['data']('j', _0x44409e)["load"](function () {
            $(_0x3a08c1)['unblock']({
              'fadeOut': 0
            });
            $(this)['show']();
            $(this)["parent"]()["data"]("isTopDiv") && $(this)['parent']()["find"]("img:hidden")['length'] == 0 && $(_0x3a08c1)["unblock"]();
          })["error"](function () {
            return;
          })["attr"]("src", _0x4c7f17['src']);

          $["browser"]["msie"] && $["browser"]["version"] <= 8 && ($(_0x5c3424)["css"]("display", ''), $(_0x3a08c1)["unblock"]());
          _0x41e965 == 0 && $(_0x5c3424)['addClass']("topimg");
          $(_0x54dca8)["append"](_0x5c3424);
        }
      };

      _0x4c7f17["src"] = urls[_0x2a9fb3][_0x5a60b1];
      return;

      var _0xf03fa3 = new Image();

      _0xf03fa3["onload"] = function () {
        if ($('#' + _0x526897) && $('#' + _0x526897)["length"] > 0) {
          $('#' + _0x526897)["attr"]('src') != urls[_0x2a9fb3][_0x5a60b1] ? ($('#' + _0x526897)["css"]("display", "none")["unbind"]("load")['load'](function () {
            $(_0x3a08c1)["unblock"]({
              'fadeOut': 0
            });
            $(this)["show"]();
            $(this)["parent"]()['data']("isTopDiv") && $(this)['parent']()["find"]("img:hidden")["length"] == 0 && $(_0x3a08c1)["unblock"]();
          })["error"](function () {})["attr"]('src', _0xf03fa3["src"]), $["browser"]["msie"] && $['browser']["version"] <= 8 && ($('#' + _0x526897)["css"]("display", ''), $(_0x3a08c1)["unblock"]()), _0x41e965 == 0 && $(_0x5a323c)["addClass"]("topimg")) : $(_0x3a08c1)["unblock"]();
        } else {
          var _0x5a323c = $("<img>")["attr"]('id', _0x526897)["css"]("display", 'none')["css"]("width", _0x4bc5f6)['css']('height', _0x1c04d9)["css"]('-webkit-transform', "translate3d(0,0,0)")["data"]('i', _0x41e965)["data"]('j', _0x44409e)['load'](function () {
            $(_0x3a08c1)['unblock']({
              'fadeOut': 0
            });
            $(this)["show"]();
            $(this)["parent"]()["data"]("isTopDiv") && $(this)["parent"]()['find']("img:hidden")["length"] == 0 && $(_0x3a08c1)["unblock"]();
          })["error"](function () {
            return;
            $(this)["error"] = null;

            if ($(this)['attr']("src")["indexOf"]("ImageHandler") < 0) {
              return;
            }

            $(this)['hide']();
            console["log"]("load error:" + $(this)["attr"]('src'));

            var _0x214452 = $(this)["attr"]("src") + '?rand=' + Math["floor"](Math["random"]() * 10000);

            $(this)["attr"]("src", _0x214452);
          })['attr']("src", _0xf03fa3['src']);

          $['browser']["msie"] && $["browser"]["version"] <= 8 && ($(_0x5a323c)["css"]('display', ''), $(_0x3a08c1)["unblock"]());
          _0x41e965 == 0 && $(_0x5a323c)["addClass"]("topimg");
          $(_0x54dca8)["append"](_0x5a323c);
        }
      };

      _0xf03fa3["src"] = urls[_0x2a9fb3][_0x5a60b1];
    }
  }

  return;

  for (var _0x41e965 = 0; _0x41e965 < _0x571343["images"]['length']; _0x41e965++) {
    for (var _0x44409e = 0; _0x44409e < _0x571343["images"][_0x41e965]["length"]; _0x44409e++) {
      ajaxRequests['push'](reqToServer(_0x3a08c1, _0x571343, _0x4bc5f6, _0x1c04d9, _0x41e965, _0x44409e));
    }
  }

  var _0x49a28e = $['when']["apply"]($, ajaxRequests);

  _0x49a28e["done"](function (_0xb83766) {});

  return;

  for (var _0x41e965 = 0; _0x41e965 < _0x571343['images']['length']; _0x41e965++) {
    for (var _0x44409e = 0; _0x44409e < _0x571343['images'][_0x41e965]["length"]; _0x44409e++) {
      var _0x170767 = function (_0x22cbe6, _0x1318e1) {
        var _0x26d79c = $('<img>')['css']('display', "none")["css"]('position', "absolute")['css']("width", _0x4bc5f6)['css']("height", _0x1c04d9)["css"]('left', _0x1318e1 * _0x4bc5f6 + 'px')["css"]("top", _0x22cbe6 * _0x1c04d9 + 'px')["css"]("-webkit-transform", "translate3d(0,0,0)")['data']('i', _0x22cbe6)["data"]('j', _0x1318e1)["load"](function () {
          $(this)["show"]();
          $(this)["parent"]()["data"]("isTopDiv") && $(this)['parent']()["find"]("img:hidden")["length"] == 0 && $(_0x3a08c1)["unblock"]();
        })['error'](function () {
          alert('error');
          return;
          $(this)["error"] = null;

          if ($(this)["attr"]("src")['indexOf']('ImageHandler') < 0) {
            return;
          }

          $(this)['hide']();
          console["log"]("load error:" + $(this)["attr"]("src"));

          var _0x50691c = $(this)["attr"]("src") + "?rand=" + Math["floor"](Math["random"]() * 10000);

          $(this)["attr"]("src", _0x50691c);
        })['attr']('src', bookData["getPageImage"](_0x571343['images'][_0x22cbe6][_0x1318e1]));

        $["browser"]["msie"] && $["browser"]["version"] <= 8 && ($(_0x26d79c)["css"]("display", ''), $(_0x3a08c1)["unblock"]());
        _0x22cbe6 == 0 && $(_0x26d79c)["addClass"]("topimg");
        $(_0x54dca8)["append"](_0x26d79c);
      }(_0x41e965, _0x44409e);

      $["ajax"]({
        'url': bookData['getPageImage'](_0x571343["images"][_0x41e965][_0x44409e]),
        'type': 'GET',
        'async': true,
        'cache': true,
        'beforeSend': function (_0x362d2a) {
          _0x362d2a["setRequestHeader"]('Connection', "Keep-Alive");
        },
        'success': _0x170767,
        'error': function (_0x18bc5f, _0x138a2f, _0x3c488a) {
          alert(_0x3c488a);
        }
      });
    }
  }

  $(_0x54dca8)["css"]("z-index", 1)['data']("isTopDiv", true);
  $(_0x3a08c1)["append"](_0x54dca8);
  img = null;
  _0x54dca8 = null;
  $(_0x3a08c1)["find"]("div")["not"]('#' + _0x571343['id'])["each"](function () {
    if ($(this)['hasClass']("blockUI")) {
      return;
    } else {
      $(this)["find"]("img")["length"] == 1 && _0x571343["images"]["length"] != 1 ? $(this)['css']("z-index", -1)["data"]("isTopDiv", false) : $(this)["remove"]();
    }
  });
}

function changeSize(_0x1bf0b5, _0x3baabe, _0x21a752, _0x3abdf4) {
  var _0xa2b992,
      _0x1ea21f,
      _0x490042 = _0x1bf0b5["width"]();

  _0xa2b992 = _0x490042 * _0x21a752;

  var _0xf63cf8 = _0x1bf0b5["height"]();

  _0x1ea21f = _0xf63cf8 * _0x21a752;
  _0xa2b992 = Math['round'](_0xa2b992);
  _0x1ea21f = Math["round"](_0x1ea21f);
  _0x3abdf4 > 0 ? (_0xa2b992 = _0x3abdf4, _0x1ea21f = _0xa2b992 * (_0x3baabe["u_height"] / _0x3baabe['u_width'])) : this["last_width"] = _0xa2b992;

  if (_0xa2b992 >= _0x3baabe["u_width"]) {
    return false;
  }

  var _0x1f9d9e = Math["round"](_0xa2b992 / u_width);

  if (_0x1f9d9e >= _0x3baabe["imgSet"]['length']) {
    _0x1f9d9e = _0x3baabe['imgSet']["length"] - 1;

    if ($(_0x1bf0b5)["find"]('#' + _0x3baabe["imgSet"][_0x1f9d9e]['id'])["length"] > 0 && _0xa2b992 / _0x3baabe["imgSet"][_0x1f9d9e]["images"][0]["length"] > _0x3baabe['u_width']) {
      return false;
    }
  }

  var _0x5dcf16, _0x1e2e0b;

  !isNotPC && $(_0x1bf0b5)['find']("div")["each"](function () {
    var _0x3ee3b0 = getImgSetById(_0x3baabe, $(this)['data']('id'));

    _0x3ee3b0 != null && (_0x5dcf16 = _0xa2b992 / _0x3ee3b0["images"][0]["length"], _0x1e2e0b = _0x1ea21f / _0x3ee3b0["images"]["length"], _0x5dcf16 = _0x5dcf16["toFixed"](), _0x1e2e0b = _0x1e2e0b["toFixed"](), $(this)['find']("img")["each"](function () {
      $(this)["width"](_0x5dcf16);
      $(this)['height'](_0x1e2e0b);
    }));
  });
  $(_0x1bf0b5)["width"](_0xa2b992);
  $(_0x1bf0b5)["height"](_0x1ea21f);
  minPageW == 0 && (minPageW = _0xa2b992);
  changeOffest($(_0x1bf0b5));

  if ($(_0x1bf0b5)["find"]("div[id$='part" + (_0x1f9d9e + 1) + "']")["length"] == 0) {
    isNotPC ? (_0x5dcf16 = _0x490042 / _0x3baabe["imgSet"][_0x1f9d9e]['images'][0]["length"], _0x1e2e0b = _0xf63cf8 / _0x3baabe["imgSet"][_0x1f9d9e]['images']["length"]) : (_0x5dcf16 = _0xa2b992 / _0x3baabe["imgSet"][_0x1f9d9e]["images"][0]['length'], _0x1e2e0b = _0x1ea21f / _0x3baabe["imgSet"][_0x1f9d9e]["images"]['length']);
  } else {
    savePageTime();
    return true;
  }

  _0x5dcf16 = _0x5dcf16["toFixed"]();
  _0x1e2e0b = _0x1e2e0b["toFixed"]();
  changeImg(_0x1bf0b5, _0x3baabe["imgSet"][_0x1f9d9e], _0x5dcf16, _0x1e2e0b);
  return true;
}

function changeOffest(_0x46ee09) {
  var _0x4bd53b = $(_0x46ee09)["parent"]();

  $(_0x4bd53b)["css"]('position', "relative");

  if ($(_0x46ee09)['hasClass']('pageS') || $(_0x46ee09)["hasClass"]('page-cover')) {
    $(_0x4bd53b)["width"]($(_0x46ee09)["width"]());

    var _0xcd6d13 = ($(window)["width"]() - $(_0x4bd53b)["width"]()) / 2;

    _0xcd6d13 < 0 && (_0xcd6d13 = 0);
    $(_0x4bd53b)["css"]("left", _0xcd6d13 + 'px');

    var _0x2bfecd = ($(window)["height"]() - $(_0x46ee09)['height']()) / 2;

    _0x2bfecd < 0 && (_0x2bfecd = 0);
    $(_0x4bd53b)["css"]("top", _0x2bfecd + 'px');
  } else {
    pageDirection == "left" ? $(_0x4bd53b)["children"](".smoothR")["width"]($(_0x4bd53b)["children"]('.smoothL')["width"]()) : $(_0x4bd53b)["children"](".smoothL")['width']($(_0x4bd53b)["children"](".smoothR")["width"]());
    $(_0x4bd53b)["width"]($(_0x4bd53b)['children'](".smoothL")['width']() * 2);

    var _0xcd6d13 = ($(window)["width"]() - $(_0x4bd53b)['width']()) / 2;

    _0xcd6d13 < 0 && (_0xcd6d13 = 0);
    $(_0x4bd53b)["css"]("left", _0xcd6d13 + 'px');

    var _0x2bfecd = ($(window)["height"]() - $(_0x46ee09)['height']()) / 2;

    _0x2bfecd < 0 && (_0x2bfecd = 0);
    $(_0x4bd53b)["css"]("top", _0x2bfecd + 'px');
  }
}

function getImgSetById(_0x2594b1, _0x21e0d5) {
  for (var _0x4ab96a in _0x2594b1["imgSet"]) {
    if (_0x2594b1["imgSet"][_0x4ab96a]['id'] == _0x21e0d5 && typeof _0x21e0d5 != "undefined") {
      return _0x2594b1["imgSet"][_0x4ab96a];
    }
  }

  return null;
}

function LoadMediaAnnot(_0xd8c0b7, _0x1959d9) {
  $(_0x1959d9)["children"]("div[id$='_media']")["remove"]();
  bookData['getPageMediaAnnot'](_0xd8c0b7, function (_0x147cb5) {
    $(_0x1959d9)['data']("mediaAnnots", _0x147cb5);
    SetMediaAnnot(_0x147cb5, _0x1959d9, _0xd8c0b7);
  });
  strISBN == "EBK10200011193" && $["ajax"]({
    'async': true,
    'contentType': "application/x-www-form-urlencoded",
    'url': "EBK10200011193.txt",
    'type': 'GET',
    'error': function () {},
    'success': function (_0x5a66aa) {
      var _0x475cdc = _0x5a66aa["split"]("\n");

      $["each"](_0x475cdc, function (_0x56e66d, _0x3dc815) {
        var _0x1a6f94 = _0x3dc815["split"](',');

        if (_0x1a6f94[0] == _0xd8c0b7 + 1) {
          var _0x269cb1 = _0x1a6f94[1],
              _0xb2dc02 = _0x1a6f94[2],
              _0x5666e1 = _0x1a6f94[3];

          if (_0xb2dc02["trim"]() != '') {
            var _0x29d96a = $("<div/>"),
                _0x1390c8 = $(_0x1959d9)['height']() / 10 * (_0x269cb1["substring"](0, 1) - 1),
                _0x5e7055 = _0x269cb1["indexOf"]('-') > -1 ? $(_0x1959d9)["height"]() / 10 * 2 : $(_0x1959d9)["height"]() / 10 * 1,
                _0x1db9ef = $("<input>")["attr"]('type', "image")["css"]('position', "absolute")["css"]("opacity", '0')["css"]("filter", "alpha(opacity=0)")['width']($(_0x1959d9)["width"]() / 10 * 2)["height"](_0x5e7055)['css']("left", $(_0x1959d9)['width']() / 10 * 0.5 + 'px')['css']("top", _0x1390c8 + 'px')["data"]("Media", _0xb2dc02)['data']('MediaType', "CourseURL")['click'](function (_0x107e15) {
              window["open"]($(this)["data"]("Media"));

              _0x107e15["preventDefault"]();

              return false;
            });

            $(_0x29d96a)["append"]($(_0x1db9ef));
            setTimeout(function () {
              $(_0x1959d9)["append"]($(_0x29d96a));
            }, 500);
          }

          if (_0x5666e1["trim"]() != '') {
            var _0x2fa8e1 = $('<div/>'),
                _0x43445c = $("<input>")["attr"]("type", "image")["css"]("position", 'absolute')["css"]('opacity', '0')['css']("filter", 'alpha(opacity=0)')["width"]($(_0x1959d9)["width"]() / 10 * 3.5)["height"]($(_0x1959d9)["height"]() / 10 * 3)["css"]("left", $(_0x1959d9)['width']() / 10 * 6 + 'px')["css"]("top", $(_0x1959d9)["height"]() / 10 * 2 + 'px')["data"]("Media", _0x5666e1)["data"]("MediaType", "MovieURL")["click"](function (_0x213c0b) {
              window["open"]($(this)["data"]("Media"));

              _0x213c0b["preventDefault"]();

              return false;
            });

            $(_0x2fa8e1)['append']($(_0x43445c));
            setTimeout(function () {
              $(_0x1959d9)['append']($(_0x2fa8e1));
            }, 500);
          }
        }
      });
    }
  });
  return;
  $(_0x1959d9)["children"]('#' + _0xd8c0b7 + "_media")["remove"]();
  typeof $(_0x1959d9)["data"]("mediaAnnots") == "undefined" || $(_0x1959d9)['data']("mediaAnnots") == null ? bookData["getPageMediaAnnot"](_0xd8c0b7, function (_0x33eb77) {
    $(_0x1959d9)["data"]("mediaAnnots", _0x33eb77);
    SetMediaAnnot(_0x33eb77, _0x1959d9, _0xd8c0b7);
  }) : SetMediaAnnot($(_0x1959d9)["data"]("mediaAnnots"), _0x1959d9, _0xd8c0b7);
}

function SetMediaAnnot(_0x5357fc, _0x5b1355, _0x1c9673) {
  if (_0x5357fc == null) {
    return;
  }

  var _0x4d2249 = $("<div/>");

  $(_0x4d2249)['attr']('id', _0x1c9673 + "_media")["css"]("z-index", 2);

  for (var _0xca28ad = 0; _0xca28ad < _0x5357fc["length"]; _0xca28ad++) {
    var _0x6784f5 = _0x5357fc[_0xca28ad],
        _0x50867c = $(_0x5b1355)['width']() / _0x6784f5['pagewidth'],
        _0x3c26d2 = $(_0x5b1355)["height"]() / _0x6784f5["pageheight"],
        _0x3180b0 = $("<input>")["attr"]('type', "image")["attr"]('src', _0x6784f5['icon'] != null ? "data:image/jpeg;base64," + _0x6784f5["icon"] : _0x6784f5["type"] == "audio" ? 'images/audio.png' : "images/video.png")["css"]("position", "absolute")["css"]('opacity', '0')["css"]("filter", 'alpha(opacity=0)')['width'](_0x6784f5["rect"]["Width"] * _0x50867c)['height'](_0x6784f5['rect']["Height"] * _0x3c26d2)["css"]("left", _0x6784f5["rect"]["Left"] * _0x50867c + 'px')['css']("top", _0x6784f5['rect']["Top"] * _0x3c26d2 + 'px')["data"]("Media", _0x6784f5['id'])["data"]("MediaType", _0x6784f5['type'])["click"](function (_0x5c586e) {
      $(this)["data"]("MediaType") == "audio" ? playAudio(bookData["getMedia"]($(this)["data"]("Media")), _0x5c586e) : playVideo(bookData["getMedia"]($(this)["data"]("Media")), _0x5c586e);

      _0x5c586e["preventDefault"]();

      return false;
    });

    $(_0x4d2249)["append"]($(_0x3180b0));
  }

  $(_0x5b1355)["append"]($(_0x4d2249));
}

function SmoothZoomIn() {
  zoom(scale);
}

function SmoothZoomOut() {
  zoom(0.8);
}

function zoom(_0x5da673) {
  nowScale = _0x5da673;
  var _0x5e4658 = 0,
      _0xfebfe4 = 0,
      _0x46330e = 0,
      _0x4ce935 = 0;
  isTwoPage ? (_0x46330e = $('#pageL')["width"]() + $("#pageR")["width"](), nowPage == 0 && (_0x46330e = pageDirection == 'left' ? $("#pageL")["width"]() : $('#pageR')['width']())) : _0x46330e = $("#pageS")["width"]();
  _0x4ce935 = isTwoPage ? pageDirection == 'left' ? $("#pageL")["height"]() : $("#pageR")["height"]() : $("#pageS")["height"]();
  _0x5e4658 = _0x46330e * _0x5da673;
  _0xfebfe4 = _0x4ce935 * _0x5da673;

  var _0x2c869e = isTwoPage && nowPage != 0 ? u_width * 2 : u_width * 1,
      _0x45ea26 = isTwoPage && nowPage != 0 ? minPageW * 2 : minPageW;

  _0x46330e < _0x2c869e && _0x5e4658 > _0x2c869e && (_0x5e4658 = _0x2c869e, _0xfebfe4 = _0xfebfe4 * _0x2c869e / _0x5e4658, _0x5da673 = _0x5e4658 / _0x46330e);
  _0x46330e > _0x45ea26 && _0x5e4658 < _0x45ea26 && (_0x5e4658 = _0x45ea26, _0xfebfe4 = _0xfebfe4 * _0x45ea26 / _0x5e4658, _0x5da673 = _0x5e4658 / _0x46330e);
  (_0x5da673 > 1 || _0x5e4658 / $(window)["width"]() > _0x5da673 || _0xfebfe4 / $(window)["height"]() > _0x5da673) && _0x5e4658 <= _0x2c869e && zoomInterTimer == null && (zoomInterTimer = setInterval(function () {
    bookData["getPageManifest"](nowPage, true, function (_0x373d9a) {
      var _0x1d389e = '',
          _0x39165f = '';
      isTwoPage ? pageDirection == "left" ? (_0x1d389e = "#pageL", _0x39165f = "#pageR") : (_0x1d389e = "#pageR", _0x39165f = "#pageL") : _0x1d389e = "#pageS";
      zoomSuccess = changeSize($(_0x1d389e), _0x373d9a, _0x5da673);
      zoomSuccess && nowPage != 0 && isTwoPage && bookData["getPageManifest"](nowPage + 1, true, function (_0x4c94b3) {
        changeSize($(_0x39165f), _0x4c94b3, _0x5da673, $(_0x1d389e)['width']());
        LoadMediaAnnot(nowPage + 1, $(_0x39165f));
      });
      LoadMediaAnnot(nowPage, $(_0x1d389e));
    });
    clearInterval(zoomInterTimer);
    zoomInterTimer = null;

    if (zoomSuccess) {
      var _0x508e08 = (_0x5e4658 - _0x46330e) / 2 + $("#scroller-FlipZoom")["scrollLeft"](),
          _0x182ba5 = (_0xfebfe4 - _0x4ce935) / 2 + $('#scroller-FlipZoom')["scrollTop"]();

      if (_0x508e08 < 0 || _0x5e4658 < intBrowserW) {
        _0x508e08 = 0;
      }

      if (_0x182ba5 < 0 || _0xfebfe4 < intBrowserH) {
        _0x182ba5 = 0;
      }

      $("#scroller-FlipZoom")["scrollLeft"](_0x508e08);
      $('#scroller-FlipZoom')['scrollTop'](_0x182ba5);
      $("#scroller-FlipZoom")["data"]("scrollLeft", _0x508e08);
      $('#scroller-FlipZoom')["data"]("scrollTop", _0x182ba5);
    }

    if (zoomSuccess) {
      try {
        for (var _0x2f845a = 1; _0x2f845a <= intPreloadPage; _0x2f845a++) {
          var _0x5acde6 = nowPage + _0x2f845a;

          isTwoPage && nowPage != 0 && _0x5acde6++;

          if (_0x5acde6 > bookData["pageCount"]) {
            break;
          }
        }
      } catch (_0x40e094) {}

      try {
        for (var _0x2f845a = 1; _0x2f845a <= intPreloadPage; _0x2f845a++) {
          var _0x5acde6 = nowPage - _0x2f845a;

          if (_0x5acde6 < 0) {
            break;
          }
        }
      } catch (_0x2c1e6b) {}
    }
  }, 50));
}

function getScrollpage() {
  return pageDirection == "left" ? $("#slider-fill")['slider']('option', "value") : intSliderTotalPage - $("#slider-fill")["slider"]("option", 'value') - 1;
}

function scrollToPage(_0x39d7c2, _0x217354) {
  console["log"]("scrollToPage : %d", _0x39d7c2);

  var _0x57a865, _0x4c745c, _0x50a561;

  $('#previous_page')["stop"](true, true)["show"]();
  $("#next_page")["stop"](true, true)['show']();

  if (_0x39d7c2 <= 0) {
    _0x39d7c2 = 0;
    $("#previous_page")["hide"]();
  } else {
    _0x39d7c2 >= intSliderTotalPage - 1 && (_0x39d7c2 = intSliderTotalPage - 1, $("#next_page")["hide"]());
  }

  pageDirection == "left" ? $('#slider-fill')["slider"]("option", 'value', _0x39d7c2) : $("#slider-fill")["slider"]("option", "value", intSliderTotalPage - _0x39d7c2 - 1);
  clearTimeout(onScrollEndTimer);
  onScrollEndTimer = null;
  clearTimeout(loadZoomImageTimer);
  loadZoomImageTimer = null;
  isTwoPage ? pageDirection == "left" ? nowPage = _0x39d7c2 * 2 - 1 : intTotalPage % 2 == 0 ? nowPage = intTotalPage - _0x39d7c2 * 2 - 1 : nowPage = intTotalPage - _0x39d7c2 * 2 - 2 : pageDirection == "left" ? nowPage = _0x39d7c2 : nowPage = intTotalPage - _0x39d7c2 - 1;
  nowPage < 0 && (nowPage = 0);
  $("#pageNum")["val"](nowPage);

  if (checkPreview() == false) {
    return;
  }

  _0x57a865 = $("#pageL")["width"]();
  _0x4c745c = $('#pageR')['height']();
  _0x50a561 = $("[id^='scroller-page-']:visible")['css']("left");
  $("[id^='scroller-page-'] [id^='page']")["width"](_0x57a865)["height"](_0x4c745c);
  $('#scroller-page-' + _0x39d7c2)['css']('left', _0x50a561);
  $("#scroller-page-" + _0x39d7c2)['show']();
  loadPageLoadingImage(nowPage);

  if (!(arrPageObj[nowPage] != undefined)) {
    $("#pageL")["width"](_0x57a865);
    $("#pageL")["height"](_0x4c745c);
  }

  if (isTwoPage) {
    loadPageLoadingImage(nowPage + 1);

    if (!(arrPageObj[nowPage + 1] != undefined)) {
      $("#pageR")["width"](_0x57a865);
      $('#pageR')["height"](_0x4c745c);
    }
  }

  setNowPage();
  onScrollEndTimer = setTimeout(function () {
    loadPageImage(nowPage, true);
    $("[id^='scroller-page-']:hidden [id^='page']")['each'](function () {
      $(this)['find']("div")["not"]("div:first")["each"](function () {
        $(this)["find"]("img")["attr"]("src", '');
        $(this)["remove"]();
      });
    });
    onScrollEndTimer = null;
  }, intTransPageTime);
  savePageTime();
}

function savePageTime() {
  pageTimer && pageTimeStop();

  if (!isTwoPage || nowPage == 0 || intTotalPage <= nowPage + 1) {
    pages = nowPage;

    var _0x15368c;

    !isTwoPage ? _0x15368c = "#pageS" : pageDirection == 'left' ? _0x15368c = "#pageL" : _0x15368c = "#pageR";

    var _0xf3067f = isNaN(parseFloat($("#scroller-page")["css"]("top"))) ? 0 : parseFloat($("#scroller-page")["css"]("top")),
        _0x287216 = $(_0x15368c)["width"](),
        _0x31e0b2 = $(_0x15368c)["height"](),
        _0x52f97b = $(_0x15368c)["offset"]()['left'] > 0 ? 0 : -$(_0x15368c)["offset"]()["left"],
        _0x26d374 = $(_0x15368c)["offset"]()["top"] > 0 ? 0 : -($(_0x15368c)["offset"]()["top"] - _0xf3067f),
        _0x2d796e = intBrowserW > _0x287216 ? _0x287216 : intBrowserW,
        _0x36ecf5 = intBrowserH > _0x31e0b2 ? _0x31e0b2 : intBrowserH;

    pagePositions = _0x287216 + '-' + _0x31e0b2 + '-' + _0x52f97b + '-' + _0x26d374 + '-' + _0x2d796e + '-' + _0x36ecf5;
  } else {
    if (intTotalPage > nowPage + 1) {
      var _0x2dd3d7 = "#pageL",
          _0x174493 = "#pageR";
      pageDirection == "left" ? pages = nowPage + '|' + (nowPage + 1) : pages = nowPage + 1 + '|' + nowPage;

      var _0xf3067f = isNaN(parseFloat($("#scroller-page")['css']("top"))) ? 0 : parseFloat($("#scroller-page")['css']("top")),
          _0x287216 = $(_0x2dd3d7)["width"](),
          _0x24c59a = $(_0x174493)["width"](),
          _0x31e0b2 = $(_0x2dd3d7)['height'](),
          _0x6cc5b2 = $(_0x174493)["height"](),
          _0x52f97b = $(_0x2dd3d7)["offset"]()["left"] > 0 ? 0 : -$(_0x2dd3d7)["offset"]()["left"],
          _0x57aeeb = $(_0x174493)['offset']()["left"] > 0 ? 0 : -$(_0x174493)['offset']()['left'],
          _0x26d374 = $(_0x2dd3d7)["offset"]()['top'] > 0 ? 0 : -($(_0x2dd3d7)["offset"]()['top'] - _0xf3067f),
          _0x4a9611 = $(_0x174493)["offset"]()["top"] > 0 ? 0 : -($(_0x174493)["offset"]()["top"] - _0xf3067f),
          _0x2d796e,
          _0x21fc2a;

      intBrowserW >= _0x287216 + _0x24c59a ? (_0x2d796e = _0x287216, _0x21fc2a = _0x24c59a) : (_0x2d796e = $(_0x174493)["offset"]()["left"], _0x21fc2a = intBrowserW - $(_0x174493)["offset"]()['left']);

      var _0x36ecf5, _0x53a8ac;

      intBrowserH >= _0x31e0b2 ? (_0x36ecf5 = _0x31e0b2, _0x53a8ac = _0x6cc5b2) : (_0x36ecf5 = intBrowserH, _0x53a8ac = intBrowserH);
      pagePositions = _0x287216 + '-' + _0x31e0b2 + '-' + _0x52f97b + '-' + _0x26d374 + '-' + _0x2d796e + '-' + _0x36ecf5 + '|' + _0x24c59a + '-' + _0x6cc5b2 + '-' + _0x57aeeb + '-' + _0x4a9611 + '-' + _0x21fc2a + '-' + _0x53a8ac;
    }
  }

  pageTimeCount();
}

function pageTimeCount() {
  pageTime = parseInt(pageTime) + 1;
  pageTimer = setTimeout(function () {
    pageTimeCount();
  }, 1000);
}

function pageTimeStop() {
  clearTimeout(pageTimer);

  if (pageTime < 2) {
    pageTime = 0;
    return;
  }

  $["ajax"]({
    'url': "SavePageTime",
    'type': 'POST',
    'data': {
      'ISBN': strISBN,
      'pageDirection': pageDirection,
      'pages': pages,
      'pagePositions': pagePositions,
      'pageTime': pageTime
    },
    'async': true,
    'cache': false,
    'success': function (_0x217728) {},
    'error': function (_0x337bac, _0x53b791, _0xbc710f) {}
  });
  pageTime = 0;
}

function blobtoDataURL(_0x2ca138, _0xbd426b) {
  var _0x10a55a = new FileReader();

  _0x10a55a['onload'] = function (_0x3b5deb) {
    _0xbd426b(_0x3b5deb['target']["result"]);
  };

  _0x10a55a["readAsDataURL"](_0x2ca138);
}