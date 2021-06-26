class PrintingFileGroupDuplexSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filesGroup: null,
            selectedPrinterIndex: 0,
            printerName: "",
            printerTrayName: "",
            printerPaperName: "",
            printInReverseOrder: false,
            printRange: "",
            manualDuplex: false,
            driverDuplex: false
        };
    }

    setFilesGroup(event) {
        this.state.filesGroup = Array.from(event.target.files);
    }

    
    setPrinterState(event) {
        this.setState({ selectedPrinterIndex: event.target.value });
        this.state.printerName = this.props.printersInfo[event.target.value].name;
    }

    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    createPrintJob() {
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.state.printerName, false, this.state.printerTrayName, this.state.printerPaperName);

        if (this.state.filesGroup) {

            let files = [];

            for (let j = 0; j < this.state.filesGroup.length; j++) {
                let file_ext = this.state.filesGroup[j].name.split(".").pop().toLowerCase();
                if (file_ext == "pdf") {
                    files.push(new JSPM.PrintFilePDF(this.state.filesGroup[j], JSPM.FileSourceType.BLOB, this.state.filesGroup[j].name, 1));
                } else if (file_ext == "tif") {
                    files.push(new JSPM.PrintFileTIF(this.state.filesGroup[j], JSPM.FileSourceType.BLOB, this.state.filesGroup[j].name, 1));
                } else if (file_ext == "txt") {
                    files.push(new JSPM.PrintFileTXT(this.state.filesGroup[j], this.state.filesGroup[j].name, 1, JSPM.FileSourceType.BLOB));
                } else {
                    files.push(new JSPM.PrintFile(this.state.filesGroup[j], JSPM.FileSourceType.BLOB, this.state.filesGroup[j].name, 1));
                }
            }

            let myFileGroup = new JSPM.PrintFileGroup(files, "MyFileGroup", 1);

            myFileGroup.printInReverseOrder = this.state.printInReverseOrder;
            myFileGroup.printRange = this.state.printRange;
            if (this.state.manualDuplex === true) {
                myFileGroup.manualDuplex = this.state.manualDuplex;
            } else if (this.state.driverDuplex === true && this.props.printersInfo[this.state.selectedPrinterIndex].duplex === true) {
                cpj.clientPrinter.duplex = JSPM.DuplexMode.Default;
            }
            
            cpj.files.push(myFileGroup);
        }

        return cpj;
    }

    doPrinting() {
        let cpj = this.createPrintJob();
        if (cpj) {
            cpj.sendToClient();
        }
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

            let selPrinter = installedPrinters[this.state.selectedPrinterIndex];

            let driverDuplexStyle = selPrinter.duplex === true
                    ? { color: "black" }
                    : {
                        textDecoration: "line-through",
                        color: "red"
                    };

            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                        <i className="fa fa-info-circle" /> <small>Select a couple of image files in PNG or JPG format and print all of them as they were part of a multipage document!</small>
                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <ul className="nav nav-tabs" id="myTabFiles" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="local-files-tab" data-toggle="tab" href="#local-files" role="tab" aria-controls="local-files" aria-selected="true">
                                                Files to print
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabFilesContent">
                                        <div className="tab-pane fade show active" id="local-files" role="tabpanel" aria-labelledby="local-files">
                                            <br />
                                            <input name="input-local-files-group" type="file" className="form-control-file" onChange={this.setFilesGroup.bind(this)} accept=".jpg,.png" multiple />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <br />
                                            <div className="alert alert-info">
                                                <strong>Target Printer</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label>Printer:</label>
                                            <select className="form-control form-control-sm" onChange={this.setPrinterState.bind(this)}>
                                                {installedPrinters.map(function(item, i) {
                                                    let opt = (
                                                        <option key={i} value={i}>
                                                            {item.name}
                                                        </option>
                                                                            );
                                            return opt;
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label>Tray:</label>
                                            <select className="form-control form-control-sm" name="printerTrayName" onChange={this.setData.bind(this)}>
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
                                        <div className="col-md-4">
                                            <label>Paper:</label>
                                            <select className="form-control form-control-sm" name="printerPaperName" onChange={this.setData.bind(this)}>
                                                {selPrinter.papers.map(function(item, i) {
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
                                        <div className="col-md-4">
                                            <label>Pages Range: [e.g. 1,2,3,10-13]</label>
                                            <input type="text" className="form-control form-control-sm" name="printRange" onChange={this.setData.bind(this)} />
                                        </div>
                                                
                                        <div className="col-md-4">
                                            <div className="custom-control custom-switch">
                                                <input type="checkbox" className="custom-control-input" id="driverDuplex" name="driverDuplex" onChange={this.setData.bind(this)} disabled={selPrinter.duplex === false} />
                                                <label className="custom-control-label" htmlFor="driverDuplex" style={driverDuplexStyle}>
                                                    Use Driver Duplex Printing
                                                </label>
                                            </div>
                                            <div className="custom-control custom-switch">
                                                <input type="checkbox" className="custom-control-input" id="manualDuplex" name="manualDuplex" onChange={this.setData.bind(this)} />
                                                <label className="custom-control-label" htmlFor="manualDuplex">
                                                    Use Manual Duplex Printing
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="custom-control custom-switch">
                                                <input type="checkbox" className="custom-control-input" id="printInReverseOrder" name="printInReverseOrder" onChange={this.setData.bind(this)} />
                                                <label className="custom-control-label" htmlFor="printInReverseOrder">
                                                    Print In Reverse Order
                                                </label>
                                            </div>                                   
                                        </div>
                                                    
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <br />
                                            <div className="text-center">
                                                <button className="btn btn-success btn-lg" onClick={this.doPrinting.bind(this)}>
                                                    <i className="fa fa-print" /> Print File Group Now...
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
                            <i className="fa fa-files-o" />&nbsp;Print File Group as a single multipage document with Duplex!
                        </h2>
                        <hr />
                    </div>
                </div>
                            {demoContent}
            </div>
        );
                            }
}

window.PrintingFileGroupDuplexSample = PrintingFileGroupDuplexSample;
