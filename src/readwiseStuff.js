define(["require", "exports", "tslib"], function (require, exports, tslib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readwiseGetBookDetails = exports.readwiseGetHighlightsByBookID = exports.readwiseGetBookList = void 0;
    const readwiseGetBookList = (rwToken) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        try {
            const bookList = yield fetch('https://readwise.io/api/v2/books/?page_size=1000', {
                headers: {
                    "Authorization": "Token " + rwToken
                }
            });
            // sort by date, newest to oldest
            return (yield bookList.json()).results.sort((a, b) => {
                const c = new Date(a.last_highlight_at).getTime();
                const d = new Date(b.last_highlight_at).getTime();
                return d - c;
            });
        }
        catch (error) {
            return null;
        }
    });
    exports.readwiseGetBookList = readwiseGetBookList;
    const readwiseGetHighlightsByBookID = (rwToken, bookId) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const highlightList = yield fetch(`https://readwise.io/api/v2/highlights/?book_id=${bookId}`, {
            headers: {
                "Authorization": "Token " + rwToken,
            }
        });
        return yield highlightList.json();
    });
    exports.readwiseGetHighlightsByBookID = readwiseGetHighlightsByBookID;
    const readwiseGetBookDetails = (rwToken, bookId) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const highlightList = yield fetch(`https://readwise.io/api/v2/highlights/?book_id=${bookId}`, {
            headers: {
                "Authorization": "Token " + rwToken,
            }
        });
        return yield highlightList.json();
    });
    exports.readwiseGetBookDetails = readwiseGetBookDetails;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZHdpc2VTdHVmZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlYWR3aXNlU3R1ZmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUFPLE1BQU0sbUJBQW1CLEdBQUcsQ0FBTyxPQUFnQixFQUFFLEVBQUU7UUFDMUQsSUFBSTtZQUNBLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLGtEQUFrRCxFQUFFO2dCQUM3RSxPQUFPLEVBQUU7b0JBQ0wsZUFBZSxFQUFFLFFBQVEsR0FBRyxPQUFPO2lCQUN0QzthQUNKLENBQUMsQ0FBQTtZQUNGLGlDQUFpQztZQUNqQyxPQUFPLENBQUMsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBSyxFQUFDLENBQUssRUFBQyxFQUFFO2dCQUN4RCxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztTQUNOO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQyxDQUFBLENBQUE7SUFoQlksUUFBQSxtQkFBbUIsdUJBZ0IvQjtJQUdNLE1BQU0sNkJBQTZCLEdBQUcsQ0FBTyxPQUFnQixFQUFFLE1BQWMsRUFBRSxFQUFFO1FBQ3BGLE1BQU0sYUFBYSxHQUFHLE1BQU0sS0FBSyxDQUFDLGtEQUFrRCxNQUFNLEVBQUUsRUFBRTtZQUMxRixPQUFPLEVBQUU7Z0JBQ0wsZUFBZSxFQUFFLFFBQVEsR0FBRyxPQUFPO2FBQ3RDO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QyxDQUFDLENBQUEsQ0FBQTtJQVBZLFFBQUEsNkJBQTZCLGlDQU96QztJQUdNLE1BQU0sc0JBQXNCLEdBQUUsQ0FBTyxPQUFnQixFQUFFLE1BQWMsRUFBRSxFQUFFO1FBQzVFLE1BQU0sYUFBYSxHQUFHLE1BQU0sS0FBSyxDQUFDLGtEQUFrRCxNQUFNLEVBQUUsRUFBRTtZQUMxRixPQUFPLEVBQUU7Z0JBQ0wsZUFBZSxFQUFFLFFBQVEsR0FBRyxPQUFPO2FBQ3RDO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QyxDQUFDLENBQUEsQ0FBQTtJQVBZLFFBQUEsc0JBQXNCLDBCQU9sQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCByZWFkd2lzZUdldEJvb2tMaXN0ID0gYXN5bmMgKHJ3VG9rZW4gOiBzdHJpbmcpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYm9va0xpc3QgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9yZWFkd2lzZS5pby9hcGkvdjIvYm9va3MvP3BhZ2Vfc2l6ZT0xMDAwJywge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJUb2tlbiBcIiArIHJ3VG9rZW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gc29ydCBieSBkYXRlLCBuZXdlc3QgdG8gb2xkZXN0XHJcbiAgICAgICAgcmV0dXJuIChhd2FpdCBib29rTGlzdC5qc29uKCkpLnJlc3VsdHMuc29ydCggKGE6YW55LGI6YW55KT0+e1xyXG4gICAgICAgICAgICBjb25zdCBjID0gbmV3IERhdGUoYS5sYXN0X2hpZ2hsaWdodF9hdCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoYi5sYXN0X2hpZ2hsaWdodF9hdCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZCAtIGM7XHJcbiAgICAgICAgfSk7ICAgICAgICAgICAgXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlYWR3aXNlR2V0SGlnaGxpZ2h0c0J5Qm9va0lEID0gYXN5bmMgKHJ3VG9rZW4gOiBzdHJpbmcsIGJvb2tJZDogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBoaWdobGlnaHRMaXN0ID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vcmVhZHdpc2UuaW8vYXBpL3YyL2hpZ2hsaWdodHMvP2Jvb2tfaWQ9JHtib29rSWR9YCwge1xyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiVG9rZW4gXCIgKyByd1Rva2VuLCBcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhd2FpdCBoaWdobGlnaHRMaXN0Lmpzb24oKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWFkd2lzZUdldEJvb2tEZXRhaWxzPSBhc3luYyAocndUb2tlbiA6IHN0cmluZywgYm9va0lkOiBzdHJpbmcpID0+IHtcclxuICAgIGNvbnN0IGhpZ2hsaWdodExpc3QgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9yZWFkd2lzZS5pby9hcGkvdjIvaGlnaGxpZ2h0cy8/Ym9va19pZD0ke2Jvb2tJZH1gLCB7XHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJUb2tlbiBcIiArIHJ3VG9rZW4sIFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGF3YWl0IGhpZ2hsaWdodExpc3QuanNvbigpO1xyXG59XHJcbiJdfQ==