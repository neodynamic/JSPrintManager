class PrintingMultiplePrintJobsSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: []
        };
    }

    removeJob(i) {
        let arr = this.state.jobs;
        arr.splice(i, 1);
        this.setState({ jobs: arr });
    }

    addJob() {
        let arr = this.state.jobs;
        arr.push(new JSPM.ClientPrintJob());
        this.setState({ jobs: arr });
    }

    updateJob(i, pj) {
        //no need to re-render
        this.state.jobs[i] = pj;
    }

    doPrinting() {
        var cpjg = new JSPM.ClientPrintJobGroup();
        for (var i = 0; i < this.state.jobs.length; i++) {
            cpjg.jobs.push(this.state.jobs[i]);
        }
        cpjg.sendToClient();
    }

    render() {
        let printButton;
        if (this.state.jobs.length > 0) {
            printButton = (
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
                            <i className="fa fa-barcode" />+
                            <i className="fa fa-file-text" />&nbsp;Print Multiple Jobs in one shot!
                        </h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <button className="btn btn-info btn-lg" onClick={this.addJob.bind(this)}>
                            <i className="fa fa-plus" /> Add Print Job
                        </button>
                    </div>
                    <div className="col-md-9">
                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                            <i className="fa fa-info-circle" /> <small>You can print raw commands and files to different client printers if needed!</small>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="accordion">
                    {this.state.jobs.map((pj, i) => {
                        return <PrintJob key={i} jobIndex={i} removeJobHandler={this.removeJob.bind(this)} updateJobHandler={this.updateJob.bind(this)} />;
                    })}
                </div>
                {printButton}
            </div>
        );
    }
}

window.PrintingMultiplePrintJobsSample = PrintingMultiplePrintJobsSample;
