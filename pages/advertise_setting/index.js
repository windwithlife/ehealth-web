import React from "react";
import "../styles/advertiseSetting.less"
import { Button } from 'antd';
import {invoke_post,doHref} from "../../common/index"
import config from "../../config.json";


export default class LectureSetting extends React.Component{
    static async getInitialProps({router ,req ,res, initializeStoreObj}) {
        return {}
    }
    componentDidMount(){
        invoke_post('advertService/getAdvertList')
    }
    constructor(props){
        super(props)
    }
    lookDetail(){
        doHref('advertise_setting/advertise_detail');
    }
    publish(){

    }
    newSetUp(){
        doHref('advertise_setting/add_advertise');
    }
    render(){
        return(
            <div className="lecture_setting_con">
                <Button className="new_setup_btn" onClick={this.newSetUp.bind(this)}>新建讲座</Button>
                {
                    [1,2,3,4,5].map(()=>{
                        return (
                            <div className="content_con">
                                <div className="content_con_left">
                                    <div className="content_con_left_img_con">
                                        <img className="img_base" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1235257593,3415073461&fm=26&gp=0.jpg"></img>
                                    </div>
                                    <div className="content_con_left_total_con">
                                        跳转链接<br />
                                        https://www.baidu.com/?tn=02003390_43_hao_pg
                                    </div>
                                </div>
                                <div className="content_con_right">
                                    <Button onClick={this.lookDetail.bind(this)}>编辑</Button>
                                    <Button onClick={this.publish.bind(this)}>删除</Button>
                                </div>
                            </div> 
                        )
                    })
                }
            </div>
        )
    }
}


