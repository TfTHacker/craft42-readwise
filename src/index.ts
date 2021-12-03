import "./style.css"
import {readwiseGetBookList, readwiseGetHighlightsByBookID} from "./readwiseStuff";

let button: HTMLButtonElement;
let inputReadwiseApiToken: HTMLInputElement;
let bookListDiv: HTMLDivElement;

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
  bookList.results.forEach((e : any) => {
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

window.addEventListener("load", async () => {
    button = <HTMLButtonElement> document.getElementById('btn-execute');
    inputReadwiseApiToken = <HTMLInputElement> document.getElementById("readwise-api-key")
    bookListDiv = <HTMLDivElement> document.getElementById("book-list");
    const rwToken = await craft.storageApi.get("readwiseToken");
    console.log("rwToken", rwToken);
    if (rwToken.status != "error" && rwToken.data != "") {
        inputReadwiseApiToken.value = rwToken.data;
        await listBooks();
    }

    button?.addEventListener("click", async () => {
        bookListDiv.innerHTML="";
        await listBooks()
    })

    inputReadwiseApiToken?.addEventListener("keyup", () => {
        craft.storageApi.put("readwiseToken", inputReadwiseApiToken.value)
    });
})

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
