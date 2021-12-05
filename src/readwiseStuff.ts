/**
 * 
 * List of last 1000 books highlighted in Readwise
 * 
 * @param rwToken Access token for api call
 * @returns list of last 1000 items from readwise
 */
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

/**
 * 
 * Retrieves all highlights for a given  document 
 * 
 * @param rwToken Access token for api call
 * @param bookId  Retrieve highlights  for this  book ID
 * @returns array of highlights
 */
export const readwiseGetHighlightsByBookID = async (rwToken : string, bookId: string) => {
    const highlightList = await fetch(`https://readwise.io/api/v2/highlights/?book_id=${bookId}`, {
        headers: {
            "Authorization": "Token " + rwToken, 
        }
    });
    return await highlightList.json();
}


/**
 * 
 * Gets detailed information on a document by its book id
 * 
 * @param rwToken Access token for api call
 * @param bookId  Retrieve highlights  for this  book ID
 * @returns details of a document
 */
export const readwiseGetBookDetails= async (rwToken : string, bookId: string) => {
    const highlightList = await fetch(`https://readwise.io/api/v2/highlights/?book_id=${bookId}`, {
        headers: {
            "Authorization": "Token " + rwToken, 
        }
    });
    return await highlightList.json();
}


/**
 * 
 * generates a random number
 * 
 * @param max highest number
 * @returns number
 */
function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}


/**
 * 
 * Grabs a random highlight from readwise
 * 
 * @param rwToken Access token for api call
 * @returns 
 */
export const readwiseGetRandomHighlight =async (rwToken : string) => {
    const highlights = await fetch(`https://readwise.io/api/v2/highlights/?page_size=500`, {
        headers: {
            "Authorization": "Token " + rwToken, 
        }
    });
    const respone = await highlights.json();
	const randomIndex = getRandomInt(respone.results.length);
	return respone.results[randomIndex];
}

