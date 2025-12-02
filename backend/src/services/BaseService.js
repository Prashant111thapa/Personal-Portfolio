class BaseService {
    static validateIDParam(res, idParam, paramName="ID") {
        const id = parseInt(idParam);

        if(!id || isNaN(id) || id < 1){
            return res.status(400).json({ success: false, message: `Invalid ${paramName}`});
        }
        return id;
    }
}

export default BaseService;