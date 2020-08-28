import React from "react";
import "../../styles/lecture_detail/lectureDetail.less";
import {invoke_post,uploadFile,getTime} from "../../../common/index";
import {Breadcrumb, Input, Select,DatePicker,Button,Modal } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import QRCode from 'qrcode.react'
import Item from "antd/lib/list/Item";



function getQuery() {
    const url = decodeURI(location.search); // 获取url中"?"符后的字串(包括问号)
    let query = {};
    if (url.indexOf("?") != -1) {
        const str = url.substr(1);
        const pairs = str.split("&");
        for(let i = 0; i < pairs.length; i ++) {
             const pair = pairs[i].split("=");
            query[pair[0]] = pair[1];
        }
    }
    return query ;  // 返回对象
}

export default class Index extends React.Component{
    constructor(props){
        super(props);
        this.playBackAddress = '';
        this.liveTimeOnOkVal = null;


        this.playBackAddressInputOnChange = this.playBackAddressInputOnChange.bind(this);
        this.lectureNameInputOnChange = this.lectureNameInputOnChange.bind(this);
        this.liveTimeOnOk = this.liveTimeOnOk.bind(this);
        this.btnSaveClick = this.btnSaveClick.bind(this);

        this.state = {
            roomQrCodePath: "",
            previewImgUrl: 'http://images.koudaibook.com/images/2020/08/05/images20080520490978428.jpg',
            previewImgFile: null,

            preview_huiyiricheng_imgurl: 'http://images.koudaibook.com/images/2020/08/05/images20080520503391470.jpg',
            preview_huiyiricheng_file: null,

            preview_huiyiyulan_imgurl: 'http://images.koudaibook.com/images/2020/08/05/images20080520510262551.jpg',
            preview_huiyiyulan_file: null,

            modules:[{
                leftDesc:"推流地址",
                rightType:"text",
                rightDesc:"",
            },{
                leftDesc:"串流秘钥",
                rightType:"text",
                rightDesc:"", 
            },{
                leftDesc:"回放地址",
                rightType:"input",
                defalutVal:"",
                bindEvent:this.playBackAddressInputOnChange
            },{
                leftDesc:"会议名",
                rightType:"input",
                defalutVal:"",
                bindEvent:this.lectureNameInputOnChange
            },{
                leftDesc:"直播时间",
                rightType:"datePick",
                defalutVal:"",
                bindEvent:this.liveTimeOnOk
            },{
                rightType: 'upload_img',
            },{
                leftDesc:"",
                rightType:"button",
                bindEvent:this.btnSaveClick
            }]
        }
    }
    async componentDidMount(){
        try{
            let {id} = getQuery();
            let result = await invoke_post('https://service.koudaibook.com/meeting-server/pc/liveService/getLiveDetail',{id})
            let data = result?.data || {};
            let {roomPicPath,roomQrCodePath,roomSchedulePath,roomDescPath} = data;
            let {modules} = this.state;
            let newModules = modules.map((item,idx)=>{
                if(item.leftDesc == '推流地址') item.rightDesc = data?.pushServerUrl;
                if(item.leftDesc == '串流秘钥') item.rightDesc = data?.pushSecretKey;
                if(item.leftDesc == '回放地址') item.defalutVal = data?.videoMp4Url;
                if(item.leftDesc == '会议名') item.defalutVal = data?.roomTitle;
                if(item.leftDesc == '直播时间') item.defalutVal = data?.liveStartDate;
                return item;
            })
            this.setState({
                module:newModules,
                roomQrCodePath:roomQrCodePath,
                previewImgUrl:roomPicPath,
                preview_huiyiricheng_imgurl:roomSchedulePath,
                preview_huiyiyulan_imgurl:roomDescPath
            })         
        }catch(error){
            console.error('onFinish-error: ', error);
        }
    }
    playBackAddressInputOnChange(event){ //回放地址
        this.playBackAddress = event.currentTarget.value;
    }
    lectureNameInputOnChange(event){ //讲座名称
        this.lectureName = event.currentTarget.value;
    }
    async btnSaveClick(){
        try{
            let {id} = getQuery();
            let {previewImgUrl,preview_huiyiricheng_imgurl,preview_huiyiyulan_imgurl,modules} = this.state;
            let params = {
                id,
                roomPicPath:previewImgUrl,
                roomSchedulePath:preview_huiyiricheng_imgurl,
                roomDescPath:preview_huiyiyulan_imgurl,
            };
            if(this.liveTimeOnOkVal) {
                let {nowOfDay} = getTime(this.liveTimeOnOkVal);
                params.liveStartDate = nowOfDay;
            }else{
                let liveStartDate = modules.filter((item)=>item.leftDesc=='直播时间').shift().defalutVal;
                params.liveStartDate = liveStartDate;
            }
            if(this.playBackAddress) {
                params.videoMp4Url = this.playBackAddress;
            }else{
                let videoMp4Url = modules.filter((item)=>item.leftDesc=='回放地址').shift().defalutVal;
                params.videoMp4Url = videoMp4Url;
            }
            if(this.lectureName) {
                params.roomTitle = this.lectureName;
            }else{
                let roomTitle = modules.filter((item)=>item.leftDesc=='会议名').shift().defalutVal;
                params.roomTitle = roomTitle;
            }
            
            await invoke_post('https://service.koudaibook.com/meeting-server/pc/liveService/updateLive',params);
            Modal.info({content:'修改成功'});
        }catch(error){
            console.log('btnSaveClick_error: ', error);
        }
    }
    liveTimeOnOk(value) { //直播时间
        this.liveTimeOnOkVal = value._d.getTime();
    }

