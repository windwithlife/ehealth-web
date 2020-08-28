import React from "react";
import "../../styles/add_cnosult/add_cnosult.less"

import {Breadcrumb, Input, Select,DatePicker,Button } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;



export default class Index extends React.Component{
    static async getInitialProps({router ,req ,res, initializeStoreObj}) {
        return {}
    }
    constructor(props){
        super(props);
        this.textArea = '';
        this.state = {
            previewImgUrl : 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3264589794,202278324&fm=26&gp=0.jpg',
            previewImgFile: null,
        }
    }


    selectedLocalPic(event){
        let file = event.target.files[0];
        this.setState({
            previewImgFile : file,
            previewImgUrl : URL.createObjectURL(file)
        })
    }
    uploadLocalPic(){ //上传本地图片
        const {previewImgFile} = this.state;
        let formData = new FormData();
        // let request = new XMLHttpRequest();
        formData.append("imgData", previewImgFile);
        // request.open("POST", url, true);
        // request.send(formData);
    }
    textAreaOnChange(event){  
        this.textArea = event.currentTarget.value;
    }
    save(){
        console.log('this.textArea : ', this.textArea );
    }
    render(){
        const {previewImgUrl} = this.state;
        return(
            <div className="lecture_detail_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href="/consult_edit">资讯编辑</Breadcrumb.Item>
                    <Breadcrumb.Item>新增资讯</Breadcrumb.Item>
                </Breadcrumb>
                <h1>资讯图</h1>
                <div className="picture_con">
                    <div className="picture_con_left">
                        <img className="img_base" src={previewImgUrl}></img>
                    </div>
                    <div className="picture_con_right">
                        {/* <Button>预览</Button> */}
                        <div className="previewBtn">预览</div>
                        <div onClick={this.uploadLocalPic.bind(this)} className="previewBtn uploadBtn">上传</div>
                        <input type="file" onChange={this.selectedLocalPic.bind(this)}></input>
                    </div>
                </div>
                <h1>资讯内容</h1>
                <TextArea style={{ height:120 }} onChange={this.textAreaOnChange.bind(this)}></TextArea>
                <div className="save">
                    <Button onClick={this.save.bind(this)}>保存</Button>
                </div>
            </div>
        )
    }
}


