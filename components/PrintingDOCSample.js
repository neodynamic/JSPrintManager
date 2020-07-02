class PrintingDOCSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            docFile: null,
            installedPrinters: [],
            printerName: "",
            printInReverseOrder: false,
            printRange: "",
            manualDuplex: false
        };
    }

    setDocFile(event) {
        if (event.target.name == "input-local-doc-file") this.state.docFile = Array.from(event.target.files);
        else this.state.docFile = [event.target.value];
    }

    setInstalledPrinters(printersList) {
        this.setState({ installedPrinters: printersList });
        this.state.printerName = printersList[0];
    }

    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    createPrintJob() {
        //no need to re-render
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.state.printerName, false, null, null);

        if (this.state.docFile) {
            let myDocFile;

            if (this.state.docFile[0].name) myDocFile = new JSPM.PrintFileDOC(this.state.docFile[0], JSPM.FileSourceType.BLOB, this.state.docFile[0].name, 1);
            else myDocFile = new JSPM.PrintFileDOC(this.state.docFile[0], JSPM.FileSourceType.URL, "myFileToPrint.doc", 1);

            myDocFile.printInReverseOrder = this.state.printInReverseOrder;
            myDocFile.printRange = this.state.printRange;
            myDocFile.manualDuplex = this.state.manualDuplex;

            cpj.files.push(myDocFile);
        }

        return cpj;
    }

    doPrinting() {
        let cpj = this.createPrintJob();
        if (cpj) {
            cpj.sendToClient();
        }
    }

    componentDidMount() {
        JSPM.JSPrintManager.Caller = this;
        //get client installed printers
        JSPM.JSPrintManager.getPrinters().then(function(printersList) {
            JSPM.JSPrintManager.Caller.setInstalledPrinters(printersList);
        });
    }

    render() {
        let demoContent;

        if (this.props.os == "win") {
            if (this.state.installedPrinters.length == 0) {
                demoContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center">
                                <img src="loading.gif" id="loadingPrintersInfo" />
                                <br />
                                <strong>Getting printers...</strong>
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
                                        <strong>DOC File to print</strong>
                                        <ul className="nav nav-tabs" id="myTabDoc" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="local-doc-file-tab" data-toggle="tab" href="#local-doc-file" role="tab" aria-controls="local-doc-file" aria-selected="true">
                                                    Local DOC File
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="remote-doc-file-tab" data-toggle="tab" href="#remote-doc-file" role="tab" aria-controls="remote-doc-file" aria-selected="false">
                                                    DOC File from URL
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTabDocContent">
                                            <div className="tab-pane fade show active" id="local-doc-file" role="tabpanel" aria-labelledby="local-doc-file">
                                                <br />
                                                <input name="input-local-doc-file" type="file" className="form-control-file" onChange={this.setDocFile.bind(this)} />
                                            </div>
                                            <div className="tab-pane fade" id="remote-doc-file" role="tabpanel" aria-labelledby="remote-doc-file">
                                                <br />
                                                URL for DOC File{" "}
                                                <small>
                                                    (e.g.{" "}
                                                    <a href="https://neodynamic.com/temp/Sample-Employee-Handbook.doc" target="_blank">
                                                        https://neodynamic.com/temp/Sample-Employee-Handbook.doc
                                                    </a>)
                                                </small>
                                                <input name="input-file-url" className="form-control form-control-sm" onChange={this.setDocFile.bind(this)} />
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
                                        <select name="printerName" className="form-control form-control-sm" onChange={this.setData.bind(this)}>
                                            {this.state.installedPrinters.map(function(i) {
                                                let opt = (
                                                    <option key={i} value={i}>
                                                        {i}
                                                    </option>
                                                );
                                                return opt;
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label>Pages Range: [e.g. 1,2,3,10-13]</label>
                                        <input type="text" className="form-control form-control-sm" name="printRange" onChange={this.setData.bind(this)} />
                                    </div>
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
                                            <input type="checkbox" className="custom-control-input" id="manualDuplex" name="manualDuplex" onChange={this.setData.bind(this)} />
                                            <label className="custom-control-label" htmlFor="manualDuplex">
                                                Duplex Printing
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <br />
                                        <div className="text-center">
                                            <button className="btn btn-success btn-lg" onClick={this.doPrinting.bind(this)}>
                                                <i className="fa fa-print" /> Print DOC Now...
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
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
                            <i className="fa fa-file-word-o" />&nbsp;Advanced DOC Printing
                        </h2>
                        <hr />
                        <div className="alert alert-warning">
                            <small>
                                <strong>Requirements:</strong>
                                <ul>
                                    <li>
                                        Available for <strong>Windows clients only</strong>
                                    </li>
                                    <li>
                                        <strong>Microsoft Word 97+</strong> must be installed at the client machine
                                    </li>
                                    <li>
                                        DOC files can be any of these file formats: <strong>*.docx, *.docm, *.dotx, *.dotm, *.doc, *.dot, *.rtf, and *.odt</strong>
                                    </li>
                                </ul>
                            </small>
                        </div>
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.PrintingDOCSample = PrintingDOCSample;
