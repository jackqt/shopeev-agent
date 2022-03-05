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
    card.style = "margin-bottom: 16px;";

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
function replaceProductImage() {
    document
        .getElementsByClassName("product-item")
        .forEach((e) => {
            let img = e.firstChild;
            let imgSrc = img.getAttribute("style").replace(/.*url\(\"/, "").replace(/\"\);/, "");
            let newImgEle = document.createElement("img");
            newImgEle.src = imgSrc;
            newImgEle.style = "height: 60px; border: 1px solid #e8e8e8; margin-right: 10px;";
            img.remove();
            e.insertAdjacentElement('afterbegin', newImgEle);
        });
}
function getOriginUserInfoCard() {
    let mainContainer = document.getElementsByClassName("order-detail")[0];
    let leftCards = mainContainer.firstChild.firstChild.children;
    let cards = Array.from(leftCards).filter(e => e.getElementsByClassName("user-view-item").length > 0);

    return cards.length > 0 ? cards[0] : undefined;
}
function getOriginUserRatingCard() {
    let mainContainer = document.getElementsByClassName("order-detail")[0];
    let leftCards = mainContainer.firstChild.firstChild.children;
    let cards = Array.from(leftCards).filter(e => e.getElementsByClassName("cod-content").length > 0);

    return cards.length > 0 ? cards[0] : undefined;
}
function removeLeftUserInfoCard() {
    let mainContainer = document.getElementsByClassName("order-detail")[0];
    let leftCards = mainContainer.firstChild.firstChild.children;
    let buyerCard = getOriginUserInfoCard()
    if (buyerCard === undefined) {
      return undefined;
    }
    let buyerCardHTML = buyerCard.innerHTML;
    buyerCard.remove();
    return buyerCard;
}
function removeLeftUserRatingCard() {
    let mainContainer = document.getElementsByClassName("order-detail")[0];
    let leftCards = mainContainer.firstChild.firstChild.children;
    let buyerRatingCard = getOriginUserRatingCard();
    if (buyerRatingCard === undefined) {
      return undefined;
    }
    let buyerRatingCardHTML = buyerRatingCard.innerHTML;
    buyerRatingCard.remove();
    console.log(buyerRatingCard);
    return buyerRatingCard;
}
function onload() {
    let right = document.getElementsByClassName("od-history")[0];
    let buyerCard = removeLeftUserInfoCard();
    if (buyerCard === undefined) {
        return;
    }
    let rightBuyerInfoCard = right.insertAdjacentElement('afterbegin', buyerCard);
    resizeBuyerInfoCard();

    let buyerRatingCard = removeLeftUserRatingCard();
    if (buyerRatingCard !== undefined) {
        let rightBuyerRatingCard = rightBuyerInfoCard.insertAdjacentElement('afterend', buyerRatingCard);
        resizeBuyerRatingCard();
    }
    setTimeout(replaceProductImage, 1000);
}

setTimeout(onload, 2000);
