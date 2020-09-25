import React from "react";
import "./index.less";
import {invoke_post,uploadFile,getTime,getQuery,doHref} from "../../../common/index";
import {Breadcrumb, Input, Select,DatePicker,Modal } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import QRCode from 'qrcode.react'
import config from "../../../config.json"
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';





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
            previewImgUrl: 'http://images.e-healthcare.net/images/2020/09/13/images20091313123054940.png',
            previewImgFile: null,

            Editor: null,

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
                rightType: 'richText',
                leftDesc: "会议日程",
                editorState:EditorState.createEmpty(),
                type:"hiuyiricheng",
            },{
                rightType: 'richText',
                leftDesc: "会议预览",
                editorState:EditorState.createEmpty(),
                type:"huiyiyulan",
            },{
                leftDesc:"",
                rightType:"button",
                bindEvent:this.btnSaveClick
            }]
        }
    }
    async initData(){
        try{
            let {id} = getQuery();
            let data = await invoke_post('liveService/getLiveDetail',{id}).then(res=>res?.data)
            let htmlToDraft = await import('html-to-draftjs').then(data=>data.default);
            let {roomPicPath} = data;
            let {modules} = this.state;
            let newModules = modules.map((item)=>{
                if(item.leftDesc == '推流地址') item.rightDesc = data?.pushServerUrl;
                if(item.leftDesc == '串流秘钥') item.rightDesc = data?.pushSecretKey;
                if(item.leftDesc == '回放地址') item.defalutVal = data?.videoMp4Url;
                if(item.leftDesc == '会议名') item.defalutVal = data?.roomTitle;
                if(item.leftDesc == '直播时间') item.defalutVal = data?.liveStartDate;
                if(item.leftDesc == '会议日程' || item.leftDesc == '会议预览'){
                    let contentBlock =  '';
                    if(item.leftDesc == '会议日程') contentBlock = htmlToDraft(data?.roomScheduleInfo || '');
                    if(item.leftDesc == '会议预览') contentBlock = htmlToDraft(data?.roomIntroduce || '');
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        item.editorState = editorState;
                    }
                }
                return item;
            })
            this.setState({
                roomQrCodePath:`https://m.e-healthcare.net/ehealth_h5/live?id=${id}`,
                module:newModules,
                previewImgUrl:roomPicPath,
            })         
        }catch(error){
            console.error('onFinish-error: ', error);
        }
    }
    async componentDidMount(){
        const Editor = await import('react-draft-wysiwyg').then((data)=>data.Editor);
        this.setState({ Editor })
        this.initData();
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
            let {previewImgUrl,modules} = this.state;
            let params = {
                id,
                roomPicPath:previewImgUrl,
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
            modules.forEach((item)=>{
                if(item.leftDesc == '会议日程'){
                    params.roomScheduleInfo = draftToHtml(convertToRaw(item.editorState.getCurrentContent()));
                }
                if(item.leftDesc == '会议预览'){
                    params.roomIntroduce = draftToHtml(convertToRaw(item.editorState.getCurrentContent()));
                }
            })
            await invoke_post('liveService/updateLive',params);
            doHref('lecture_setting');
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

    onEditorStateChange(type, editorState) {
        let {modules} = this.state;
        if (type == "hiuyiricheng") {
            modules.forEach((item) => {
                if(item.leftDesc == '会议日程'){
                    item.editorState = editorState;
                }
            });
        }
        if (type == "huiyiyulan") {
            modules.forEach((item) => {
                if(item.leftDesc == '会议预览'){
                    item.editorState = editorState;
                }
            });
        }
        this.setState({modules})
    }
    async uploadLocalPic(type) { //上传本地图片
        const file = this.state[type];
        if(!file){
            Modal.info({content:'图片不能为空'});
            return;
        }
        let result = await uploadFile(file);
        const {data} = result;
        let picPath = data?.picPath;
        if(type == 'previewImgFile') {
            this.setState({ previewImgUrl:picPath})
        }
       
        Modal.info({content:'上传成功'})
    }

    render(){
        const { previewImgUrl,roomQrCodePath,modules,Editor} = this.state;
        return(
            <div className="lecture_detail_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href={`${config.baseUrl}/lecture_setting`}>讲座设置</Breadcrumb.Item>
                    <Breadcrumb.Item>讲座详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="lecture_detail_wrap">
                    <div className="picture_con">
                        <div className="picture_con_left">
                            <img className="img_base" src={previewImgUrl}></img>
                        </div>
                        <div className="picture_con_right">
                            <div>
                                <div className="previewBtn">预览</div>
                                <div onClick={this.uploadLocalPic.bind(this, 'previewImgFile')} className="previewBtn uploadBtn">上传</div>
                                <input type="file" onChange={this.selectedLocalPic.bind(this, 'previewImgFile', 'previewImgUrl')}></input>
                            </div>
                            <div className="qrcode_con">
                                <div className="qrcode_desc">会议二维码</div>   
                                <QRCode size={150} value={roomQrCodePath} />
                            </div>
                        </div>
                    </div>
                    <div className="base_info_con">
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
                                        case 'input' :
                                                return (
                                                    <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                        <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                        <div className="base_info_con_right_second">
                                                            <input style={{width:"300px"}} placeholder={module.defalutVal} onChange={module.bindEvent}/>
                                                        </div>
                                                    </div>
                                                ) 
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
                                        case 'textarea' :
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                    <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                    <div className="base_info_con_right_second">
                                                        <TextArea style={{ width: 300,height:120 }} onChange={module.bindEvent}></TextArea>
                                                    </div>
                                                </div>
                                            )
                                        case 'button' : 
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                     <div className="save_btn" onClick={module.bindEvent}>保存</div>
                                                </div>
                                            )
                                        case "richText" :
                                            return (
                                                <>
                                                    <div className="base_info_con_right_small_con">
                                                        <div className="base_info_con_right_small_con_left">
                                                            <div className="desc_con">
                                                            <span className="desc">{module.leftDesc}</span>
                                                                {
                                                                    !!Editor && (
                                                                        <div className="editor_con">
                                                                            <Editor editorState={module.editorState} onEditorStateChange={this.onEditorStateChange.bind(this, module.type)}
                                                                                toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


