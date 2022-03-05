// ==UserScript==
// @name         Shopeev-Order-Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agent run in shopee admin console to collect data
// @author       Jack Qingtian<jack.coder@outlook.com>
// @match        https://seller.shopee.cn/portal/sale/order/*
// @icon         https://www.google.com/s2/favicons?domain=shopee.cn
// @grant        none
// @run-at       document-body
// ==/UserScript==

'use strict';

function resizeBuyerInfoCard() {
    let right = document.getElementsByClassName("od-history")[0];
    let card = right.firstChild;
    card.className = "shopee-card";

    let container = card.getElementsByClassName("user-view-item")[0];
    container.style = "display: block !important";

    let avatar = container.firstChild;
    avatar.style = "float: none !important;";

    let buyerName = avatar.nextElementSibling;
    buyerName.style = "margin-top: 20px; margin-left: 0 !important;";

    let btnGroup = buyerName.nextElementSibling;
    btnGroup.style = "width: 100%; margin: 20px 0 0 0;";
}

function resizeBuyerRatingCard() {
    let right = document.getElementsByClassName("od-history")[0];
    let container = right.firstChild.nextElementSibling;
    let body = container.getElementsByClassName("cod-content")[0];
    body.style = "display: block !important;";

    let desc = body.firstChild;
    desc.style = "width: unset !important; border-right: unset !important;";

    let charts = desc.nextElementSibling;
    charts.style = "float: unset !important; width: unset !important; height: unset !important; margin: 0;";

    let childrenCharts = charts.children;
    childrenCharts.forEach((e) => {
        e.style = "float: unset !important; width: unset !important; -webkit-box-align: unset !important; align-items: unset !important; margin: 15px 0 0 0;"
    });
}
function onload() {
    let mainContainer = document.getElementsByClassName("order-detail")[0];
    let leftCards = mainContainer.firstChild.firstChild.children;
    let buyerRatingCard = leftCards[1];
    let buyerCard = leftCards[3];
    let buyerCardHTML = buyerCard.innerHTML;
    buyerCard.remove();

    let buyerRatingCardHTML = buyerRatingCard.innerHTML;
    buyerRatingCard.remove()


    let right = document.getElementsByClassName("od-history")[0];
    let rightBuyerInfoCard = right.insertAdjacentElement('afterbegin', buyerCard);
    let rightBuyerRatingCard = rightBuyerInfoCard.insertAdjacentElement('afterend', buyerRatingCard);

    resizeBuyerInfoCard();
    resizeBuyerRatingCard();
}

setTimeout(onload, 2000);
