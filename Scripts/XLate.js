var XLateModule = (function() {
    this.translatePage = function() {
        if (localStorage.transLationMode === "Translate") {
            var colTra = [];
            var col = document.querySelectorAll("[data-xlate]");
            col.forEach(function(o) {
                if (o.dataset.xlate !== "[XL8]") {
                    colTra.push({
                        key: o.dataset.xlate,
                        text: o.innerHTML.trim()
                    })
                }
            });
            if (colTra.length > 0) {
                $.ajax({
                    async: true,
                    type: 'POST',
                    url: 'VBserver.asmx/writeTranslate',
                    dataType: 'json',
                    data: JSON.stringify({
                        col: colTra
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function(jsres) {},
                    error: function(e) {
                        alert(e.responseText);
                    }
                });
            }
        } else {
            var lang = localStorage.language || "en-us";
            if (lang !== "en-us") {
                var col = document.querySelectorAll("[data-xlate]");
                col.forEach(function(o) {
                    var txt = localStorage.getItem("XL8." + lang + "." + o.dataset.xlate);
                    if (txt && txt !== "") {
                        if (txt === "-") {
                            o.innerHTML = "";
                        } else {
                            o.innerHTML = txt;
                        }
                    }
                });
            }
        }
    }
    ;
    this.XL8 = function(code, def) {
        var lang = localStorage.language || "en-us";
        if (lang === "en-us") {
            return def;
        }
        var ret = localStorage.getItem("XL8." + lang + "." + code);
        if (!ret) {
            return def;
        }
        if (ret === "-") {
            return "";
        } else {
            return ret;
        }
    }
    ;
    this.getLanguage = function(lang) {
        if (lang !== "en-us") {
            var values = [];
            var keys = Object.keys(localStorage);
            var i = keys.length;
            while (i--) {
                if (keys[i].indexOf("XL8.") !== -1) {
                    values.push(keys[i])
                }
            }
            values.forEach(function(o) {
                localStorage.removeItem(o);
            });
            $.ajax({
                type: 'POST',
                url: 'VBserver.asmx/getLanguage',
                dataType: 'json',
                data: JSON.stringify({
                    Lang: lang
                }),
                contentType: "application/json; charset=utf-8",
                success: function(jsres) {
                    var col = jsres.d;
                    col.Trans.forEach(function(o) {
                        localStorage.setItem("XL8." + col.Code + "." + o.Key, o.Text);
                    });
                    $.ajax({
                        type: 'POST',
                        url: 'VBserver.asmx/getLastLangRev',
                        dataType: 'json',
                        data: JSON.stringify({
                            Lang: lang
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function(jsres) {
                            localStorage.lastLangRev = jsres.d;
                            Xlate.translatePage();
                            localStorage.refreshLanguage = "";
                        },
                        error: function(e) {
                            alert(e.responseText);
                        }
                    });
                },
                error: function(e) {
                    alert(e.responseText);
                }
            });
        }
    }
    ;
    this.setLanguage = function(lang) {
        localStorage.language = lang;
        if (lang === "en-us") {
            $.ajax({
                type: 'POST',
                url: 'VBserver.asmx/getDefaultLanguage',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function(jsres) {
                    var colDef = jsres.d.Trans;
                    var col = document.querySelectorAll("[data-xlate]");
                    col.forEach(function(o) {
                        colDef.forEach(function(oo) {
                            if (oo.Key === o.dataset.xlate) {
                                o.innerHTML = oo.Text;
                                return;
                            }
                        });
                    });
                    Xlate.translatePage();
                    localStorage.refreshLanguage = "";
                },
                error: function(e) {
                    alert(e.responseText);
                }
            });
        } else {
            Xlate.getLanguage(lang);
        }
    }
    ;
    this.languages = function() {
        return [{
            text: "عربى",
            value: "ar"
        }, {
            text: "Český",
            value: "cs"
        }, {
            text: "Dansk",
            value: "da"
        }, {
            text: "Deutsch",
            value: "de"
        }, {
            text: "Nederlands",
            value: "nl"
        }, {
            text: "English",
            value: "en-us"
        }, {
            text: "Español",
            value: "es"
        }, {
            text: "Français",
            value: "fr"
        }, {
            text: "Íslensku",
            value: "is"
        }, {
            text: "Italiano",
            value: "it"
        }, {
            text: "Magyar",
            value: "hu"
        }, {
            text: "Norsk",
            value: "no"
        }, {
            text: "Português",
            value: "pt"
        }, {
            text: "Polski",
            value: "pl"
        }, {
            text: "Pусский",
            value: "ru"
        }, {
            text: "Suomi",
            value: "fi"
        }, {
            text: "Svenska",
            value: "sv"
        }, {
            text: "Türkçe",
            value: "tr"
        }]
    }
    ;
    this.getLangName = function(code) {
        var ret = code;
        var col = Xlate.languages();
        col.forEach(function(o) {
            if (o.value === code) {
                ret = o.text;
            }
        });
        return ret;
    }
    ;
    this.toggleTranslate = function() {}
}
);
var Xlate = new XLateModule();
document.addEventListener('DOMContentLoaded', (event)=>{
    if (getCookie("VB3userTranslateAdmin") !== "") {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        var a = document.createElement("a");
        a.href = "./translations.html?filter=" + page;
        a.target = "_blank";
        a.style = "position:fixed;left:0;top:0;z-index:100000;";
        var imgTran = document.createElement("img");
        imgTran.src = "./images/butBgrTrans.png";
        imgTran.style = "width:16px;height:12px;";
        a.appendChild(imgTran);
        document.body.appendChild(a);
        if (localStorage.refreshLanguage === "YES") {
            Xlate.setLanguage(localStorage.language);
        }
    }
    if (!localStorage.language || localStorage.language === "undefined") {
        localStorage.language = "en-us";
    }
    if (localStorage.language !== "en-us") {
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1);
        if (filename === "mainmenu.html" || filename === "projectlist.html") {
            if (!localStorage.lastLangRev) {
                Xlate.setLanguage(localStorage.language);
            } else {
                $.ajax({
                    type: 'POST',
                    url: 'VBserver.asmx/getLastLangRev',
                    dataType: 'json',
                    data: JSON.stringify({
                        Lang: localStorage.language
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function(jsres) {
                        var rev = jsres.d;
                        if (parseInt(localStorage.lastLangRev) < parseInt(rev)) {
                            Xlate.setLanguage(localStorage.language);
                        }
                    },
                    error: function(e) {
                        alert(e.responseText);
                    }
                });
            }
        }
    }
}
);
