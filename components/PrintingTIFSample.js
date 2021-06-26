class PrintingTIFSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tifFile: null,
            selectedPrinterIndex: 0,
            printerName: "",
            printerTrayName: "",
            printerPaperName: "",
            printAsGrayscale: false,
            printInReverseOrder: false,
            printRange: "",
            printRotation: "None",
            pageSizing: "None",
            manualDuplex: false,
            driverDuplex: false,
            printAutoRotate: false,
            printAutoCenter: false
        };
    }

    setTifFile(event) {
        if (event.target.name == "input-local-tif-file") this.state.tifFile = Array.from(event.target.files);
        else this.state.tifFile = [event.target.value];
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

        if (this.state.tifFile) {
            let myTifFile;

            if (this.state.tifFile[0].name) myTifFile = new JSPM.PrintFileTIF(this.state.tifFile[0], JSPM.FileSourceType.BLOB, this.state.tifFile[0].name, 1);
            else myTifFile = new JSPM.PrintFileTIF(this.state.tifFile[0], JSPM.FileSourceType.URL, "myFileToPrint.tif", 1);

            myTifFile.printAsGrayscale = this.state.printAsGrayscale;
            myTifFile.printInReverseOrder = this.state.printInReverseOrder;
            myTifFile.printRange = this.state.printRange;
            myTifFile.printRotation = JSPM.PrintRotation[this.state.printRotation];
            myTifFile.pageSizing = JSPM.Sizing[this.state.pageSizing];
            if (this.state.manualDuplex === true) {
                myTifFile.manualDuplex = this.state.manualDuplex;
            } else if (this.state.driverDuplex === true && this.props.printersInfo[this.state.selectedPrinterIndex].duplex === true) {
                cpj.clientPrinter.duplex = JSPM.DuplexMode.Default;
            }
            myTifFile.printAutoRotate = this.state.printAutoRotate;
            myTifFile.printAutoCenter = this.state.printAutoCenter;

            cpj.files.push(myTifFile);
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
                                    <strong>TIF File to print</strong>
                                    <ul className="nav nav-tabs" id="myTabTif" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="local-tif-file-tab" data-toggle="tab" href="#local-tif-file" role="tab" aria-controls="local-tif-file" aria-selected="true">
                                                Local TIF File
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="remote-tif-file-tab" data-toggle="tab" href="#remote-tif-file" role="tab" aria-controls="remote-tif-file" aria-selected="false">
                                                TIF File from URL
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabTifContent">
                                        <div className="tab-pane fade show active" id="local-tif-file" role="tabpanel" aria-labelledby="local-tif-file">
                                            <br />
                                            <input name="input-local-tif-file" type="file" className="form-control-file" onChange={this.setTifFile.bind(this)} />
                                        </div>
                                        <div className="tab-pane fade" id="remote-tif-file" role="tabpanel" aria-labelledby="remote-tif-file">
                                            <br />
                                            URL for TIF File{" "}
                                            <small>
                                                (e.g.{" "}
                                                <a href="https://neodynamic.com/temp/patent2pages.tif" target="_blank">
                                                    https://neodynamic.com/temp/patent2pages.tif
                                                </a>)
                                            </small>
                                            <input name="input-file-url" className="form-control form-control-sm" onChange={this.setTifFile.bind(this)} />
                                        </div>
                                        <br />
                                    </div>
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
                                <div className="col-md-3">
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
                                <div className="col-md-3">
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
                                <div className="col-md-3">
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
                                <div className="col-md-3">
                                    <label>Print Rotation (Clockwise):</label>
                                    <select className="form-control form-control-sm" name="printRotation" onChange={this.setData.bind(this)}>
                                        <option>None</option>
                                        <option>Rot90</option>
                                        <option>Rot180</option>
                                        <option>Rot270</option>
                                    </select>
                                </div>
                            </div>
                            <br />

                            <div className="row">
                                <div className="col-md-3">
                                    <label>Pages Range: [e.g. 1,2,3,10-13]</label>
                                    <input type="text" className="form-control form-control-sm" name="printRange" onChange={this.setData.bind(this)} />
                                </div>
                                <div className="col-md-3">
                                    <div className="custom-control custom-switch">
                                        <input type="checkbox" className="custom-control-input" id="printAutoCenter" name="printAutoCenter" onChange={this.setData.bind(this)} />
                                        <label className="custom-control-label" htmlFor="printAutoCenter">
                                            Auto Center
                                        </label>
                                    </div>
                                    <div className="custom-control custom-switch">
                                        <input type="checkbox" className="custom-control-input" id="printAutoRotate" name="printAutoRotate" onChange={this.setData.bind(this)} />
                                        <label className="custom-control-label" htmlFor="printAutoRotate">
                                            Auto Rotate
                                        </label>
                                    </div>
                                </div>                                
                                <div className="col-md-3">
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
                                <div className="col-md-3">
                                    <label>Page Sizing:</label>
                                    <select name="lstPrintRotation" name="pageSizing" className="form-control form-control-sm" onChange={this.setData.bind(this)}>
                                        <option>None</option>
                                        <option>Fit</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="custom-control custom-switch">
                                        <input type="checkbox" className="custom-control-input" id="printInReverseOrder" name="printInReverseOrder" onChange={this.setData.bind(this)} />
                                        <label className="custom-control-label" htmlFor="printInReverseOrder">
                                            Print In Reverse Order
                                        </label>
                                    </div>                                   
                                </div>
                                <div className="col-md-3">
                                    <div className="custom-control custom-switch">
                                        <input type="checkbox" className="custom-control-input" id="printAsGrayscale" name="printAsGrayscale" onChange={this.setData.bind(this)} />
                                        <label className="custom-control-label" htmlFor="printAsGrayscale">
                                            Print As Grayscale
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-3">

                                </div>
                                <div className="col-md-3">

                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <br />
                                    <div className="text-center">
                                        <button className="btn btn-success btn-lg" onClick={this.doPrinting.bind(this)}>
                                            <i className="fa fa-print" /> Print TIF Now...
                                        </button>
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
                            <i className="fa fa-files-o" />&nbsp;Advanced TIF Printing
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.PrintingTIFSample = PrintingTIFSample;
