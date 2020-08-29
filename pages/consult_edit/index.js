import React from "react";
import "../styles/consultEdit.less"
import { Button } from 'antd';
import config from "../../config.json"
import {doHref} from "../../common/index"


export default class LectureSetting extends React.Component{
    static async getInitialProps({router ,req ,res, initializeStoreObj}) {
        return {}
    }
    constructor(props){
        super(props)
    }
    lookDetail(){
        doHref('consult_edit/consult_detail');
    }
    publish(){

    }
    newSetUp(){
        doHref('consult_edit/add_cnosult');
    }
    render(){
        return(
            <div className="lecture_setting_con">
                <Button className="new_setup_btn" onClick={this.newSetUp.bind(this)}>新增咨询</Button>
                {
                    [1,2,3,4,5].map(()=>{
                        return (
                            <div className="content_con">
                                <div className="content_con_left">
                                    <div className="content_con_left_img_con">
                                        <img className="img_base" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1235257593,3415073461&fm=26&gp=0.jpg"></img>
                                    </div>
                                    <div className="content_con_left_total_con">
                                        <h1>蚂蚁集团启动上市计划 概念股开盘大涨</h1>
                                        <div className="content_con_left_doctor_con">
                                        2020/07/22  13:15:23
                                        </div>
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


