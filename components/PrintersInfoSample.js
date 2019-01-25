class PrintersInfoSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPrinterIndex: 0,
            installedPrinters: []
        };
    }

    setInstalledPrinters(printersList) {
        this.setState({ installedPrinters: printersList });
        console.log(printersList);
    }

    setPrinterState(event) {
        this.setState({ selectedPrinterIndex: event.target.value });
    }

    componentDidMount() {
        //get client installed printers with detailed info
        JSPM.JSPrintManager.Caller = this;
        JSPM.JSPrintManager.getPrintersInfo().then(function(printersList) {
            JSPM.JSPrintManager.Caller.setInstalledPrinters(printersList);
        });
    }

    render() {
        let demoContent;

        if (this.state.installedPrinters.length == 0) {
            demoContent = (
              <div className="row">
                <div className="col-md-12">
                  <div className="text-center">
                    <img src="loading.gif" id="loadingPrintersInfo" />
                    <br />
                    <strong>Getting printers info...</strong>
                  </div>
                </div>
              </div>
          );
        } else {
            let isVirtual = true;
            let printerPort = this.state.installedPrinters[
              this.state.selectedPrinterIndex
            ].port.toLowerCase();

            if (printerPort != "nul" && this.state.installedPrinters[
              this.state.selectedPrinterIndex
            ].BIDIEnabled) 
                isVirtual = false;
            else if (printerPort.indexOf("usb") >= 0 && printerPort.indexOf("?serial=") >= 0)
                isVirtual = false;


            demoContent = (
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-3">
                        <label>Printers:</label>
            <select
            className="form-control form-control-sm"
            onChange={this.setPrinterState.bind(this)}
          >
            {this.state.installedPrinters.map(function(item, i) {
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
                        <label>It seems to be a...</label>
                        <div>
                          <h2
                            className={
                              isVirtual
                                ? "badge badge-warning"
                                : "badge badge-info"
                        }
                          >
                        {isVirtual
                              ? "VIRTUAL PRINTER"
                              : "REAL/PHYSICAL PRINTER"}
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label>Supported Trays:</label>
                        <select
                          className="form-control form-control-sm"
                          name="printerTrayName"
                        >
                        {this.state.installedPrinters[
                            this.state.selectedPrinterIndex
                        ].trays.map(function(item) {
                            let opt = (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            );
                            return opt;
                        })}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Supported Papers:</label>
                        <select
                          className="form-control form-control-sm"
                          name="printerPaperName"
                        >
                        {this.state.installedPrinters[
                            this.state.selectedPrinterIndex
                        ].papers.map(function(item) {
                            let opt = (
                              <option key={item} value={item}>
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
                              <td><strong>Port Name:</strong></td>
                              <td>
                        {
                                  this.state.installedPrinters[
                                    this.state.selectedPrinterIndex
                        ].port
                        }
                              </td>
                              <td><strong>Horizontal Resolution (dpi):</strong></td>
                              <td>
                                {
                                    this.state.installedPrinters[
                                      this.state.selectedPrinterIndex
                                    ].XDPI
                                }
                              </td>
                              <td><strong>Vertical Resolution (dpi):</strong></td>
                              <td>
                                {
                                    this.state.installedPrinters[
                                      this.state.selectedPrinterIndex
                                    ].YDPI
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                <h4>
                          <span
                            className={
                                this.state.installedPrinters[
                                  this.state.selectedPrinterIndex
                                ].connected
                                  ? "badge badge-info fa fa-check"
                                  : "badge badge-danger fa fa-close"
                            }
                          >
                            &nbsp;
                            </span>{" "}
                            Is Connected?
                          </h4>
                                </td>  
                                <td colSpan="2">
                                  <h4>
                            <span
                            className={
                                this.state.installedPrinters[
                                  this.state.selectedPrinterIndex
                                ].default
                                  ? "badge badge-info fa fa-check"
                                  : "badge badge-danger fa fa-close"
                            }
                          >
                            &nbsp;
                            </span>{" "}
                            Is Default?
                          </h4>      
                                </td>
                                <td colSpan="2">
                                  <h4>
                            <span
                            className={
                                this.state.installedPrinters[
                                  this.state.selectedPrinterIndex
                                ].BIDIEnabled
                                  ? "badge badge-info fa fa-check"
                                  : "badge badge-danger fa fa-close"
                            }
                          >
                            &nbsp;
                            </span>{" "}
                            Is BIDI Enabled?
                          </h4>      
                              </td>
                              </tr>
                              <tr>
                                <td colSpan="2">
                                  <h4>
                            <span
                            className={
                                this.state.installedPrinters[
                                  this.state.selectedPrinterIndex
                                ].isLocal
                                  ? "badge badge-info fa fa-check"
                                  : "badge badge-danger fa fa-close"
                            }
                          >
                            &nbsp;
                            </span>{" "}
                            Is Local?
                          </h4>
                              
                              </td>
                              <td colSpan="2">
                                <h4>
                            <span
                            className={
                                this.state.installedPrinters[
                                  this.state.selectedPrinterIndex
                                ].isNetwork
                                  ? "badge badge-info fa fa-check"
                                  : "badge badge-danger fa fa-close"
                            }
                          >
                            &nbsp;
                            </span>{" "}
                            Is Network?
                          </h4>
                              
                              </td>
                              <td colSpan="2">
                                <h4>
                            <span
                            className={
                                this.state.installedPrinters[
                                  this.state.selectedPrinterIndex
                                ].isShared
                                  ? "badge badge-info fa fa-check"
                                  : "badge badge-danger fa fa-close"
                            }
                          >
                            &nbsp;
                            </span>{" "}
                            Is Shared?
                          </h4>      
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

    return (
      <div>
        <div className="row">
          <div className="col-md-1">
            <button
              className="btn btn-dark btn-lg"
              onClick={() => this.props.setSample(0)}
                  >
                    <i className="fa fa-arrow-left" />
                  </button>
                </div>
                <div className="col-md-11">
                  <h2 className="text-center">
                    <i className="fa fa-print" />&nbsp;Printers Info
                  </h2>
                  <hr />
                </div>
              </div>

                    {demoContent}
            </div>
          );
                    }
}

window.PrintersInfoSample = PrintersInfoSample;