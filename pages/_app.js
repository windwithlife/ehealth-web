import App, {Container} from 'next/app'
import React from 'react'
import  initializeStore  from '../models/index';
import { Provider } from 'mobx-react'
import Wrap from './Wrap'
import Head from 'next/head'
import "./styles/_app.less";



class MyApp extends App {
    static async getInitialProps({req,res,router,Component}) {
        let ComponentInitProps = {};
        let WrapInitialProps = {};
        let initializeStoreObj = initializeStore({
            testStore:{ count:2 }
        });

        if(Component.getInitialProps) ComponentInitProps = await Component.getInitialProps({
            router ,req ,res, initializeStoreObj
        })
        if(Wrap.getInitialProps) WrapInitialProps = await  Wrap.getInitialProps(router);
        return {
            ComponentInitProps,
            WrapInitialProps,
            initializeStoreObj
        };
    }

    constructor(props) {
        super(props)
        this.mobxStore = initializeStore(props?.initializeStoreObj);
    }

    render() {
        const { Component, ComponentInitProps={} ,WrapInitialProps={} } = this.props;
        return (
            <>
                <Head>
                    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>{`
                    body { margin:0 } 
                    #__next {height:100%}
                    `}</style>
                </Head>
                <Provider {...this.mobxStore}>
                    <Wrap {...WrapInitialProps}>
                        <Component {...ComponentInitProps}/>
                    </Wrap>
                </Provider>
            </>
        )
    }
}
export default MyApp



