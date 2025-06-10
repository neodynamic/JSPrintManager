class BTBIDISample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfBTDevices: -1,
            btDevices: [],
            btAddress: "",
            btChannel: 0,
            btComm: null,
            btCommState: 0, // 0 = closed, 1 = sending, 2 = data received, 3 = error
            dataToSend: "",
            dataReceived: ""
        };
    }

    setBTDevices(btDevicesList) {
        this.state.numOfBTDevices = btDevicesList.length;
        this.setState({ btDevices: btDevicesList });
    }
    
    componentDidMount() {
        JSPM.JSPrintManager.Caller = this;
        //get client BT devices
        JSPM.JSPrintManager.getBluetoothDevices().then(function(btDevicesList) {
            JSPM.JSPrintManager.Caller.setBTDevices(btDevicesList);
        });
    }
    
    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    doSendData() {
        if (!this.state.btComm) {
            this.state.dataReceived += "BT COMM is not connected!\r\n";
            this.setState({ btCommState: 3 });
        } else if (this.state.dataToSend.length > 0) {
            this.setState({ btCommState: 1 });
            this.state.btComm.send(this.state.dataToSend);
            this.state.dataReceived += "> " + this.state.dataToSend + "\r\n";
        }
    }

    doOpen() {
        this.state.btComm = new JSPM.BTComm(this.state.btAddress, parseInt(this.state.btChannel));

        let _this = this;

        this.state.btComm.onDataReceived = function(data) {
            _this.state.dataReceived += "< " + data + "\r\n";
            console.log("Data Received:" + data);
            _this.setState({ btCommState: 2 });
        };

        this.state.btComm.onError = function(data, is_critical) {
            _this.state.dataReceived += "ERROR: " + data + "\r\n";
            console.log("Error: " + data);
            _this.setState({ btCommState: 3 });
        };

        this.state.btComm.onClose = function(data) {
            _this.state.dataReceived += "BT COMM CLOSED!" + "\r\n";
            console.log("Closed: " + data);
            _this.setState({ btCommState: 0 });
            _this.setState({ btComm: null });
        };
        this.state.btComm.connect().then(_ => {
            _this.state.dataReceived += "BT COMM CONNECTED!" + "\r\n";
            _this.setState({ btCommState: 1 });
        });
    }

    doClose() {
        this.state.btComm.close();
    }

    render() {
        let dataReceived = this.state.dataReceived;

        let demoContent;

        let btDevices = this.state.btDevices;
        
        if (this.state.numOfBTDevices == -1) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <img src="loading.gif" id="loadingPrintersInfo" />
                            <br />
                            <strong>Getting Bluetooth devices info...</strong>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.numOfBTDevices == 0) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <div className="alert alert-danger">
                                <div className="text-center">
                                    No Bluetooth devices were detected on this system.   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {

            demoContent = (
              <div className="row">
                  <div className="col-md-12">
                      <div className="form-group">
                          <div className="row">
                              <div className="col-md-12">
                                  <strong>BT Comm Settings</strong>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-md-12">
                                  <div className="small alert alert-warning">
                                      <label>
                                          Address
                                          <input className="form-control form-control-sm" name="btAddress" placeholder="00:00:00:00:00:00" onChange={this.setData.bind(this)} />
                                      </label>
                                      <label>
                                          Channel
                                          <input className="form-control form-control-sm" name="btChannel" placeholder="1" onChange={this.setData.bind(this)} />
                                      </label>
                                      <a className="btn btn-info btn-sm" data-toggle="modal" data-target="#bd-devices-dialog" href="">
                                            View BT Devices...
                                        </a>
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
        }

        let availableBTDevices = (
            <div id="bd-devices-dialog" className="modal fade topMost" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Available Bluetooth Devices
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {btDevices.map(function(item, i) {
                                            let opt = (
                                                <tr key={i}>
                                                    <td>{item.name}</td>
                                                    <td>{item.address}</td>                                                    
                                                </tr>);
                                                        return opt;
                                                    })}
                                    </tbody>
                                </table>                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
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
                            <i className="fa fa-bluetooth-b iconDemo" />&nbsp;BIDI Bluetooth Comm
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}

                {availableBTDevices}
            </div>
        );
    }
}

window.BTBIDISample = BTBIDISample;
