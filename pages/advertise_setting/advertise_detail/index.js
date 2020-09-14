import React from "react";
import "../../styles/advertise_detail/advertiseDetail.less"

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
        this.jumpUrl = '';
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
    onChange(event){
        this.jumpUrl = event.currentTarget.value;
    }
    save(){
        console.log('this.jumpUrl : ', this.jumpUrl );
    }
    render(){
        const {previewImgUrl} = this.state;
        return(
            <div className="advertise_detail_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href="/advertise_setting">广告设置</Breadcrumb.Item>
                    <Breadcrumb.Item>广告详情</Breadcrumb.Item>
                </Breadcrumb>
                <h1>轮播图</h1>
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
                <h1>跳转链接</h1>
                <Input onChange={this.onChange.bind(this)}></Input>
                <div className="save">
                    <Button onClick={this.save.bind(this)}>保存</Button>
                </div>
            </div>
        )
    }
}


