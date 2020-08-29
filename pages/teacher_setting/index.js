import React from "react";
import "../styles/teacherSetting.less"
import { Button } from 'antd';
import {doHref} from "../../common/index"


export default class teacherSetting extends React.Component{
    static async getInitialProps({router ,req ,res, initializeStoreObj}) {
        return {}
    }
    constructor(props){
        super(props)
    }
    newSetUp(){
        doHref(`teacher_setting/add_teacher`);
    }
    goDetail(){
        doHref(`teacher_setting/teacher_detail`);
    }

    render(){
        return(
            <div className="teacher_setting_con">
                <Button className="new_setup_btn" onClick={this.newSetUp.bind(this)}>新增讲师</Button>
                <div className="base_info_con">
                    {
                        [1,2,3,4,5,6].map(()=>{
                            return (
                                <div className="base_info_item_con">
                                    <div className="base_info_item_con_left">
                                        <img className="img_base" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=126766299,3652968388&fm=26&gp=0.jpg"></img>
                                    </div>
                                    <div className="base_info_item_con_right">
                                        <div>李四</div>
                                        <div>主任医师</div>
                                        <div>第九人民医院第九人民医院第九人民医院</div>
                                        <Button onClick={this.goDetail.bind(this)}>详情</Button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}


