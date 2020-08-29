import React from "react";
import "../../styles/newBuildLecture/newBuildLecture.less"
import {invoke_post,uploadFile,getTime} from "../../../common/index"
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
            previewImgUrl: 'http://images.koudaibook.com/images/2020/08/05/images20080520490978428.jpg',
            previewImgFile: null,

            preview_huiyiricheng_imgurl: 'http://images.koudaibook.com/images/2020/08/05/images20080520503391470.jpg',
            preview_huiyiricheng_file: null,

            preview_huiyiyulan_imgurl: 'http://images.koudaibook.com/images/2020/08/05/images20080520510262551.jpg',
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
        let {previewImgUrl,preview_huiyiricheng_imgurl,preview_huiyiyulan_imgurl} = this.state;
        let {nowOfDay} = getTime(this.liveTimeOnOkVal)
        console.log('nowOfDay: ', nowOfDay);
        try{
            let result = await invoke_post('https://service.koudaibook.com/meeting-server/pc/liveService/addLive',{
                roomTitle:this.lectureName,
                roomPicPath:previewImgUrl, // 直播封面图片
                roomSchedulePath:preview_huiyiricheng_imgurl, //
                roomDescPath:preview_huiyiyulan_imgurl, 
                liveStartDate:nowOfDay
            })
            Modal.info({content:'保存成功'});
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
            <div className="lecture_detail_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href={`${config.baseUrl}/lecture_setting`}>讲座设置</Breadcrumb.Item>
                    <Breadcrumb.Item>新建讲座</Breadcrumb.Item>
                </Breadcrumb>
                <div className="picture_con">
                    <div className="picture_con_left">
                        <img className="img_base" src={previewImgUrl}></img>
                    </div>
                    <div className="picture_con_right">
                        <div className="previewBtn">预览</div>
                        <div onClick={this.uploadLocalPic.bind(this, 'previewImgFile')} className="previewBtn uploadBtn">上传</div>
                        <input type="file" onChange={this.selectedLocalPic.bind(this, 'previewImgFile', 'previewImgUrl')}></input>
                    </div>
                </div>
                <div className="base_info_con">
                    <div className="base_info_con_left">
                        {/* <img className="img_base" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3264589794,202278324&fm=26&gp=0.jpg"></img> */}
                    </div>
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
                                                    <DatePicker showTime style={{ width: 300 }}
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
                                                <div className="base_info_con_right_first">
                                                    <Button onClick={module.bindEvent}>保存</Button>
                                                </div>
                                            </div>
                                        )
                                        break;
                                    case "upload_img":
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
                                        break
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}


