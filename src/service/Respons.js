export class MyResponse {

    constructor(error, data) {
        this.error = error;
        this.data = data;
    }

    static buildNullDataErrorObj(error) {
        return new MyResponse(error, null);
    }

    getOutput() {
        return JSON.stringify(this);
    }
}