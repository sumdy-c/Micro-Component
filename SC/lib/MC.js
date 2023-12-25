const MicroStateComponents = new Set(),
  GetMicroStateComponents = function (t) {
    0 === MicroStateComponents.length &&
      console.warn(
        "[Micro Component] Вы пытаетесь получить объект компонента, до их инциацлизации. Проверьте правильность вызова"
      );
    let e;
    return (
      MicroStateComponents.forEach((s) => {
        s.CSSfiles.includes(t) && (e = s.stylize.bind(s));
      }),
      e
    );
  };
class State {
  instance;
  save_value;
  version = "2.0.0";
  action = !1;
  constructor(t) {
    return (
      void 0 !== t && (this.action = !0),
      (this.save_value = t),
      (this.instance = { value: t }),
      this
    );
  }
  set(t) {
    this.set_save(t), (this.instance.value.value = t);
  }
  reg() {
    return this.instance.value.value;
  }
  set_save(t) {
    this.save_value = t;
  }
  go() {
    this.instance.value.value = this.save_value;
  }
  get() {
    return this.save_value;
  }
}
class SCmove {
  state;
  states;
  valueState;
  proxyState;
  safeIterator;
  personfn;
  saveMoveClass;
  saveMoveSel;
  toggleMod;
  virtualFn;
  constructor() {
    this.states = new Set();
  }
  stateProxy(t, e, s) {
    let r = {};
    s || (s = "obj");
    let a = new Proxy(t, {
      get: (a, i) =>
        "object" != typeof t[i]
          ? t[i]
          : (void 0 === r[i] && (r[i] = this.stateProxy(t[i], e, `${s}.${i}`)),
            r[i]),
      set: (s, r, i) => e(i, r, a, t[r]) || 1,
    });
    return a;
  }
  handlerDOM(t, e, s) {
    let r = {};
    s || (s = "obj");
    let a = new Proxy(t, {
      get: (a, i) =>
        "object" != typeof t[i]
          ? t[i]
          : (void 0 === r[i] && (r[i] = this.handlerDOM(t[i], e, `${s}.${i}`)),
            r[i]),
      set: (t, s, r) => (e(r, s, a), r.fn(), r),
    });
    return a;
  }
  render = async (t, e, s) => {
    t.virtual.replaceWith(t.userNode), (s = t.userNode);
  };
  action = (t, e, s, r) => {
    this.states.forEach((e) => {
      if (s === e.proxyState.value) {
        if (e.tree) {
          (e.state = t),
            e.CollectionDOM.forEach((e) => {
              let s = e.Function(t);
              if (!s) {
                s = [];
                let r = document.createElement("source");
                r.setAttribute("style", "height: 0; width: 0; display: none;"),
                  s.push(r);
              }
              e.virtualDOM.DOM = {
                virtual: e.lastState,
                userNode: s[0],
                fn() {
                  e.lastState = s[0];
                },
              };
            });
          return;
        }
        e.selectors.forEach((s) => {
          if (e.state.value !== t || s.noCheck || s.fastStart) {
            if (((s.fastStart = !1), e.toggle)) {
              if (Array.isArray(t))
                t.forEach((t) => {
                  this.personfn(s.target, t);
                });
              else if ("*empty" === t) $(s.target).empty();
              else {
                if ("*remove" !== t) return this.personfn(s.target, t);
                $(s.target).remove();
              }
            } else this.personfn(s.target, s.SCstyle(t));
          }
        }),
          "object" == typeof t && (t = JSON.stringify(t)),
          (e.state.value = t),
          (e.fastStart = !1);
      }
    });
  };
  controlState(t, e, s, r, a) {
    let i = Date.now() + this.safeIterator;
    if ("tree" === t) {
      let o = null,
        n = r,
        l = !1;
      if (
        (this.states.forEach((t) => {
          if (t.proxyState === e) {
            let s = {
              Function: n,
              lastState: a,
              virtualDOM: this.handlerDOM(a, this.render, t.proxyState),
            };
            if ((t.CollectionDOM.push(s), t.proxyState.value.value)) {
              let r = s.Function(t.proxyState.value.value);
              if (!r) {
                r = [];
                let i = document.createElement("source");
                i.setAttribute("style", "height: 0; width: 0; display: none;"),
                  r.push(i);
              }
              (s.virtualDOM.DOM = {
                virtual: s.lastState,
                userNode: r[0],
                fn() {
                  s.lastState = r[0];
                },
              }),
                (o = r[0]);
            } else o = null;
            l = !0;
          }
        }),
        l)
      )
        return o;
      let h = {
          Function: n,
          lastState: a,
          virtualDOM: this.handlerDOM(a, this.render, e),
        },
        S = {
          state: e.value,
          key: i,
          CollectionDOM: [h],
          proxyState: e,
          tree: !0,
        };
      if (e.value) {
        let C = h.Function(e.value);
        if (!C) {
          C = [];
          let c = document.createElement("source");
          c.setAttribute("style", "height: 0; width: 0; display: none;"),
            C.push(c);
        }
        return (
          (h.virtualDOM.DOM = {
            virtual: h.lastState,
            userNode: C[0],
            fn() {
              h.lastState = C[0];
            },
          }),
          this.states.add(S),
          C[0]
        );
      }
      return this.states.add(S), null;
    }
    if (0 === this.states.size) {
      this.states.add({
        state: this.state,
        key: i,
        selectors: [
          {
            target: this.saveMoveSel,
            SCstyle: this.saveMoveClass,
            fastStart: r.action,
            noCheck: s,
          },
        ],
        proxyState: this.proxyState,
        toggle: e,
      });
      return;
    }
    let u = !1;
    if (
      (this.states.forEach((e) => {
        e.proxyState === t &&
          ((u = !0),
          e.selectors.push({
            target: this.saveMoveSel,
            SCstyle: this.saveMoveClass,
            fastStart: r.action,
            noCheck: s,
          }));
      }),
      !u)
    ) {
      this.states.add({
        state: this.state,
        key: i,
        selectors: [
          {
            target: this.saveMoveSel,
            SCstyle: this.saveMoveClass,
            fastStart: r.action,
            noCheck: s,
          },
        ],
        proxyState: this.proxyState,
        toggle: e,
      });
      return;
    }
  }
  create(t, e, s, r) {
    (this.valueState = this.stateProxy(
      this.state,
      this.action,
      this.valueState
    )),
      this.safeIterator++,
      this.controlState(t, e, s, r),
      (t.value = this.valueState);
  }
  createStateTree(t, e, s, r, a) {
    let i = this.stateProxy({ value: t.value }, this.action, { value: null });
    this.safeIterator++;
    let o = this.controlState("tree", t, e, s, a);
    return (t.value = i), o;
  }
  move(t, e, s, r, a, i) {
    (this.state = { value: t.value }),
      (this.valueState = { value: null }),
      (this.proxyState = t),
      (this.safeIterator = 0),
      (this.saveMoveSel = e),
      s ? (this.saveMoveClass = s) : (this.saveMoveClass = void 0),
      (this.personfn = (t, e) => {
        r.stylize($(t), e);
      }),
      void 0 === a && (a = !1),
      this.create(t, !s, a, i);
  }
  statement(t, e, s, r, a) {
    return (this.safeIterator = 0), this.createStateTree(t, e, s, r, a);
  }
}
class MicroComponent {
  commercialName = "Micro Component | 2023";
  stylesScheme;
  CSSfiles;
  CSSdocumentsClasses;
  SCid;
  settingSC;
  document_style;
  SCStyleSheet;
  childrenVirtual;
  constructor(t) {
    (this.settingSC = { init: "disable" }),
      (this.document_style = []),
      (this.stylesScheme = {}),
      (this.CSSdocumentsClasses = []),
      t && ((this.settingSC = t), (this.settingSC.init = "enable"));
  }
  uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (t) =>
      (
        t ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (t / 4)))
      ).toString(16)
    );
  }
  generateRandomValue() {
    for (
      var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        e = "",
        s = 0;
      s < 6;
      s++
    ) {
      var r = Math.floor(Math.random() * t.length);
      e += t.charAt(r);
    }
    return e;
  }
  hasDuplicatesClassCSS(t, e) {
    return t.some(function (s, r) {
      return t.some(function (t, a) {
        a !== r && t.selectorText === s.selectorText && e.push(s.selectorText);
      });
    });
  }
  createCssNode() {
    (this.SCStyleSheet = new CSSStyleSheet()),
      (document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        this.SCStyleSheet,
      ]);
  }
  initCSSClass() {
    let t = Array.from(document.styleSheets),
      e = [];
    this.CSSfiles.forEach((s) => {
      e.push(
        t.find((t) => {
          if (t.href && t.href.match(/\/([^\/]+\.css)$/))
            return t.href.match(/\/([^\/]+\.css)$/)[1] === s;
        })
      ),
        this.document_style.push(
          t.findIndex((t) => {
            if (t.href && t.href.match(/\/([^\/]+\.css)$/))
              return t.href.match(/\/([^\/]+\.css)$/)[1] === s;
          })
        );
    }),
      e.forEach((t) => {
        if (!t) {
          this.settingSC &&
            !this.settingSC.offWarn &&
            console.error(`[Micro Component] Ошибка подключения стилей`);
          return;
        }
        Array.from(t.rules).forEach((e, s) => {
          try {
            let r = {};
            (r.selectorText = e.selectorText),
              (r.cssText = e.style.cssText),
              this.CSSdocumentsClasses.push(r),
              this.settingSC &&
                this.settingSC.deleteNativeCSS &&
                t.deleteRule(0);
          } catch (a) {}
        });
      });
    let s = [];
    this.hasDuplicatesClassCSS(this.CSSdocumentsClasses, s),
      s.length > 1 &&
        ((this.settingSC && this.settingSC.offWarn) ||
          (console.warn(
            `[Micro Component] Обнаружено дублирование CSS классов! Обратите внимание, что это может привести к неправильному поведению страницы`
          ),
          console.warn(`[Micro Component] Дубли ${s.join(", ")}`)));
  }
  removeStyledComponentClasses(t, e) {
    let s = e.replace("-", ".");
    this.CSSdocumentsClasses.map((e) => {
      e.hasOwnProperty("originalClass") &&
        e.originalClass === s &&
        $(t).removeClass(e.selectorText.substring(1));
    });
  }
  proggresiveVar() {
    (window.DIV = "DIV"),
      (window.SPAN = "SPAN"),
      (window.BUTTON = "BUTTON"),
      (window.ASIDE = "ASIDE"),
      (window.FOOTER = "FOOTER"),
      (window.HEADER = "HEADER"),
      (window.H1 = "H1"),
      (window.H2 = "H2"),
      (window.H3 = "H3"),
      (window.H4 = "H4"),
      (window.H5 = "H5"),
      (window.H6 = "H6"),
      (window.MAIN = "MAIN"),
      (window.NAV = "NAV"),
      (window.LI = "LI"),
      (window.MENU = "MENU"),
      (window.P = "P"),
      (window.UL = "UL"),
      (window.A = "A"),
      (window.IMG = "IMG"),
      (window.VIDEO = "VIDEO"),
      (window.IFRAME = "IFRAME"),
      (window.SVG = "SVG"),
      (window.CANVAS = "CANVAS"),
      (window.FORM = "FORM"),
      (window.INPUT = "INPUT"),
      (window.LABEL = "LABEL"),
      (window.OPTION = "OPTION"),
      (window.SELECT = "SELECT"),
      (window.TEXTAREA = "TEXTAREA"),
      (window.TEMPLATE = "TEMPLATE");
  }
  styledComponentClasses(t, e) {
    var s, r, a;
    let i = !1,
      o = [];
    if (
      (this.CSSdocumentsClasses.map((s) => {
        s.hasOwnProperty("originalClass") &&
          s.originalClass === e &&
          ($(t).addClass(s.selectorText.substring(1)).attr("SC", this.SCid),
          (i = !0)),
          s.selectorText.includes(e) && o.push(s);
      }),
      i)
    )
      return;
    if (0 === o.length) {
      (this.settingSC && this.settingSC.offWarn) ||
        (console.warn(
          `[Micro Component] Не удалось найти CSS класс. Возможно вы не подключили файл в отслеживание MC или опечатались.`
        ),
        console.warn(`[Micro Component] Проблема была обнаружена с - ${e}`));
      return;
    }
    let n = `.SC_${e.substring(1)}-${this.generateRandomValue()}`,
      l =
        ((s = o),
        (r = e),
        (a = n),
        s.forEach(function (t) {
          (t.originalClass = t.selectorText),
            (t.selectorText = t.selectorText.replace(r, a));
        }),
        s);
    l.forEach((t) => {
      this.SCStyleSheet.insertRule(`${t.selectorText} {${t.cssText}}`, 0);
    }),
      $(t).addClass(n.substring(1)).attr("SC", this.SCid);
  }
  createElementCheck(t) {
    return [
      "HTML",
      "BASE",
      "HEAD",
      "LINK",
      "META",
      "STYLE",
      "TITLE",
      "BODY",
      "SHADOW",
    ].includes(t)
      ? (console.error(
          `MC | Использовать метаданные документа и корень раздела не позволяется. Проблема возникла с ${t}, может в хотели найти этот элемент ? Напишите его без использования КАПСа`
        ),
        !1)
      : !!"ADDRESS,ARTICLE,ASIDE,FOOTER,HEADER,H1,H2,H3,H4,H5,H6,HGROUP,MAIN,NAV,SECTION,SEARCH,BLOCKQUOTE,DD,DIV,DL,DT,FIGCAPTION,FIGURE,HR,LI,MENU,OL,P,PRE,UL,A,ABBR,B,BDI,BDO,BR,CITE,CODE,DATA,DFN,EM,I,KBD,MARK,Q,RP,RT,RUBY,S,SAMP,SMALL,SPAN,STRONG,SUB,SUP,TIME,U,VAR,WBR,AREA,AUDIO,IMG,MAP,TRACK,VIDEO,EMBED,IFRAME,OBJECT,PICTURE,PORTAL,SOURCE,SVG,MATH,CANVAS,NOSCRIPT,SCRIPT,DEL,INS,CAPTION,COL,COLGROUP,TABLE,TBODY,TD,TFOOT,TH,THEAD,TRBUTTON,DATALIST,FIELDSET,FORM,INPUT,LABEL,LEGEND,METER,OPTGROUP,OPTION,OUTPUT,PROGRESS,SELECT,TEXTAREA,DETAILS,DIALOG,SUMMARY,SLOT,TEMPLATE,ACRONYM,BIG,CENTER,CONTENT,DIR,FONT,FRAME,FRAMESET,IMAGE,MARQUEE,MENUITEM,NOBR,NOEMBED,NOFRAMES,PARAM,PLAINTEXT,RB,RTC,STRIKE,TT,XMP".includes(
          t
        );
  }
  hasCapital = (t) => !/^[a-zа-я\d]*$/.test(t);
  stylize = (t, e) => {
    if ("State" === t.__proto__.constructor.name && "function" == typeof e) {
      let s = null,
        r;
      if (
        (MicroStateComponents.forEach((t) => {
          this.SCid === t.SCid && (s = t);
        }),
        s.SCmove.states.forEach((t) => {
          t.CollectionDOM.forEach((t) => {
            t.Function.toString() === e.toString() && (r = t.lastState);
          });
        }),
        r)
      )
        return r;
      this.childrenVirtual = !0;
      let a = document.createElement("source");
      a.setAttribute("style", "height: 0; width: 0; display: none;");
      let i = s.SCmove.statement(t.instance, s, e, t, a);
      return ((this.childrenVirtual = !1), i) ? i : a;
    }
    if (this.settingSC && !this.settingSC.mutateCSS) {
      if (!e) {
        let o;
        return this.createElementCheck(t)
          ? (this.hasCapital(t) &&
              "." !== t[0] &&
              (o = $(`<${t.toLowerCase()}>`).attr("SC", this.SCid)),
            o)
          : $(t).attr("SC", this.SCid);
      }
      let n;
      if (
        ((n =
          this.hasCapital(t) && "." !== t[0] && this.createElementCheck(t)
            ? $(`<${t.toLowerCase()}>`)
            : $(t)),
        "." === e[0])
      )
        return $(n).addClass(e.substring(1)), n;
      if ("-" === e[0]) return $(n).removeClass(e), n;
      if ("!line" === e) return n.removeAttr("style"), n;
      else if ("!class" === e) return n.removeClass(), n;
      else if ("*remove" === e) return n.remove(), null;
      else if ("*empty" === e) return n.empty(), n;
      else if (Array.isArray(e))
        return (
          e.forEach((t) => {
            this.stylize(n, t);
          }),
          n
        );
      else return n;
    }
    if (!e) {
      let l;
      return this.createElementCheck(t)
        ? (this.hasCapital(t) &&
            "." !== t[0] &&
            (l = $(`<${t.toLowerCase()}>`).attr("SC", this.SCid)),
          l)
        : (0 === (l = $(t).attr("SC", this.SCid)).length &&
            this.CSSdocumentsClasses.map((e) => {
              if (e.hasOwnProperty("originalClass") && e.originalClass === t)
                return (l = $(e.selectorText));
            }),
          l);
    }
    let h;
    if (
      (0 ===
        (h =
          this.hasCapital(t) && "." !== t[0] && this.createElementCheck(t)
            ? $(`<${t.toLowerCase()}>`)
            : $(t)).length &&
        this.CSSdocumentsClasses.map((e) => {
          e.hasOwnProperty("originalClass") &&
            e.originalClass === t &&
            (h = $(e.selectorText));
        }),
      "." === e[0])
    )
      return this.styledComponentClasses(h, e), h;
    if ("-" === e[0]) return this.removeStyledComponentClasses(h, e), h;
    if ("!line" === e) return h.removeAttr("style"), h;
    if ("!class" === e) return h.removeClass(), h;
    if ("*remove" === e) return h.remove(), null;
    else if ("*empty" === e) return h.empty(), h;
    else if (Array.isArray(e))
      return (
        e.forEach((t) => {
          this.stylize(h, t);
        }),
        h
      );
    else return h;
  };
  use(t) {
    return (
      this.settingSC &&
        this.settingSC.mutateCSS &&
        ((this.CSSfiles = t), this.initCSSClass(), this.createCssNode()),
      (this.SCid = (Date.now() / 28).toFixed(0) + this.generateRandomValue()),
      (this.SCmove = new SCmove()),
      MicroStateComponents.add(this),
      this.goSC(),
      this.settingSC && this.settingSC.progressiveVar && this.proggresiveVar(),
      this.stylize.bind(this)
    );
  }
  goSC = () => {
    !(MicroStateComponents.size > 1) &&
      (($.fn.MCstate = function (t, e, s) {
        if (!$(this).attr("sc")) {
          console.error(
            `[Micro Component] Вы пытаетесь назначить обработчик MC, на компонент который не был им зарегистрирован! Проверьте селектор к которому вы пытаетесь применить функции MC!`
          ),
            console.error(t),
            console.error(this);
          return;
        }
        let r;
        return (
          MicroStateComponents.forEach((t) => {
            $(this).attr("sc") === t.SCid && (r = t);
          }),
          "2.0.0" === t.version &&
            (r.SCmove.move(t.instance, $(this), e, r, s, t),
            t.action && t.go()),
          this
        );
      }),
      ($.fn.MCadd = function (t) {
        if (!$(this).attr("sc")) {
          console.error(
            `[Micro Component] Вы пытаетесь назначить обработчик MC, на компонент который не был им зарегистрирован! Проверьте селектор к которому вы пытаетесь применить функции MC!`
          ),
            console.error(arg),
            console.error(this);
          return;
        }
        let e;
        return (
          MicroStateComponents.forEach((t) => {
            $(this).attr("sc") === t.SCid && (e = t);
          }),
          e.stylize(this, t),
          this
        );
      }),
      ($.fn.MChasClass = function (t) {
        if (!$(this).attr("sc")) {
          console.error(
            "[Micro Component] Вы пытаетесь проверить обработчик MC, на компонент который не был им зарегистрирован! Проверьте селектор к которому вы пытаетесь применить функции MC!"
          );
          return;
        }
        let e,
          s = !1;
        return (
          MicroStateComponents.forEach((t) => {
            $(this).attr("sc") === t.SCid && (e = t);
          }),
          e.CSSdocumentsClasses.map((e) => {
            e.hasOwnProperty("originalClass") &&
              e.originalClass === t &&
              $(this).hasClass(e.selectorText.substring(1)) &&
              (s = !0);
          }),
          s
        );
      }));
  };
}
