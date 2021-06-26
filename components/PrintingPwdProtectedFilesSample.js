class PrintingPwdProtectedFilesSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientPrinter: null,
            printFileName: 'https://neodynamic.com/temp/LoremIpsum-PasswordProtected.PDF',
            password: null
        };
    }

    onPrinterChange(newPrinter) {
        this.state.clientPrinter = newPrinter;
    }

    setData(event) {
        this.setState({ [event.target.name]: event.target.checked ? event.target.checked : event.target.value });
    }

    createPrintJob() {
        var cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = this.state.clientPrinter;
        if (this.state.printFileName) {
            let my_file;
            let file_ext = this.state.printFileName.split(".").pop().toLowerCase();

            if (file_ext == "pdf") {
                my_file = new JSPM.PrintFilePDF(this.state.printFileName, JSPM.FileSourceType.URL, "myFileToPrint." + file_ext, 1);
            } else if (file_ext == "doc") {
                my_file = new JSPM.PrintFileDOC(this.state.printFileName, JSPM.FileSourceType.URL, "myFileToPrint." + file_ext, 1);
            } else {
                my_file = new JSPM.PrintFileXLS(this.state.printFileName, JSPM.FileSourceType.URL, "myFileToPrint." + file_ext, 1);
            }

            my_file.encryptedPassword = this.state.password;
            
            cpj.files.push(my_file);
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
        //get password from website/server
        let _this = this;
        var req = new XMLHttpRequest();
        req.open('POST', '/GetEncryptPassword.ashx', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    _this.setState({
                        password: req.responseText
                    });
                } else {
                    alert('Could not get password from server!');
                }
            }
        };
        JSPM.JSPrintManager.getSessionCertificate()
            .then((data) => {req.send(JSON.stringify({ Certificate: data.certificate }));})
            .catch(err => console.log(err));
        

        /*
        fetch("/GetEncryptPassword.ashx", {
            body: JSON.stringify({ Certificate: JSPM.JSPrintManager.session_certificate }),
            headers: {
                "content-type": "application/json"
            },
            method: "POST"
        }).then((res) => {
            res.text().then((data) => {
                this.setState({
                    password: data
                });
            });
        });
        */

    }

    render() {
        let demoContent;

        if (!this.state.password) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <img src="loading.gif" id="wait" />
                            <br />
                            <strong>Getting password from server...</strong>
                        </div>
                    </div>
                </div>
            );
        } else {
            demoContent = (
                <div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="alert alert-info">
                                    <strong>The file password is set at server side using your preferred programming language (PHP, Java, .NET, etc.)</strong> and it's <strong>encrypted (using RSA)</strong> and embedded into the file metadata. Although the file is downloaded to the client machine, <strong>it keeps password protected!</strong> The JSPrintManager app, loads the file in memory and unlock the file in system memory for printing it.
                            </div>
                                <p>
                                    The following are pre-selected files to test JSPrintManager's File Printing with Password Protection feature enabled. The password for all files is <code>ABC123</code> if you want to download them to verify they are protected files. In real world scenarios you never need to disclouse the password as it will be set at server side.
                            </p>

                                <br />
                                <br />
                                <label><strong>Select the Password-Protected File to print</strong></label>
                                <select className="form-control form-control-sm" name="printFileName" onChange={this.setData.bind(this)}>
                                    <option>https://neodynamic.com/temp/LoremIpsum-PasswordProtected.PDF</option>
                                    <option disabled={this.props.os == "win" ? null : true}>https://neodynamic.com/temp/LoremIpsum-PasswordProtected.DOC</option>
                                    <option disabled={this.props.os == "win" ? null : true}>https://neodynamic.com/temp/SampleSheet-PasswordProtected.XLS</option>
                                </select>
                                <br />
                                <a className="btn btn-secondary btn-sm" href="https://neodynamic.com/temp/LoremIpsum-PasswordProtected.pdf" target="_blank"><i className="fa fa-download"></i>&nbsp;PDF</a>&nbsp;&nbsp;
                            <a className="btn btn-secondary btn-sm" href="https://neodynamic.com/temp/LoremIpsum-PasswordProtected.doc" target="_blank"><i className="fa fa-download"></i>&nbsp;DOC</a>&nbsp;&nbsp;
                            <a className="btn btn-secondary btn-sm" href="https://neodynamic.com/temp/SampleSheet-PasswordProtected.xls" target="_blank"><i className="fa fa-download"></i>&nbsp;XLS</a>
                                <br />
                                <br />
                            </div>
                        </div>
                        <div className="row">
                            <Printers JobContentType={1} onPrinterChange={this.onPrinterChange.bind(this)} />
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
                            <i className="fa fa-key iconDemo" />&nbsp;Print Password Protected Files
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );

        
    }
}

window.PrintingPwdProtectedFilesSample = PrintingPwdProtectedFilesSample;
