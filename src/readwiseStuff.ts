export const readwiseGetBookList = async (rwToken : string) => {
    try {
        const bookList = await fetch('https://readwise.io/api/v2/books/?page_size=1000', {
            headers: {
                "Authorization": "Token " + rwToken
            }
        })
        // sort by date, newest to oldest
        return (await bookList.json()).results.sort( (a:any,b:any)=>{
            const c = new Date(a.last_highlight_at).getTime();
            const d = new Date(b.last_highlight_at).getTime();
            return d - c;
        });            
    } catch (error) {
        return null;
    }
}


export const readwiseGetHighlightsByBookID = async (rwToken : string, bookId: string) => {
    const highlightList = await fetch(`https://readwise.io/api/v2/highlights/?book_id=${bookId}`, {
        headers: {
            "Authorization": "Token " + rwToken, 
        }
    });
    return await highlightList.json();
}


export const readwiseGetBookDetails= async (rwToken : string, bookId: string) => {
    const highlightList = await fetch(`https://readwise.io/api/v2/highlights/?book_id=${bookId}`, {
        headers: {
            "Authorization": "Token " + rwToken, 
        }
    });
    return await highlightList.json();
}