    selectedLocalPic(file, imgUrl, event) {
        let __file = event?.target.files[0];
        let obj = {}
        obj[file] = __file;
        obj[imgUrl] = URL.createObjectURL(__file)
        this.setState(obj)
    }
    async uploadLocalPic(type) { //上传本地图片
        const file = this.state[type];
        let result = await uploadFile(file);
        const {data} = result;
        let picPath = data?.picPath;
        if(type == 'previewImgFile') {
            this.setState({ previewImgUrl:picPath})
        }
        if(type == 'preview_huiyiricheng_file') {
            this.setState({ preview_huiyiricheng_imgurl:picPath})
        }
        if(type == 'preview_huiyiyulan_file') {
            this.setState({ preview_huiyiyulan_imgurl:picPath})
        }
        Modal.info({content:'上传成功'})
    }

    render(){
        const { previewImgUrl,preview_huiyiricheng_imgurl,preview_huiyiyulan_imgurl,roomQrCodePath,modules } = this.state;
        return(
            <div className="lecture_detail_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href="/lecture_setting">讲座设置</Breadcrumb.Item>
                    <Breadcrumb.Item>讲座详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="picture_con">
                    <div className="picture_con_left">
                        <img className="img_base" src={previewImgUrl}></img>
                    </div>
                    <div className="picture_con_right">
                        {/* <Button>预览</Button> */}
                        <div className="previewBtn">预览</div>
                        <div onClick={this.uploadLocalPic.bind(this, 'previewImgFile')} className="previewBtn uploadBtn">上传</div>
                        <input type="file" onChange={this.selectedLocalPic.bind(this, 'previewImgFile', 'previewImgUrl')}></input>
                    </div>
                </div>
                <div className="base_info_con">
                    <div className="base_info_con_left">
                        {
                            !!roomQrCodePath && (
                                <div className="qrcode_con" style={{marginTop:'20px'}}>
                                    <div className="qrcode_desc">会议二维码</div>   
                                    <img style={{width: '240px',height: '240px'}} src={roomQrCodePath} />
                                </div>
                            )
                        }
                    </div>
                    <div className="base_info_con_right">
                        {
                             modules.map((module)=>{
                                switch(module.rightType){
                                    case "text" :
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">{module.rightDesc}</div>
                                            </div>
                                        )
                                    break;
                                    case 'input' :
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                    <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                    <div className="base_info_con_right_second">
                                                        <input style={{width:"300px"}} placeholder={module.defalutVal} onChange={module.bindEvent}/>
                                                    </div>
                                                </div>
                                            ) 
                                    break;
                                    case 'select' :
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <Select showSearch style={{ width: 300 }} placeholder="Select a person" 
                                                        optionFilterProp="children" onChange={module.bindEvent}
                                                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                                            {
                                                                module.options.map(option=>{
                                                                    return (
                                                                        <Option key={option}>{option}</Option>
                                                                    )
                                                                })
                                                            }
                                                    </Select>
                                                </div>
                                            </div>
                                        )
                                    break;
                                    case 'datePick' :
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <DatePicker placeholder={module.defalutVal} showTime style={{width:300}}
                                                        onOk={module.bindEvent} />
                                                </div>
                                            </div>
                                        )
                                    break;
                                    case 'textarea' :
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <TextArea style={{ width: 300,height:120 }} onChange={module.bindEvent}></TextArea>
                                                </div>
                                            </div>
                                        )
                                    break;
                                    case 'button' : 
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">
                                                    <Button onClick={module.bindEvent}>保存</Button>
                                                </div>
                                            </div>
                                        )
                                    break;
                                    case "upload_img" :
                                        return (
                                            <div className="base_info_con_right_small_con">
                                                <div  className="base_info_con_right_small_con_left">
                                                    <div>会议日程</div>
                                                    <div className="picture_con_right">
                                                        <div className="previewBtn">预览</div>
                                                        <div onClick={this.uploadLocalPic.bind(this, 'preview_huiyiricheng_file')} className="previewBtn uploadBtn">上传</div>
                                                        <input type="file" onChange={this.selectedLocalPic.bind(this, 'preview_huiyiricheng_file', 'preview_huiyiricheng_imgurl')}></input>
                                                    </div>
                                                    <div className="img_con">
                                                        <img className="img_base" src={preview_huiyiricheng_imgurl}></img>
                                                    </div>
                                                </div>
                                                <div className="base_info_con_right_small_con_left">
                                                    <div>会议介绍</div>
                                                    <div className="picture_con_right">
                                                        <div className="previewBtn">预览</div>
                                                        <div onClick={this.uploadLocalPic.bind(this, 'preview_huiyiyulan_file')} className="previewBtn uploadBtn">上传</div>
                                                        <input type="file" onChange={this.selectedLocalPic.bind(this, 'preview_huiyiyulan_file', 'preview_huiyiyulan_imgurl')}></input>
                                                    </div>
                                                    <div className="img_con">
                                                        <img className="img_base" src={preview_huiyiyulan_imgurl}></img>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    break;
                                }
                             })
                        }
                    </div>
                </div>
            </div>
        )
    }
}


