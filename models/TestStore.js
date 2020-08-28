import { observable, action } from "mobx";

export default class TestStore {
    @observable count;
    constructor(initDataObj = {}){
        this.count = initDataObj?.count || 1;
    }
    @action addCount() {
        this.count = ++this.count;
    }
    @action reduceCount(){
        this.count = --this.count;
    }
}