class SerialPortBIDISample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfSerialPorts: -1,
            serialPorts: [],
            serialPort: "",
            serialPortBaudRate: 9600,
            serialPortParity: "None",
            serialPortStopBits: "One",
            serialPortDataBits: "Eight",
            serialPortFlowControl: "None",
            serialComm: null,
            serialCommState: 0, // 0 = closed, 1 = sending, 2 = data received, 3 = error
            dataToSend: "",
            dataReceived: "",
            endLineChars: ""
        };
    }

    setSerialPorts(portsList) {
        this.state.numOfSerialPorts = portsList.length;
        this.setState({ serialPorts: portsList });
    }

    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    componentDidMount() {
        JSPM.JSPrintManager.Caller = this;
        //get serial ports if any
        JSPM.JSPrintManager.getSerialPorts().then(function(portsList) {
            JSPM.JSPrintManager.Caller.setSerialPorts(portsList);
        });
    }

    doSendData() {
        if (!this.state.serialComm) {
            this.state.dataReceived += "Serial port is not open!\r\n";
            this.setState({ serialCommState: 3 });
        } else if (this.state.dataToSend.length > 0) {
            this.setState({ serialCommState: 1 });
            this.state.serialComm.send(this.state.dataToSend + this.state.endLineChars.replace('CR', '\r').replace('LF', '\n'));
            this.state.dataReceived += "> " + this.state.dataToSend + "\r\n";
        }
    }

    doOpen() {
        this.state.serialComm = new JSPM.SerialComm(this.state.serialPort, parseInt(this.state.serialPortBaudRate), JSPM.Serial.Parity[this.state.serialPortParity], JSPM.Serial.StopBits[this.state.serialPortStopBits], JSPM.Serial.DataBits[this.state.serialPortDataBits], JSPM.Serial.Handshake[this.state.serialPortFlowControl]);

        let _this = this;

        this.state.serialComm.onDataReceived = function(data) {
            _this.state.dataReceived += "< " + data + "\r\n";
            console.log("Data Received:" + data);
            _this.setState({ serialCommState: 2 });
        };

        this.state.serialComm.onError = function(data, is_critical) {
            _this.state.dataReceived += "ERROR: " + data + "\r\n";
            console.log("Error: " + data);
            _this.setState({ serialCommState: 3 });
        };

        this.state.serialComm.onClose = function(data) {
            _this.state.dataReceived += "COMM CLOSED!" + "\r\n";
            console.log("Closed: " + data);
            _this.setState({ serialCommState: 0 });
        };
        this.state.serialComm.open().then(_ => {
            _this.state.dataReceived += "COMM OPEN!" + "\r\n";
            _this.setState({ serialCommState: 1 });
        });
    }

    doClose() {
        if (!this.state.serialComm && this.state.serialComm.isOpen !== true) {
            this.state.dataReceived += "Serial port is not open!\r\n";
            this.setState({ serialCommState: 3 });
        } else this.state.serialComm.close();
    }

    render() {
        let demoContent;

        if (this.state.numOfSerialPorts == -1) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <img src="loading.gif" id="loadingSerialPorts" />
                            <br />
                            <strong>Getting serial ports...</strong>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.numOfSerialPorts == 0) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <div className="alert alert-danger">No serial ports detected on this system.</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            let ports = this.state.serialPorts;
            let dataReceived = this.state.dataReceived;
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-12">
                                    <strong>Serial Comm Settings</strong>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="small alert alert-warning">
                                        <label>
                                            Serial Port
                                            <select className="form-control form-control-sm" name="serialPort" onChange={this.setData.bind(this)}>
                                                <option defaultValue value="" />
                                                {ports.map(function(i) {
                                                    let opt = (
                                                        <option key={i} value={i}>
                                                            {i}
                                                        </option>
                                                    );
                                                    return opt;
                                                })}
                                            </select>
                                        </label>
                                        <label>
                                            Baud Rate
                                            <input className="form-control form-control-sm" name="serialPortBaudRate" placeholder="9600" onChange={this.setData.bind(this)} />
                                        </label>
                                        <label>
                                            Data Bits
                                            <select className="form-control form-control-sm" name="serialPortDataBits" onChange={this.setData.bind(this)}>
                                                <option value="Eight">8</option>
                                                <option value="Seven">7</option>
                                                <option value="Six">6</option>
                                                <option value="Five">5</option>
                                            </select>
                                        </label>
                                        <label>
                                            Parity
                                            <select className="form-control form-control-sm" name="serialPortParity" onChange={this.setData.bind(this)}>
                                                <option value="None">None</option>
                                                <option value="Odd">Odd</option>
                                                <option value="Even">Even</option>
                                                <option value="Mark">Mark</option>
                                                <option value="Space">Space</option>
                                            </select>
                                        </label>
                                        <label>
                                            Stop bits
                                            <select className="form-control form-control-sm" name="serialPortStopBits" onChange={this.setData.bind(this)}>
                                                <option value="One">1</option>
                                                <option value="OnePointFive">1.5</option>
                                                <option value="Two">2</option>
                                            </select>
                                        </label>
                                        <label>
                                            Flow control
                                            <select className="form-control form-control-sm" name="serialPortFlowControl" onChange={this.setData.bind(this)}>
                                                <option value="None">None</option>
                                                <option value="XOnXOff">XOnXOff</option>
                                                <option value="RequestToSend">RTS (Request to send)</option>
                                                <option value="RequestToSendXOnXOff">RTS XOnXOff</option>
                                            </select>
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
                                        <select name="endLineChars" onChange={this.setData.bind(this)}>
                                            <option value="">None</option>
                                            <option value="CR">CR</option>
                                            <option value="LF">LF</option>
                                            <option value="CRLF">CRLF</option>
                                        </select>
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
        }

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
                            <i className="fa fa-exchange iconDemo" />&nbsp;BIDI Serial Comm
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.SerialPortBIDISample = SerialPortBIDISample;
