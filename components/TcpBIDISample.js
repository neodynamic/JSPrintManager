class TcpBIDISample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tcpAddress: "",
            tcpPort: 0,
            tcpComm: null,
            tcpCommState: 0, // 0 = closed, 1 = sending, 2 = data received, 3 = error
            dataToSend: "",
            dataReceived: ""
        };
    }

    
    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    doSendData() {
        if (!this.state.tcpComm) {
            this.state.dataReceived += "TCP Comm is not connected!\r\n";
            this.setState({ tcpCommState: 3 });
        } else if (this.state.dataToSend.length > 0) {
            this.setState({ tcpCommState: 1 });
            this.state.tcpComm.send(this.state.dataToSend);
            this.state.dataReceived += "> " + this.state.dataToSend + "\r\n";
        }
    }

    doOpen() {
        this.state.tcpComm = new JSPM.TcpComm(this.state.tcpAddress, parseInt(this.state.tcpPort));

        let _this = this;

        this.state.tcpComm.onDataReceived = function(data) {
            _this.state.dataReceived += "< " + data + "\r\n";
            console.log("Data Received:" + data);
            _this.setState({ tcpCommState: 2 });
        };

        this.state.tcpComm.onError = function(data, is_critical) {
            _this.state.dataReceived += "ERROR: " + data + "\r\n";
            console.log("Error: " + data);
            _this.setState({ tcpCommState: 3 });
        };

        this.state.tcpComm.onClose = function(data) {
            _this.state.dataReceived += "TCP COMM CLOSED!" + "\r\n";
            console.log("Closed: " + data);
            _this.setState({ tcpCommState: 0 });
        };
        this.state.tcpComm.connect().then(_ => {
            _this.state.dataReceived += "TCP COMM CONNECTED!" + "\r\n";
            _this.setState({ tcpCommState: 1 });
        });
    }

    doClose() {
        this.state.tcpComm.close();
    }

    render() {
        let dataReceived = this.state.dataReceived;
        let demoContent = (
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-12">
                                <strong>TCP Comm Settings</strong>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="small alert alert-warning">
                                    <label>
                                        Address
                                        <input className="form-control form-control-sm" name="tcpAddress" placeholder="10.0.0.1" onChange={this.setData.bind(this)} />
                                    </label>
                                    <label>
                                        Port
                                        <input className="form-control form-control-sm" name="tcpPort" placeholder="8001" onChange={this.setData.bind(this)} />
                                    </label>
                                    <br />
                                    <button className="btn btn-success" type="button" onClick={this.doOpen.bind(this)}>
                                        Open
                                    </button>
                                    &nbsp;&nbsp;
                                    <button className="btn btn-danger" type="button" onClick={this.doClose.bind(this)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <strong>Data to Send:</strong>
                                <div className="input-group mb-3">
                                    <input placeholder="Type Data here..." aria-label="Type Data here..." aria-describedby="basic-addon2" className="form-control text-monospace" name="dataToSend" onChange={this.setData.bind(this)} />
                                    <div className="input-group-append">
                                        <button className="btn btn-info" type="button" onClick={this.doSendData.bind(this)}>
                                            Send...
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <small>
                                    <textarea className="terminal" name="txtDataReceived" readOnly value={dataReceived} />
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        

        return (
            <div>
                <div className="row">
                    <div className="col-md-1">
                        <button className="btn btn-dark btn-lg" onClick={() => this.props.setSample(0)}>
                            <i className="fa fa-arrow-left" />
                        </button>
                    </div>
                    <div className="col-md-11">
                        <h2 className="text-center">
                            <i className="fa fa-exchange iconDemo" />&nbsp;BIDI TCP Comm
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.TcpBIDISample = TcpBIDISample;
