class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            JSPM_WS_Status: null,
            printersInfo: null,
            DemoIndex: 0
        };
        this.setDemoSample = this.setDemoSample.bind(this);
        this.OS = "";
    }

    jspmWsStatusChanged(status) {
        this.setState({
            JSPM_WS_Status: status
        });
    }

    printersInfoChanged(newPrintersInfo) {
        this.setState({
            printersInfo: newPrintersInfo
        });
    }

    setDemoSample(index) {
        this.setState({
            DemoIndex: index
        });
    }

    componentDidMount() {
        JSPM.JSPrintManager.auto_reconnect = true;
        JSPM.JSPrintManager.start();

        JSPM.JSPrintManager.MainApp = this;

        JSPM.JSPrintManager.WS.onOpen = function() {
            JSPM.JSPrintManager.MainApp.jspmWsStatusChanged(JSPM.WSStatus[JSPM.JSPrintManager.WS.status]);

            JSPM.JSPrintManager.MainApp.printersInfoChanged(null);
            //get client installed printers with detailed info
            JSPM.JSPrintManager.getPrintersInfo().then(function (printersList) {
                JSPM.JSPrintManager.MainApp.printersInfoChanged(printersList);
            });
        };

        JSPM.JSPrintManager.WS.onStatusChanged = function() {
            JSPM.JSPrintManager.MainApp.jspmWsStatusChanged(JSPM.WSStatus[JSPM.JSPrintManager.WS.status]);
        };

        JSPM.JSPrintManager.WS.onClose = function() {
            JSPM.JSPrintManager.MainApp.jspmWsStatusChanged(JSPM.WSStatus[JSPM.JSPrintManager.WS.status]);
        };

        let os = (function() {
            var ua = navigator.userAgent.toLowerCase();
            return {
                isWindows: /(windows|win32|win64)/.test(ua),
                isLinux: /(linux)/.test(ua),
                isIntelMac: /(intel mac)/.test(ua),
                isRPi: /(Linux arm)/.test(ua)
            };
        })();

        if (os.isWindows) {
            this.OS = "win";
        } else if (os.isLinux) {
            this.OS = "linux";
        } else if (os.isIntelMac) {
            this.OS = "mac";
        } else if (os.isRPi) {
            this.OS = "rpi";
        } else {
            this.OS = "other";
        }
    }

    render() {
        let year = new Date().getFullYear();
        let demoContent;

        if (this.state.JSPM_WS_Status == "Open") {
            if (this.state.DemoIndex == 0) {
                demoContent = <DemoStartPage setSample={this.setDemoSample} />;
            } else if (this.state.DemoIndex == 1) {
                demoContent = <PrintingRawCommandsSample setSample={this.setDemoSample} />;
            } else if (this.state.DemoIndex == 2) {
                demoContent = <PrintingPDFSample setSample={this.setDemoSample} printersInfo={this.state.printersInfo} />;
            } else if (this.state.DemoIndex == 3) {
                demoContent = <PrintingFilesSample setSample={this.setDemoSample} />;
            } else if (this.state.DemoIndex == 4) {
                demoContent = <PrintingMultiplePrintJobsSample setSample={this.setDemoSample} />;
            } else if (this.state.DemoIndex == 5) {
                demoContent = <PrintingTXTSample setSample={this.setDemoSample} printersInfo={this.state.printersInfo} />;
            } else if (this.state.DemoIndex == 6) {
                demoContent = <PrintersInfoSample setSample={this.setDemoSample} printersInfo={this.state.printersInfo} />;
            } else if (this.state.DemoIndex == 7) {
                demoContent = <PrintingDOCSample setSample={this.setDemoSample} os={this.OS} />;
            } else if (this.state.DemoIndex == 8) {
                demoContent = <PrintingXLSSample setSample={this.setDemoSample} os={this.OS} />;
            } else if (this.state.DemoIndex == 9) {
                demoContent = <ScanningSample setSample={this.setDemoSample} />;
            } else if (this.state.DemoIndex == 10) {
                demoContent = <SerialPortBIDISample setSample={this.setDemoSample} />;
            } else if (this.state.DemoIndex == 11) {
                demoContent = <PrintersWatcherSample setSample={this.setDemoSample} os={this.OS} />;
            } else if (this.state.DemoIndex == 12) {
                demoContent = <PrintingPwdProtectedFilesSample setSample={this.setDemoSample} os={this.OS} />;
            } else if (this.state.DemoIndex == 13) {
                demoContent = <PrintingTIFSample setSample={this.setDemoSample} printersInfo={this.state.printersInfo} />;
            } else if (this.state.DemoIndex == 14) {
                demoContent = <PrintingFileGroupDuplexSample setSample={this.setDemoSample} printersInfo={this.state.printersInfo} />;
            }
        } else if (this.state.JSPM_WS_Status == "Closed") demoContent = <InstallJSPMClientApp />;
        else if (this.state.JSPM_WS_Status == "Blocked") demoContent = <WebsiteBlocked />;
        else {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <img src="loading.gif" id="loadingPrintersInfo" />
                            <br />
                            <strong>Waiting for user response....</strong>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="//neodynamic.com/products/printing/js-print-manager" target="_blank">
                            <img alt="Neodynamic" src="//neodynamic.com/images/jspm-32.png" />
                            &nbsp;&nbsp;JSPrintManager <span className="round">4.0</span>
                        </a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button>

                        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                            <div className="mr-auto" />
                            <a href="https://github.com/neodynamic/JSPrintManager/" target="_blank" title="Download Source Code..." className="githubIcon">
                                <i className="fa fa-github" />
                            </a>
                            <JSPMStatus JSPM_WS_Status={this.state.JSPM_WS_Status} />
                        </div>
                    </div>
                </nav>
                <div className="container content">
                    <h2>
                        JSPrintManager{" "}
                        <small>
                            <em>Print Commands &amp; Files, Manage Printers &amp; Scan Docs from Javascript</em>
                        </small>
                    </h2>
                    <hr />
                    {demoContent}
                    <footer>
                        <br />
                        <br />
                        <br />
                        <br />
                        <hr />
                        <p>
                            <a href="//neodynamic.com/products/printing/js-print-manager/" target="_blank">
                                JSPrintManager for any Web Platform!
                            </a>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                            <i className="icon-user" />{" "}
                            <a href="//neodynamic.com/support" target="_blank">
                                Contact Tech Support
                            </a>
                        </p>
                        <p>
                            Copyright &copy; 2003-{year}
                            <br />
                            Neodynamic SRL
                            <br />
                            <a href="//neodynamic.com" alt="Neodynamic Website" target="_blank">
                                https://neodynamic.com
                            </a>
                        </p>
                    </footer>
                </div>
                <div id="files-requirements-dialog" className="modal fade topMost" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Client System Requeriments
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr className="fileFormats">
                                            <td>File Format</td>
                                            <td>Windows Clients</td>
                                            <td>UNIX Clients</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>DOC, DOCX</td>
                                            <td>Microsoft Word is required</td>
                                            <td>LibreOffice is required</td>
                                        </tr>
                                        <tr>
                                            <td>XLS, XLSX</td>
                                            <td>Microsoft Excel is required</td>
                                            <td>LibreOffice is required</td>
                                        </tr>
                                        <tr>
                                            <td>PDF</td>
                                            <td>Natively supported!</td>
                                            <td>Natively supported!</td>
                                        </tr>
                                        <tr>
                                            <td>TIF</td>
                                            <td>Natively supported!</td>
                                            <td>Natively supported!</td>
                                        </tr>
                                        <tr>
                                            <td>TXT</td>
                                            <td>Natively supported!</td>
                                            <td>Natively supported!</td>
                                        </tr>
                                        <tr>
                                            <td>JPEG</td>
                                            <td>Natively supported!</td>
                                            <td>Natively supported!</td>
                                        </tr>
                                        <tr>
                                            <td>PNG</td>
                                            <td>Natively supported!</td>
                                            <td>Natively supported!</td>
                                        </tr>
                                        <tr>
                                            <td>BMP</td>
                                            <td>Natively supported!</td>
                                            <td>Natively supported!</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));

window.App = App;
