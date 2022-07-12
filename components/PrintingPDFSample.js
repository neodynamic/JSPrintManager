class PrintingPDFSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfFile: null,
            selectedPrinterIndex: 0,
            printerName: "",
            printerTrayName: "",
            printerPaperName: "",
            printAnnotations: false,
            printAsGrayscale: false,
            printInReverseOrder: false,
            printRange: "",
            printRotation: "None",
            pageSizing: "None",
            manualDuplex: false,
            driverDuplex: false,
            printAutoRotate: false,
            printAutoCenter: false,
            duplexOption: "Default"
        };
    }

    setPdfFile(event) {
        if (event.target.name == "input-local-pdf-file") this.state.pdfFile = Array.from(event.target.files);
        else this.state.pdfFile = [event.target.value];
    }

    
    setPrinterState(event) {
        this.setState({ selectedPrinterIndex: event.target.value });
        this.state.printerName = this.props.printersInfo[event.target.value].name;
    }

    setData(event) {
        this.setState({[event.target.name] : event.target.checked ? event.target.checked : event.target.value});
    }

    createPrintJob() {
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.state.printerName, false, this.state.printerTrayName, this.state.printerPaperName);

        if (this.state.pdfFile) {
            let myPdfFile;

            if (this.state.pdfFile[0].name) myPdfFile = new JSPM.PrintFilePDF(this.state.pdfFile[0], JSPM.FileSourceType.BLOB, this.state.pdfFile[0].name, 1);
            else myPdfFile = new JSPM.PrintFilePDF(this.state.pdfFile[0], JSPM.FileSourceType.ExternalURL, "myFileToPrint.pdf", 1);

            myPdfFile.printAnnotations = this.state.printAnnotations;
            myPdfFile.printAsGrayscale = this.state.printAsGrayscale;
            myPdfFile.printInReverseOrder = this.state.printInReverseOrder;
            myPdfFile.printRange = this.state.printRange;
            myPdfFile.printRotation = JSPM.PrintRotation[this.state.printRotation];
            myPdfFile.pageSizing = JSPM.Sizing[this.state.pageSizing];
            if (this.state.manualDuplex === true) {
                myPdfFile.manualDuplex = this.state.manualDuplex;
            } else if (this.state.driverDuplex === true && this.props.printersInfo[this.state.selectedPrinterIndex].duplex === true) {
                cpj.clientPrinter.duplex = JSPM.DuplexMode[this.state.duplexOption];
            }
            myPdfFile.printAutoRotate = this.state.printAutoRotate;
            myPdfFile.printAutoCenter = this.state.printAutoCenter;

            cpj.files.push(myPdfFile);
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

            let duplexOptions;
            if (selPrinter.duplex === true && this.state.driverDuplex === true){
                duplexOptions = (
                                    <select className="form-control form-control-sm" name="duplexOption" onChange={this.setData.bind(this)}>
                                        <option>Default</option>
                                        <option>Simplex</option>
                                        <option>DuplexLongEdge</option>
                                        <option>DuplexShortEdge</option>
                                    </select>
                                 );
            }


            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-12">
                                    <strong>PDF File to print</strong>
                                    <ul className="nav nav-tabs" id="myTabPdf" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="local-pdf-file-tab" data-toggle="tab" href="#local-pdf-file" role="tab" aria-controls="local-pdf-file" aria-selected="true">
                                                Local PDF File
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="remote-pdf-file-tab" data-toggle="tab" href="#remote-pdf-file" role="tab" aria-controls="remote-pdf-file" aria-selected="false">
                                                PDF File from URL
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabPdfContent">
                                        <div className="tab-pane fade show active" id="local-pdf-file" role="tabpanel" aria-labelledby="local-pdf-file">
                                            <br />
                                            <input name="input-local-pdf-file" type="file" className="form-control-file" onChange={this.setPdfFile.bind(this)} />
                                        </div>
                                        <div className="tab-pane fade" id="remote-pdf-file" role="tabpanel" aria-labelledby="remote-pdf-file">
                                            <br />
                                            URL for PDF File{" "}
                                            <small>
                                                (e.g.{" "}
                                                <a href="https://neodynamic.com/temp/mixed-page-orientation.pdf" target="_blank">
                                                    https://neodynamic.com/temp/mixed-page-orientation.pdf
                                                </a>)
                                            </small>
                                            <input name="input-file-url" className="form-control form-control-sm" onChange={this.setPdfFile.bind(this)} />
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
                                            {duplexOptions}
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
                                        <input type="checkbox" className="custom-control-input" id="printAnnotations" name="printAnnotations" onChange={this.setData.bind(this)} />
                                        <label className="custom-control-label" htmlFor="printAnnotations">
                                            Print Annotations
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
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <br />
                                    <div className="text-center">
                                        <button className="btn btn-success btn-lg" onClick={this.doPrinting.bind(this)}>
                                            <i className="fa fa-print" /> Print PDF Now...
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
                            <i className="fa fa-file-pdf-o" />&nbsp;Advanced PDF Printing
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.PrintingPDFSample = PrintingPDFSample;
