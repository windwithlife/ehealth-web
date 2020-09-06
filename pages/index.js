import React from 'react';
import { Form, Input, Button, Checkbox ,Modal} from 'antd';


import "./styles/index.less";
import {invoke_post,Loading} from "../common/index"


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
    }
    async onFinish(valueObj){
        try{
            const {userPassword,userName} = valueObj;
            invoke_post('userService/userLogin',{ userPassword,userName})
        }catch(error){
            console.error('onFinish-error: ', error);
        }
    }

    render(){
        return (
            <div className="con">  
                <h1 style={{color:"#000"}}>
                    E健云运营后台
                </h1>
                <Form  {...layout} name="basic" initialValues={{ remember: true, }} 
                    onFinish={this.onFinish.bind(this)}
                >
                    <Form.Item label="Username" name="userName"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input />
                    </Form.Item>
                    
                    <Form.Item label="Password" name="userPassword"
                        rules={[{ required: true, message: 'Please input your password!'}]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button  type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

            </div>
          );
    }
}

