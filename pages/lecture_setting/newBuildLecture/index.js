import React from "react";
import "./index.less"
import { invoke_post, uploadFile, getTime, doHref } from "../../../common/index"
import { Breadcrumb, Input, Select, DatePicker, Modal } from 'antd';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
const { Option } = Select;
const { TextArea } = Input;
import config from "../../../config.json"






export default class Index extends React.Component {
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
            localImgeToCdnUrl: "",

            Editor: null,
            huiyirichengEditorState: EditorState.createEmpty(),
            huiyiyulanEditorState: EditorState.createEmpty(),
        }

        this.modules = [{
            leftDesc: "会议名",
            rightType: "input",
            bindEvent: this.lectureNameInputOnChange
        }, {
            leftDesc: "直播时间",
            rightType: "datePick",
            bindEvent: this.liveTimeOnOk
        },
        {
            leftDesc: "图片上传",
            rightType: 'upload_img',
        },
        {
            leftDesc: "会议日程",
            rightType: "richText",
        },
        {
            leftDesc: "",
            rightType: "button",
            bindEvent: this.btnSaveClick
        }]
    }
    componentDidMount() {
        import('react-draft-wysiwyg').then((data) => {
            this.setState({ Editor: data.Editor })
        })
    }
    onEditorStateChange(type, editorState) {
        if (type == "hiuyiricheng") {
            this.setState({ huiyirichengEditorState: editorState });
        }
        if (type == "huiyiyulan") {
            this.setState({ huiyiyulanEditorState: editorState });
        }
    }

    lectureNameInputOnChange(event) { //讲座名称
        this.lectureName = event.currentTarget.value;
    }
    async btnSaveClick() {
        try {
            let { previewImgUrl, previewImgFile, huiyirichengEditorState, huiyiyulanEditorState } = this.state;
            let roomScheduleInfo = draftToHtml(convertToRaw(huiyirichengEditorState.getCurrentContent()))
            let roomIntroduce = draftToHtml(convertToRaw(huiyiyulanEditorState.getCurrentContent()))
            let { nowOfDay } = getTime(this.liveTimeOnOkVal);
            if (!previewImgFile || !this.liveTimeOnOkVal || !this.lectureName) {
                Modal.info({ content: '信息填写不完整' });
                return
            }
            await invoke_post('liveService/addLive', {
                roomTitle: this.lectureName,
                roomPicPath: previewImgUrl, // 直播封面图片
                liveStartDate: nowOfDay,
                roomScheduleInfo,
                roomIntroduce
            })
            doHref('lecture_setting');
        } catch (error) {
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
        try {
            const file = this.state[type];
            if (!file) {
                Modal.info({ content: '图片不能为空' });
                return;
            }

            let result = await uploadFile(file);
            const { data } = result;
            let picPath = data?.picPath;
            if (type == 'previewImgFile') {
                this.setState({ previewImgUrl: picPath })
            }
            Modal.info({ content: '上传成功' })
        } catch (error) {
            console.error('uploadLocalPic-error: ', error);
        }
    }
    async uploadFileGetImgUrl(event) {
        let file = event?.target.files[0];
        let result = await uploadFile(file);
        const { data } = result;
        this.setState({ localImgeToCdnUrl: data?.picPath });
        Modal.info({ content: '上传成功' })
    }

    render() {
        const { previewImgUrl, localImgeToCdnUrl, Editor, huiyirichengEditorState, huiyiyulanEditorState } = this.state;

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
                                        case 'input':
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                    <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                    <div className="base_info_con_right_second">
                                                        <Input onChange={module.bindEvent} />
                                                    </div>
                                                </div>
                                            )
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
                                        case 'datePick':
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                    <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                    <div className="base_info_con_right_second">
                                                        <DatePicker showTime style={{ width: "26%", height: "24px" }}
                                                            onOk={module.bindEvent} />
                                                    </div>
                                                </div>
                                            )
                                        case 'textarea':
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                    <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                    <div className="base_info_con_right_second">
                                                        <TextArea style={{ width: 300, height: 120 }} onChange={module.bindEvent}></TextArea>
                                                    </div>
                                                </div>
                                            )
                                        case 'button':
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                    <div className="save_btn" onClick={module.bindEvent}>保存</div>
                                                </div>
                                            )
                                        case "upload_img":
                                            return (
                                                <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                    <div className="base_info_con_right_small_con_left">
                                                        <div className="desc_con">
                                                            <span className="desc">{module.leftDesc}</span>
                                                            <span className="preview_con">
                                                                <input type="file" onChange={this.uploadFileGetImgUrl.bind(this)}></input>
                                                                <div className="preview_btn base_btn" style={{ background: "#00A8FF !important;" }}>上传</div>
                                                            </span>
                                                            <span className="local_imge_to_cdn_url">{localImgeToCdnUrl}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        case "richText":
                                            return (
                                                <>
                                                    <div className="base_info_con_right_small_con">
                                                        <div className="base_info_con_right_small_con_left">
                                                            <div className="desc_con">
                                                                <span className="desc">会议日程</span>
                                                                {
                                                                    !!Editor && (
                                                                        <div className="editor_con">
                                                                            <Editor editorState={huiyirichengEditorState} onEditorStateChange={this.onEditorStateChange.bind(this, "hiuyiricheng")}
                                                                                toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="base_info_con_right_small_con">
                                                        <div className="base_info_con_right_small_con_left">
                                                                <div className="desc_con">
                                                                    <span className="desc">会议预览</span>
                                                                    {
                                                                        !!Editor && (
                                                                            <div className="editor_con">
                                                                                <Editor editorState={huiyiyulanEditorState} onEditorStateChange={this.onEditorStateChange.bind(this, "huiyiyulan")}
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
