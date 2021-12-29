import "./style.css"
import {readwiseGetBookList, readwiseGetHighlightsByBookID, readwiseGetRandomHighlight} from "./readwiseStuff";
import { CraftBlockInsert, CraftImageBlockInsert } from "@craftdocs/craft-extension-api"

let divBookList: HTMLDivElement;
let divToolbarLower: HTMLDivElement;
let btnRandomHighlight: HTMLButtonElement;
let btnRefreshHighlightList: HTMLButtonElement;
let btnConfigureReadwise: HTMLImageElement;
let divSettingsWrapper: HTMLDivElement;
let inputReadwiseApiToken: HTMLInputElement;
let btnSaveConfig: HTMLDivElement;
let lastBookListQuery: any;

window.addEventListener("load", async () => {
  await initializeUI();
})


/**
 * Generates the UI for the widget
 */
const initializeUI = async ()=> {
  divBookList = <HTMLDivElement> document.getElementById("book-list");
  divToolbarLower = <HTMLDivElement> document.getElementById("toolbar-lower");
  btnRandomHighlight = <HTMLButtonElement> document.getElementById('btn-random-highlight');
  btnRefreshHighlightList = <HTMLButtonElement> document.getElementById('btn-refresh-highlights');
  btnConfigureReadwise = <HTMLImageElement> document.getElementById("btn-configure-readwise");
  divSettingsWrapper = <HTMLDivElement> document.getElementById("config-readwise-setings");
  inputReadwiseApiToken = <HTMLInputElement> document.getElementById("readwise-api-key")
  btnSaveConfig = <HTMLDivElement> document.getElementById("btn-save-config");

  pleaseWaitLoadingHighlights();

  // prepare event handlers
  btnRandomHighlight.addEventListener("click", async ()=> await insertRandomHighlight() );

  btnRefreshHighlightList.addEventListener("click", async () => {
      divBookList.innerHTML="";
      await listBooks()
  });

  inputReadwiseApiToken?.addEventListener("keyup", () => {
      craft.storageApi.put("readwiseToken", inputReadwiseApiToken.value)
      if(inputReadwiseApiToken.value.trim()==="") {
        btnRefreshHighlightList.style.display="";
        divSettingsWrapper.style.display="inline";
      }
  });

  btnSaveConfig.addEventListener("click", async ()=> await toggleSettingsOnOff());
  
  btnConfigureReadwise.addEventListener("click", async ()=> await toggleSettingsOnOff());

  // initialize UI
  const rwToken = await craft.storageApi.get("readwiseToken");
  if (rwToken.status != "error" && rwToken.data != "") {
      inputReadwiseApiToken.value = rwToken.data;
      btnRefreshHighlightList.style.display = "inline";
      await listBooks();
  } else {
    divToolbarLower.style.visibility="hidden";
    divSettingsWrapper.style.display = "inline";
    divBookList.style.height="0px";
  }
}

/**
 * Displays the settings area or hides it
 */
const toggleSettingsOnOff = async ()=> {
  divSettingsWrapper.style.display = divSettingsWrapper.style.display==="" ? "inline" : "";
  divBookList.style.height="0px";
  if(divSettingsWrapper.style.display==="") {
    divBookList.innerHTML = "";
    divBookList.style.height="500px";
    divToolbarLower.style.visibility="visible";
    await listBooks();
  }  else {
    divToolbarLower.style.visibility="hidden";
  }
  if(inputReadwiseApiToken.value.trim()!="") btnRefreshHighlightList.style.display="inline";
}

/**
 * Message displayed in the book list area while loading books
 */
const pleaseWaitLoadingHighlights = ()=>{
  divBookList.innerHTML=`<div style="padding:20px;padding-top:50px">Please wait, loading highlights ...</div>`;
}

/**
 * Inserts into craft a random highlight from Readwise
 */
const insertRandomHighlight = async ()=>  {
  const rwToken = await craft.storageApi.get("readwiseToken");
  const highlight = await readwiseGetRandomHighlight(<string> rwToken.data);
  const bookInfo = lastBookListQuery.find((b:any)=> b.id.toString() === highlight.book_id.toString() );
  craft.dataApi.addBlocks([{
    type: "textBlock",
    hasFocusDecoration: true,
    content: [
      { text: highlight.text },
      { text: " - " },
      { text: bookInfo.title, isItalic:true, link: { 
        type: "url", 
        url: (highlight.url != null ? highlight.url : (bookInfo.source_url!=null ? bookInfo.source_url : `https://readwise.io/open/${highlight.id}`) )
      }},
      { text:  " by " + bookInfo.author + "", isItalic:true},
    ]
  },
  { type: "textBlock", content: ""}
]);
}

