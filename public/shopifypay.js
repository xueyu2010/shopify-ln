// Load QR code script
var qrcodescript = document.createElement("script");
qrcodescript.src =
  "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";
qrcodescript.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(qrcodescript);

// Load Copy script
var copyscript = document.createElement("script");
copyscript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js";
copyscript.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(copyscript);

!(function() {
  const app = {
    zh: {
      download: "还没有 BTC 闪电网络钱包？下载 ",
      copy: "复制",
      expires: "过期时间：",
      expired: "付款码已过期，请刷新页面重试",
      title: "确认订单，并且使用闪电网络支付",
      waiting: "请稍后，请勿刷新页面...",
      payment_exception: "支付失败，请刷新页面重新生成支付二维码"
    },
    download: "Don't have a BTC Lightning Wallet? Try",
    copy: "Copy",
    expires: "Invoice expires in ",
    expired: "Invoice was expired, please refresh page",
    title: "Review and pay BTC with Lightning Network",
    waiting: "Please wait, and don't refresh the page...",
    payment_exception:
      "Opps! Payment error, please refresh to generate new payment QR code"
  };
  const i18n = (lang, key) => {
    if (lang === "zh-CN") return app.zh[key];
    else {
      return app[key];
    }
  };
  const e = document.querySelector.bind(document),
    n = (document.querySelectorAll.bind(document),
    (e, n) => {
      n.parentNode.insertBefore(e, n.nextSibling);
    });

  let i = {},
    o = "Thank you!",
    r = null,
    d = null;
  const s = () => {
      i = {
        mainHeader: e("#main-header"),
        orderConfirmed: e(".os-step__title"),
        orderConfirmedDescription: e(".os-step__description"),
        continueButton: e(".step__footer__continue-btn"),
        checkMarkIcon: e(".os-header__hanging-icon"),
        orderStatus: e(".os-header__title"),
        paymentMethod: e(".payment-method-list__item__info"),
        product: e(".product__description"),
        price: e(".total-recap__final-price")
      };
    },
    c = () => {
      clearInterval(r),
        (i.mainHeader.innerText = o),
        (i.orderConfirmed.style.display = "block"),
        i.orderConfirmedDescription &&
          (i.orderConfirmedDescription.style.display = "block"),
        (i.continueButton.style.visibility = "visible"),
        (i.checkMarkIcon.style.visibility = "visible"),
        (d.style.display = "none");
    };
  const lang = navigator.language;
  tt = expireSeconds => {
    var countDownDate = new Date().getTime() + expireSeconds - 10000;
    setInterval(function() {
      // Get todays date and time
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById("cobo-timer").innerHTML =
        i18n(lang, "expires") + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(tt);
        document.getElementById("cobo-timer").innerHTML = i18n(lang, "expired");
      }
    }, 1000);
  };

  (window.setOrderAsPaid = c),
    (window.CoboShopify = function e(a) {
      if ((s(), "Order canceled" === i.orderStatus.innerText)) return;
      const l = i.paymentMethod;
      if (
        null === l ||
        typeof ClipboardJS !== "function" ||
        typeof QRCode !== "function"
      )
        return void setTimeout(() => {
          e(a);
        }, 10);
      if (-1 === l.innerText.toLowerCase().indexOf("bitcoin")) return;
      (o = i.mainHeader.innerText),
        (i.mainHeader.innerText = i18n(lang, "title")),
        (i.continueButton.style.visibility = "hidden"),
        (i.checkMarkIcon.style.visibility = "hidden"),
        (i.orderConfirmed.style.display = "none"),
        i.orderConfirmedDescription &&
          (i.orderConfirmedDescription.style.display = "none"),
        (d = document.createElement("div"));
      const p = window.location.pathname.split("/")[3],
        u = window.location.pathname.split("/")[2];

      d.innerHTML = `\n  <div style="margin:100px"> ${i18n(
        lang,
        "waiting"
      )}</div>  \n`;

      var priceTarget = i.price.outerText.toString().substring(1); // only support CNY
      const exchangeApi = "https://api.coindesk.com/v1/bpi/currentprice.json";
      start = orderid => {
        fetch(exchangeApi)
          .then(e => e.json())
          .then(e => {
            const exchangeRate = parseFloat(e.bpi.USD.rate_float) * 6.7;
            const satoshi = Math.ceil(
              (parseFloat(priceTarget) * Math.pow(10, 8)) / exchangeRate
            );
            n(d, i.orderConfirmed);

            const invoice = `${a.domain}/commerce/create_order/`;

            fetch(invoice, {
              headers: {
                Accept: "application/json"
              },
              method: "POST",
              body: JSON.stringify({
                key: a.token,
                order: orderid,
                coin: "BTC",
                memo: i.product.innerText,
                amount: satoshi
              })
            })
              .then(e => e.json())
              .then(e => {
                new ClipboardJS(".btn");
                // expires in 1000 seconds
                const sec =
                  (e.result.creation_date + e.result.expiry) * 1000 -
                  new Date().getTime();

                tt(sec);
                d.innerHTML = `\n
                        <h3 style="text-align:center"> ${i18n(
                          lang,
                          "download"
                        )} <a href="https://cobo.com/" target="_blank">\n Cobo Wallet \n </a>\n   </h3> \n
                         <hr> \n
                         <div style="display:flex; justify-content: center"> \n
                           <div id="qrcode"></div> \n
                         </div> \n
                         <h4 style=" text-align:center; margin-top: 20px" id="cobo-timer"> </h4>
                         <div style="display:flex; flex-direction: row;border-style: dashed; border-color: lightgrey; width:100%; max-width: 450px;padding: 5px; border-width: 1.5px; margin: auto;margin-top:20px" >
                            <div style="margin-right:20px">${e.result.invoice.substring(
                              0,
                              72
                            )} ...  </div>
                             <button class="btn" style="padding:10px; width:80px; margin:auto" data-clipboard-text="${
                               e.result.invoice
                             }"> \n
                               <span> ${i18n(lang, "copy")} </span>\n
                             </button>  \n
                          </div> \n
                        `;

                var q = new QRCode(document.getElementById("qrcode"), {
                  text: e.result.invoice,
                  width: 300,
                  height: 300,
                  style: "margin:auto",
                  colorDark: "#000000",
                  colorLight: "#ffffff",
                  correctLevel: QRCode.CorrectLevel.L
                });
              });
          });
      };

      if (u === "checkouts") {
        // we need orderid, not checkout id
        window.location.replace(window.location.href);
      } else {
        start(p);
        const m = `${a.domain}/commerce/order/?key=${
          a.token
        }&order=${p}&coin=BTC`;
        r = setInterval(() => {
          fetch(m, {
            headers: {
              Accept: "application/json"
            }
          })
            .then(e => e.json())
            .then(e => {
              if (e.result.state === "receive_settled") {
                c();
              } else if (e.result.state === "exception") {
                d.innerHTML = `\n  <div style="margin:100px"> ${i18n(
                  lang,
                  "payment_exception"
                )}</div>  \n`;
              }
            })
            .catch(function(e) {});
        }, 2000);
      }
    });
})();
