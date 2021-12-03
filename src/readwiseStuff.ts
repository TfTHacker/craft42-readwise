export const readwiseGetBookList = async (rwToken : string) => {
    const bookList = await fetch('https://readwise.io/api/v2/books/?page_size=1000', {
        headers: {
            "Authorization": "Token " + rwToken
        }
    });
    return await bookList.json();
}


export const readwiseGetHighlightsByBookID = async (rwToken : string, bookId: string) => {
    const highlightList = await fetch(`https://readwise.io/api/v2/highlights/?book_id=${bookId}`, {
        headers: {
            "Authorization": "Token " + rwToken, 
        }
    });
    return await highlightList.json();
}

