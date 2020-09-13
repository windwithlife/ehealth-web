import React from 'react';
import { Form, Input, Button, Checkbox ,Modal} from 'antd';


import "./styles/index.less";
import {invoke_post,Loading} from "../common/index"
React.createRef()

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16,},
};

export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.userName = React.createRef();
        this.userPassword = React.createRef();
    }
    inputChange(type){
    }
    async onFinish(){
        try{
            let userName = this?.userName?.current?.value;
            let userPassword = this?.userPassword?.current?.value;
            if(!userName || !userPassword) {
                Modal.info({ content: '信息填写不完整' })
                return
            }
            await invoke_post('userService/userLogin',{ userPassword,userName})
        }catch(error){
            console.error('onFinish-error: ', error);
        }
    }

    render(){
        return (
            <div className="con">  
                <div className="con_left">
                    <img src="https://dimg02.c-ctrip.com/images/10081e000001ftgsm99A3.jpg"></img>
                </div>
                <div className="con_right">
                    <div className="input_con">
                        <input ref={this.userName} onChange={this.inputChange.bind(this,"NAME")} placeholder="用户名"/>
                        <input ref={this.userPassword} onChange={this.inputChange.bind(this,"PASSWORD")} type="password" placeholder="密码"/>
                        <div className="login_btn" onClick={this.onFinish.bind(this)}>登录</div>
                    </div>
                </div>
            </div>
          );
    }
}

