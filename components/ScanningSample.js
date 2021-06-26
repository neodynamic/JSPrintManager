class ScanningSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfScannerDevices: -1,
            scannerDevices: [],
            scannerName: "",
            resolution: 200,
            pixelMode: "Color",
            imageFormat: "JPG",
            enableDuplex: false,
            enableFeeder: false,
            feederCount: 1,
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

    createScanJob() {
        let csj = new JSPM.ClientScanJob();
        csj.scannerName = this.state.scannerName;
        csj.pixelMode = JSPM.PixelMode[this.state.pixelMode];
        csj.resolution = parseInt(this.state.resolution);
        csj.imageFormat = JSPM.ScannerImageFormatOutput[this.state.imageFormat];
        csj.enableDuplex = this.state.enableDuplex;
        csj.enableFeeder = this.state.enableFeeder;
        csj.feederCount = parseInt(this.state.feederCount);

        let _this = this;

        csj.onUpdate = (data, last) => {
            
            this.setState({ scanningState: (last ? 0 : 1) });

            if (!(data instanceof Blob)) {
                console.info(data);
                return;
            }

            var imgBlob = new Blob([data]);

            if (imgBlob.size == 0) return;

            var data_type = "image/jpg";
            if (this.state.imageFormat == "PNG") data_type = "image/png";
            var img = URL.createObjectURL(imgBlob, { type: data_type });
            this.state.scannedImages.push(img);
            
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
                            <div className="alert alert-danger">No scanner devices detected on this system.</div>
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
                                    <select className="form-control form-control-sm" name="pixelMode" onChange={this.setData.bind(this)}>
                                        <option>Color</option>
                                        <option>Grayscale</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label>Image Format:</label>
                                    <select className="form-control form-control-sm" name="imageFormat" onChange={this.setData.bind(this)}>
                                        <option>JPG</option>
                                        <option>PNG</option>
                                    </select>
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
                                      <input type="text" name="feederCount" className="form-control" aria-label="Feeder Count" aria-describedby="basic-addon1" onChange={this.setData.bind(this)} placeholder="1" />
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
