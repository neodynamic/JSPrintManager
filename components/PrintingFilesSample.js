class PrintingFilesSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job: null,
            clientPrinter: null,
            printFiles: []
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
        if (this.state.printFiles) {
            let files = this.state.printFiles;
            for (let j = 0; j < files.length; j++) {
                let my_file;

                if (files[j].name)
                    my_file = new JSPM.PrintFile(
                      files[j],
                      JSPM.FileSourceType.BLOB,
                      files[j].name,
                      1
                    );
                else
                    my_file = new JSPM.PrintFile(
                      files[j],
                      JSPM.FileSourceType.URL,
                      "myFileToPrint." + files[j].split(".").pop(),
                      1
                    );

                cpj.files.push(my_file);
            }
        }

        //no need to re-render
        this.state.job = cpj;
    }

    onPrinterChange(newPrinter) {
        //No need to re-render!
        this.state.clientPrinter = newPrinter;
        this.updateJob();
    }

    onPrintFilesChange(newFiles) {
        //No need to re-render!
        this.state.printFiles = newFiles;
        this.updateJob();
    }

    render() {
        return (
          <div>
            <div className="row">
              <div className="col-md-1">
                <button
        className="btn btn-dark btn-lg"
        onClick={() => this.props.setSample(0)}
      >
        <i className="fa fa-arrow-left" />
      </button>
    </div>
    <div className="col-md-11">
      <h2 className="text-center">
        <i className="fa fa-file-image-o" />&nbsp;Print Images &amp;
        Docs
      </h2>
      <hr />
    </div>
  </div>
  <div className="card-body">
    <div className="row">
      <Printers
        JobContentType={1}
        onPrinterChange={this.onPrinterChange.bind(this)}
      />
    </div>
    <div className="row">
      <PrintJobForFiles
        jobIndex={0}
        onPrintFilesChange={this.onPrintFilesChange.bind(this)}
      />
    </div>
  </div>
  <div className="row">
    <div className="col-md-12">
      <br />
      <div className="text-center">
        <button
        className="btn btn-success btn-lg"
        onClick={this.doPrinting.bind(this)}
      >
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