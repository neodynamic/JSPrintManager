class PrintersWatcherSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printersTrace:""
        };

        this.printerCreatedEventID = null;
        this.printerDeletedEventID = null;
        this.printerUpdatedEventID = null;

    }

    
    componentDidMount() {
        JSPM.JSPrintManager.Caller = this;
        
        let _this = this;

        if (this.props.os == "win") {

            //set printers watcher event handlers

            this.printerCreatedEventID = JSPM.JSPrintManager.onPrinterCreated(
                data => {
                    console.info(data);
                    let buffer = _this.state.printersTrace;
                    _this.setState({ printersTrace: buffer + "PRINTER CREATED! >>> " + JSON.stringify(data) + "\r\n" });
                },
                err => {
                    console.error(err);
                }
            );

            this.printerUpdatedEventID = JSPM.JSPrintManager.onPrinterUpdated(
                data => {
                    console.info(data);
                    let buffer = _this.state.printersTrace;
                    _this.setState({ printersTrace: buffer + "PRINTER UPDATED! >>> " + JSON.stringify(data) + "\r\n" });
                },
                err => {
                    console.error(err);
                }
            );

            this.printerDeletedEventID = JSPM.JSPrintManager.onPrinterDeleted(
                data => {
                    console.info(data);
                    let buffer = _this.state.printersTrace;
                    _this.setState({ printersTrace: buffer + "PRINTER DELETED! >>> " + JSON.stringify(data) + "\r\n" });
                },
                err => {
                    console.error(err);
                }
            );
        }
    }

    componentWillUnmount() {
        if (this.printerCreatedEventID) JSPM.JSPrintManager.unsubscribePrinterEvent(this.printerCreatedEventID);
        if (this.printerDeletedEventID) JSPM.JSPrintManager.unsubscribePrinterEvent(this.printerDeletedEventID);
        if (this.printerUpdatedEventID) JSPM.JSPrintManager.unsubscribePrinterEvent(this.printerUpdatedEventID);
    }


    render() {
        let demoContent;

        let printersTrace = this.state.printersTrace;

        if (this.props.os == "win") {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <p>Add, Delete/Remove or Update an existing printer in your system and the info will be reflected below.</p>
                        <small>
                            <textarea className="terminal" name="txtPrintersTrace" readOnly value={printersTrace} />
                        </small>
                    </div>
                </div>
            );
        } else {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="alert alert-warning">
                            Available for <strong>Windows clients only</strong>
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
                            <i className="fa fa-eye iconDemo" />&nbsp;Printers Watcher
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.PrintersWatcherSample = PrintersWatcherSample;
