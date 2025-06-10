class VideoScanningSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfVideoDevices: -1,
            videoDevices: [],
            videoDeviceName: "",
            pixelMode: "Color",
            dither: "Threshold",
            threshold: 128,
            rotAngle: 0,
            imageFormat: "JPG",
            jpgQuality: 100,
            tiffCompression: 0,
            pngCompression: 0,
            pdfTitle: "",
            scanningState: 0, // 0 = finished, 1 = scanning, 2 = error
            error: "",
            capturedImages: [],
            curImgIndex: 0
        };
    }

    setVideoDevices(scannersList) {
        this.state.numOfVideoDevices = scannersList.length;
        this.state.videoDeviceName = scannersList[0];
        this.setState({ videoDevices: scannersList });
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
        this.state.imageFormat = "PNG";
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

    setRotAngle(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({rotAngle: val});
    }

    setJpgQuality(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({jpgQuality: val});
    }

    setTiffCompression(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({tiffCompression: val});
    }

    setPngCompression(event) {
        let val = event.target.checked ? event.target.checked : event.target.value;
        this.setState({pngCompression: val});
    }

    createVideoScanJob() {
        let csj = new JSPM.ClientVideoScanJob();
        csj.videoDeviceName = this.state.videoDeviceName;
        csj.pixelMode = JSPM.PixelMode[this.state.pixelMode];
        csj.dither = JSPM.Dither[this.state.dither];
        csj.resolution = parseInt(this.state.resolution);
        csj.imageFormat = JSPM.ScannerImageFormatOutput[this.state.imageFormat];
        csj.jpgCompressionQuality = parseInt(this.state.jpgQuality);
        csj.tiffCompression = JSPM.TiffCompression[this.state.tiffCompression];
        csj.pngCompression = JSPM.PngCompression[this.state.pngCompression];
        csj.pdfTitle = this.state.pdfTitle;
        csj.rotAngle = parseInt(this.state.rotAngle);

        let _this = this;

        csj.onUpdate = (data, last) => {
            
            if (last && this.state.scanningState != 2)
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
                this.state.capturedImages.push(img);
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
        if (this.state.curImgIndex < this.state.capturedImages.length - 1) {
            this.setState({ curImgIndex: (this.state.curImgIndex + 1) });
        }
    }

    prevImage() {
        if (this.state.curImgIndex > 0) {
            this.setState({ curImgIndex: (this.state.curImgIndex - 1) });
        }
    }

    doScanning() {
        let csj = this.createVideoScanJob();
        if (csj) {
            this.state.error = "";
            this.setState({ scanningState: 1 });
            this.setState({ capturedImages: []});
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
        let _this = this;

        if (this.props.os == "win") {
        
            //get client installed video devices
            JSPM.JSPrintManager.getVideoDevices().then(function(camerasList) {
                JSPM.JSPrintManager.Caller.setVideoDevices(camerasList);
            });
        
        }
    }

    render() {
        let demoContent;

        if (this.props.os == "win") {
            if (this.state.numOfVideoDevices == -1) {
                demoContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center">
                                <img src="loading.gif" id="loadingScanners" />
                                <br />
                                <strong>Getting video devices...</strong>
                            </div>
                        </div>
                    </div>
                );
            } else if (this.state.numOfVideoDevices == 0) {
                demoContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center">
                                <div className="alert alert-danger">
                                    <div className="text-center">
                                    No video input devices were detected on this system.
                                    </div>
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
                } else if (this.state.scanningState == 0 && this.state.capturedImages.length > 0) {
                    let imgScale = { width: "100%", height: "auto" };

                    scanningStateContent = (
                        <div className="row">
                            <div className="col-md-12">
                                <div className="alert alert-secondary">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <button type="button" className="btn btn-info" onClick={this.prevImage.bind(this)}><i className="fa fa-chevron-left"></i></button>
                                        </div>
                                        <div className="col-md-4 text-center">
                                            <h4>Scan result: {this.state.curImgIndex + 1} of {this.state.capturedImages.length} </h4>
                                        </div>
                                        <div className="col-md-4">
                                            <button type="button" className="btn btn-info pull-right" onClick={this.nextImage.bind(this)}><i className="fa fa-chevron-right"></i></button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-md-12  text-center">
                                            <img src={this.state.capturedImages[this.state.curImgIndex]} id="scanningImageResult" style={imgScale} />
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

                let tiffCompression;

                if (this.state.imageFormat == "TIFF"){
                    tiffCompression = (
                        <div>
                            <label>Compression:</label>
                            <select className="form-control form-control-sm" name="tiffCompression" onChange={this.setTiffCompression.bind(this)}>
                                <option>DEFAULT</option>
                                <option>PACKBITS</option>
                                <option>DEFLATE</option>
                                <option>ADOBE_DEFLATE</option>
                                <option>NONE</option>
                                <option>CCITTFAX3</option>
                                <option>CCITTFAX4</option>
                                <option>LZW</option>
                            </select>                 
                        </div>    
                            );
                }

                let pngCompression;

                if (this.state.imageFormat == "PNG"){
                    pngCompression = (
                        <div>
                            <label>Compression:</label>
                            <select className="form-control form-control-sm" name="pngCompression" onChange={this.setPngCompression.bind(this)}>
                                <option>DEFAULT</option>
                                <option>Z_BEST_SPEED</option>
                                <option>Z_BEST_COMPRESSION</option>
                                <option>NONE</option>
                            </select>                 
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

                let imageFormats;

                if (bwDither){
                    imageFormats = (<div><select className="form-control form-control-sm" name="imageFormat" onChange={this.setImageFormat.bind(this)}><option>PNG</option><option>TIFF</option></select>{tiffCompression}{pngCompression}</div>);
                } else {
                    imageFormats = (<div><select className="form-control form-control-sm" name="imageFormat" onChange={this.setImageFormat.bind(this)}><option>JPG</option><option>PNG</option><option>TIFF</option><option>PDF</option></select>{jpgQuality}{pdfTitle}{tiffCompression}{pngCompression}</div>);
                }
    
                demoContent = (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label>Scanner:</label>
                                        <select name="videoDeviceName" className="form-control form-control-sm" onChange={this.setData.bind(this)}>
                                            {this.state.videoDevices.map(function(i) {
                                                let opt = (
                                                    <option key={i} value={i}>
                                                        {i}
                                                    </option>
                                                );
                                                return opt;
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label>Pixel Mode:</label>
                                        <select className="form-control form-control-sm" name="pixelMode" onChange={this.setPixelMode.bind(this)}>
                                            <option>Color</option>
                                            <option>Grayscale</option>
                                            <option>BlackAndWhite</option>
                                        </select>
                                        {bwDither}
                                        {bwThreshold}
                                    </div>
                                    <div className="col-md-3">
                                        <label>Image Format:</label>
                                        {imageFormats}                                    
                                    </div>    
                                    <div className="col-md-2">
                                        <label>Rotate:</label>
                                        <select className="form-control form-control-sm" name="rotAngle" onChange={this.setRotAngle.bind(this)}>
                                            <option value="0">None</option>
                                            <option value="90">Rot90</option>
                                            <option value="180">Rot180</option>
                                            <option value="270">Rot270</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <br />
                                        <div className="text-center">
                                            <button className="btn btn-success btn-lg" onClick={this.doScanning.bind(this)}>
                                                <i className="fa fa-crosshairs" /> Video Scan Now...
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
        } else {
            demoContent = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="alert alert-warning">
                            Available for <strong>Windows clients only</strong>
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
                            <i className="fa fa-video-camera iconDemo" />&nbsp;Video Snapshot
                        </h2>
                        <hr />
                    </div>
                </div>

                {demoContent}
            </div>
        );
    }
}

window.VideoScanningSample = VideoScanningSample;
