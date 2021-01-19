import React, { Component } from "react";
import { Row, Col, Input, Button, Table, Space, DatePicker,Select } from "antd";

import "./index.css";
const { Option } = Select;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      h1: 8,
      h2: 20,
      m1: 45,
      m2: 0,
      total: 0,
      average: 0,
      count: 0,
      curDate:new Date().toLocaleDateString(),
      columns: [
        {
          title:"日期",
          dataIndex: "date",
          key: "date",
        },
        // {
        //   title: "序号",
        //   dataIndex: "id",
        //   key: "id",
        // },
        {
          title: "签到",
          dataIndex: "signIn",
          key: "signIn",
          // render: (text) => <a>{text}</a>,
        },
        {
          title: "签退",
          dataIndex: "signOut",
          key: "signOut",
        },
        {
          title: "时长（分钟）",
          dataIndex: "time1",
          key: "time1",
        },
        {
          title: "时长（小时）",
          dataIndex: "time2",
          key: "time2",
        },
        {
          title: "操作",
          key: "action",
          render: (text, record) => (
            <Space size="middle">
              <a onClick={(e) => this.handleDelete(record, e)}>Delete</a>
            </Space>
          ),
        },
      ],
      tableData: [
        // {
        //   key: "1",
        //   indexSort: "John Brown",
        //   signIn: "8:32",
        //   signOut: "22:00",
        //   time1: "sada",
        //   time2: "dfsdf",
        // },
      ],
    };
  }

  componentDidMount(){
    let data =  localStorage.getItem('myData')
    let sum = localStorage.getItem('localsum')
    let ave = localStorage.getItem('localave')
    console.log(data)
    if(data){
      data = JSON.parse(data)
      sum = JSON.parse(sum)
      ave = JSON.parse(ave)
      this.setState({
        tableData:data,
        total:sum,
        average:ave
      })
    }
  }
  
  handleDelete = (record, e) => {
    let newData = this.state.tableData.filter(function (item) {
      return item.id !== record.id; //返回你选中删除之外的所有数据
    });
    console.log(newData);
    let sum = newData.reduce((acc, cur) => acc + Number(cur.time2), 0);
    console.log(this.state.tableData.length);
    let ave = sum / (this.state.tableData.length - 1);
    this.setState({
      tableData: newData,
      total: sum,
      average: ave,
    });
   
    setTimeout(() => {
      let data = JSON.stringify(this.state.tableData);
      let localsum = JSON.stringify(this.state.total);
      let localave = JSON.stringify(this.state.average);
      localStorage.setItem('myData',data)
      localStorage.setItem('localsum',localsum)
      localStorage.setItem('localave',localave)
    }, 0);
  };

  handleClick = () => {
    let d = new Date().toLocaleDateString();
    let h1 = this.state.h1;
    let h2 = this.state.h2;
    let m1 = this.state.m1;
    let m2 = this.state.m2;
    
    console.log(h1,h2)
    if (h2 - h1 < 0) {
      alert("签退时间要大于签到时间");
      return;
    } else if (h2 == h1) {
      if (m2 <= m1) {
        alert("签退时间要大于签到时间");
        return;
      }
    }

    let time1 = d + " " + h1 + ":" + m1 + ":" + "00";
    let time2 = d + " " + h2 + ":" + m2 + ":" + "00";

    let res = new Date(time2).getTime() - new Date(time1).getTime();
    res = res - 1000 * 3600 * 1.5;
    if (h2 > 18) {
      res = res - 1000 * 60 * 40;
    } else if (h2 == 18) {
      if (m2 >= 40) {
        res = res - 1000 * 60 * 40;
      } else {
        res = res - m2 * 60000;
      }
    }
    let dayDiff = Math.floor(res / (24 * 3600 * 1000));

    let leave1 = res % (24 * 3600 * 1000);

    let hours = Math.floor(leave1 / (3600 * 1000));

    let leave2 = leave1 % (3600 * 1000);

    let minutes = Math.floor(leave2 / (60 * 1000));

    let pot = Number(minutes / 60 + hours).toFixed(2);

    let obj = {};
    obj.date = this.state.curDate;
    obj.id = Date.parse(new Date()) + parseInt(Math.random()*100000);
    obj.signIn = `${h1}:${m1}`;
    obj.signOut = `${h2}:${m2}`;
    obj.time1 = `${hours}小时${minutes}分钟`;
    obj.time2 = `${pot}`;

    let sum = this.state.tableData.reduce(
      (acc, cur) => acc + Number(cur.time2),
      0
    );
   
    sum = Number(sum) + Number(pot);
    
    console.log(this.state.tableData.length);
    let ave = sum / (this.state.tableData.length + 1);

    // const obj1 = {
    //   key:12,
    //   indexSort:12,
    //   signIn:'8:20',
    //   signOut:'22:00',
    //   time1:'12312312',
    //   time2:'fsdfsfsfsd'
    // }
    const { tableData, average, total } = this.state;
    this.setState({
      tableData: [...tableData, obj],
      total: sum,
      average: ave,
      h1: 9,
      h2: 20,
      m1: 0,
      m2: 0,
    });
    setTimeout(() => {
      console.log(this.state.tableData)
      let localData = JSON.stringify(this.state.tableData)
      localStorage.setItem('myData',localData)
      let localsum = JSON.stringify(this.state.total)
      let localave = JSON.stringify(this.state.average)
      localStorage.setItem('localsum',localsum)
      localStorage.setItem('localave',localave)
    }, 0);
  };

  handleInput = (type, e) => {
    console.log(type, e.target.value);
    this.setState({
      [type]: e.target.value,
    });
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    let week = new Date(dateString).getDay();
    console.log(typeof week);
    let str = "";
    if (week == 0) {
      str = dateString + "(星期日)";
    } else if (week == 1) {
      str = dateString + "(星期一)";
    } else if (week == 2) {
      str = dateString + "(星期二)";
    } else if (week == 3) {
      str = dateString + "(星期三)";
    } else if (week == 4) {
      str = dateString + "(星期四)";
    } else if (week == 5) {
      str = dateString + "(星期五)";
    } else if (week == 6) {
      str = dateString + "(星期六)";
    }

    this.setState({
      curDate: str,
    });
    setTimeout(() => {
      console.log(this.state.curDate);
    }, 0);
  };
  selectOnChange = (value)=>{
    console.log(value)
    this.setState({
      h2:value
    })
  }
  onSearch=(val) => {
    console.log('search:', val);
    
  }
  deletAll = () => {
    if(this.state.tableData.length>0){
      this.setState({
        tableData:[],
        total:0,
        average:0
      })
      localStorage.removeItem('myData')
      localStorage.removeItem('localsum')
      localStorage.removeItem('localave')
    }
  }

  render() {
    return (
      <div>
        <>
          <Row>
            <Col span={8} className="left-pd">
              <div className="top">
                <div className="ml-space">
                  请选择日期: 
                  <Space direction="vertical">
                    <DatePicker onChange={this.onChange} />
                  </Space>
                </div>
                <div>
                  请输入签到时间：
                  <Input
                    type="Number"
                    max={24}
                    min={0}
                    className="single-input"
                    value={this.state.h1}
                    onChange={(e) => {
                      this.handleInput("h1", e);
                    }}
                  />
                  :
                  <Input
                    type="Number"
                    defaultValue={0}
                    max={60}
                    min={0}
                    className="single-input"
                    value={this.state.m1}
                    onChange={(e) => {
                      this.handleInput("m1", e);
                    }}
                  />
                </div>
              </div>
              <div>
                请输入签退时间：
                <Select
                  className="select-input"
                  showSearch
                  placeholder="Select"
                  onChange={this.selectOnChange}
                  value = {this.state.h2}
                  onSearch={this.onSearch}
                  optionFilterProp="children"
                >
                  <Option value="17">17</Option>
                  <Option value="18">18</Option>
                  <Option value="19">19</Option>
                  <Option value="20">20</Option>
                  <Option value="21">21</Option>
                  <Option value="22">22</Option>
                  <Option value="23">23</Option>
                </Select>
                :
                <Input
                  type="Number"
                  defaultValue={0}
                  max={60}
                  min={0}
                  className="single-input"
                  value={this.state.m2}
                  onChange={(e) => {
                    this.handleInput("m2", e);
                  }}
                />{" "}
              </div>
              <Button
                type="primary"
                size="large"
                className="btn"
                onClick={this.handleClick}
              >
                计算
              </Button>
              <ul style={{ color: "red" }}>
                <li>注意：</li>
                <li>1.签到时间早于12点，签退时间晚于18点</li>
                <li>2.不要输入负数以及其他数字以外的字符</li>
              </ul>
            </Col>
            <Col span={16}>
              <Table
                className="top bottom"
                columns={this.state.columns}
                dataSource={this.state.tableData}
                rowKey={(record) => {
                  return record.id + Date.now(); //在这里加上一个时间戳就可以了
                }}
                pagination={false}
              />
              <span className="ml-3">
                共{this.state.tableData.length}条数据
              </span>{" "}
              <Space>{}</Space>
              <span className="ml-3">共计{this.state.total}个小时</span>
              <span>平均时长为{this.state.average}小时</span>
              <span style={{float:"right",marginRight:"100px"}}><Button type="primary" onClick={this.deletAll} danger>全部删除</Button></span>
            </Col>
          </Row>
        </>
      </div>
    );
  }
}

export default App;
