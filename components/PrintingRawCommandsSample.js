class PrintingRawCommandsSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job: null,
            clientPrinter: null,
            printerCommands: "",
            printerCommandsCodePage: -1
        };
    }

    doPrinting() {
        if (this.state.job) {
            let cpj = this.state.job;
            cpj.sendToClient();
        }
    }

    updateJob() {
        var cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = this.state.clientPrinter;
        cpj.printerCommands = this.state.printerCommands;
        cpj.printerCommandsCodePage = this.state.printerCommandsCodePage; 
        //no need to re-render
        this.state.job = cpj;
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

    onPrinterCommandsCodePageChange(newCodepage) {
        //No need to re-render!
        this.state.printerCommandsCodePage = newCodepage;
        this.updateJob();
    }

    render() {
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
                            <i className="fa fa-barcode" />&nbsp;Raw Data Printing
                        </h2>
                        <hr />
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <Printers JobContentType={0} onPrinterChange={this.onPrinterChange.bind(this)} />
                    </div>
                    <div className="row">
                        <PrintJobForRawCommands jobIndex={0} onPrinterCommandsChange={this.onPrinterCommandsChange.bind(this)} onPrinterCommandsCodePageChange={this.onPrinterCommandsCodePageChange.bind(this)} />
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

window.PrintingRawCommandsSample = PrintingRawCommandsSample;
