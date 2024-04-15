class IPPSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceUri: "",
            userName: "",
            password: "",
            jsonIppMessage: null,
            strIppMessage: "",
            strIppResponse: "",
            ippPredefinedSample: -1
        };
    }

    
    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    doSendData() {
        
        this.setState({ strIppResponse: "" });

        if (this.state.deviceUri){
            if (this.state.jsonIppMessage){

                if (this.state.ippPredefinedSample == 4){
                    // Get PDF binary file content
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', 'https://neodynamic.com/temp/LoremIpsum.pdf', true);

                    xhr.responseType = 'arraybuffer';

                    var _this = this;

                    xhr.onload = function (e) {
                        if (this.status == 200) {

                            let pdfFileBinContent = new Uint8Array(xhr.response);

                            _this.doHandleIppMessage(pdfFileBinContent);
                        }
                    }

                    xhr.send();

                }
                else {
                    let fileContent = null;
                    if (this.state.ippPredefinedSample == 3){
                        let enc = new TextEncoder();
                        fileContent = enc.encode("Hello World - Printed by JSPrintManager through IPP!");
                    }  
                
                    this.doHandleIppMessage(fileContent);
                }
            }
            else {
                document.getElementById("strIppMessage").value = "Please click on any of the predefined IPP samples!";            
            }
        }
        else {
            document.getElementById("strIppMessage").value = "Please specifiy the IPP Device URI!";            
        }
    }

    doHandleIppMessage(fileContent){
        JSPM.JSPrintManager.sendIppMessage(this.state.deviceUri, this.state.jsonIppMessage, fileContent, this.state.userName, this.state.password).then((resp) => {
            let errorCode = '';
            if (resp._oprationIdOrStatusCode && resp._oprationIdOrStatusCode > 0) {
                errorCode = 'ERROR!!! ' + JSPM.Ipp[resp._oprationIdOrStatusCode] + '\n\n';
            }            
            this.setState({ strIppResponse: errorCode + JSON.stringify(resp) });
            console.info(resp);
        }).catch((err) => {
            this.setState({ strIppResponse: JSON.stringify(err) });
            console.error(err);
        })
    }

    setPredefinedMessage(id) {

        if (this.state.deviceUri){

            let sIppMessage = null;
            if (id == "ipp1") {
                // Get Printer Attributes
                let ippMsgGetPrinterAttributes = {
                    version: {
                        major: 1,
                        minor: 1
                    },
                    operationId: JSPM.Ipp.GET_PRINTER_ATTRIBUTES,
                    requestId: 1,
                    groups: [
                      {
                          tag: JSPM.Ipp.OPERATION_ATTRIBUTES_TAG, attributes: [
                              { tag: JSPM.Ipp.CHARSET, name: 'attributes-charset', value: ['utf-8'] },
                              { tag: JSPM.Ipp.NATURAL_LANG, name: 'attributes-natural-language', value: ['en-us'] },
                              { tag: JSPM.Ipp.URI, name: 'printer-uri', value: [this.state.deviceUri] },
                              { tag: JSPM.Ipp.KEYWORD, name: 'requested-attributes', value: ['all'] }
                          ]
                      }
                    ]
                }

                this.state.ippPredefinedSample = 1;
                this.state.jsonIppMessage = ippMsgGetPrinterAttributes;
            }
            else if (id == "ipp2") {
                // Get Completed Jobs
                let ippMsgGetCompletedJobs = {
                    version: {
                        major: 1,
                        minor: 1
                    },
                    operationId: JSPM.Ipp.GET_JOBS,
                    requestId: 1,
                    groups: [
                      {
                          tag: JSPM.Ipp.OPERATION_ATTRIBUTES_TAG, attributes: [
                              { tag: JSPM.Ipp.CHARSET, name: 'attributes-charset', value: ['utf-8'] },
                              { tag: JSPM.Ipp.NATURAL_LANG, name: 'attributes-natural-language', value: ['en-us'] },
                              { tag: JSPM.Ipp.URI, name: 'printer-uri', value: [this.state.deviceUri] },
                              { tag: JSPM.Ipp.KEYWORD, name: 'which-jobs', value: ['completed'] },
                              { tag: JSPM.Ipp.KEYWORD, name: 'requested-attributes', value: ['job-id','job-state','job-state-reasons','job-name','job-media-sheets-completed'] }
                          ]
                      }
                    ]
                }

                this.state.ippPredefinedSample = 2;
                this.state.jsonIppMessage = ippMsgGetCompletedJobs;
            }
            else if (id == "ipp3") {
                // Print a Plain Text file
                let ippMsgPrintFile = {
                    version: {
                        major: 1,
                        minor: 1
                    },
                    operationId: JSPM.Ipp.PRINT_JOB,
                    requestId: 1,
                    groups: [
                      {
                          tag: JSPM.Ipp.OPERATION_ATTRIBUTES_TAG, attributes: [
                              { tag: JSPM.Ipp.CHARSET, name: 'attributes-charset', value: ['utf-8'] },
                              { tag: JSPM.Ipp.NATURAL_LANG, name: 'attributes-natural-language', value: ['en-us'] },
                              { tag: JSPM.Ipp.URI, name: 'printer-uri', value: [this.state.deviceUri] },
                              { tag: JSPM.Ipp.NAME_WITHOUT_LANG, name: 'job-name', value: ['HelloWorldTest'] },
                              { tag: JSPM.Ipp.MIME_MEDIA_TYPE, name: 'document-format', value: ['application/octet-stream'] }
                          ]
                      },
                      {
                          tag: JSPM.Ipp.JOB_ATTRIBUTES_TAG, attributes: [
                            { tag: JSPM.Ipp.INTEGER, name: 'copies', value: [1] },
                            { tag: JSPM.Ipp.KEYWORD, name: 'media', value: ['iso_a4_210x297mm'] }
                          ]
                      }
                    ]
                }

                this.state.ippPredefinedSample = 3;
                this.state.jsonIppMessage = ippMsgPrintFile;
            }
            else if (id == "ipp4") {
                // Print a PDF file
                let ippMsgPrintFile = {
                    version: {
                        major: 1,
                        minor: 1
                    },
                    operationId: JSPM.Ipp.PRINT_JOB,
                    requestId: 1,
                    groups: [
                      {
                          tag: JSPM.Ipp.OPERATION_ATTRIBUTES_TAG, attributes: [
                              { tag: JSPM.Ipp.CHARSET, name: 'attributes-charset', value: ['utf-8'] },
                              { tag: JSPM.Ipp.NATURAL_LANG, name: 'attributes-natural-language', value: ['en-us'] },
                              { tag: JSPM.Ipp.URI, name: 'printer-uri', value: [this.state.deviceUri] },
                              { tag: JSPM.Ipp.NAME_WITHOUT_LANG, name: 'job-name', value: ['HelloWorldTest'] },
                              { tag: JSPM.Ipp.MIME_MEDIA_TYPE, name: 'document-format', value: ['application/pdf'] }
                          ]
                      },
                      {
                          tag: JSPM.Ipp.JOB_ATTRIBUTES_TAG, attributes: [
                            { tag: JSPM.Ipp.INTEGER, name: 'copies', value: [1] },
                            { tag: JSPM.Ipp.KEYWORD, name: 'media', value: ['iso_a4_210x297mm'] }
                          ]
                      }
                    ]
                }

                this.state.ippPredefinedSample = 3;
                this.state.jsonIppMessage = ippMsgPrintFile;
            }

            this.state.strIppMessage = JSON.stringify(this.state.jsonIppMessage);
            document.getElementById("strIppMessage").value = this.state.strIppMessage;
        }
        else{
            document.getElementById("strIppMessage").value = "Please specifiy the IPP Device URI!";            
        }

        this.setState({ strIppResponse: "" });
    }

    
    render() {
        let strIppResponse = this.state.strIppResponse;
        let demoContent = (
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-12">
                                <strong>IPP Comm Settings</strong>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="small alert alert-warning">
                                    <label>
                                        Device URI
                                        <input className="form-control form-control-sm" name="deviceUri" placeholder="ipp://10.0.0.1:631" onChange={this.setData.bind(this)} />
                                    </label>
                                    &nbsp;&nbsp;
                                    <label>
                                        User Name <strong>(If required!)</strong>
                                        <input className="form-control form-control-sm" name="userName" placeholder="User Name" onChange={this.setData.bind(this)} />
                                    </label>
                                    &nbsp;&nbsp;
                                    <label>
                                        Password <strong>(If required!)</strong>
                                        <input className="form-control form-control-sm" name="password" type="password"  onChange={this.setData.bind(this)} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <strong>IPP Request/Message:</strong>
                                <div>
                                    <small>
                                        <strong>Click on a predefined IPP Message Sample:</strong>
                                    </small>
                                    &nbsp;&nbsp;
                                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedMessage("ipp1")}>
                                        <i className="fa fa-arrow-circle-down" /> Get Printer Attributes
                                    </button>
                                    &nbsp;&nbsp;
                                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedMessage("ipp2")}>
                                        <i className="fa fa-arrow-circle-down" /> Get Completed Jobs
                                    </button>
                                    &nbsp;&nbsp;
                                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedMessage("ipp3")}>
                                        <i className="fa fa-arrow-circle-down" /> Print a Plain Text file
                                    </button>
                                    &nbsp;&nbsp;
                                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedMessage("ipp4")}>
                                        <i className="fa fa-arrow-circle-down" /> Print a PDF file
                                    </button>
                                </div>

                                <small>
                                    <textarea className="terminal-light" name="strIppMessage" id="strIppMessage" readOnly />
                                </small>
                                <br/>
                                <button className="btn btn-info" type="button" onClick={this.doSendData.bind(this)}>
                                    Send IPP Request/Message...
                                </button>
                                <br/><br/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <strong>IPP Response:</strong><br/>
                                <small>
                                    <textarea className="terminal" name="txtIppResponse" id="txtIppResponse" readOnly value={strIppResponse} />
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        

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
                            <i className="fa fa-globe iconDemo" />&nbsp;IPP Comm
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.IPPSample = IPPSample;
