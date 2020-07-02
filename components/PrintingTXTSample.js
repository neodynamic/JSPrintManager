class PrintingTXTSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txtFile: null,
            txtContent: null,
            selectedPrinterIndex: 0,
            printerName: "",
            printerTrayName: "",
            printerPaperName: "",
            installedFonts: [],
            fontName: "Arial",
            fontSize: 8,
            fontBold: false,
            fontItalic: false,
            fontUnderline: false,
            fontStrikethrough: false,
            textAlign: "Left",
            fontColor: "#000000",
            printOrientation: "Portrait"
        };
    }

    
    setPrinterState(event) {
        this.setState({ selectedPrinterIndex: event.target.value });
        this.state.printerName = this.props.printersInfo[event.target.value].name;
    }

    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    setFontStyle(event) {
        //no need for re-render
        var val = event.currentTarget.classList.contains("active");
        var name = event.currentTarget.querySelector("input").name;
        this.state[name] = val;
    }

    setTextAlign(event) {
        var val = event.currentTarget.classList.contains("active");
        var name = event.currentTarget.querySelector("input").name;
        var textAlign = "Left";
        if (val && name == "CenterAlign") textAlign = "Center";
        if (val && name == "RightAlign") textAlign = "Right";
        if (val && name == "JustifyAlign") textAlign = "Justify";
        if (val && name == "NoneAlign") textAlign = "None";
        this.state["textAlign"] = textAlign;
    }

    setInstalledFonts(fontsList) {
        this.setState({ installedFonts: fontsList });
    }

    setTxtFile(event) {
        if (event.target.name == "input-local-txt-file") this.state.txtFile = Array.from(event.target.files);
        else this.state.txtFile = [event.target.value];
    }

    createPrintJob() {
        //no need to re-render
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.state.printerName, false, this.state.printerTrayName, this.state.printerPaperName);

        if (this.state.txtContent || this.state.txtFile) {
            let myTxtFile;

            if (this.state.txtFile) {
                // txt from file or URL
                if (this.state.txtFile[0].name)
                    myTxtFile = new JSPM.PrintFileTXT(this.state.txtFile[0], this.state.txtFile[0].name, 1, JSPM.FileSourceType.BLOB);
                else
                    myTxtFile = new JSPM.PrintFileTXT(this.state.txtFile[0], "myFileToPrint.txt", 1, JSPM.FileSourceType.URL);
            } else {
                // plain text content
                myTxtFile = new JSPM.PrintFileTXT(this.state.txtContent, "myFileToPrint.txt", 1);
            }

            myTxtFile.textAligment = JSPM.TextAlignment[this.state.textAlign];
            myTxtFile.fontName = this.state.fontName;
            myTxtFile.fontBold = this.state.fontBold;
            myTxtFile.fontItalic = this.state.fontItalic;
            myTxtFile.fontUnderline = this.state.fontUnderline;
            myTxtFile.fontStrikethrough = this.state.fontStrikethrough;
            myTxtFile.fontSize = parseFloat(this.state.fontSize);
            myTxtFile.fontColor = this.state.fontColor;
            myTxtFile.printOrientation = JSPM.PrintOrientation[this.state.printOrientation];

            cpj.files.push(myTxtFile);
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
        //get installed fonts
        JSPM.JSPrintManager.getSystemFonts().then(function(fontsList) {
            JSPM.JSPrintManager.Caller.setInstalledFonts(fontsList);
        });
    }

    render() {
        let demoContent;
        let installedPrinters = this.props.printersInfo;

        if (!installedPrinters || this.state.installedFonts.length == 0) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <img src="loading.gif" id="loadingPrintersInfo" />
                            <br />
                            <strong>Getting printers info and system fonts...</strong>
                        </div>
                    </div>
                </div>
            );
        } else {
            let systemFonts = this.state.installedFonts;
            let selPrinter = installedPrinters[this.state.selectedPrinterIndex];

            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-12">
                                    <strong>Font Settings &amp; Style</strong>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="btn-toolbar" role="toolbar">
                                        <div className="btn-group btn-group-sm" role="group">
                                            <select className="form-control form-control-sm" name="fontName" onChange={this.setData.bind(this)}>
                                                {systemFonts.map(function(i) {
                                                    let opt = (
                                                        <option key={i} value={i}>
                                                            {i}
                                                        </option>
                                                    );
                                                    return opt;
                                                })}
                                            </select>
                                        </div>
                                        <div className="btn-group btn-group-sm" role="group">
                                            <select className="form-control form-control-sm" name="fontSize" onChange={this.setData.bind(this)}>
                                                <option>8</option>
                                                <option>10</option>
                                                <option>12</option>
                                                <option>14</option>
                                                <option>16</option>
                                            </select>
                                        </div>
                                        <div className="btn-group-toggle btn-group-sm" data-toggle="buttons">
                                            <label className="btn btn-light" onClick={this.setFontStyle.bind(this)} title="Bold">
                                                <input type="checkbox" autoComplete="off" name="fontBold" />
                                                <i className="fa fa-bold" aria-hidden="true" />
                                            </label>
                                            <label className="btn btn-light" onClick={this.setFontStyle.bind(this)} title="Italic">
                                                <input type="checkbox" autoComplete="off" name="fontItalic" />
                                                <i className="fa fa-italic" aria-hidden="true" />
                                            </label>
                                            <label className="btn btn-light" onClick={this.setFontStyle.bind(this)} title="Underline">
                                                <input type="checkbox" autoComplete="off" name="fontUnderline" />
                                                <i className="fa fa-underline" aria-hidden="true" />
                                            </label>
                                            <label className="btn btn-light" onClick={this.setFontStyle.bind(this)} title="Strikethrough">
                                                <input type="checkbox" autoComplete="off" name="fontStrikethrough" />
                                                <i className="fa fa-strikethrough" aria-hidden="true" />
                                            </label>
                                        </div>
                                        <div className="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">
                                            <label className="btn btn-light active" onClick={this.setTextAlign.bind(this)} title="Left Alignment">
                                                <input type="radio" name="LeftAlign" autoComplete="off" defaultChecked />
                                                <i className="fa fa-align-left" aria-hidden="true" />
                                            </label>
                                            <label className="btn btn-light" onClick={this.setTextAlign.bind(this)} title="Center Alignment">
                                                <input type="radio" name="CenterAlign" autoComplete="off" />
                                                <i className="fa fa-align-center" aria-hidden="true" />
                                            </label>
                                            <label className="btn btn-light" onClick={this.setTextAlign.bind(this)} title="Right Alignment">
                                                <input type="radio" name="RightAlign" autoComplete="off" />
                                                <i className="fa fa-align-right" aria-hidden="true" />
                                            </label>
                                            <label className="btn btn-light" onClick={this.setTextAlign.bind(this)} title="Justify Alignment">
                                                <input type="radio" name="JustifyAlign" autoComplete="off" />
                                                <i className="fa fa-align-justify" aria-hidden="true" />
                                            </label>
                                            <label className="btn btn-light" onClick={this.setTextAlign.bind(this)} title="No Alignment">
                                                <input type="radio" name="NoneAlign" autoComplete="off" />
                                                <i className="fa fa-bars" aria-hidden="true" />
                                            </label>
                                        </div>
                                        <div className="btn-group btn-group-sm" role="group">
                                            <input type="color" name="fontColor" defaultValue="#000000" onChange={this.setData.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <strong>Text Source</strong>
                                    <ul className="nav nav-tabs" id="myTabTxt" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="plain-txt-tab" data-toggle="tab" href="#plain-txt" role="tab" aria-controls="plain-txt" aria-selected="true">
                                                Plain Text
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="local-txt-file-tab" data-toggle="tab" href="#local-txt-file" role="tab" aria-controls="local-txt-file" aria-selected="true">
                                                Local TXT File
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="remote-txt-file-tab" data-toggle="tab" href="#remote-txt-file" role="tab" aria-controls="remote-txt-file" aria-selected="false">
                                                TXT File from URL
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabTxtContent">
                                        <div className="tab-pane fade show active" id="plain-txt" role="tabpanel" aria-labelledby="plain-txt">
                                            <br />
                                            <textarea className="form-control form-control-sm" name="txtContent" onChange={this.setData.bind(this)} value="Type or copy/paste text here..." />
                                        </div>
                                        <div className="tab-pane fade" id="local-txt-file" role="tabpanel" aria-labelledby="local-txt-file">
                                            <br />
                                            <input name="input-local-txt-file" type="file" className="form-control-file" onChange={this.setTxtFile.bind(this)} />
                                        </div>
                                        <div className="tab-pane fade" id="remote-txt-file" role="tabpanel" aria-labelledby="remote-txt-file">
                                            <br />
                                            URL for TXT File{" "}
                                            <small>
                                                (e.g.{" "}
                                                <a href="https://neodynamic.com/temp/LoremIpsum.txt" target="_blank">
                                                    https://neodynamic.com/temp/LoremIpsum.txt
                                                </a>)
                                            </small>
                                            <input name="input-file-url" className="form-control form-control-sm" onChange={this.setTxtFile.bind(this)} />
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
                                    <select className="form-control form-control-sm" onChange={this.setPrinterState.bind(this)}>
                                        {installedPrinters.map(function(item, i) {
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
                                    <select className="form-control form-control-sm" name="printerTrayName" onChange={this.setData.bind(this)}>
                                        {selPrinter.trays.map(function(item, i) {
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
                                    <select className="form-control form-control-sm" name="printerPaperName" onChange={this.setData.bind(this)}>
                                        {selPrinter.papers.map(function(item, i) {
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
                                    <label>Print Orientation:</label>
                                    <select className="form-control form-control-sm" name="printOrientation" onChange={this.setData.bind(this)}>
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
                                        <button className="btn btn-success btn-lg" onClick={this.doPrinting.bind(this)}>
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
                        <button className="btn btn-dark btn-lg" onClick={() => this.props.setSample(0)}>
                            <i className="fa fa-arrow-left" />
                        </button>
                    </div>
                    <div className="col-md-11">
                        <h2 className="text-center">
                            <i className="fa fa-file-text-o" />&nbsp;Advanced TXT Printing
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
