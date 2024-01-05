

export class Errors {

    static num = 1000;
    static ERROR_NO_ERROR = { 'ERR_NO': 0, 'ERR_MSG': 'SUCCESS' }
    static ERROR_PARAMTER_CHECK_FAILED = { 'ERR_NO': Errors.num++, 'ERR_MSG': 'Paramter check failed' }
    static ERROR_UER_EXIST = { 'ERR_NO': Errors.num++, 'ERR_MSG': 'User Existed' }
    static ERROR_UER_ADD_FAILED = { 'ERR_NO': Errors.num++, 'ERR_MSG': 'User Add Failed' }
    static ERROR_LOGIN_FAILED = { 'ERR_NO': Errors.num++, 'ERR_MSG': 'User Login Failed' }

    static customErrorObj(errorObj, msg) {
        var newObj = {};
        newObj.ERR_NO = errorObj.ERR_NO;
        newObj.ERR_MSG = msg;
        return newObj;
    }


    static parseValidationErrors(errors) {
        var msg = errors[0].location + "-" + errors[0].path + " : " + errors[0].msg
        var errorObj = this.customErrorObj(Errors.ERROR_PARAMTER_CHECK_FAILED, msg);
        return errorObj;
    }

}