/**
 * 
 * Grabs all highlights for a book  and inserts them into Craft
 * 
 * @param bookId ID of the document to retrieve highlights for
 * 
 */
const insertHighlights = async (bookId : string) => {
  const rwToken = await craft.storageApi.get("readwiseToken");
  const highlights =  await readwiseGetHighlightsByBookID(<string> rwToken.data, bookId);
  const bookInfo = lastBookListQuery.find((b:any)=> b.id.toString() === bookId );
  let output: CraftBlockInsert[] = [];
  if(bookInfo.title) 
    output.push( { type: "textBlock",  content: bookInfo.title, style: { textStyle: "title"} } );

  console.log(bookInfo)
  if(bookInfo.cover_image_url) 
    output.push( { type: "imageBlock",  url: bookInfo.cover_image_url } );

  if(bookInfo.author) 
    output.push( { type: "textBlock",  content: [ { text: "Author:", isBold: true}, {text: " " + bookInfo.author}]} );

  if(bookInfo.category) 
    output.push( { type: "textBlock",  content: [ { text: "Category:", isBold: true}, {text: " " + bookInfo.category}]} );

  if(bookInfo.source_url) 
    output.push( { type: "textBlock",  content: [ { text: "Source: ", isBold: true}, 
                 { text: bookInfo.source_url,  link: {type: "url", url: bookInfo.source_url} }] });

  if(bookInfo.tags.length>0) {    
    const tags = bookInfo.tags.map((t:any)=> "#" + t.name).join(" ");
    output.push( { type: "textBlock", content: [ { text: "Tags:", isBold: true}, {text: " " + tags}]} );
  }
  output.push( { type: "textBlock",  content: [ { text: "Import Date:", isBold: true}, {text: " " + (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString() }]} );

  if(bookInfo.last_highlight_at && bookInfo.last_highlight_at != "")
    output.push( { type: "textBlock",  content: [ { text: "Last Highlight Date:", isBold: true}, {text: " " + (new Date(bookInfo.last_highlight_at)).toLocaleDateString() + " " + (new Date(bookInfo.last_highlight_at)).toLocaleTimeString() }]} );

  output.push( { type: "textBlock",  content: [{ text: `Highlights (${bookInfo.num_highlights})`, isBold: true}],  listStyle: { type: "toggle"} } );

  const bulletStyle = craft.blockFactory.defaultListStyle("bullet");
  console.log(highlights.results);
  const allHighlights = highlights.results.reverse().forEach( (highlight:any) => {
    output.push( 
      craft.blockFactory.textBlock({
        listStyle: bulletStyle,
        indentationLevel: 1,
        content: [
          { text: highlight.text + " " },
          { text: "link", link: { type: "url",
            url:  (highlight.url != null ? highlight.url : (bookInfo.source_url!=null ? bookInfo.source_url : `https://readwise.io/open/${highlight.id}`)) }
          }
        ]
      })
    );
    if(highlight.note!="") 
      output.push( craft.blockFactory.textBlock({ listStyle: bulletStyle, indentationLevel: 2, content: [{text: `Notes: ${highlight.note}`}] }) );
    if(highlight.tags.length>0) { 
      const tags = highlight.tags.map((t:any)=> "#" + t.name).join(" ");
      output.push( craft.blockFactory.textBlock({ listStyle: bulletStyle, indentationLevel: 2, content: [{text: `Tags: ${tags}`}] }) );
    }
  });
  craft.dataApi.addBlocks( output );
}

const listBooks = async () => {
  pleaseWaitLoadingHighlights();
  const rwToken = await craft.storageApi.get("readwiseToken");
  lastBookListQuery = await readwiseGetBookList(<string>rwToken.data)
  let output = "";
  if(lastBookListQuery===null) {
    divBookList.innerHTML="Information could not be retrieved from Readwise. Please verify the Readwise Access Token."
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
  divBookList.innerHTML = output;
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
