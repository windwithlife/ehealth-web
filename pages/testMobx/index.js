import React from "react";
import {observer, inject} from 'mobx-react'

@inject("testStore")
@observer
class SonComponent extends React.Component{
    constructor(props){
        super(props)
    }
    add(){
        const {testStore} = this.props;
        testStore.addCount();
    }
    reduce(){
        const {testStore} = this.props;
        testStore.reduceCount();
    }
    render(){
        const {testStore} = this.props;
        // console.log('---------',testStore.addCount);
        return(
            <>
                <div>{testStore.count}</div>
                <button onClick={this.add.bind(this)}>+</button>
                <button onClick={this.reduce.bind(this)}>-</button>
            </>
        )
    }
}


@inject("testStore")
@observer
export default class LectureSetting extends React.Component{
    static async getInitialProps({router ,req ,res, initializeStoreObj}) {
        initializeStoreObj.testStore.addCount();
        return {}
    }
    constructor(props){
        super(props)
    }
    render(){
        const {testStore} = this.props;
        return(
            <>
                <h1>this is mobx test page</h1>
                <h3>nowCountNumVal</h3>
                <div>{testStore.count}</div>
                <div>-----------</div>
                <SonComponent></SonComponent>
            </>
        )
    }
}


