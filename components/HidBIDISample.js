class HidBIDISample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfHidDevices: -1,
            hidDevices: [],
            hidDevicePath: "",
            hidComm: null,
            hidCommState: 0, // 0 = closed, 1 = sending, 2 = data received, 3 = error
            dataToSend: "",
            dataReceived: ""
        };
    }

    sethidDevices(hidDevicesList) {
        this.state.numOfHidDevices = hidDevicesList.length;
        this.setState({ hidDevices: hidDevicesList });
    }
    
    componentDidMount() {
        JSPM.JSPrintManager.Caller = this;
        //get client HID devices
        JSPM.JSPrintManager.getHidDevices().then(function(hidDevicesList) {
            JSPM.JSPrintManager.Caller.sethidDevices(hidDevicesList);
        });
    }
    
    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    doSendData() {
        if (!this.state.hidComm) {
            this.state.dataReceived += "HID COMM is not connected!\r\n";
            this.setState({ hidCommState: 3 });
        } else if (this.state.dataToSend.length > 0) {
            this.setState({ hidCommState: 1 });
            this.state.hidComm.send(this.state.dataToSend);
            this.state.dataReceived += "> " + this.state.dataToSend + "\r\n";
        }
    }

    doOpen() {
        this.state.hidComm = new JSPM.HIDComm(this.state.hidDevicePath);

        let _this = this;

        this.state.hidComm.onDataReceived = function(data) {
            _this.state.dataReceived += "< " + data + "\r\n";
            console.log("Data Received:" + data);
            _this.setState({ hidCommState: 2 });
        };

        this.state.hidComm.onError = function(data, is_critical) {
            _this.state.dataReceived += "ERROR: " + data + "\r\n";
            console.log("Error: " + data);
            _this.setState({ hidCommState: 3 });
        };

        this.state.hidComm.onClose = function(data) {
            _this.state.dataReceived += "HID COMM CLOSED!" + "\r\n";
            console.log("Closed: " + data);
            _this.setState({ hidCommState: 0 });
            _this.setState({ hidComm: null });
        };
        this.state.hidComm.connect().then(_ => {
            _this.state.dataReceived += "HID COMM CONNECTED!" + "\r\n";
            _this.setState({ hidCommState: 1 });
        });
    }

    doClose() {
        this.state.hidComm.close();
    }

    render() {
        let dataReceived = this.state.dataReceived;

        let demoContent;

        let hidDevices = this.state.hidDevices;
        
        if (this.state.numOfHidDevices == -1) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <img src="loading.gif" id="loadingPrintersInfo" />
                            <br />
                            <strong>Getting HID devices info...</strong>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.numOfHidDevices == 0) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <div className="alert alert-danger">
                                <div className="text-center">
                                    No HID devices were detected on this system.   
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
                                  <strong>HID Comm Settings</strong>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-md-12">
                                  <div className="small alert alert-warning">
                                      <label>
                                          Device Path
                                          <input className="form-control form-control-sm" name="hidDevicePath" onChange={this.setData.bind(this)} />
                                      </label>
                                      <a className="btn btn-info btn-sm" data-toggle="modal" data-target="#bd-devices-dialog" href="">
                                            View HID Devices...
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

        let availableHidDevices = (
            <div id="bd-devices-dialog" className="modal fade topMost" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Available HID Devices
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
                                            <th>Device Path</th>
                                            <th>Vendor ID</th>
                                            <th>Product ID</th>
                                            <th>Serial Number</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hidDevices.map(function(item, i) {
                                            let opt = (
                                                <tr key={i}>
                                                    <td>{item.name}</td>
                                                    <td>{item.device_path}</td>   
                                                    <td>{item.vendor_id}</td>
                                                    <td>{item.product_id}</td>
                                                    <td>{item.serial_number}</td>
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
                            <i className="fa fa-usb iconDemo" />&nbsp;BIDI HID Comm
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}

                {availableHidDevices}
            </div>
        );
    }
}

window.UsbBIDISample = UsbBIDISample;
