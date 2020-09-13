import React from "react";
import "../../styles/newBuildLecture/newBuildLecture.less"
import {invoke_post,uploadFile,getTime,doHref} from "../../../common/index"
import { Breadcrumb, Input, Select, DatePicker, Button ,Modal} from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import config from "../../../config.json"






export default class Index extends React.Component {
    static async getInitialProps({ router, req, res, initializeStoreObj }) {
        return {}
    }
    constructor(props) {
        super(props);
        this.lectureName = ''; //会议名
        this.liveTimeOnOkVal = null; //直播时间

        this.huiyirichengUpload = null;
        this.huiyiyulanUpload = null;



        this.lectureNameInputOnChange = this.lectureNameInputOnChange.bind(this);
        this.liveTimeOnOk = this.liveTimeOnOk.bind(this);
        this.btnSaveClick = this.btnSaveClick.bind(this);


        this.state = {
            previewImgUrl: 'http://images.e-healthcare.net/images/2020/09/13/images20091313123054940.png',
            previewImgFile: null,

            preview_huiyiricheng_imgurl: 'http://images.e-healthcare.net/images/2020/09/13/images20091313112259671.png',
            preview_huiyiricheng_file: null,

            preview_huiyiyulan_imgurl: 'http://images.e-healthcare.net/images/2020/09/13/images20091313295955926.png',
            preview_huiyiyulan_file: null,
        }

        this.modules = [{
            leftDesc: "会议名",
            rightType: "input",
            bindEvent: this.lectureNameInputOnChange
        },
            , {
            leftDesc: "直播时间",
            rightType: "datePick",
            bindEvent: this.liveTimeOnOk
        },
        {
            rightType: 'upload_img',
        },
        {
            leftDesc: "",
            rightType: "button",
            bindEvent: this.btnSaveClick
        }]
    }

    lectureNameInputOnChange(event) { //讲座名称
        this.lectureName = event.currentTarget.value;
    }
    async btnSaveClick() {
        try{
            let {previewImgUrl,previewImgFile,
                preview_huiyiricheng_imgurl,preview_huiyiricheng_file,
                preview_huiyiyulan_imgurl,preview_huiyiyulan_file
            } = this.state;
            let {nowOfDay} = getTime(this.liveTimeOnOkVal);
            if(!previewImgFile || !preview_huiyiricheng_file || !preview_huiyiyulan_file || !this.liveTimeOnOkVal || !this.lectureName){
               
                Modal.info({content:'信息填写不完整'});
                return
            }
            await invoke_post('liveService/addLive',{
                roomTitle:this.lectureName,
                roomPicPath:previewImgUrl, // 直播封面图片
                roomSchedulePath:preview_huiyiricheng_imgurl, //
                roomDescPath:preview_huiyiyulan_imgurl, 
                liveStartDate:nowOfDay
            })
            doHref('lecture_setting');
        }catch(error){
            console.error('onFinish-error: ', error);
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
        try{
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
            if(type == 'preview_huiyiricheng_file') {
                this.setState({ preview_huiyiricheng_imgurl:picPath})
            }
            if(type == 'preview_huiyiyulan_file') {
                this.setState({ preview_huiyiyulan_imgurl:picPath})
            }
            Modal.info({content:'上传成功'})
        }catch(error){
            console.error('uploadLocalPic-error: ', error);
        }
    }

    render() {
        const { previewImgUrl,preview_huiyiricheng_imgurl,preview_huiyiyulan_imgurl} = this.state;
    
        return (
            <div className="new_build_lecture_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href={`${config.baseUrl}/lecture_setting`}>讲座设置</Breadcrumb.Item>
                    <Breadcrumb.Item>新建讲座</Breadcrumb.Item>
                </Breadcrumb>
            <div className="new_build_lecture_wrap">
                <div className="picture_con">
                    <div className="picture_con_left">
                        <img className="img_base" src={previewImgUrl}></img>
                    </div>
                    <div className="picture_con_right">
                        <div onClick={this.uploadLocalPic.bind(this, 'previewImgFile')} className="previewBtn uploadBtn">上传</div>
                        <div className="previewBtn">预览</div>
                        <input type="file" onChange={this.selectedLocalPic.bind(this, 'previewImgFile', 'previewImgUrl')}></input>
                    </div>
                </div>
                <div className="base_info_con">

                    <div className="base_info_con_right">
                        {
                            this.modules.map((module) => {
                                switch (module.rightType) {
                                    case "text":
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">{module.rightDesc}</div>
                                            </div>
                                        )
                                        break;
                                    case 'input':
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <Input onChange={module.bindEvent} />
                                                </div>
                                            </div>
                                        )
                                        break;
                                    case 'select':
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <Select showSearch style={{ width: 300 }} placeholder="Select a person"
                                                        optionFilterProp="children" onChange={module.bindEvent}
                                                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                                        {
                                                            module.options.map(option => {
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
                                    case 'datePick':
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <DatePicker showTime style={{ width:"26%",height:"24px" }} 
                                                        onOk={module.bindEvent} />
                                                </div>
                                            </div>
                                        )
                                        break;
                                    case 'textarea':
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <TextArea style={{ width: 300, height: 120 }} onChange={module.bindEvent}></TextArea>
                                                </div>
                                            </div>
                                        )
                                        break;
                                    case 'button':
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                  <div className="save_btn" onClick={module.bindEvent}>保存</div>
                                            </div>
                                        )
                                        break;
                                    case "upload_img":
                                        return (
                                            <div className="base_info_con_right_small_con">
                                                <div  className="base_info_con_right_small_con_left">
                                                    <div className="desc_con">
                                                        <span className="desc">会议日程</span> 
                                                        <span onClick={this.uploadLocalPic.bind(this, 'preview_huiyiricheng_file')} className="upload_btn base_btn">上传</span>
                                                        <span className="preview_con">
                                                            <input type="file" onChange={this.selectedLocalPic.bind(this, 'preview_huiyiricheng_file', 'preview_huiyiricheng_imgurl')}></input>
                                                            <div className="preview_btn base_btn">预览</div> 
                                                        </span>
                                                    </div>
                                                    <div className="img_con">
                                                        <img className="img_base" src={preview_huiyiricheng_imgurl}></img>
                                                    </div>
                                                </div>

                                                <div  className="base_info_con_right_small_con_left">
                                                    <div className="desc_con">
                                                        <span className="desc">会议介绍</span> 
                                                        <span onClick={this.uploadLocalPic.bind(this, 'preview_huiyiyulan_file')} className="upload_btn base_btn" >上传</span>
                                                        <span className="preview_con">
                                                            <input type="file" onChange={this.selectedLocalPic.bind(this, 'preview_huiyiyulan_file', 'preview_huiyiyulan_imgurl')}></input>
                                                            <div className="preview_btn base_btn">预览</div> 
                                                        </span>
                                                    </div>
                                                    <div className="img_con">
                                                        <img className="img_base" src={preview_huiyiyulan_imgurl}></img>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        break
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


