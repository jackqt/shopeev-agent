// ==UserScript==
// @name         Shopeev-Agent
// @namespace    https://github.com/jackqt/shopeev-agent
// @version      0.4
// @description  Agent run in shopee admin console to collect data
// @author       Jack Qingtian<jack.coder@outlook.com>
// @match        https://seller.shopee.cn/portal/sale/shipment*
// @icon         https://www.google.com/s2/favicons?domain=shopee.cn
// @grant        none
// ==/UserScript==

const SIDEBAR_MENU_ID = 'orderList';
const SIDEBAR_MENU_NAME = '订单列表';

(function() {
    'use strict';
    let btnCheckingTimeout = undefined;
    let currentURL = undefined;

    async function setClipboard() {
        let container = document.getElementById("exportContainer");
        let text = container.childNodes[0].value;
        try {
            await navigator.clipboard.writeText(text);
            alert("Save to Clipboard");
        } catch (err) {
            alert("Failed to Clipboard");
        };
    }
    function currentSiteName() {
        let shop = document.getElementsByClassName("shop-select")
        let site = shop[0].firstChild.firstChild.textContent.split(".")[1]
        return site.toUpperCase();
    }

    function allOrderElements() {
        let listdom = document.getElementsByClassName("shipemnt-list-item-container")[0]
        return listdom.childNodes
    }

    function formatTableRow(dateStr, site, orderNo, pageLink) {
        let linkTemp = `=HYPERLINK("${pageLink}","${orderNo}")`
        return [dateStr, "	", site, "	", linkTemp].join("")
    }

    function currentDate(orderNo) {
        let month = parseInt(orderNo.substr(2,2))
        let date = parseInt(orderNo.substr(4,2))
        return [month, "月", date, "日"].join("");
    }
    function toggleDialog() {
        let ele = document.getElementById("exportDialog");
        ele.parentElement.removeChild(ele);
    }
    function showDialog(text) {
        let dialogEle = document.createElement("div");
        dialogEle.id = "exportDialog";
        dialogEle.style = "position: absolute; z-index: 999; width: 80%; height: 500px; top: 100px; left: 100px; background-color: #fff; border: 1px solid gray; border-radius: 5px; padding: 20px;";

        let header = document.createElement("div");
        header.style = "line-height: 24px; margin-bottom: 8px; font-size: 22px; font-weight: 500; font-weight: var(--font-weight);";
        header.textContent = "Export Data";
        dialogEle.append(header);

        let contentContainer = document.createElement("div");
        contentContainer.style = "height: 400px;"
        contentContainer.id = "exportContainer";
        let dialogContent = document.createElement("textarea");
        dialogContent.style = "white-space: break-spaces; height: 95%; width: 100%;"
        dialogContent.value = text;
        contentContainer.append(dialogContent);
        dialogEle.append(contentContainer);

        let btnGroup = document.createElement("div");
        btnGroup.style = "width: 100%; text-align: center;";

        let closeBtn = document.createElement("button");
        closeBtn.id = "exportCloseBtn";
        closeBtn.type = "button";
        closeBtn.style = "margin: 0px 5px;";
        closeBtn.className = "ship-btn shopee-button shopee-button--large";
        closeBtn.onclick = toggleDialog;
        let closeBtnContent = document.createElement("span");
        closeBtnContent.textContent = "Close";
        closeBtn.append(closeBtnContent);
        btnGroup.append(closeBtn);

        let saveBtn = document.createElement("button");
        saveBtn.id = "saveExportBtn";
        saveBtn.type = "button";
        saveBtn.style = "margin: 0px 5px;";
        saveBtn.className = "ship-btn shopee-button shopee-button--primary shopee-button--large";
        saveBtn.onclick = setClipboard;
        let saveBtnContent = document.createElement("span");
        saveBtnContent = "Save To Clipboard";
        saveBtn.append(saveBtnContent);
        btnGroup.append(saveBtn);

        dialogEle.append(btnGroup);

        let parentEle = document.getElementsByTagName("body")[0];
        parentEle.appendChild(dialogEle);
    }

    function exportAction() {
        let result = ""
        allOrderElements()
            .forEach((order) => {
            let site = currentSiteName()
            let orderNo = order.getElementsByClassName("order-sn")[0].textContent.split(" ")[1].trim()
            let link = order.href
            let date = currentDate(orderNo)

            result += formatTableRow(date, site, orderNo, link) + "\n"
        });
        showDialog(result);
    }
    function initExportButton() {
        let root = document.getElementsByClassName("tab-buttons");
        if (root.length === 0) {
            return undefined;
        }
        let btn = document.createElement("button");
        btn.id = "exportData";
        btn.style = "margin-left: 16px"
        btn.className = "ship-btn shopee-button shopee-button--dashed shopee-button--large"
        btn.type = "button"
        btn.onclick = exportAction;
        let btnContent = document.createElement("span");
        btnContent.textContent = "Export Order";
        btn.append(btnContent);

        let btnGroup = root[0];
        btnGroup.appendChild(btn);
    }
    function main() {
        if (currentURL === undefined || currentURL !== window.location.href) {
            console.log("Init Button: Export Order");
            initExportButton();
            currentURL = window.location.href;
        }

        clearTimeout(btnCheckingTimeout);
        btnCheckingTimeout = setTimeout(main, 5000);
    }
    btnCheckingTimeout = setTimeout(main, 5000);
})();

