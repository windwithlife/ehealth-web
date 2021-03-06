import React from "react";
import "./advertiseSetting.less"
import { Button,Modal } from 'antd';
import {invoke_post} from "../../common/Network"
import {doHref} from "../../common/utils";



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
            let result = await invoke_post('advertService/getInformationList',{
                currentPage:this.currentPage,
                pageSize:10,
            });
            let data = result?.data || {};
            let {totalPage,informationList} = data;
            let now_advertList = this.state.liveList;
            this.setState({
                liveList:now_advertList.concat(informationList)
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
    async deleteClick(id){
        await invoke_post('advertService/deleteInformation',{ id:id})
        Modal.info({ content: '删除成功' });
    }
    newSetUp(){
        doHref('advertise_setting/add_advertise');
    }
    render(){
        let {liveList} = this.state;
        // “id”:int 资讯ID,
        //  “advTitle”:String 资讯标题,
        //  “advPicPath”:String  资讯图片,
        //  “advDesc”:String  资讯内容(html格式,前端提供富文本编辑框)
        //  “advSource”:String 资讯地址(生成的Html链接)
        //  “startDate”：Date  开始时间,
        //  “endDate”:Date  结束时间,
        //  “advStatus”:int 状态(0:禁用 1:正常 -1:删除)
        //  “advOrder”:int 排序

        return(
            <div className="advertise_setting_con">
                <Button className="new_setup_btn" onClick={this.newSetUp.bind(this)}>新增新闻</Button>
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
                                        <div className="info_con">
                                            <div className="iconfont icon-iconset0481">开始时间 {item?.startDate}</div>
                                            <div className="iconfont icon-iconset0481">结束时间 {item?.endDate}</div>
                                        </div>
                                    </div>
                                    <div className="status_con">
                                        {item.advStatus == 1 && <div className="operate_btn" onClick={this.deleteClick.bind(this,item.id)}>删除新闻</div>}
                                        {item.advStatus == -1 && <div>已删除</div>}
                                        {item.advStatus == 0 && <div>禁用</div>}
                                    </div>
                                </div>
                            </div> 
                        )
                    })
                }
            </div>
        )
    }
}


