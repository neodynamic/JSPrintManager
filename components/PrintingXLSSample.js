class PrintingXLSSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xlsFile: null,
            installedPrinters: [],
            printerName: "",
            pageFrom: 0,
            pageTo: 0
        };
    }

    setXlsFile(event) {
        if (event.target.name == "input-local-xls-file") this.state.xlsFile = Array.from(event.target.files);
        else this.state.xlsFile = [event.target.value];
    }

    setInstalledPrinters(printersList) {
        this.setState({ installedPrinters: printersList });
        this.state.printerName = printersList[0];
    }

    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    createPrintJob() {
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.state.printerName, false, null, null);

        if (this.state.xlsFile) {
            let myXlsFile;

            if (this.state.xlsFile[0].name) myXlsFile = new JSPM.PrintFileXLS(this.state.xlsFile[0], JSPM.FileSourceType.BLOB, this.state.xlsFile[0].name, 1);
            else myXlsFile = new JSPM.PrintFileXLS(this.state.xlsFile[0], JSPM.FileSourceType.URL, "myFileToPrint.xls", 1);

            myXlsFile.pageFrom = parseInt(this.state.pageFrom);
            myXlsFile.pageTo = parseInt(this.state.pageTo);

            cpj.files.push(myXlsFile);
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
                                        <strong>XLS File to print</strong>
                                        <ul className="nav nav-tabs" id="myTabXls" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="local-xls-file-tab" data-toggle="tab" href="#local-xls-file" role="tab" aria-controls="local-xls-file" aria-selected="true">
                                                    Local XLS File
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="remote-xls-file-tab" data-toggle="tab" href="#remote-xls-file" role="tab" aria-controls="remote-xls-file" aria-selected="false">
                                                    XLS File from URL
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTabXlsContent">
                                            <div className="tab-pane fade show active" id="local-xls-file" role="tabpanel" aria-labelledby="local-xls-file">
                                                <br />
                                                <input name="input-local-xls-file" type="file" className="form-control-file" onChange={this.setXlsFile.bind(this)} />
                                            </div>
                                            <div className="tab-pane fade" id="remote-xls-file" role="tabpanel" aria-labelledby="remote-xls-file">
                                                <br />
                                                URL for XLS File{" "}
                                                <small>
                                                    (e.g.{" "}
                                                    <a href="https://neodynamic.com/temp/Project-Scheduling-Monitoring-Tool.xls" target="_blank">
                                                        https://neodynamic.com/temp/Project-Scheduling-Monitoring-Tool.xls
                                                    </a>)
                                                </small>
                                                <input name="input-file-url" className="form-control form-control-sm" onChange={this.setXlsFile.bind(this)} />
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
                                    <div className="col-md-4">
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
                                    <div className="col-md-4">
                                        <label>Page From:</label>
                                        <input type="text" className="form-control form-control-sm" name="pageFrom" onChange={this.setData.bind(this)} />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Page To:</label>
                                        <input type="text" className="form-control form-control-sm" name="pageTo" onChange={this.setData.bind(this)} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <br />
                                        <div className="text-center">
                                            <button className="btn btn-success btn-lg" onClick={this.doPrinting.bind(this)}>
                                                <i className="fa fa-print" /> Print XLS Now...
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
                            <i className="fa fa-file-excel-o" />&nbsp;Advanced XLS Printing
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
                                        <strong>Microsoft Excel 97+</strong> must be installed at the client machine
                                    </li>
                                    <li>
                                        XLS files can be any of these file formats: <strong>*.xl, *.xlsx, *.xlsm, *.xlsb, *.xlam, *.xltx, *.xltm, *.xls, *.xla, *.xlt, *.xlm, *.xlw and *.ods</strong>
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

window.PrintingXLSSample = PrintingXLSSample;
