define(["require", "exports", "tslib", "./readwiseStuff", "./style.css"], function (require, exports, tslib_1, readwiseStuff_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let btnRefreshHighlightList;
    let inputReadwiseApiToken;
    let bookListDiv;
    let buttonConfigureReadwise;
    let divSettingsWrapper;
    let lastBookListQuery;
    window.addEventListener("load", () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        btnRefreshHighlightList = document.getElementById('btn-execute');
        inputReadwiseApiToken = document.getElementById("readwise-api-key");
        bookListDiv = document.getElementById("book-list");
        buttonConfigureReadwise = document.getElementById("btn-configure-readwise");
        divSettingsWrapper = document.getElementById("config-readwise-setings");
        // prepare event handlers
        btnRefreshHighlightList === null || btnRefreshHighlightList === void 0 ? void 0 : btnRefreshHighlightList.addEventListener("click", () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            bookListDiv.innerHTML = "";
            yield listBooks();
        }));
        inputReadwiseApiToken === null || inputReadwiseApiToken === void 0 ? void 0 : inputReadwiseApiToken.addEventListener("keyup", () => {
            craft.storageApi.put("readwiseToken", inputReadwiseApiToken.value);
            if (inputReadwiseApiToken.value.trim() === "") {
                btnRefreshHighlightList.style.display = "";
                divSettingsWrapper.style.display = "inline";
            }
        });
        buttonConfigureReadwise === null || buttonConfigureReadwise === void 0 ? void 0 : buttonConfigureReadwise.addEventListener("click", () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            divSettingsWrapper.style.display = divSettingsWrapper.style.display === "" ? "inline" : "";
            bookListDiv.innerHTML = "";
            bookListDiv.style.height = "0px";
            btnRefreshHighlightList.style.visibility = "hidden";
            if (inputReadwiseApiToken.value.trim() != "")
                btnRefreshHighlightList.style.display = "inline";
            if (divSettingsWrapper.style.display === "") {
                bookListDiv.innerHTML = "";
                bookListDiv.style.height = "520px";
                btnRefreshHighlightList.style.visibility = "visible";
            }
        }));
        // initialize UI
        const rwToken = yield craft.storageApi.get("readwiseToken");
        if (rwToken.status != "error" && rwToken.data != "") {
            inputReadwiseApiToken.value = rwToken.data;
            btnRefreshHighlightList.style.display = "inline";
            yield listBooks();
        }
        else {
            divSettingsWrapper.style.display = "inline";
            bookListDiv.style.height = "0px";
        }
    }));
    const insertHighlights = (id) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const rwToken = yield craft.storageApi.get("readwiseToken");
        const highlights = yield (0, readwiseStuff_1.readwiseGetHighlightsByBookID)(rwToken.data, id);
        console.log(lastBookListQuery.find((b) => b.id = id));
        let output = [];
        output.push(craft.blockFactory.horizontalLineBlock({ lineStyle: "light" }));
        const bulletStyle = craft.blockFactory.defaultListStyle("bullet");
        const allHighlights = highlights.results.map((h) => {
            return craft.blockFactory.textBlock({
                listStyle: bulletStyle,
                content: [
                    { text: h.text + " " },
                    { text: "link", link: { type: "url", url: `https://readwise.io/open/${h.id}` } }
                ]
            });
        });
        output.push(allHighlights);
        output.push(craft.blockFactory.horizontalLineBlock({ lineStyle: "light" }));
        craft.dataApi.addBlocks(output);
    });
    const listBooks = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const rwToken = yield craft.storageApi.get("readwiseToken");
        lastBookListQuery = yield (0, readwiseStuff_1.readwiseGetBookList)(rwToken.data);
        let output = "";
        if (lastBookListQuery === null) {
            bookListDiv.innerHTML = "Information could not be retrieved from Readwise. Please verify the Readwise Access Token.";
            return;
        }
        lastBookListQuery.forEach((e) => {
            if (e.num_highlights === 0)
                return;
            output += `<div class="ReadWiseBook"  style="padding-bottom:4px; width=230px; display: flex; border-top-style:dashed; border-top-width:1px; padding-top:5px">
            <span style="width:45px;padding-left:5px;"><img src="${e.cover_image_url}" width="45px"></span>
              <span style="width:100px;padding-left:5px"">
                <div >${e.title} (${e.num_highlights})</div>
                <div>${e.author}</div>
              </span>
              <span><img class="btn-insert-highlights" id="${e.id}" src="https://readwise-assets.s3.amazonaws.com/static/images/new_icons/import.30df72e7b737.svg"></span>                 
            </div>`;
        });
        bookListDiv.innerHTML = output;
        document.querySelectorAll(".btn-insert-highlights").forEach((i) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            i.addEventListener("click", (e) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () { return yield insertHighlights(i.id); }));
        }));
    });
    craft.env.setListener((env) => {
        switch (env.colorScheme) {
            case "dark":
                document.body.classList.add("dark");
                break;
            case "light":
                document.body.classList.remove("dark");
                break;
        }
    });
});