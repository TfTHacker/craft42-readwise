import "./style.css"
import {readwiseGetBookList, readwiseGetHighlightsByBookID} from "./readwiseStuff";
import { CraftBlockInsert, CraftImageBlockInsert } from "@craftdocs/craft-extension-api"

let btnRefreshHighlightList: HTMLButtonElement;
let inputReadwiseApiToken: HTMLInputElement;
let bookListDiv: HTMLDivElement;
let buttonConfigureReadwise: HTMLImageElement;
let divSettingsWrapper: HTMLDivElement;
let lastBookListQuery: any;

window.addEventListener("load", async () => {
  await initializeUI();
})

const initializeUI = async ()=> {
  btnRefreshHighlightList = <HTMLButtonElement> document.getElementById('btn-execute');
  inputReadwiseApiToken = <HTMLInputElement> document.getElementById("readwise-api-key")
  bookListDiv = <HTMLDivElement> document.getElementById("book-list");
  buttonConfigureReadwise = <HTMLImageElement> document.getElementById("btn-configure-readwise");
  divSettingsWrapper = <HTMLDivElement> document.getElementById("config-readwise-setings");

  // prepare event handlers
  btnRefreshHighlightList?.addEventListener("click", async () => {
      bookListDiv.innerHTML="";
      await listBooks()
  });

  inputReadwiseApiToken?.addEventListener("keyup", () => {
      craft.storageApi.put("readwiseToken", inputReadwiseApiToken.value)
      if(inputReadwiseApiToken.value.trim()==="") {
        btnRefreshHighlightList.style.display="";
        divSettingsWrapper.style.display="inline";
      }
  });

  buttonConfigureReadwise?.addEventListener("click", async () => {
    divSettingsWrapper.style.display = divSettingsWrapper.style.display==="" ? "inline" : "";
    bookListDiv.innerHTML = "";
    bookListDiv.style.height="0px";
    btnRefreshHighlightList.style.visibility="hidden";
    if(inputReadwiseApiToken.value.trim()!="") btnRefreshHighlightList.style.display="inline";
    if(divSettingsWrapper.style.display==="") {
      bookListDiv.innerHTML = "";
      bookListDiv.style.height="500px";
      btnRefreshHighlightList.style.visibility="visible";
    }
  });

  // initialize UI
  const rwToken = await craft.storageApi.get("readwiseToken");
  if (rwToken.status != "error" && rwToken.data != "") {
      inputReadwiseApiToken.value = rwToken.data;
      btnRefreshHighlightList.style.display = "inline";
      await listBooks();
  } else {
    divSettingsWrapper.style.display = "inline";
    bookListDiv.style.height="0px";
  }
}

const insertHighlights = async (id : string) => {
  const rwToken = await craft.storageApi.get("readwiseToken");
  const highlights =  await readwiseGetHighlightsByBookID(<string> rwToken.data, id);
  const bookInfo = lastBookListQuery.find((b:any)=> b.id.toString() === id );
  let output: CraftBlockInsert[] = [];
  if(bookInfo.title) 
    output.push( { type: "textBlock",  content: bookInfo.title, style: { textStyle: "title"} } );

  if(bookInfo.author) 
    output.push( { type: "textBlock",  content: [ { text: "Author:", isBold: true}, {text: " " + bookInfo.author}]} );

  if(bookInfo.category) 
    output.push( { type: "textBlock",  content: [ { text: "Category:", isBold: true}, {text: " " + bookInfo.category}]} );

  if(bookInfo.source_url) 
    output.push( { type: "textBlock",  content: [ { text: "Source: ", isBold: true}, 
                 { text: bookInfo.source_url,  link: {type: "url", url: bookInfo.source_url} }] });

  if(bookInfo.tags.length>0) 
      output.push( { type: "textBlock", content: [ { text: "Tags:", isBold: true}, {text: " " + bookInfo.tags.join(" ")}]} );

  output.push( { type: "textBlock",  content: [ { text: "Import Date:", isBold: true}, {text: " " + (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString() }]} );

  if(bookInfo.last_highlight_at && bookInfo.last_highlight_at != "")
    output.push( { type: "textBlock",  content: [ { text: "Last Highlight Date:", isBold: true}, {text: " " + (new Date()).toLocaleDateString() + " " + (new Date(bookInfo.last_highlight_at)).toLocaleTimeString() }]} );

  output.push( { type: "textBlock",  content: [{ text: `Highlights (${bookInfo.num_highlights})`, isBold: true}],  listStyle: { type: "toggle"} } );

  const bulletStyle = craft.blockFactory.defaultListStyle("bullet");
  const allHighlights = highlights.results.forEach( (h:any) => {
    output.push( 
      craft.blockFactory.textBlock({
        listStyle: bulletStyle,
        indentationLevel: 1,
        content: [
          { text: h.text + " " },
          { text: "link", link: { type: "url", url: `https://readwise.io/open/${h.id}` } }
        ]
      })
    );
  });
  craft.dataApi.addBlocks( output );
}

const listBooks = async () => {
  const rwToken = await craft.storageApi.get("readwiseToken");
  lastBookListQuery = await readwiseGetBookList(<string>rwToken.data)
  let output = "";
  if(lastBookListQuery===null) {
    bookListDiv.innerHTML="Information could not be retrieved from Readwise. Please verify the Readwise Access Token."
    return;
  }
  lastBookListQuery.forEach((e : any) => {
    if(e.num_highlights===0) return;
    output += `<div class="readwise-book-container">
            <span class="book-images-wrapper"><img class="book-images" src="${e.cover_image_url}"></span>
              <span class="book-info">
                <div>${e.title} (${e.num_highlights})</div>
                <div>${e.author}</div>
              </span>
              <span><img class="btn-insert-highlights" id="${e.id}" src="https://readwise-assets.s3.amazonaws.com/static/images/new_icons/import.30df72e7b737.svg"></span>                 
            </div>`;
  });
  bookListDiv.innerHTML = output;
  document.querySelectorAll(".btn-insert-highlights").forEach(async (i) => {
      i.addEventListener("click", async (e) => await insertHighlights(i.id) );
  });
}

craft.env.setListener((env) => {
    switch (env.colorScheme) {
        case "dark":
            document.body.classList.add("dark");
            break;
        case "light":
            document.body.classList.remove("dark");
            break;
    }
})
