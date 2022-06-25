class ScanningSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfScannerDevices: -1,
            scannerDevices: [],
            scannerName: "",
            resolution: 200,
            pixelMode: "Color",
            dither: "Threshold",
            threshold: 128,
            imageFormat: "JPG",
            jpgQuality: 100,
            pdfTitle: "",
            enableDuplex: false,
            enableFeeder: false,
            feederCount: 0,
            scanningState: 0, // 0 = finished, 1 = scanning, 2 = error
            error: "",
            scannedImages: [],
            curImgIndex: 0
        };
    }

    setScannerDevices(scannersList) {
        this.state.numOfScannerDevices = scannersList.length;
        this.state.scannerName = scannersList[0];
        this.setState({ scannerDevices: scannersList });
    }

    setData(event) {
        this.state[event.target.name] = event.target.checked ? event.target.checked : event.target.value;
    }

    setImageFormat(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({imageFormat: val});
    }

    setPixelMode(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({pixelMode: val});
    }

    setDither(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({dither: val});
    }

    setThreshold(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({threshold: val});
    }

    setJpgQuality(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({jpgQuality: val});
    }

    createScanJob() {
        let csj = new JSPM.ClientScanJob();
        csj.scannerName = this.state.scannerName;
        csj.pixelMode = JSPM.PixelMode[this.state.pixelMode];
        csj.dither = JSPM.Dither[this.state.dither];
        csj.resolution = parseInt(this.state.resolution);
        csj.imageFormat = JSPM.ScannerImageFormatOutput[this.state.imageFormat];
        csj.enableDuplex = this.state.enableDuplex;
        csj.enableFeeder = this.state.enableFeeder;
        csj.feederCount = parseInt(this.state.feederCount);
        csj.jpgCompressionQuality = parseInt(this.state.jpgQuality);
        csj.pdfTitle = this.state.pdfTitle;

        let _this = this;

        csj.onUpdate = (data, last) => {
            
            this.setState({ scanningState: (last ? 0 : 1) });

            if (!(data instanceof Blob)) {
                console.info(data);
                return;
            }

            var imgBlob = new Blob([data]);

            if (imgBlob.size == 0) return;

            if (this.state.imageFormat == "TIFF"){
                _this.saveBlob(imgBlob, 'output_scan.tif');
            }
            else if (this.state.imageFormat == "PDF"){
                _this.saveBlob(imgBlob, 'output_scan.pdf');
            }
            else {
                var data_type = "image/jpg";
                if (this.state.imageFormat == "PNG") data_type = "image/png";
                var img = URL.createObjectURL(imgBlob, { type: data_type });
                this.state.scannedImages.push(img);
            }
        };

        csj.onError = function(data, is_critical) {
            _this.state.error = data;
            console.log(data);
            _this.setState({ scanningState: 2 });
        };

        
        return csj;
    }

    nextImage() {
        if (this.state.curImgIndex < this.state.scannedImages.length - 1) {
            this.setState({ curImgIndex: (this.state.curImgIndex + 1) });
        }
    }

    prevImage() {
        if (this.state.curImgIndex > 0) {
            this.setState({ curImgIndex: (this.state.curImgIndex - 1) });
        }
    }

    doScanning() {
        let csj = this.createScanJob();
        if (csj) {
            this.state.error = "";
            this.setState({ scanningState: 1 });
            this.setState({ scannedImages: []});
            this.setState({ curImgIndex: 0 });
            csj.sendToClient().then(data => console.info(data));
        }
    }

    saveBlob(blob, fileName) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    componentDidMount() {
        JSPM.JSPrintManager.Caller = this;
        //get client installed scanners
        JSPM.JSPrintManager.getScanners().then(function(scannersList) {
            JSPM.JSPrintManager.Caller.setScannerDevices(scannersList);
        });
    }

    render() {
        let demoContent;

        if (this.state.numOfScannerDevices == -1) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <img src="loading.gif" id="loadingScanners" />
                            <br />
                            <strong>Getting scanner devices...</strong>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.numOfScannerDevices == 0) {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <div className="alert alert-danger">
                                <div className="text-center">
                                No scanner devices detected on this system.
                                <h4>READ CAREFULLY</h4>
                                </div>
                                <p>
                                If you have installed the JSPrintManager client app in a Windows 64-bit edition through our universal installer or the one specific for Win64 and your scanner does not provide a 64-bit TWAIN driver or it supports the TWAIN 1.x specification only then please, do the following:
                                </p>
                                <ul>
                                <li>Uninstall current JSPrintManager app for 64-bit</li>
                                <li><a href="https://www.neodynamic.com/downloads/jspm/">Download and install <strong>JSPrintManager app for 32-bit</strong></a> instead. The JSPrintManager app for 32-bit will detect not only those missing TWAIN devices but also any other WIA devices that might be available in your system.</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            );
        } else {
            let scanningStateContent;

            if (this.state.scanningState == 1) {
                scanningStateContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center">
                                <img src="scanning.gif" id="scanningImage" />
                                <br />
                                <strong>Scanning...</strong>
                            </div>
                        </div>
                    </div>
                );
            } else if (this.state.scanningState == 2) {
                scanningStateContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center">
                                <div className="alert alert-danger">
                                    <strong>Error:</strong> {this.state.error}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (this.state.scanningState == 0 && this.state.scannedImages.length > 0) {
                let imgScale = { width: Math.round(96.0 / this.state.resolution * 100.0) + "%", height: "auto" };

                scanningStateContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-secondary">
                                <div className="row">
                                    <div className="col-md-4">
                                        <button type="button" className="btn btn-info" onClick={this.prevImage.bind(this)}><i className="fa fa-chevron-left"></i></button>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <h4>Scan result: {this.state.curImgIndex + 1} of {this.state.scannedImages.length} </h4>
                                    </div>
                                    <div className="col-md-4">
                                        <button type="button" className="btn btn-info pull-right" onClick={this.nextImage.bind(this)}><i className="fa fa-chevron-right"></i></button>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-12  text-center">
                                        <img src={this.state.scannedImages[this.state.curImgIndex]} id="scanningImageResult" style={imgScale} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            let bwDither;
            let bwThreshold;

            if (this.state.pixelMode == "BlackAndWhite"){
                bwDither = (
                    <div>
                        <label>Dither:</label>
                        <select className="form-control form-control-sm" name="dither" onChange={this.setDither.bind(this)}>
                            <option>Threshold</option>
                            <option>FloydSteinberg</option>
                            <option>Bayer4x4</option>
                            <option>Bayer8x8</option>
                            <option>Cluster6x6</option>
                            <option>Cluster8x8</option>
                            <option>Cluster16x16</option>
                        </select>                 
                    </div>    
                );

                if (this.state.dither == "Threshold"){
                    bwThreshold = (
                        <div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Threshold:</span>
                                </div>
                                <input type="number" name="threshold" className="form-control" aria-label="Threshold" aria-describedby="basic-addon1" onChange={this.setThreshold.bind(this)} placeholder="1" step="1" min="0" max="255"/>
                            </div>      
                        </div>    
                    );
                }
            }

            let jpgQuality;

            if (this.state.imageFormat == "JPG"){
                jpgQuality = (
                    <div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Quality:</span>
                            </div>
                            <input type="number" name="jpgQuality" className="form-control" aria-label="Threshold" aria-describedby="basic-addon1" onChange={this.setJpgQuality.bind(this)} placeholder="1" step="1" min="0" max="100"/>
                        </div>      
                    </div>    
                );
            }

            let pdfTitle;

            if (this.state.imageFormat == "PDF"){
                pdfTitle = (
                    <div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Title:</span>
                            </div>
                            <input type="text" name="pdfTitle" className="form-control" aria-label="PDF Title" aria-describedby="basic-addon1" onChange={this.setData.bind(this)} placeholder="The title"/>
                        </div>      
                    </div>    
                );
            }

            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Scanner:</label>
                                    <select name="scannerName" className="form-control form-control-sm" onChange={this.setData.bind(this)}>
                                        {this.state.scannerDevices.map(function(i) {
                                            let opt = (
                                                <option key={i} value={i}>
                                                    {i}
                                                </option>
                                            );
                                            return opt;
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label>Resolution (DPI):</label>
                                        <input type="text" className="form-control form-control-sm" name="resolution" onChange={this.setData.bind(this)} placeholder="200" />
                                </div>
                                <div className="col-md-2">
                                    <label>Pixel Mode:</label>
                                    <select className="form-control form-control-sm" name="pixelMode" onChange={this.setPixelMode.bind(this)}>
                                        <option>Color</option>
                                        <option>Grayscale</option>
                                        <option>BlackAndWhite</option>
                                    </select>
                                    {bwDither}
                                    {bwThreshold}
                                </div>
                                <div className="col-md-2">
                                    <label>Image Format:</label>
                                    <select className="form-control form-control-sm" name="imageFormat" onChange={this.setImageFormat.bind(this)}>
                                        <option>JPG</option>
                                        <option>PNG</option>
                                        <option>TIFF</option>
                                        <option>PDF</option>
                                    </select>
                                    {jpgQuality}
                                    {pdfTitle}
                                </div>
                                <div className="col-md-3">
                                    <span className="badge badge-info">Windows Only</span>
                                    <br />
                                    <div className="custom-control custom-switch">
                                        <input type="checkbox" className="custom-control-input" id="enableDuplex" name="enableDuplex" onChange={this.setData.bind(this)} />
                                        <label className="custom-control-label" htmlFor="enableDuplex">
                                            Enable Duplex
                                        </label>
                                    </div>
                                    <div className="custom-control custom-switch">
                                        <input type="checkbox" className="custom-control-input" id="enableFeeder" name="enableFeeder" onChange={this.setData.bind(this)} />
                                        <label className="custom-control-label" htmlFor="enableFeeder">
                                            Enable Feeder (ADF)
                                        </label>
                                    </div>
                                    <div className="input-group input-group-sm mb-3">
                                      <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Feeder Count:</span>
                                      </div>
                                       <input type="number" name="feederCount" className="form-control" aria-label="Feeder Count" aria-describedby="basic-addon1" onChange={this.setData.bind(this)} placeholder="0" step="1" min="0" max="100"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <br />
                                    <div className="text-center">
                                        <button className="btn btn-success btn-lg" onClick={this.doScanning.bind(this)}>
                                            <i className="fa fa-crosshairs" /> Scan Now...
                                        </button>
                                    </div>
                                    <br />
                                </div>
                            </div>
                            
                            {scanningStateContent}
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
                            <i className="fa fa-crosshairs iconDemo" />&nbsp;Scan Docs &amp; Images
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.ScanningSample = ScanningSample;
