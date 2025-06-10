class ScannersInfoSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scannersInfo: null,
            selectedScannerIndex: 0
        };
    }

    scannersInfoChanged(newScannersInfo) {
        this.setState({
            scannersInfo: newScannersInfo
        });
    }

    componentDidMount() {
        JSPM.JSPrintManager.Caller = this;
        
        let _this = this;

        if (this.props.os == "win") {
            JSPM.JSPrintManager.Caller.scannersInfoChanged(null);
            //get client installed scanners with detailed info
            JSPM.JSPrintManager.getScannersInfo().then(function (scannersList) {
                JSPM.JSPrintManager.Caller.scannersInfoChanged(scannersList);
            });
        }
    }

    setScannerState(event) {
        this.setState({ selectedScannerIndex: event.target.value });
    }

    
    render() {
        let demoContent;

        if (this.props.os == "win") {
            let installedScanners = this.state.scannersInfo;

            if (!installedScanners) {
                demoContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center">
                                <img src="loading.gif" id="loadingScannersInfo" />
                                <br />
                                <strong>Getting scanners info...</strong>
                            </div>
                        </div>
                    </div>
                );
            } 
            else if (installedScanners.length == 0) {
                demoContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center">
                                <div className="alert alert-danger">
                                    <div className="text-center">
                                    No scanners were detected on this system.
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                );
            }
            else {
                let selScanner = installedScanners[this.state.selectedScannerIndex];

                let self = this;

                demoContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label>Scanners:</label>
                                            <select className="form-control form-control-sm" onChange={this.setScannerState.bind(this)}>
                                                {installedScanners.map(function(item, i) {
                                                    let opt = (
                                                        <option key={i} value={i}>
                                                            {item.name}
                                                        </option>
                                                                                );
                                                    return opt;
                                                })}
                                            </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label>Manufacturer:</label>
                                            <div>
                                                <strong>{selScanner.manufacturer}</strong>
                                            </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label>Horizontal Resolutions:</label>
                                        <select className="form-control form-control-sm" name="scannerXDPI" id="scannerXDPI">
                                            {selScanner.XDPI.map(function(item, i) {
                                                let opt = (
                                                    <option key={i} value={item}>
                                                        {item}
                                                    </option>
                                                                            );
                                                    return opt;
                                                })}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label>Vertical Resolutions:</label>
                                        <select className="form-control form-control-sm" name="scannerYDPI" id="scannerYDPI">
                                        {selScanner.YDPI.map(function(item, i) {
                                            let opt = (
                                                <option key={i} value={item}>
                                                    {item}
                                                </option>
                                                );
                                            return opt;
                                        })}
                                        </select>
                                    </div>
                                </div>
                                
                            <div className="row">
                                <div className="col-md-12">
                                    <br />
                                    <br />
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selScanner.duplex ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Duplex support?
                                                    </h4>
                                                </td>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selScanner.feeder ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Feeder?
                                                    </h4>
                                                </td>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selScanner.controlledByUI ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> UI controllable?
                                                    </h4>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="6">
                                                    <strong>Status: </strong> {selScanner.status}
                                                </td>
                                            </tr>                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
                                    }
        } else {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="alert alert-warning">
                            Available for <strong>Windows clients only</strong>
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
                            <i className="fa fa-th-list" />&nbsp;Scanners Info
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.ScannersInfoSample = ScannersInfoSample;
