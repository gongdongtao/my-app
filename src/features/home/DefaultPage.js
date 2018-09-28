import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import 'antd/dist/antd.css';
import { Button, Table, message, Input, Form, Icon, Tooltip } from 'antd';
const FormItem = Form.Item;

export class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state={
    membersDataSource: [],
    IsPassed: false,
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps){
    let { loginInfo } = nextProps.home;
    if(loginInfo){
      // console.log(loginInfo);
      this.setIsPassed(loginInfo.IsPassed);
      if(!loginInfo.IsPassed){
        message.error(loginInfo.Message);
      }
    } else {
      this.setIsPassed(false);
      message.error('login failed.');
    }
  }

  onSearchBtnHandle = () => {
    const { IsPassed } = this.state;
    const { loginInfo } = this.props.home;
    if(IsPassed){
      this.setState({searchBtnLoading: true});
      this.props.actions.search((res)=>{
        this.setState({searchBtnLoading: false});
        if(res.reLogin){
          this.props.actions.login(loginInfo.userInfo, (flag_login, res_login) => {
            if(!flag_login){
              message.error('Automatic logon failure.');
            }
          });
        } else {
          if(!res.flag1&&!res.flag2){
            message.error('Search failed.');
          } else {
            if(!res.flag1){
              message.error('Search proxy failed.');
            }
            if(!res.flag2){
              message.error('Search teams failed.');
            }
          } 
        }
      });
    } else {
      message.info('Please login first.');
    }
  }

  setIsPassed = (IsPassed) => {
    this.setState({IsPassed});
  }

  onTeamRowClick = (record) => {
    if(record&&record.members&&record.members.length > 0){
      this.setState({membersDataSource: record.members});
    } else {
      this.setState({membersDataSource: []});
    }
  }

  render() {
    const { teams, proxys } = this.props.home;
    let { membersDataSource, IsPassed, searchBtnLoading } = this.state;
    // console.log(IsPassed);
    if(!teams||teams.length === 0){
      membersDataSource = [];
    }
    // console.log(teams);
    // console.log(proxys);
    const proxyColumns = [
      { title: 'Proxy IP', dataIndex: 'proxyIP' },
      { title: 'Status', dataIndex: 'status' },
      { title: 'Online Device', dataIndex: 'onlinedevice' },
      { title: 'Offline Device', dataIndex: 'offlinedevice' },
    ];
    const columns = [
      { title: 'Team ID', dataIndex: 'teamId' },
      { title: 'Group Name', dataIndex: 'teamName' },
      { title: 'Description', dataIndex: 'teamDes' },
      { title: 'Proxy Ip', dataIndex: 'proxyIp' },
      { title: 'Subnet', dataIndex: 'subnet' },
      { title: 'Site Count', dataIndex: 'siteCount' },
      { title: 'Terminal Count', dataIndex: 'terminalCount' }
    ];
    const membersColumns = [
      { title: 'Type', dataIndex: '', render: (text, record) => {
        let index = record.mac.indexOf('/');
        let pre = record.mac.substring(0, index);
        if(index === -1 && record.mac.length === 13){
          pre = 'router';
        }
        let type,tip;
        switch (pre) {
          case 'android':
            tip = "Android";
            type = "android-o";
            break;
          case 'iOS':
            tip = "IOS";
            type = "apple-o";
            break;
          case 'winddows':
            tip = "Windows";
            type = "windows-o";
            break;
          case 'router':
            tip = "Router";
            type = "hdd";
            break;
          default:
            tip = "UnKnown";
            type = "question-circle-o";
            break;
        }
        return (
          <Tooltip title={tip}>
            <Icon type={type} />
          </Tooltip>
        )
      } },
      { title: 'IP', dataIndex: 'ip' },
      { title: 'MAC', dataIndex: 'mac' },
      { title: 'WAN', dataIndex: 'wan' },
      { title: 'LAN', dataIndex: 'lan' },
      { title: 'Proxy Ip', dataIndex: 'proxyIp' },
      { title: 'Label Name', dataIndex: 'labelName' },
      { title: 'Status', dataIndex: 'status', render: text => <div>{text===0?'Offline':'Online'}</div> },
    ];
    return (
      <div className="home-default-page">
        <div style={{display: 'flex'}}>
          <div hidden={IsPassed}>
            <WrappedLoginForm actions={this.props.actions} />
          </div>
          <Button loading={searchBtnLoading} style={{marginLeft: "auto", marginRight: "10px"}} type="primary" onClick={this.onSearchBtnHandle}>Search</Button>
        </div>
        <Table
          title={() => <span className="tableTitle">Proxy</span>}
          rowKey={record => record.proxyIP}
          columns={proxyColumns}
          dataSource={proxys || []}
        />
        <Table
          title={() => <span className="tableTitle">Groups (Click on a group to display the group of devices below)</span>}
          rowKey={record => record.teamId}
          columns={columns}
          dataSource={teams || []}
          onRow={(record) =>{return{onClick: (row) => {this.onTeamRowClick(record)}}}}
        />
        <Table
          title={() => <span className="tableTitle">Devices</span>}
          rowKey={record => record.ip}
          columns={membersColumns}
          dataSource={membersDataSource}
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefaultPage);

//用于生成uuid
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

class LoginForm extends Component{
  state={
    loginBtnLoading: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loginBtnLoading: true});
        values.clientid = guid();
        this.props.actions.login(values, (flag, result)=> {
          this.setState({loginBtnLoading: false});
          if(!flag){
            console.log(result);
            message.error('Login failed.');
          }
        });
      }
    });
  }

  render() {
    const { loginBtnLoading } = this.state;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    let loginBtnDisabled = true;
    const values = this.props.form.getFieldsValue();
    if(values.username&&values.password){
      loginBtnDisabled = false;
    }
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Button
            loading={loginBtnLoading}
            type="primary"
            htmlType="submit"
            disabled={loginBtnDisabled}
          >
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm);
