class PrintingTXTSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txtContent: null,
            selectedPrinterIndex: 0,
            installedPrinters: [],
            printerName: "",
            printerTrayName: "",
            printerPaperName: "",
            fontName: "Arial",
            fontSize: 8,
            fontBold: false,
            fontItalic: false,
            fontUnderline: false,
            fontStrikethrough: false,
            textAlign: "Left",
            fontColor: "#000000",
            printOrientation: "Portrait",
            job: null
        };
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

    setFontStyle(event) {
        //no need for re-render
        var val = event.currentTarget.classList.contains("active");
        var name = event.currentTarget.querySelector("input").name;
        this.state[name] = val;
        this.updatePrintJob();
    }

    setTextAlign(event) {
        //no need for re-render
        var val = event.currentTarget.classList.contains("active");
        var name = event.currentTarget.querySelector("input").name;
        var textAlign = "Left";
        if (val && name == "CenterAlign") textAlign = "Center";
        if (val && name == "RightAlign") textAlign = "Right";
        if (val && name == "JustifyAlign") textAlign = "Justify";
        this.state["textAlign"] = textAlign;
        this.updatePrintJob();
    }

    updatePrintJob() {
        //no need to re-render
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.state.printerName, false, this.state.printerTrayName, this.state.printerPaperName);

        if (this.state.txtContent) {
            let myTxtFile = new JSPM.PrintFileTXT(
              this.state.txtContent,
              "myFileToPrint.txt",
              1
            );

            myTxtFile.textAligment = JSPM.TextAlignment[this.state.textAlign];
            myTxtFile.fontName = this.state.fontName;
            myTxtFile.fontBold = this.state.fontBold;
            myTxtFile.fontItalic = this.state.fontItalic;
            myTxtFile.fontUnderline = this.state.fontUnderline;
            myTxtFile.fontStrikethrough = this.state.fontStrikethrough;
            myTxtFile.fontSize = this.state.fontSize;
            myTxtFile.fontColor = this.state.fontColor;
            myTxtFile.printOrientation =
              JSPM.PrintOrientation[this.state.printOrientation];

            cpj.files.push(myTxtFile);
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
                        <strong>Enter Text to print</strong>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="btn-toolbar" role="toolbar">
                          <div className="btn-group btn-group-sm" role="group">
                            <select
            className="form-control form-control-sm"
            name="fontName"
            onChange={this.setData.bind(this)}
          >
            <option>Arial</option>
            <option>Courier New</option>
            <option>Comic Sans MS</option>
            <option>Verdana</option>
          </select>
        </div>
        <div className="btn-group btn-group-sm" role="group">
          <select
            className="form-control form-control-sm"
            name="fontSize"
            onChange={this.setData.bind(this)}
          >
            <option>8</option>
            <option>10</option>
            <option>12</option>
            <option>14</option>
            <option>16</option>
          </select>
        </div>
        <div
            className="btn-group-toggle btn-group-sm"
            data-toggle="buttons"
          >
            <label
            className="btn btn-light"
            onClick={this.setFontStyle.bind(this)}
          >
            <input
            type="checkbox"
            autoComplete="off"
            name="fontBold"
          />
          <i className="fa fa-bold" aria-hidden="true" />
        </label>
        <label
            className="btn btn-light"
            onClick={this.setFontStyle.bind(this)}
          >
            <input
            type="checkbox"
            autoComplete="off"
            name="fontItalic"
          />
          <i className="fa fa-italic" aria-hidden="true" />
        </label>
        <label
            className="btn btn-light"
            onClick={this.setFontStyle.bind(this)}
          >
            <input
            type="checkbox"
            autoComplete="off"
            name="fontUnderline"
          />
          <i
            className="fa fa-underline"
            aria-hidden="true"
          />
        </label>
        <label
            className="btn btn-light"
            onClick={this.setFontStyle.bind(this)}
          >
            <input
            type="checkbox"
            autoComplete="off"
            name="fontStrikethrough"
          />
          <i
            className="fa fa-strikethrough"
            aria-hidden="true"
          />
        </label>
      </div>
      <div
            className="btn-group btn-group-sm btn-group-toggle"
            data-toggle="buttons"
          >
            <label
            className="btn btn-light active"
            onClick={this.setTextAlign.bind(this)}
          >
            <input
            type="radio"
            name="LeftAlign"
            autoComplete="off"
            defaultChecked
          />
          <i
            className="fa fa-align-left"
            aria-hidden="true"
          />
        </label>
        <label
            className="btn btn-light"
            onClick={this.setTextAlign.bind(this)}
          >
            <input
            type="radio"
            name="CenterAlign"
            autoComplete="off"
          />
          <i
            className="fa fa-align-center"
            aria-hidden="true"
          />
        </label>
        <label
            className="btn btn-light"
            onClick={this.setTextAlign.bind(this)}
          >
            <input
            type="radio"
            name="RightAlign"
            autoComplete="off"
          />
          <i
            className="fa fa-align-right"
            aria-hidden="true"
          />
        </label>
        <label
            className="btn btn-light"
            onClick={this.setTextAlign.bind(this)}
          >
            <input
            type="radio"
            name="JustifyAlign"
            autoComplete="off"
          />
          <i
            className="fa fa-align-justify"
            aria-hidden="true"
          />
        </label>
      </div>
      <div className="btn-group btn-group-sm" role="group">
        <input
            type="color"
            name="fontColor"
            defaultValue="#000000"
            onChange={this.setData.bind(this)}
          />
        </div>
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col-md-12">
      <textarea
            className="form-control form-control-sm"
            name="txtContent"
            onChange={this.setData.bind(this)}
          />
        </div>
      </div>
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
                            ].trays.map(function(item) {
                                let opt = (
                                  <option key={item} value={item}>
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
                            ].papers.map(function(item) {
                                let opt = (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                            );
                            return opt;
                        })}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Print Orientation:</label>
                        <select
                          className="form-control form-control-sm"
                          name="printRotation"
                          onChange={this.setData.bind(this)}
                        >
                          <option>Portrait</option>
                          <option>Landscape</option>
                        </select>
                      </div>
                    </div>
                    <br />

                    <div className="row">
                      <div className="col-md-12">
                        <br />
                        <div className="text-center">
                          <button
                            className="btn btn-success btn-lg"
                            onClick={this.doPrinting.bind(this)}
                          >
                            <i className="fa fa-print" /> Print Text Now...
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
                    <i className="fa fa-file-text-o" />&nbsp;Advanced TXT
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

window.PrintingTXTSample = PrintingTXTSample;