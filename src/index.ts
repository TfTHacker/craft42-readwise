import "./style.css"
import {readwiseGetBookList, readwiseGetHighlightsByBookID} from "./readwiseStuff";

let btnRefreshHighlightList: HTMLButtonElement;
let inputReadwiseApiToken: HTMLInputElement;
let bookListDiv: HTMLDivElement;
let buttonConfigureReadwise: HTMLImageElement;
let divSettingsWrapper: HTMLDivElement;


window.addEventListener("load", async () => {
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
    if(inputReadwiseApiToken.value.trim()!="") btnRefreshHighlightList.style.display="inline";
    if(divSettingsWrapper.style.display!="inline") await listBooks();
  });

  // initialize UI
  const rwToken = await craft.storageApi.get("readwiseToken");
  console.log("rwToken", rwToken);
  if (rwToken.status != "error" && rwToken.data != "") {
      inputReadwiseApiToken.value = rwToken.data;
      btnRefreshHighlightList.style.display = "inline";
      await listBooks();
  } else {
    divSettingsWrapper.style.display = "inline";
  }

})

const insertHighlights = async (id : string) => {
  const rwToken = await craft.storageApi.get("readwiseToken");
  const highlights =  await readwiseGetHighlightsByBookID(<string> rwToken.data, id);

  craft.dataApi.addBlocks( [ craft.blockFactory.horizontalLineBlock({lineStyle:"light"}) ]);
  const bulletStyle = craft.blockFactory.defaultListStyle("bullet");
  const allHighlights = highlights.results.map( (h:any) => {
    console.log(h)
    return craft.blockFactory.textBlock({
      listStyle: bulletStyle,
      content: [
        { text: h.text + " " },
        { text: "link", link: { type: "url", url: `https://readwise.io/open/${h.id}` } }
      ]
    });
  });
  craft.dataApi.addBlocks(allHighlights);
  craft.dataApi.addBlocks( [ craft.blockFactory.horizontalLineBlock({lineStyle:"light"}) ]);
}

const listBooks = async () => {
  const rwToken = await craft.storageApi.get("readwiseToken");
  const bookList = await readwiseGetBookList(<string>rwToken.data)
  let output = "";
  bookList.forEach((e : any) => {
    if(e.num_highlights===0) return;
    output += `<div class="ReadWiseBook" id="${e.id}" style="width=250px; display: flex; border-top-style:dashed; border-top-width:1px; padding-top:5px">
              <span style="width:50px"><img src="${e.cover_image_url}" width="45px"></span>
              <span style="width:195px;padding-left:5px"">
                <div >${e.title} (${e.num_highlights})</div>
                <div>${e.author}</div>
              </span>                  
            </div>`;
  });
  bookListDiv.innerHTML = output;
  document.querySelectorAll(".ReadWiseBook").forEach(async (i) => {
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
