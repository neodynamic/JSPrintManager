class PrintingPDFSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfFile: null,
            selectedPrinterIndex: 0,
            installedPrinters: [],
            printerName: "",
            printerTrayName: "",
            printerPaperName: "",
            printAnnotations: false,
            printAsGrayscale: false,
            printInReverseOrder: false,
            printRange: "",
            printRotation: "None",
            job: null
        };
    }

    setPdfFile(event) {
        //no need to re-render
        if (event.target.name == "input-local-pdf-file")
            this.state.pdfFile = Array.from(event.target.files);
        else this.state.pdfFile = [event.target.value];
    }

    setInstalledPrinters(printersList) {
        this.setState({ installedPrinters: printersList });
        this.state.printerName = printersList[0].name;
        this.updatePrintJob();
    }

    setPrinterState(event) {
        this.setState({ selectedPrinterIndex: event.target.value });
        this.state.printerName = this.state.installedPrinters[
          event.target.value
        ].name;
        this.updatePrintJob();
    }

    setData(event) {
        //no need for re-render
        this.state[event.target.name] = event.target.checked
          ? event.target.checked
          : event.target.value;
        this.updatePrintJob();
    }
    f;
    updatePrintJob() {
        //no need to re-render
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.state.printerName, false, this.state.printerTrayName, this.state.printerPaperName);

        if (this.state.pdfFile) {
            let myPdfFile;

            if (this.state.pdfFile[0].name)
                myPdfFile = new JSPM.PrintFilePDF(
                  this.state.pdfFile[0],
                  JSPM.FileSourceType.BLOB,
                  this.state.pdfFile[0].name,
                  1
                );
            else
                myPdfFile = new JSPM.PrintFilePDF(
                  this.state.pdfFile[0],
                  JSPM.FileSourceType.URL,
                  "myFileToPrint.pdf",
                  1
                );

            myPdfFile.printAnnotations = this.state.printAnnotations;
            myPdfFile.printAsGrayscale = this.state.printAsGrayscale;
            myPdfFile.printInReverseOrder = this.state.printInReverseOrder;
            myPdfFile.printRange = this.state.printRange;
            myPdfFile.printRotation =
              JSPM.PrintRotation[this.state.printRotation];

            cpj.files.push(myPdfFile);
        }

        this.state.job = cpj;
    }

    componentDidMount() {
        //get client installed printers with detailed info
        JSPM.JSPrintManager.Caller = this;
        JSPM.JSPrintManager.getPrintersInfo().then(function(printersList) {
            JSPM.JSPrintManager.Caller.setInstalledPrinters(printersList);
        });
    }

    doPrinting() {
        if (this.state.job) {
            let cpj = this.state.job;
            cpj.sendToClient();
        }
    }

    render() {
        let demoContent;

        if (this.state.installedPrinters.length == 0) {
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
            demoContent = (
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-12">
                        <strong>PDF File to print</strong>
                        <ul
            className="nav nav-tabs"
            id="myTabPdf"
            role="tablist"
          >
            <li className="nav-item">
              <a
            className="nav-link active"
            id="local-pdf-file-tab"
            data-toggle="tab"
            href="#local-pdf-file"
            role="tab"
            aria-controls="local-pdf-file"
            aria-selected="true"
          >
            Local PDF File
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id="remote-pdf-file-tab"
            data-toggle="tab"
            href="#remote-pdf-file"
            role="tab"
            aria-controls="remote-pdf-file"
            aria-selected="false"
          >
            PDF File from URL
          </a>
        </li>
      </ul>
      <div className="tab-content" id="myTabPdfContent">
        <div
            className="tab-pane fade show active"
            id="local-pdf-file"
            role="tabpanel"
            aria-labelledby="local-pdf-file"
          >
            <br />
            <input
            name="input-local-pdf-file"
            type="file"
            className="form-control-file"
            onChange={this.setPdfFile.bind(this)}
          />
        </div>
        <div
            className="tab-pane fade"
            id="remote-pdf-file"
            role="tabpanel"
            aria-labelledby="remote-pdf-file"
          >
            <br />
            URL for PDF File
            <input
              name="input-file-url"
              className="form-control form-control-sm"
              onChange={this.setPdfFile.bind(this)}
        />
      </div>
    </div>
  </div>
</div>
<hr />
<div className="row">
                      <div className="col-md-12">
                        <strong>Target Printer</strong>
                      </div>
                    </div>
<div className="row">
  <div className="col-md-3">
    <label>Printer:</label>
        <select
        className="form-control form-control-sm"
        onChange={this.setPrinterState.bind(this)}
      >
        {this.state.installedPrinters.map(function(item, i) {
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
                        <select
                          className="form-control form-control-sm"
                          name="printerTrayName"
                          onChange={this.setData.bind(this)}
                        >
                            {this.state.installedPrinters[
                              this.state.selectedPrinterIndex
                            ].trays.map(function(item, i) {
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
                        <select
                          className="form-control form-control-sm"
                          name="printerPaperName"
                          onChange={this.setData.bind(this)}
                        >
                            {this.state.installedPrinters[
                              this.state.selectedPrinterIndex
                            ].papers.map(function(item, i) {
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
                            <select
                            className="form-control form-control-sm"
                            name="printRotation"
                            onChange={this.setData.bind(this)}
                          >
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
                          <label>Pages Range: [e.g. 1,2,3,10-15]</label>
                            <input
                            type="text"
                            className="form-control form-control-sm"
                            name="printRange"
                            onChange={this.setData.bind(this)}
                          />
                        </div>
                        <div className="col-md-3">
                          <div className="checkbox">
                            <label>
                              <input
                          id="printInReverseOrder"
                            type="checkbox"
                            name="printInReverseOrder"
                            onChange={this.setData.bind(this)}
                          />
                          Print In Reverse Order?
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="checkbox">
                        <label>
                          <input
                            id="chkPrintAnnotations"
                            type="checkbox"
                            name="printAnnotations"
                            onChange={this.setData.bind(this)}
                          />
                          Print Annotations?{" "}
                          <span className="badge badge-info">
                            Windows Only
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="checkbox">
                        <label>
                          <input
                            id="chkPrintAsGrayscale"
                            type="checkbox"
                            name="printAsGrayscale"
                            onChange={this.setData.bind(this)}
                          />
                          Print As Grayscale?{" "}
                          <span className="badge badge-info">
                            Windows Only
                          </span>
                        </label>
                      </div>
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
            <button
              className="btn btn-dark btn-lg"
              onClick={() => this.props.setSample(0)}
                  >
                    <i className="fa fa-arrow-left" />
                  </button>
                </div>
                <div className="col-md-11">
                  <h2 className="text-center">
                    <i className="fa fa-file-pdf-o" />&nbsp;Advanced PDF
                    Printing
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