import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { Component } from "react";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    address: "",
    value: "",
    status: "-",
  };

  componentDidMount = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayer().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const address = lottery.options.address;
    this.setState({ manager, balance, address, players });
  };

  pickWinner = async (event) => {
    event.preventDefault();

    const account = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: account[0],
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const account = await web3.eth.getAccounts();

    this.setState({ status: "wait we are processing" });
    await lottery.methods.enter().send({
      from: account[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ status: "processed" });
  };

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          The manager of this contract is {this.state.manager} and the address
          is {this.state.address} and {this.state.players.length} are competing
          to win {web3.utils.fromWei(this.state.balance, "ether")} ether. All
          the players are {this.state.players}
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4> Wanna try your luck</h4>
          <div>
            <label>Enter the amount </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>submit</button>
        </form>

        <hr />

        <h4>{this.state.status}</h4>
        <hr />

        <form onSubmit={this.pickWinner}>
          <button> Pick a winner</button>
        </form>
      </div>
    );
  }
}

export default App;
