function PDFParser() {
  this['status'] = false;
  this["error"] = null;
  this["ISBN"] = '';
  this['title'] = '';
  this["pageCount"] = 0;
  this["navPoint"] = new Array();
  this['navList'] = new Array();
  this['navAnnot'] = new Array();
  this["direction"] = 'left';

  var _0x32d1f9 = this;

  _0x32d1f9["getPageManifest"] = function (_0x307859, _0x4c850b, _0x4581e4) {
    var _0x58ddc3 = 0,
        _0x37afeb = 0,
        _0x5349aa = new XMLHttpRequest();

    _0x5349aa["open"]("GET", "GetPageImage?ISBN=" + _0x32d1f9["ISBN"] + "&PageNum=" + _0x307859, true);

    _0x5349aa["responseType"] = "arraybuffer";

    _0x5349aa["onloadend"] = function (_0x1b6e18) {
      this["status"] != 200 && !isAlertAlready && (isAlertAlready = true, alert("登入逾时，请重入登入。"), location["href"] = "../home/index");
    };

    _0x5349aa["onload"] = function (_0x29f50d) {
      if (this["status"] == 200) {
        var _0xd5d482 = this['response'],
            _0x2809cd = _HashMap[_0x307859 % 10],
            _0x143724 = parseInt(_0xd5d482['byteLength'] / _0x2809cd["length"]),
            _0x1f5b6f = new Uint8Array(0);

        for (var _0x53287f = 0; _0x53287f <= _0x2809cd["length"] - 1; _0x53287f++) {
          var _0x3cf77b = _0x2809cd["indexOf"](_0x53287f);

          _0x1f5b6f = appendBuffer(_0x1f5b6f, _0xd5d482["slice"](_0x3cf77b * _0x143724, _0x3cf77b * _0x143724 + _0x143724));
        }

        _0x1f5b6f = appendBuffer(_0x1f5b6f, _0xd5d482["slice"](_0x2809cd["length"] * _0x143724));

        var _0x5ebdd3 = new Blob([_0x1f5b6f], {
          'type': 'image/jpeg'
        });

        blobtoDataURL(_0x5ebdd3, function (_0x43dcba) {
          var _0x5eb780 = new Image();

          _0x5eb780["onload"] = function () {
            urls[_0x307859] = [null, null, _0x43dcba];
            _0x58ddc3 = _0x5eb780["width"];
            _0x37afeb = _0x5eb780["height"];

            var _0x572998 = "{\"imgSet\":[{\"images\":[[\"" + _0x307859 + '/' + _0x307859 + "_1\"]],\"id\":\"" + _0x307859 + "_1\"}," + "{\"images\":[[\"" + _0x307859 + '/' + _0x307859 + "_2\"]],\"id\":\"" + _0x307859 + "_2\"}," + "{\"images\":[[\"" + _0x307859 + '/' + _0x307859 + "_3\"]],\"id\":\"" + _0x307859 + "_3\"}]," + "\"pageNum\":" + _0x307859 + ',' + "\"u_width\":" + _0x58ddc3 + ',' + "\"u_height\":" + _0x37afeb + ',' + "\"url\":\"" + _0x43dcba + "\"}";

            _0x572998 = $["parseJSON"](_0x572998);
            typeof _0x32d1f9["navList"][_0x307859] != "undefined" ? _0x4581e4(_0x32d1f9['navList'][_0x307859]) : (_0x32d1f9["navList"][_0x307859] = _0x572998, _0x4581e4(_0x572998));
          };

          _0x5eb780['src'] = _0x43dcba;
        });
      }
    };

    _0x5349aa['send']();

    return;

    var _0x3f191c = new Image();

    $(_0x3f191c)['one']("load", function () {
      _0x58ddc3 = _0x3f191c['width'];
      _0x37afeb = _0x3f191c["height"];
      _0x3f191c = null;

      var _0x29c0c0 = "{\"imgSet\":[{\"images\":[[\"" + _0x307859 + '/' + _0x307859 + "_1\"]],\"id\":\"" + _0x307859 + "_1\"}," + "{\"images\":[[\"" + _0x307859 + '/' + _0x307859 + "_2\"]],\"id\":\"" + _0x307859 + "_2\"}," + "{\"images\":[[\"" + _0x307859 + '/' + _0x307859 + "_3\"]],\"id\":\"" + _0x307859 + "_3\"}]," + "\"pageNum\":" + _0x307859 + ',' + "\"u_width\":" + _0x58ddc3 + ',' + "\"u_height\":" + _0x37afeb + '}';

      _0x29c0c0 = $["parseJSON"](_0x29c0c0);
      typeof _0x32d1f9["navList"][_0x307859] != "undefined" ? _0x4581e4(_0x32d1f9["navList"][_0x307859]) : typeof _0x32d1f9["navList"][_0x307859] == "undefined" && (_0x32d1f9["navList"][_0x307859] = _0x29c0c0, _0x4581e4(_0x29c0c0));
    });
    _0x3f191c["src"] = 'GetPageImage?ISBN=' + _0x32d1f9['ISBN'] + "&PageNum=" + _0x307859;
  };

  _0x32d1f9["getPageMediaAnnot"] = function (_0x51b693, _0x2b5c81) {
    typeof _0x32d1f9["navAnnot"][_0x51b693] != 'undefined' ? _0x2b5c81(_0x32d1f9["navAnnot"][_0x51b693]) : $["ajax"]({
      'async': true,
      'contentType': 'application/x-www-form-urlencoded',
      'url': 'GetPageMediaAnnot',
      'data': "ISBN=" + strISBN + "&PageNum=" + _0x51b693,
      'type': "POST",
      'dataType': "json",
      'error': function () {
        _0x32d1f9["status"] = false;
        _0x32d1f9["error"] = "Ajax request 發生錯誤";
      },
      'success': function (_0x2aade1) {
        _0x32d1f9["navAnnot"][_0x51b693] = _0x2aade1;

        _0x2b5c81(_0x2aade1);
      }
    });
  };

  _0x32d1f9["getMedia"] = function (_0x3f8a2c) {
    var _0x39a51e = null,
        _0x48b9bd = window['location']["toString"]();

    _0x48b9bd = _0x48b9bd['substr'](0, _0x48b9bd["lastIndexOf"]('/'));
    return _0x39a51e = _0x48b9bd + "/MediaHandler.ashx?ISBN=" + strISBN + "&MediaID=" + _0x3f8a2c;
  };

  _0x32d1f9["getPageImage"] = function (_0x505c70) {
    return url = "GetPageImage/" + strISBN + '/' + _0x505c70;
  };

  _0x32d1f9["getPageTitle"] = function (_0x180495, _0x4aa683) {
    var _0x134ea0;

    typeof _0x4aa683 == "undefined" && (_0x4aa683 = _0x32d1f9["navPoint"]);

    if (_0x4aa683 == null) {
      return _0x134ea0;
    }

    for (var _0x569389 = 0; _0x569389 < _0x4aa683['length']; _0x569389++) {
      if (_0x180495 >= _0x4aa683[_0x569389]["page"] && (_0x569389 == _0x4aa683["length"] - 1 || _0x180495 < _0x4aa683[_0x569389 + 1]["page"])) {
        _0x4aa683[_0x569389]["BookMarkData"] != null && _0x4aa683[_0x569389]["BookMarkData"]["length"] > 0 ? _0x134ea0 = _0x32d1f9["getPageTitle"](_0x180495, _0x4aa683[_0x569389]['BookMarkData']) : _0x134ea0 = _0x4aa683[_0x569389]['Title'];
        return _0x134ea0;
      }
    }

    return _0x32d1f9["title"];
  };

  _0x32d1f9['initManifest'] = function () {
    $["ajax"]({
      'async': false,
      'contentType': "application/x-www-form-urlencoded",
      'url': "GetBookManifest",
      'data': 'ISBN=' + strISBN,
      'type': "POST",
      'dataType': 'json',
      'error': function () {
        _0x32d1f9['status'] = false;
        _0x32d1f9["error"] = "Ajax request 發生錯誤";
      },
      'success': function (_0x568c69) {
        _0x32d1f9["ISBN"] = strISBN;
        _0x32d1f9["title"] = _0x568c69["Title"];
        _0x32d1f9['direction'] = _0x568c69['direction'];
        _0x32d1f9["pageCount"] = _0x568c69["PageCount"];

        for (var _0x1dbf09 = 1; _0x1dbf09 <= _0x568c69["pageCount"]; _0x1dbf09++) {
          _0x32d1f9['navList']["push"](_0x1dbf09);
        }

        _0x568c69["BookMarkData"] != null && (_0x32d1f9["navPoint"] = _0x568c69['BookMarkData']);
      }
    });
  };

  _0x32d1f9["searchText"] = function (_0xe25474, _0x3be7fa, _0x5b93a9, _0x5b6042) {
    var _0x50933d = null,
        _0x27c49d = _0x3be7fa + _0x5b93a9;

    $["ajax"]({
      'async': true,
      'contentType': "application/x-www-form-urlencoded",
      'url': "SearchText",
      'data': "ISBN=" + strISBN + "&Text=" + _0xe25474 + "&StartPage=" + _0x3be7fa + '&EndPage=' + _0x27c49d,
      'type': "POST",
      'dataType': "json",
      'error': function () {
        _0x32d1f9["status"] = false;
        _0x32d1f9["error"] = "Ajax request 發生錯誤";
      },
      'success': function (_0xd66d94) {
        _0x5b6042(_0xe25474, _0x3be7fa, _0x5b93a9, _0xd66d94);
      }
    });
    return _0x50933d;
  };
}
