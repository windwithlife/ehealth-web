import React from "react";
import "./addAdvertise.less"

import { Breadcrumb, Input, Select, DatePicker, Button, Modal } from 'antd';
import {getTime,doHref} from "../../../common/utils"
import { uploadFile,invoke_post} from "../../../common/Network"
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import myBlockRenderer from "../../../common/richEditorBase";

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.advTitle = '';
        this.endTime = null;
        this.startTime = null;

        this.state = {
            previewImgUrl: 'http://images.e-healthcare.net/images/2020/09/13/images20091319492691182.png',
            previewImgFile: null,
            Editor: null,
            editorState: EditorState.createEmpty(),

        }
    }
    componentDidMount() {
        import('react-draft-wysiwyg').then((data) => {
            this.setState({ Editor: data.Editor })
        })
    }
    titleInputChange(event) {
        this.advTitle = event.currentTarget.value;
    }

    selectedLocalPic(event) {
        let file = event.target.files[0];
        this.setState({
            previewImgFile: file,
            previewImgUrl: URL.createObjectURL(file)
        })
    }
    async uploadLocalPic() { //上传本地图片
        try {
            const file = this.state.previewImgFile
            if (!file) {
                Modal.info({ content: '图片不能为空' });
                return;
            }
            let result = await uploadFile(file);
            const { data } = result;
            let picPath = data?.picPath;
            this.setState({ previewImgUrl: picPath })
            Modal.info({ content: '上传成功' })
        } catch (error) {
            console.error('uploadLocalPic-error: ', error);
        }
    }
    timeOk(type, value) {
        if (type == "END") this.endTime = getTime(value._d.getTime()).nowOfDay;
        else this.startTime = getTime(value._d.getTime()).nowOfDay;
    }
    onEditorStateChange(editorState) {
        this.setState({ editorState });
    }

    async save() {
        try {
            let { previewImgUrl, previewImgFile, editorState } = this.state;
            let advDesc = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            if (!previewImgFile || !this.endTime || !this.startTime || !this.advTitle || !advDesc) {
                Modal.info({ content: '信息填写不完整' });
                return
            }

            await invoke_post('advertService/addInformation', {
                advTitle: this.advTitle,
                advPicPath: previewImgUrl,
                advDesc: advDesc,
                startDate: this.startTime,
                endDate: this.endTime,
                advStatus: 1, //0:禁用 1:正常 -1:删除)
                advOrder: 1,
            })
            doHref('advertise_setting');
        } catch (error) {
            console.log('error: ', error);
        }
    }
    render() {
        const { previewImgUrl, Editor, editorState } = this.state;
        return (
            <div className="add_advertise_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href="/ehealth_web/advertise_setting">广告设置</Breadcrumb.Item>
                    <Breadcrumb.Item>新增广告</Breadcrumb.Item>
                </Breadcrumb>
                <div className="add_advertise_wrap">
                    <>
                        <div className="picture_con">
                            <div className="picture_con_left">
                                <img className="img_base" src={previewImgUrl}></img>
                            </div>
                            <div className="picture_con_right">
                                <div className="previewBtn">预览</div>
                                <div onClick={this.uploadLocalPic.bind(this)} className="previewBtn uploadBtn">上传</div>
                                <input type="file" onChange={this.selectedLocalPic.bind(this)}></input>
                            </div>
                        </div>
                    </>
                    <div className="base_info_con_right_small_con">
                        <div className="base_info_con_right_first">文章标题</div>
                        <div className="base_info_con_right_second">
                            <Input onChange={this.titleInputChange.bind(this)}></Input>
                        </div>
                    </div>
                    <div key={module.leftDesc} className="base_info_con_right_small_con">
                        <div className="base_info_con_right_first">开始时间</div>
                        <div className="base_info_con_right_second">
                            <DatePicker showTime style={{ width: "26%", height: "24px" }}
                                onOk={this.timeOk.bind(this, "START")} />
                        </div>
                    </div>
                    <div key={module.leftDesc} className="base_info_con_right_small_con">
                        <div className="base_info_con_right_first">结束时间</div>
                        <div className="base_info_con_right_second">
                            <DatePicker showTime style={{ width: "26%", height: "24px" }}
                                onOk={this.timeOk.bind(this, "END")} />
                        </div>
                    </div>
                    {
                        !!Editor && (
                            <div className="artical_module_con">
                                <div className="title_desc">文章内容</div>
                                <Editor editorState={editorState} 
                                    blockRendererFn={myBlockRenderer}
                                    toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName" onEditorStateChange={this.onEditorStateChange.bind(this)} />
                            </div>

                        )
                    }

                    <div className="save"  onClick={this.save.bind(this)}>
                        <div className="save_btn" onClick={module.bindEvent}>保存</div>
                    </div>
                </div>
            </div>
        )
    }
}


