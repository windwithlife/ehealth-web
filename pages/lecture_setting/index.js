import React from "react";
import "../styles/lectureSetting.less"
import { Button } from 'antd';
import {invoke_post} from "../../common/index"


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
            let result = await invoke_post('https://service.koudaibook.com/meeting-server/pc/liveService/getLiveList',{
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
        location.href = `${location.origin}/lecture_setting/lecture_detail?id=${id}`;
    }
    publish(){

    }
    newSetUp(){
        location.href = `${location.origin}/lecture_setting/newBuildLecture`;
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
                        return (
                            <div key={item.id} className="content_con">
                                <div className="content_con_left">
                                    <div className="content_con_left_img_con">
                                        <img className="img_base" src={item.roomPicPath}></img>
                                        <div className="content_con_left_img_tag">
                                            { item.roomStatus == 0 && ('未开始') }
                                            { item.roomStatus == 1 && ('直播中') }
                                            { item.roomStatus == 2 && ('已结束') }
                                        </div>
                                    </div>
                                    <div className="content_con_left_total_con">
                                        <h1>{item.roomTitle}</h1>
                                        <div className="content_con_left_doctor_con">
                                            <div>
                                                <span className="iconfont icon-yonghutouxiang">&nbsp;&nbsp;{item.userTrueName}&nbsp;{item.positionName}&nbsp;&nbsp;&nbsp;</span>
                                                <span className="iconfont icon-shipin">&nbsp;&nbsp;{item.playNumber}&nbsp;&nbsp;&nbsp;</span>
                                                <span className="iconfont icon-clock">&nbsp;&nbsp;{item.liveStartDate}&nbsp;&nbsp;&nbsp;</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content_con_right">
                                    <Button onClick={this.lookDetail.bind(this,item.id)}>查看详情</Button>
                                    <Button onClick={this.publish.bind(this)}>
                                        { item.roomStatus == 0 && ('未开始') }
                                        { item.roomStatus == 1 && ('结束直播') }
                                        { item.roomStatus == 2 && ('已结束') }
                                    </Button>
                                </div>
                            </div> 
                        )
                    })
                }
            </div>
        )
    }
}


