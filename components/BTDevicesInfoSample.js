class BTDevicesInfoSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfBTDevices: -1,
            btDevices: []
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

    
    render() {
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
                                    No Bluetooth devices detected on this system.   
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
                                
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Class</th>
                                    <th>Connected</th>
                                    <th>Remembered</th>
                                    <th>Authenticated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {btDevices.map(function(item, i) {
                                    let opt = (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td>{item.address}</td>
                                            <td>{item.class}</td>
                                            <td><div className="text-center">{item.connected ? <i className="fa fa-check" /> : <i className="fa fa-close" />}</div></td>
                                            <td><div className="text-center">{item.remembered ? <i className="fa fa-check" /> : <i className="fa fa-close" />}</div></td>
                                            <td><div className="text-center">{item.authenticated ? <i className="fa fa-check" /> : <i className="fa fa-close" />}</div></td>
                                        </tr>);
                                    return opt;
                                })}
                            </tbody>
                        </table>
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
                            <i className="fa fa-bluetooth" />&nbsp;Bluetooth Devices Info
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}

            </div>
        );
    }
}

window.BTDevicesInfoSample = BTDevicesInfoSample;
