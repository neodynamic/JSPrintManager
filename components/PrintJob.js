class PrintJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printJobType: 0,
            clientPrinter: null,
            printerCommands: "",
            printFiles: []
        };
    }

    setPrintJobType(event) {
        this.setState({ printJobType: event.target.value });
    }

    deleteJob() {
        this.props.removeJobHandler(this.props.jobIndex);
    }

    updateJob() {
        var cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = this.state.clientPrinter;
        cpj.printerCommands = this.state.printerCommands;
        if (this.state.printFiles) {
            let files = this.state.printFiles;
            for (let j = 0; j < files.length; j++) {
                let my_file;

                if (files[j].name) my_file = new JSPM.PrintFile(files[j], JSPM.FileSourceType.BLOB, files[j].name, 1);
                else my_file = new JSPM.PrintFile(files[j], JSPM.FileSourceType.URL, "myFileToPrint." + files[j].split(".").pop(), 1);

                cpj.files.push(my_file);
            }
        }

        this.props.updateJobHandler(this.props.jobIndex, cpj);
    }

    onPrinterChange(newPrinter) {
        //No need to re-render!
        this.state.clientPrinter = newPrinter;
        this.updateJob();
    }
    onPrinterCommandsChange(newPrinterCommands) {
        //No need to re-render!
        this.state.printerCommands = newPrinterCommands;
        this.updateJob();
    }
    onPrintFilesChange(newFiles) {
        //No need to re-render!
        this.state.printFiles = newFiles;
        this.updateJob();
    }

    render() {
        let jobIndex = "collapse-" + this.props.jobIndex;
        let jobIndexDT = "#" + jobIndex;
        let jobType = <PrintJobForRawCommands jobIndex={this.props.jobIndex} onPrinterCommandsChange={this.onPrinterCommandsChange.bind(this)} />;
        if (this.state.printJobType == 1) {
            jobType = <PrintJobForFiles jobIndex={this.props.jobIndex} onPrintFilesChange={this.onPrintFilesChange.bind(this)} />;
        }

        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        <div className="input-group">
                            <div className="input-group-prepend" data-toggle="collapse" data-target={jobIndexDT} aria-expanded="true" aria-controls={jobIndex}>
                                <label className="input-group-text" htmlFor="selectcontentType" data-toggle="tooltip" data-placement="left" title="Expand/Collapse">
                                    <i className="fa fa-list-alt" />&nbsp;Print Job Content Type:
                                </label>
                            </div>
                            <select className="custom-select" aria-describedby="selectcontentType" onChange={this.setPrintJobType.bind(this)}>
                                <option value="0">RAW Printer Commands</option>
                                <option value="1">Files (PDF, TXT, PNG, JPG, etc.)</option>
                            </select>
                            <div className="input-group-append">
                                <button className="btn btn-danger" type="button" onClick={this.deleteJob.bind(this)}>
                                    <i className="fa fa-minus white" />
                                </button>
                            </div>
                            <div className="input-group-append">
                                <button className="btn btn-dark" type="button" data-toggle="collapse" data-target={jobIndexDT} aria-expanded="true" aria-controls={jobIndex}>
                                    <i className="fa fa-chevron-down white" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id={jobIndex} className="collapse show" data-parent="#accordion">
                        <div className="card-body">
                            <div className="row">
                                <Printers JobContentType={this.state.printJobType} onPrinterChange={this.onPrinterChange.bind(this)} />
                            </div>
                            <div className="row">{jobType}</div>
                        </div>
                    </div>
                </div>
                <br />
            </div>
        );
    }
}

window.PrintJob = PrintJob;
