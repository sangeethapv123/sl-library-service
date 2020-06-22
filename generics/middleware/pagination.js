/**
 * name : middleware/pagination.js
 * author : Rakesh Kumar 
 * Date : 17-June-2020
 * Description : Pagination
 */

module.exports = (req, res, next) => {
    if (req.method == "GET") {
        req.pageNo = (req.query.page && Number(req.query.page) > 0) 
        ? Number(req.query.page) : 1;

        req.pageSize = (req.query.limit && Number(req.query.limit) > 0 && 
        Number(req.query.limit) <= 100) ? 
        Number(req.query.limit) : 100;

        req.searchText = (req.query.search && req.query.search != "") 
        ? decodeURI(req.query.search) : "";
        
        delete req.query.page;
        delete req.query.limit;
    }

    next();
    return;
}


