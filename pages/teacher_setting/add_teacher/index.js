import React from "react";
import "../../styles/add_teacher/addTeacher.less"

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
        this.getTeacherName = '' //讲师姓名
        this.inputGetTeacherName = this.inputGetTeacherName.bind(this);

        this.getTeacherLevel = '' //讲师职称
        this.selectGetTeacherLevel = this.selectGetTeacherLevel.bind(this);

        this.getHospital = '' //所在医院
        this.inputGetHospital = this.inputGetHospital.bind(this);


        this.lectureIntr = '' //讲师介绍
        this.textAreaOnChange = this.textAreaOnChange.bind(this);

        this.btnSaveClick = this.btnSaveClick.bind(this);
        
        this.state = {
            previewImgUrl : 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3264589794,202278324&fm=26&gp=0.jpg',
            previewImgFile: null,
        }

        this.modules = [{
            leftDesc:"讲师姓名",
            rightType:"input",
            bindEvent:this.inputGetTeacherName,
        },{
            leftDesc:"讲师职称",
            rightType:"select",
            bindEvent:this.selectGetTeacherLevel,
            options:['医士','医师','主治医是','副主任医师'],
        },{
            leftDesc:"所在医院",
            rightType:"input",
            bindEvent:this.inputGetHospital,
            options:['Jack','lucy','tom'],
        },{
            leftDesc:"讲师介绍",
            rightType:"textarea",
            bindEvent:this.textAreaOnChange
        },{
            leftDesc:"",
            rightType:"button",
            bindEvent:this.btnSaveClick
        }]
    }

    inputGetHospital(event){ //所在医院
        this.getHospital = event.currentTarget.value;
    }
    inputGetTeacherName(event){ //讲师姓名
        this.getTeacherName = event.currentTarget.value;
    }
    selectGetTeacherLevel(value, option){ //讲师职称
        this.getTeacherLevel = value;
    }
   
   
    btnSaveClick(){
        console.log('this.getTeacherName: ', this.getTeacherName,this.getTeacherLevel,this.getHospital,this.lectureIntr);
    }
    textAreaOnChange(event){  //讲座介绍
        this.lectureIntr = event.currentTarget.value;
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
    render(){
        const {previewImgUrl} = this.state;
        return(
            <div className="lecture_detail_con">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href="/teacher_setting">讲师设置</Breadcrumb.Item>
                    <Breadcrumb.Item>新增讲师</Breadcrumb.Item>
                </Breadcrumb>
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
                <div className="base_info_con">
                    <div className="base_info_con_left">
                        <img className="img_base" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3264589794,202278324&fm=26&gp=0.jpg"></img>
                    </div>
                    <div className="base_info_con_right">
                        {
                             this.modules.map((module)=>{
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
                                                        <Input onChange={module.bindEvent}  />
                                                    </div>
                                                </div>
                                            ) 
                                    break;
                                    case 'select' :
                                        return (
                                            <div key={module.leftDesc} className="base_info_con_right_small_con">
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <Select showSearch style={{ width: 300 }} placeholder="Select a level" 
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
                                                    <DatePicker showTime style={{width:300}}
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
                                                <div className="base_info_con_right_first">{module.leftDesc}</div>
                                                <div className="base_info_con_right_second">
                                                    <Button onClick={module.bindEvent}>保存</Button>
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


