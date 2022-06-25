class PrintersInfoSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPrinterIndex: 0,
            paperInfo:null
        };
        this.ppnTimer = null;
    }

    componentDidMount() {
        this.ppnTimer = setInterval(() => {
            let installedPrinters = this.props.printersInfo; 
            if (installedPrinters){
                let selPrinter = installedPrinters[this.state.selectedPrinterIndex];
                if (selPrinter.papers && selPrinter.papers.length > 0){
                    let selectPPN = document.getElementById('printerPaperName');
                    let _this = this;
                    JSPM.JSPrintManager.getPaperInfo(selPrinter.name, selectPPN.value).then((objPaperInfo) => {
                        _this.setState({paperInfo: objPaperInfo});              
                    })
                    .catch((m) => {
                        _this.setState({paperInfo: null});
                    })
                } else{
                    this.setState({paperInfo: null});
                } 
            }
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.ppnTimer);  
    }

    setPrinterState(printerIndex) {
        this.setState({ selectedPrinterIndex: printerIndex });
    }


    roundToTwo(num){
        return +(Math.round(num + "e+2") + "e-2");
    }
    
    render() {
        let demoContent;

        let installedPrinters = this.props.printersInfo;

        if (!installedPrinters) {
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
            let selPrinter = installedPrinters[this.state.selectedPrinterIndex];

            let self = this;

            let printerPort = selPrinter.port.toLowerCase();

            if (printerPort != "nul" && selPrinter.BIDIEnabled) isVirtual = false;
            else if (printerPort.indexOf("usb") >= 0 && printerPort.indexOf("?serial=") >= 0) isVirtual = false;

            let selPrinterIconSrc = (selPrinter.icon && selPrinter.icon.length > 0) ? "data:image/png;base64," + selPrinter.icon : null;
            let selPrinterIcon = selPrinterIconSrc ? (<img src={selPrinterIconSrc} />) : "";

            let selPaperInfo;
            let pi = this.state.paperInfo;
            if (pi != null){
                selPaperInfo = (
                    <div className="alert alert-info">
                      <small>
                      <strong>W x H: </strong>{this.roundToTwo(parseFloat(pi.width)/parseFloat(pi.dpi))} <strong>x</strong> {this.roundToTwo(parseFloat(pi.height)/parseFloat(pi.dpi))} <strong>inches</strong><br/>
                      <strong>Printable Area (L, T, R, B): </strong>
                      {this.roundToTwo(parseFloat(pi.printableArea.left)/parseFloat(pi.dpi))}<strong>,</strong>
                      {this.roundToTwo(parseFloat(pi.printableArea.top)/parseFloat(pi.dpi))}<strong>,</strong>
                      {this.roundToTwo(parseFloat(pi.printableArea.right)/parseFloat(pi.dpi))}<strong>,</strong>
                      {this.roundToTwo(parseFloat(pi.printableArea.bottom)/parseFloat(pi.dpi))} <strong>inches</strong>
                      </small>
                    </div>    
                );
            }

            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Printers:</label>
                                    <div className="dropdown">
                                      <a className="myDropDown" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-expanded="false">
                                        {selPrinterIcon}&nbsp;{selPrinter.name}
                                      </a>

                                      <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" style={{overflowY:'auto',maxHeight:'200px'}}>
                                        {installedPrinters.map(function(item, i) {
                                            let printerIconSrc = (item.icon && item.icon.length > 0) ? "data:image/png;base64," + item.icon : null;
                                            let printerIcon = printerIconSrc ? (<img src={printerIconSrc} />) : "";
                                            let printerClassName = (i == self.state.selectedPrinterIndex ? "dropdown-item active" : "dropdown-item");
                                            let opt = (
                                                <a key={i} className={printerClassName} href="#" onClick={e => self.setPrinterState(i)}>{printerIcon}&nbsp;{item.name}</a>
                                                );
                                                    return opt;
                                                })}
                                      </div>
                                    </div>

                                    

                                </div>
                                
                                <div className="col-md-3">
                                    <label>Supported Trays:</label>
                                    <select className="form-control form-control-sm" name="printerTrayName">
                                        {selPrinter.trays.map(function(item, i) {
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
                                    <label>Supported Papers:</label>
                                    <select className="form-control form-control-sm" name="printerPaperName" id="printerPaperName">
                                        {selPrinter.papers.map(function(item, i) {
                                            let opt = (
                                                <option key={i} value={item}>
                                                    {item}
                                                </option>
                                            );
                                            return opt;
                                        })}
                                    </select>
                                    {selPaperInfo}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <br />
                                    <br />
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>Port Name:</strong>
                                                </td>
                                                <td>{selPrinter.port}</td>
                                                <td>
                                                    <strong>Horizontal Resolution (dpi):</strong>
                                                </td>
                                                <td>{selPrinter.XDPI}</td>
                                                <td>
                                                    <strong>Vertical Resolution (dpi):</strong>
                                                </td>
                                                <td>{selPrinter.YDPI}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selPrinter.connected ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Is Connected?
                                                    </h4>
                                                </td>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selPrinter.default ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Is Default?
                                                    </h4>
                                                </td>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selPrinter.BIDIEnabled ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Is BIDI Enabled?
                                                    </h4>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selPrinter.isLocal ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Is Local?
                                                    </h4>
                                                </td>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selPrinter.isNetwork ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Is Network?
                                                    </h4>
                                                </td>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selPrinter.isShared ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Is Shared?
                                                    </h4>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <h4>
                                                        <span className={selPrinter.duplex ? "badge badge-info fa fa-check" : "badge badge-danger fa fa-close"}>&nbsp;</span> Duplex Support?
                                                    </h4>
                                                </td>
                                                <td colSpan="2">
                                                    <strong>It seems to be a...</strong><span className={isVirtual ? "badge badge-warning" : "badge badge-info"}>{isVirtual ? "VIRTUAL PRINTER" : "REAL/PHYSICAL PRINTER"}</span>                                                        
                                                </td>
                                                <td colSpan="2" />
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
                        <button className="btn btn-dark btn-lg" onClick={() => this.props.setSample(0)}>
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
