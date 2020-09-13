import React from "react";
import "../styles/lectureSetting.less"
import { Button,Modal } from 'antd';
import {invoke_post,doHref} from "../../common/index"


export default class LectureSetting extends React.Component{
    constructor(props){
        super(props);
        this.currentPage = 1;
        this.state = {
            liveList:[]
        }
    }

    async getliveList(){
        try{
            let result = await invoke_post('liveService/getLiveList',{
                currentPage:this.currentPage,
                pageSize:10,
            });
            let data = result?.data || {};
            let {totalPage,liveList} = data;
            let now_liveList = this.state.liveList;
            this.setState({
                liveList:now_liveList.concat(liveList)
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
    async componentDidMount(){
        this.getliveList();
    }
    lookDetail(id){
        doHref(`lecture_setting/lecture_detail?id=${id}`)
    }
    async publish(id,operationType){
        await invoke_post('liveService/updateLiveStatus',{
            id,operationType
        });
        location.reload();
    }
    newSetUp(){
        doHref(`lecture_setting/newBuildLecture`)
    }
    render(){
        let {liveList} = this.state;
        // let liveList = [{
        //     id:"123",
        //     roomTitle:"标题",
        //     roomPicPath:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3464775501,3653819025&fm=26&gp=0.jpg",
        //     roomDesc:"直播内容",
        //     userTrueName:"张干",
        //     positionName:"主治医师",
        //     roomStatus:0, //直播状态(0:未开始 1:直播中 2:已结束)
        //     playAble:0, // 是否可回放(0:不可回放 1:可回放)
        //     playNumber:0,  //是否发布(0:未发布 1:已发布 2:已下架)
        //     liveStartDate:new Date(), //
        //     liveEndtDate:new Date(), //
        //     playNumber:200, //直播量
        //     pushServerUrl:"https://www.baidu.com/?tn=02003390_43_hao_pg", //推流地址,
        //     pullFlvUrl:"https://www.baidu.com/?tn=02003390_43_hao_pg", //拉流地址,
        //     videoMp4Url:"https://www.baidu.com/?tn=02003390_43_hao_pg", //录播地址
        // }]
        if(!liveList.length) return null;
        return(
            <div className="lecture_setting_con">
                <Button className="new_setup_btn" onClick={this.newSetUp.bind(this)}>新建会议</Button>
                {
                    liveList.map((item,idx)=>{
                        let btn_module = null;
                        if(item.roomStatus == 1){
                            btn_module = (
                                <Button onClick={this.publish.bind(this,item.id,2)}>
                                    直播结束
                                </Button>
                            )
                        }
                        if(item.roomStatus == 2 && item.publishStatus == 0){
                            btn_module = (
                                <>
                                    <Button  onClick={this.publish.bind(this,item.id,1)}>
                                        立即发布
                                    </Button> &nbsp;&nbsp;&nbsp;
                                    <Button  onClick={this.publish.bind(this,item.id,3)}>
                                        立即下架
                                    </Button>
                                </>
                            )
                        }
                        if(item.roomStatus == 2 && item.publishStatus == 1){
                            btn_module = (
                                <Button  onClick={this.publish.bind(this,item.id,3)}>
                                    立即下架
                                </Button>
                            )
                        }

                        return (
                            <div key={item.id} className="content_con">
                                <div className="content_con_left">
                                    <div className="content_con_left_img_con">
                                        <img className="img_base" src={item.roomPicPath}></img>
                                        <div className="content_con_left_img_tag">
                                          
                                            { item.publishStatus == 0 && (' 未发布') }
                                            { item.publishStatus == 1 && (' 已发布') }
                                            { item.publishStatus == 2 && (' 已下架') }
                                        </div>
                                        <div className="content_con_left_bottom_tag">
                                        <div className="content_con_left_bottom_square">
                                            { item.roomStatus == 0 && ('未开始') }
                                            { item.roomStatus == 1 && ('直播中') }
                                            { item.roomStatus == 2 && ('已结束') }
                                        </div>
                                        </div>
                                    </div>
                                    <div className="content_con_left_total_con">
                                        <h1>{item.roomTitle}</h1>
                                        <div className="content_con_left_doctor_con">
                                            <div>
                                                {!!item.playNumber && <span className="iconfont icon-iconset0481">&nbsp;&nbsp;{item.playNumber}&nbsp;&nbsp;&nbsp;</span>} 
                                                {!!item.liveStartDate && <span className="iconfont icon-clock">&nbsp;&nbsp;{item.liveStartDate}&nbsp;&nbsp;&nbsp;</span>} 
                                                {!!item.userTrueName && !!item.positionName && <span className="iconfont icon-yonghutouxiang">&nbsp;&nbsp;{item.userTrueName}&nbsp;{item.positionName}&nbsp;&nbsp;&nbsp;</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content_con_right">
                                    <Button className="content_con_right_look_detail" onClick={this.lookDetail.bind(this,item.id)}>查看详情</Button>
                                    <div style={{display:'flex'}}>
                                        {btn_module}
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


