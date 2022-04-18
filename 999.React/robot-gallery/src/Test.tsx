import React from "react";
import logo from "./assets/images/logo.svg";
import robots from "./mockdata/robots.json";
import Robot from "./components/Robot";
import styles from "./App.module.css";
import ShoppingCart from "./components/ShoppingCart";

interface Props {}

interface State {
  num: number;
}

class Test extends React.Component<Props, State> {
  timerID!: any;
  constructor(props) {
    super(props);
    this.state = {
      num: new Date().getTime(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  tick() {
    this.setState({
      num: new Date().getTime()
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  

  render() {
    return (
      <div>
        <p>这是标题，呜呜呜呜</p>
        <p>{this.state.num}</p>
        <p>这是结尾，哈哈哈哈</p>
      </div>
    );
  }
}

export default Test;
