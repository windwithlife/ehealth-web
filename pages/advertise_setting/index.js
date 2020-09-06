import React from "react";
import "../styles/advertiseSetting.less"
import { Button } from 'antd';
import {invoke_post,doHref} from "../../common/index"
import config from "../../config.json";


export default class LectureSetting extends React.Component{
    static async getInitialProps({router ,req ,res, initializeStoreObj}) {
        return {}
    }
    constructor(props){
        super(props)
        this.currentPage = 1;
        this.state = {
            liveList:[]
        }
    }
    async getliveList(){
        try{
            let result = await invoke_post('advertService/getAdvertList',{
                currentPage:this.currentPage,
                pageSize:10,
            });
            let data = result?.data || {};
            let {totalPage,advertList} = data;
            let now_advertList = this.state.liveList;
            this.setState({
                liveList:now_advertList.concat(advertList)
            },()=>{
                if(this.currentPage<totalPage) {
                    this.currentPage++;
                    this.getliveList();
                }
            })
        }catch(error){
            console.error('onFinish-error: ', error);
        }
    }
    componentDidMount(){
        this.getliveList();
    }
    lookDetail(id){
        doHref(`advertise_setting/advertise_detail?id=${id}`);
    }

    newSetUp(){
        doHref('advertise_setting/add_advertise');
    }
    render(){
        let {liveList} = this.state;

        return(
            <div className="lecture_setting_con">
                <Button className="new_setup_btn" onClick={this.newSetUp.bind(this)}>新增广告</Button>
                {
                    liveList.map((item,idx)=>{
                        return (
                            <div className="content_con" key={idx}>
                                <div className="content_con_left">
                                    <div className="content_con_left_img_con">
                                        <img className="img_base" src={item?.advPicPath}></img>
                                    </div>
                                    <div className="content_con_left_total_con">
                                        <h1>{item?.advTitle}</h1>
                                    </div>
                                </div>
                                <div className="content_con_right">
                                    {/* <Button onClick={this.lookDetail.bind(this,item.id)}>编辑广告</Button> */}
                                    <div className="info_con">
                                        <span>开始时间 {item?.startDate}</span>&nbsp;&nbsp;&nbsp;
                                        <span>结束时间 {item?.endDate}</span>
                                    </div>
                                    {/* <Button onClick={this.publish.bind(this)}>删除</Button> */}
                                </div>
                            </div> 
                        )
                    })
                }
            </div>
        )
    }
}


