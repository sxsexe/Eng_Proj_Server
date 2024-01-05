export class MyResponse {

    constructor(error, data) {
        this.error = error;
        this.data = data;
    }

    getOutput() {
        return JSON.stringify(this);
    }
}