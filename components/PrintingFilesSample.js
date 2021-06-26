class PrintingFilesSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientPrinter: null,
            printFiles: [],
            printJobTrace: "",
            lastJobStatus: "",
            displayTrace: true
        };
    }

    createPrintJob() {
        var cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = this.state.clientPrinter;
        if (this.state.printFiles) {
            let files = this.state.printFiles;
            for (let j = 0; j < files.length; j++) {
                let my_file;
                let file_ext;

                if (files[j].name) {
                    file_ext = files[j].name
                        .split(".")
                        .pop()
                        .toLowerCase();

                    if (file_ext == "pdf") {
                        my_file = new JSPM.PrintFilePDF(files[j], JSPM.FileSourceType.BLOB, files[j].name, 1);
                    } else if (file_ext == "tif") {
                        my_file = new JSPM.PrintFileTIF(files[j], JSPM.FileSourceType.BLOB, files[j].name, 1);
                    } else if (file_ext == "txt") {
                        my_file = new JSPM.PrintFileTXT(files[j], files[j].name, 1, JSPM.FileSourceType.BLOB);
                    } else {
                        my_file = new JSPM.PrintFile(files[j], JSPM.FileSourceType.BLOB, files[j].name, 1);
                    }
                } else {
                    file_ext = files[j]
                        .split(".")
                        .pop()
                        .toLowerCase();

                    if (file_ext == "pdf") {
                        my_file = new JSPM.PrintFilePDF(files[j], JSPM.FileSourceType.URL, "myFileToPrint." + file_ext, 1);
                    } else if (file_ext == "tif") {
                        my_file = new JSPM.PrintFileTIF(files[j], JSPM.FileSourceType.URL, "myFileToPrint." + file_ext, 1);
                    } else if (file_ext == "txt") {
                        my_file = new JSPM.PrintFileTXT(files[j], "myFileToPrint." + file_ext, 1, JSPM.FileSourceType.URL);
                    } else {
                        my_file = new JSPM.PrintFile(files[j], JSPM.FileSourceType.URL, "myFileToPrint." + file_ext, 1);
                    }
                }

                cpj.files.push(my_file);
            }

            let _this = this;
            cpj.onUpdated = function (data) {
                _this.logPrintJobTrace(data);
            };

            cpj.onFinished = function(data) {
                _this.logPrintJobTrace(data);
            };
        }

        return cpj;
    }

    logPrintJobTrace(data) {
        if (this.state.lastJobStatus != JSON.stringify(data)) {
            console.info(data);
            this.state.lastJobStatus = JSON.stringify(data);
            let buffer = this.state.printJobTrace;
            this.setState({ printJobTrace: buffer + "> " + this.state.lastJobStatus + "\r\n" });
        }
    }

    onPrinterChange(newPrinter) {
        this.state.clientPrinter = newPrinter;
    }

    onPrintFilesChange(newFiles) {
        this.state.printFiles = newFiles;
    }

    setDisplayTrace(event) {
        this.setState({ displayTrace: event.target.checked });
    }

    doPrinting() {
        let cpj = this.createPrintJob();
        if (cpj) {
            cpj.sendToClient();
        }
    }

    render() {
        let printJobTrace = this.state.printJobTrace;
        let displayTraceStyle = this.state.displayTrace ? {} : { display: "none" };

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
                            <i className="fa fa-file-image-o" />&nbsp;Print Images &amp; Docs
                        </h2>
                        <hr />
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <Printers JobContentType={1} onPrinterChange={this.onPrinterChange.bind(this)} />
                    </div>
                    <div className="row">
                        <PrintJobForFiles jobIndex={0} onPrintFilesChange={this.onPrintFilesChange.bind(this)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id="displayTrace" name="displayTrace" onChange={this.setDisplayTrace.bind(this)} defaultChecked={this.state.displayTrace} />
                            <label className="custom-control-label" htmlFor="displayTrace">
                                Display Print Job Trace
                            </label>
                        </div>
                        <small>
                            <textarea className="terminal" name="txtPrintJobTrace" readOnly value={printJobTrace} style={displayTraceStyle} />
                        </small>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <br />
                        <div className="text-center">
                            <button className="btn btn-success btn-lg" onClick={this.doPrinting.bind(this)}>
                                <i className="fa fa-print" /> Print Now...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

window.PrintingFilesSample = PrintingFilesSample;
