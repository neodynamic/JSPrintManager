/*!
 * JSPrintManager v3.0.6
 * https://neodynamic.com/products/printing/js-print-manager
 *
 * GitHub Repo 
 * https://github.com/neodynamic/jsprintmanager
 *
 * Requires zip.js, zip-ext.js, and defalte.js files from 
 * https://github.com/gildas-lormeau/zip.js
 * 
 * Requires JSPrintManager Client App
 * https://neodynamic.com/downloads/jspm
 *
 * Copyright Neodynamic SRL
 * https://neodynamic.com
 * Date: 2020-11-11
 */
var JSPM;
(function (JSPM) {
    var ClientJob = (function () {
        function ClientJob() {
            this._type = '';
        }
        ClientJob.prototype._generateDataAsync = function () {
            return new Promise(function (_) {
            });
        };
        ClientJob.prototype.onUpdate = function (data, last) { };
        ;
        ClientJob.prototype.onError = function (data, critical) { };
        ;
        ClientJob.prototype.sendToClient = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this._generateDataAsync().then(function (data) {
                    var properties = {
                        type: _this._type,
                        on_update: function (data, first, last) {
                            if (first)
                                ok(data);
                            else
                                _this.onUpdate(data, last);
                        },
                        on_error: function (data, first, critical) {
                            if (first)
                                err(data);
                            else
                                _this.onError(data, critical);
                        }
                    };
                    JSPM.JSPrintManager.WS.send(data, properties);
                }).catch(function (e) { return err(e); });
            });
        };
        return ClientJob;
    }());
    JSPM.ClientJob = ClientJob;
})(JSPM || (JSPM = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var JSPM;
(function (JSPM) {
    var ClientPrintJob = (function (_super) {
        __extends(ClientPrintJob, _super);
        function ClientPrintJob() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._clientPrinter = null;
            _this._printerCommandsCopies = 1;
            _this._printerCommands = "";
            _this._printerCommandsCodePage = JSPM.Encoding.Default;
            _this._binaryPrinterCommands = null;
            _this._printFileGroup = [];
            return _this;
        }
        Object.defineProperty(ClientPrintJob.prototype, "clientPrinter", {
            get: function () {
                return this._clientPrinter;
            },
            set: function (value) {
                this._clientPrinter = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientPrintJob.prototype, "printerCommandsCopies", {
            get: function () {
                return this._printerCommandsCopies;
            },
            set: function (value) {
                if (value < 1)
                    throw "Copies must be greater than or equal to 1.";
                this._printerCommandsCopies = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientPrintJob.prototype, "printerCommands", {
            get: function () {
                return this._printerCommands;
            },
            set: function (value) {
                this._printerCommands = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientPrintJob.prototype, "printerCommandsCodePage", {
            get: function () {
                return this._printerCommandsCodePage;
            },
            set: function (value) {
                this._printerCommandsCodePage = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientPrintJob.prototype, "binaryPrinterCommands", {
            get: function () {
                return this._binaryPrinterCommands;
            },
            set: function (value) {
                this._binaryPrinterCommands = value;
                this._printerCommands = "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientPrintJob.prototype, "files", {
            get: function () {
                return this._printFileGroup;
            },
            enumerable: true,
            configurable: true
        });
        ClientPrintJob.prototype.onUpdated = function (data) { };
        ;
        ClientPrintJob.prototype.onFinished = function (data) { };
        ;
        ClientPrintJob.prototype.onError = function (data, is_critical) { };
        ;
        ClientPrintJob.prototype.onUpdate = function (data, last) {
            if (last) {
                this.onFinished(data);
            }
            else {
                this.onUpdated(data);
            }
        };
        ClientPrintJob.prototype._genPFGArrayAsync = function (printFileGroup) {
            var SEPARATOR = ',';
            return new Promise(function (resolve, reject) {
                if (!zip)
                    reject("zip.js, zip-ext.js, and deflate.js files from https://github.com/gildas-lormeau/zip.js project are missing.");
                else {
                    zip.useWebWorkers = false;
                    zip.createWriter(new zip.BlobWriter("application/zip"), function (zipWriter) {
                        function addPrintFile2Zip(pf_idx) {
                            if (pf_idx >= printFileGroup.length) {
                                zipWriter.close(function (zipBlob) {
                                    resolve(zipBlob);
                                });
                            }
                            else {
                                var printFile = printFileGroup[pf_idx];
                                var file_1 = pf_idx + SEPARATOR + printFile.copies + SEPARATOR + printFile.fileName;
                                printFile.serialize().then(function (reader) {
                                    zipWriter.add(file_1, reader, function () { addPrintFile2Zip(pf_idx + 1); });
                                }).catch(function (e) {
                                    reject(e);
                                });
                            }
                        }
                        if (printFileGroup.length != 0)
                            addPrintFile2Zip(0);
                    }, function (e) { reject(e); });
                }
            });
        };
        ClientPrintJob.prototype._genPCArrayAsync = function (binPrinterCommands, printerCopies) {
            return new Promise(function (resolve, reject) {
                try {
                    var copies = JSPM.Utils._str2UTF8Array(printerCopies.toString());
                    var pcc_copies = new Uint8Array(0);
                    if (printerCopies > 1) {
                        pcc_copies = new Uint8Array(5 + copies.length);
                        pcc_copies.set([80, 67, 67, 61]);
                        pcc_copies.set(copies, 4);
                        pcc_copies.set([124], 4 + copies.length);
                    }
                    if (binPrinterCommands != null && binPrinterCommands.length > 0)
                        resolve(new Blob([pcc_copies, binPrinterCommands]));
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        ClientPrintJob.prototype._genPrinterArrayAsync = function (clientPrinter) {
            return new Promise(function (resolve, reject) {
                try {
                    if (!clientPrinter)
                        clientPrinter = new JSPM.UserSelectedPrinter();
                    var toRet = new Uint8Array(JSPM.Utils._str2UTF8Array(clientPrinter.serialize()));
                    resolve(toRet);
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        ClientPrintJob.prototype._cmd2bin = function () {
            if (this._printerCommands && this._printerCommands.length > 0) {
                try {
                    if (this._printerCommandsCodePage == JSPM.Encoding.Default) {
                        this._binaryPrinterCommands = new Uint8Array(JSPM.Utils._str2UTF8Array(this._printerCommands));
                    }
                    else {
                        if (!('cptable' in window)) {
                            throw "cptable.js and cputils.js files from " +
                                "https://github.com/SheetJS/js-codepage" +
                                "project are missing";
                        }
                        if (!('utils' in window['cptable'])) {
                            throw "cptable.js and cputils.js files from " +
                                "https://github.com/SheetJS/js-codepage " +
                                "project are missing";
                        }
                        if (!(this._printerCommandsCodePage in window['cptable'])) {
                            throw "Encoding " +
                                this._printerCommandsCodePage.toString() +
                                " is missing. Add it from" +
                                "https://github.com/SheetJS/js-codepage/tree/master/bits";
                        }
                        this._binaryPrinterCommands = new Uint8Array(cptable.utils.encode(this._printerCommandsCodePage, this._printerCommands));
                    }
                }
                catch (e) {
                    throw e;
                }
            }
        };
        ClientPrintJob.prototype._generateDataAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._cmd2bin();
                var header = new Uint8Array([99, 112, 106, 2]);
                Promise.race([
                    _this._genPCArrayAsync(_this.binaryPrinterCommands, _this._printerCommandsCopies),
                    _this._genPFGArrayAsync(_this._printFileGroup)
                ])
                    .then(function (file_data) {
                    _this._genPrinterArrayAsync(_this._clientPrinter)
                        .then(function (printer_data) {
                        var idx1 = JSPM.Utils._intToByteArray(file_data.size);
                        resolve(new Blob([header, idx1, file_data, printer_data]));
                    })
                        .catch(function (e) { reject(e); });
                })
                    .catch(function (e) { reject(e); });
            });
        };
        return ClientPrintJob;
    }(JSPM.ClientJob));
    JSPM.ClientPrintJob = ClientPrintJob;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var ClientPrintJobGroup = (function (_super) {
        __extends(ClientPrintJobGroup, _super);
        function ClientPrintJobGroup() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._jobs = [];
            return _this;
        }
        Object.defineProperty(ClientPrintJobGroup.prototype, "jobs", {
            get: function () {
                return this._jobs;
            },
            enumerable: true,
            configurable: true
        });
        ClientPrintJobGroup.prototype._generateMiniJob = function (cj) {
            var INDEXES_SIZE = 8;
            return new Promise(function (ok, error) {
                cj._cmd2bin();
                Promise
                    .race([cj._genPCArrayAsync(cj.binaryPrinterCommands, cj.printerCommandsCopies),
                    cj._genPFGArrayAsync(cj.files)])
                    .then(function (file_data) {
                    cj._genPrinterArrayAsync(cj.clientPrinter).then(function (printer_data) {
                        var idx1 = JSPM.Utils._intToByteArray(file_data.size);
                        ok(new Blob([idx1, file_data, printer_data]));
                    }).catch(function (e) { error(e); });
                }).catch(function (e) { error(e); });
            });
        };
        ClientPrintJobGroup.prototype._generateDataAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var header = new Uint8Array([99, 112, 106, 103, 2]);
                var jobs_qty = new Uint8Array(JSPM.Utils._intToByteArray(_this.jobs.length));
                var promises = [];
                for (var i = 0; i < _this.jobs.length; i++) {
                    promises.push(_this._generateMiniJob(_this.jobs[i]));
                }
                Promise.all(promises).then(function (data_arr) {
                    var jobs_metadata = data_arr.map(function (x) {
                        return {
                            startIndex: 0,
                            endIndex: x.size - 1
                        };
                    });
                    for (var i = 1; i < jobs_metadata.length; i++) {
                        jobs_metadata[i].startIndex = jobs_metadata[i - 1].endIndex + 1;
                        jobs_metadata[i].endIndex += jobs_metadata[i].startIndex;
                    }
                    var metadata = JSON.stringify(jobs_metadata);
                    var jobs = data_arr.reduce(function (prev, curr) { return new Blob([prev, curr]); });
                    var jobs_offset = new Uint8Array(JSPM.Utils._intToByteArray(jobs.size));
                    resolve(new Blob([header, jobs_qty, jobs_offset, jobs, metadata]));
                })
                    .catch(function (error) {
                    reject(error);
                });
            });
        };
        return ClientPrintJobGroup;
    }(JSPM.ClientJob));
    JSPM.ClientPrintJobGroup = ClientPrintJobGroup;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var DefaultPrinter = (function () {
        function DefaultPrinter() {
            this.Id = 0;
        }
        DefaultPrinter.prototype.serialize = function () {
            return JSON.stringify({
                'type': this.Id
            });
        };
        return DefaultPrinter;
    }());
    JSPM.DefaultPrinter = DefaultPrinter;
    var InstalledPrinter = (function () {
        function InstalledPrinter(printerName, printToDefaultIfNotFound, trayName, paperName, duplex) {
            if (printToDefaultIfNotFound === void 0) { printToDefaultIfNotFound = false; }
            if (trayName === void 0) { trayName = ''; }
            if (paperName === void 0) { paperName = ''; }
            if (duplex === void 0) { duplex = JSPM.DuplexMode.Default; }
            this.Id = 1;
            this._name = "";
            this._printDefault = false;
            this._tray = "";
            this._paper = "";
            this._duplex = JSPM.DuplexMode.Default;
            if (!printerName)
                throw "The specified printer name is null or empty.";
            this._name = printerName;
            this._printDefault = printToDefaultIfNotFound;
            this._paper = paperName;
            this._tray = trayName;
            this._duplex = duplex;
        }
        InstalledPrinter.prototype.bool2str = function (value, true_val, false_val) {
            if (true_val === void 0) { true_val = '1'; }
            if (false_val === void 0) { false_val = '0'; }
            return value ? true_val : false_val;
        };
        Object.defineProperty(InstalledPrinter.prototype, "printerName", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstalledPrinter.prototype, "printToDefaultIfNotFound", {
            get: function () {
                return this._printDefault;
            },
            set: function (value) {
                this._printDefault = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstalledPrinter.prototype, "trayName", {
            get: function () {
                return this._tray;
            },
            set: function (value) {
                this._tray = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstalledPrinter.prototype, "paperName", {
            get: function () {
                return this._paper;
            },
            set: function (value) {
                this._paper = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstalledPrinter.prototype, "duplex", {
            get: function () {
                return this._duplex;
            },
            set: function (value) {
                this._duplex = value;
            },
            enumerable: true,
            configurable: true
        });
        InstalledPrinter.prototype.serialize = function () {
            if (!this._name) {
                throw "The specified printer name is null or empty.";
            }
            return JSON.stringify({
                type: this.Id,
                name: this._name,
                duplex: this._duplex,
                paper: this._paper,
                tray: this._tray,
                use_default: this._printDefault
            });
        };
        return InstalledPrinter;
    }());
    JSPM.InstalledPrinter = InstalledPrinter;
    var ParallelPortPrinter = (function () {
        function ParallelPortPrinter(portName) {
            this.Id = 2;
            this._parallelPortName = "LPT1";
            if (!portName)
                throw "The specified parallel port name is null or empty.";
            this._parallelPortName = portName;
        }
        Object.defineProperty(ParallelPortPrinter.prototype, "portName", {
            get: function () {
                return this._parallelPortName;
            },
            set: function (value) {
                this._parallelPortName = value;
            },
            enumerable: true,
            configurable: true
        });
        ParallelPortPrinter.prototype.serialize = function () {
            if (!this.portName)
                throw "The specified parallel port name is null or empty.";
            return JSON.stringify({
                type: this.Id,
                port: this._parallelPortName
            });
        };
        return ParallelPortPrinter;
    }());
    JSPM.ParallelPortPrinter = ParallelPortPrinter;
    var SerialPortPrinter = (function () {
        function SerialPortPrinter(portName, baudRate, parity, stopBits, dataBits, flowControl) {
            this.Id = 3;
            this._port = "COM1";
            this._baud_rate = 9600;
            this._parity = JSPM.Serial.Parity.None;
            this._stop_bits = JSPM.Serial.StopBits.One;
            this._data_bits = JSPM.Serial.DataBits.Eight;
            this._flow_control = JSPM.Serial.Handshake.XOnXOff;
            if (!portName)
                throw "The specified serial port name is null or empty.";
            this._port = portName;
            this._baud_rate = baudRate;
            this._parity = parity;
            this._stop_bits = stopBits;
            this._data_bits = dataBits;
            this._flow_control = flowControl;
        }
        Object.defineProperty(SerialPortPrinter.prototype, "portName", {
            get: function () {
                return this._port;
            },
            set: function (value) {
                this._port = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "baudRate", {
            get: function () {
                return this._baud_rate;
            },
            set: function (value) {
                this._baud_rate = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "parity", {
            get: function () {
                return this._parity;
            },
            set: function (value) {
                this._parity = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "stopBits", {
            get: function () {
                return this._stop_bits;
            },
            set: function (value) {
                this._stop_bits = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "dataBits", {
            get: function () {
                return this._data_bits;
            },
            set: function (value) {
                this._data_bits = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "flowControl", {
            get: function () {
                return this._flow_control;
            },
            set: function (value) {
                this._flow_control = value;
            },
            enumerable: true,
            configurable: true
        });
        SerialPortPrinter.prototype.serialize = function () {
            if (!this.portName)
                throw "The specified serial port name is null or empty.";
            return JSON.stringify({
                type: this.Id,
                port: this._port,
                baud_rate: this._baud_rate,
                data_bits: this._data_bits,
                flow_control: this._flow_control,
                parity: this._parity,
                stop_bits: this._stop_bits
            });
        };
        return SerialPortPrinter;
    }());
    JSPM.SerialPortPrinter = SerialPortPrinter;
    var NetworkPrinter = (function () {
        function NetworkPrinter(port, ipAddress, dnsName) {
            this.Id = 4;
            this._ip = "0.0.0.0";
            this._port = 0;
            this._dnsName = "";
            if (!(ipAddress || dnsName))
                throw "You have to specify an IP address or a DNS name";
            if (ipAddress)
                this._ip = ipAddress;
            if (dnsName)
                this._dnsName = dnsName;
            this._port = port;
        }
        Object.defineProperty(NetworkPrinter.prototype, "dnsName", {
            get: function () {
                return this._dnsName;
            },
            set: function (value) {
                this._dnsName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetworkPrinter.prototype, "ipAddress", {
            get: function () {
                return this._ip;
            },
            set: function (value) {
                this._ip = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetworkPrinter.prototype, "port", {
            get: function () {
                return this._port;
            },
            set: function (value) {
                if (!(value >= 0 && value <= 65535))
                    throw "Invalid Port Number";
                this._port = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        NetworkPrinter.prototype.serialize = function () {
            if (!(this.dnsName || this.ipAddress))
                throw "You have to specify an IP address or a DNS name";
            return JSON.stringify({
                type: this.Id,
                ip: this._ip,
                dns: this._dnsName,
                port: this._port
            });
        };
        return NetworkPrinter;
    }());
    JSPM.NetworkPrinter = NetworkPrinter;
    var UserSelectedPrinter = (function () {
        function UserSelectedPrinter() {
            this.Id = 5;
        }
        UserSelectedPrinter.prototype.serialize = function () {
            return JSON.stringify({
                type: this.Id
            });
        };
        return UserSelectedPrinter;
    }());
    JSPM.UserSelectedPrinter = UserSelectedPrinter;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var ClientScanJob = (function (_super) {
        __extends(ClientScanJob, _super);
        function ClientScanJob() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._type = 'scan_job';
            _this._scannerName = "";
            _this._pixelMode = JSPM.PixelMode.Color;
            _this._resolution = 200;
            _this._imageFormat = JSPM.ScannerImageFormatOutput.JPG;
            return _this;
        }
        Object.defineProperty(ClientScanJob.prototype, "scannerName", {
            get: function () {
                return this._scannerName;
            },
            set: function (val) {
                this._scannerName = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientScanJob.prototype, "pixelMode", {
            get: function () {
                return this._pixelMode;
            },
            set: function (val) {
                this._pixelMode = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientScanJob.prototype, "resolution", {
            get: function () {
                return this._resolution;
            },
            set: function (val) {
                this._resolution = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientScanJob.prototype, "imageFormat", {
            get: function () {
                return this._imageFormat;
            },
            set: function (val) {
                this._imageFormat = val;
            },
            enumerable: true,
            configurable: true
        });
        ClientScanJob.prototype.onFinished = function (data) { };
        ;
        ClientScanJob.prototype.onError = function (data, is_critical) { };
        ;
        ClientScanJob.prototype.onUpdate = function (data, last) {
            if (data.result) {
                this.onFinished(data);
            }
        };
        ClientScanJob.prototype._generateDataAsync = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                if (!_this._resolution)
                    err("Scan resolution is required");
                if (!_this._scannerName)
                    err("Scanner name is required");
                var json = {
                    output_image_format: _this._imageFormat,
                    pixel_mode: _this._pixelMode,
                    scanner_name: _this._scannerName,
                    resolution: _this._resolution
                };
                ok(JSON.stringify(json));
            });
        };
        return ClientScanJob;
    }(JSPM.ClientJob));
    JSPM.ClientScanJob = ClientScanJob;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var PrintersInfoLevel;
    (function (PrintersInfoLevel) {
        PrintersInfoLevel[PrintersInfoLevel["Basic"] = 0] = "Basic";
        PrintersInfoLevel[PrintersInfoLevel["Extended"] = 1] = "Extended";
    })(PrintersInfoLevel = JSPM.PrintersInfoLevel || (JSPM.PrintersInfoLevel = {}));
    var Encoding;
    (function (Encoding) {
        Encoding[Encoding["Default"] = -1] = "Default";
        Encoding[Encoding["IBM_EBCDIC_US_Canada"] = 37] = "IBM_EBCDIC_US_Canada";
        Encoding[Encoding["OEM_United_States"] = 437] = "OEM_United_States";
        Encoding[Encoding["IBM_EBCDIC_International"] = 500] = "IBM_EBCDIC_International";
        Encoding[Encoding["Polish_MS_DOS"] = 620] = "Polish_MS_DOS";
        Encoding[Encoding["Arabic_ASMO_708"] = 708] = "Arabic_ASMO_708";
        Encoding[Encoding["Arabic_Transparent_ASMO_Arabic_DOS"] = 720] = "Arabic_Transparent_ASMO_Arabic_DOS";
        Encoding[Encoding["OEM_Greek_formerly_437G_Greek_DOS"] = 737] = "OEM_Greek_formerly_437G_Greek_DOS";
        Encoding[Encoding["OEM_Baltic_Baltic_DOS"] = 775] = "OEM_Baltic_Baltic_DOS";
        Encoding[Encoding["OEM_Russian_Cyrillic_Euro_symbol"] = 808] = "OEM_Russian_Cyrillic_Euro_symbol";
        Encoding[Encoding["OEM_Multilingual_Latin_1_Western_European_DOS"] = 850] = "OEM_Multilingual_Latin_1_Western_European_DOS";
        Encoding[Encoding["OEM_Latin_2_Central_European_DOS"] = 852] = "OEM_Latin_2_Central_European_DOS";
        Encoding[Encoding["OEM_Cyrillic_primarily_Russian"] = 855] = "OEM_Cyrillic_primarily_Russian";
        Encoding[Encoding["OEM_Turkish_Turkish_DOS"] = 857] = "OEM_Turkish_Turkish_DOS";
        Encoding[Encoding["OEM_Multilingual_Latin_1_Euro_symbol"] = 858] = "OEM_Multilingual_Latin_1_Euro_symbol";
        Encoding[Encoding["OEM_Portuguese_Portuguese_DOS"] = 860] = "OEM_Portuguese_Portuguese_DOS";
        Encoding[Encoding["OEM_Icelandic_Icelandic_DOS"] = 861] = "OEM_Icelandic_Icelandic_DOS";
        Encoding[Encoding["OEM_Hebrew_Hebrew_DOS"] = 862] = "OEM_Hebrew_Hebrew_DOS";
        Encoding[Encoding["OEM_French_Canadian_French_Canadian_DOS"] = 863] = "OEM_French_Canadian_French_Canadian_DOS";
        Encoding[Encoding["OEM_Arabic_Arabic_864"] = 864] = "OEM_Arabic_Arabic_864";
        Encoding[Encoding["OEM_Nordic_Nordic_DOS"] = 865] = "OEM_Nordic_Nordic_DOS";
        Encoding[Encoding["OEM_Russian_Cyrillic_DOS"] = 866] = "OEM_Russian_Cyrillic_DOS";
        Encoding[Encoding["OEM_Modern_Greek_Greek_Modern_DOS"] = 869] = "OEM_Modern_Greek_Greek_Modern_DOS";
        Encoding[Encoding["IBM_EBCDIC_Multilingual_ROECE_Latin_2"] = 870] = "IBM_EBCDIC_Multilingual_ROECE_Latin_2";
        Encoding[Encoding["OEM_Cyrillic_primarily_Russian_Euro_Symbol"] = 872] = "OEM_Cyrillic_primarily_Russian_Euro_Symbol";
        Encoding[Encoding["Windows_Thai"] = 874] = "Windows_Thai";
        Encoding[Encoding["IBM_EBCDIC_Greek_Modern"] = 875] = "IBM_EBCDIC_Greek_Modern";
        Encoding[Encoding["Kamenicky_Czech_MS_DOS"] = 895] = "Kamenicky_Czech_MS_DOS";
        Encoding[Encoding["Japanese_Shift_JIS"] = 932] = "Japanese_Shift_JIS";
        Encoding[Encoding["Simplified_Chinese_GBK"] = 936] = "Simplified_Chinese_GBK";
        Encoding[Encoding["Korean"] = 949] = "Korean";
        Encoding[Encoding["Traditional_Chinese_Big5"] = 950] = "Traditional_Chinese_Big5";
        Encoding[Encoding["IBM_EBCDIC_French"] = 1010] = "IBM_EBCDIC_French";
        Encoding[Encoding["IBM_EBCDIC_Turkish_Latin_5"] = 1026] = "IBM_EBCDIC_Turkish_Latin_5";
        Encoding[Encoding["IBM_EBCDIC_Latin_1_Open_System"] = 1047] = "IBM_EBCDIC_Latin_1_Open_System";
        Encoding[Encoding["IBM_EBCDIC_Lao_1132_1133_1341"] = 1132] = "IBM_EBCDIC_Lao_1132_1133_1341";
        Encoding[Encoding["IBM_EBCDIC_US_Canada_037_Euro_symbol"] = 1140] = "IBM_EBCDIC_US_Canada_037_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_Germany_20273_Euro_symbol"] = 1141] = "IBM_EBCDIC_Germany_20273_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_Denmark_Norway_20277_Euro_symbol"] = 1142] = "IBM_EBCDIC_Denmark_Norway_20277_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_Finland_Sweden_20278_Euro_symbol"] = 1143] = "IBM_EBCDIC_Finland_Sweden_20278_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_Italy_20280_Euro_symbol"] = 1144] = "IBM_EBCDIC_Italy_20280_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_Latin_America_Spain_20284_Euro_symbol"] = 1145] = "IBM_EBCDIC_Latin_America_Spain_20284_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_United_Kingdom_20285_Euro_symbol"] = 1146] = "IBM_EBCDIC_United_Kingdom_20285_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_France_20297_Euro_symbol"] = 1147] = "IBM_EBCDIC_France_20297_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_International_500_Euro_symbol"] = 1148] = "IBM_EBCDIC_International_500_Euro_symbol";
        Encoding[Encoding["IBM_EBCDIC_Icelandic_20871_Euro_symbol"] = 1149] = "IBM_EBCDIC_Icelandic_20871_Euro_symbol";
        Encoding[Encoding["Unicode_UTF_16_little_endian_BMP_of_ISO_10646"] = 1200] = "Unicode_UTF_16_little_endian_BMP_of_ISO_10646";
        Encoding[Encoding["Unicode_UTF_16_big_endian"] = 1201] = "Unicode_UTF_16_big_endian";
        Encoding[Encoding["Windows_Central_Europe"] = 1250] = "Windows_Central_Europe";
        Encoding[Encoding["Windows_Cyrillic"] = 1251] = "Windows_Cyrillic";
        Encoding[Encoding["Windows_Latin_I"] = 1252] = "Windows_Latin_I";
        Encoding[Encoding["Windows_Greek"] = 1253] = "Windows_Greek";
        Encoding[Encoding["Windows_Turkish"] = 1254] = "Windows_Turkish";
        Encoding[Encoding["Windows_Hebrew"] = 1255] = "Windows_Hebrew";
        Encoding[Encoding["Windows_Arabic"] = 1256] = "Windows_Arabic";
        Encoding[Encoding["Windows_Baltic"] = 1257] = "Windows_Baltic";
        Encoding[Encoding["Windows_Vietnam"] = 1258] = "Windows_Vietnam";
        Encoding[Encoding["Korean_Johab"] = 1361] = "Korean_Johab";
        Encoding[Encoding["MAC_Roman"] = 10000] = "MAC_Roman";
        Encoding[Encoding["Japanese_Mac"] = 10001] = "Japanese_Mac";
        Encoding[Encoding["MAC_Traditional_Chinese_Big5"] = 10002] = "MAC_Traditional_Chinese_Big5";
        Encoding[Encoding["Korean_Mac"] = 10003] = "Korean_Mac";
        Encoding[Encoding["Arabic_Mac"] = 10004] = "Arabic_Mac";
        Encoding[Encoding["Hebrew_Mac"] = 10005] = "Hebrew_Mac";
        Encoding[Encoding["Greek_Mac"] = 10006] = "Greek_Mac";
        Encoding[Encoding["Cyrillic_Mac"] = 10007] = "Cyrillic_Mac";
        Encoding[Encoding["MAC_Simplified_Chinese_GB_2312"] = 10008] = "MAC_Simplified_Chinese_GB_2312";
        Encoding[Encoding["Romanian_Mac"] = 10010] = "Romanian_Mac";
        Encoding[Encoding["Ukrainian_Mac"] = 10017] = "Ukrainian_Mac";
        Encoding[Encoding["Thai_Mac"] = 10021] = "Thai_Mac";
        Encoding[Encoding["MAC_Latin_2_Central_European"] = 10029] = "MAC_Latin_2_Central_European";
        Encoding[Encoding["Icelandic_Mac"] = 10079] = "Icelandic_Mac";
        Encoding[Encoding["Turkish_Mac"] = 10081] = "Turkish_Mac";
        Encoding[Encoding["Croatian_Mac"] = 10082] = "Croatian_Mac";
        Encoding[Encoding["Unicode_UTF_32_little_endian_byte_order"] = 12000] = "Unicode_UTF_32_little_endian_byte_order";
        Encoding[Encoding["Unicode_UTF_32_big_endian_byte_order"] = 12001] = "Unicode_UTF_32_big_endian_byte_order";
        Encoding[Encoding["CNS_Taiwan_Chinese_Traditional"] = 20000] = "CNS_Taiwan_Chinese_Traditional";
        Encoding[Encoding["TCA_Taiwan"] = 20001] = "TCA_Taiwan";
        Encoding[Encoding["ETEN_Taiwan_Chinese_Traditional"] = 20002] = "ETEN_Taiwan_Chinese_Traditional";
        Encoding[Encoding["IBM5550_Taiwan"] = 20003] = "IBM5550_Taiwan";
        Encoding[Encoding["TeleText_Taiwan"] = 20004] = "TeleText_Taiwan";
        Encoding[Encoding["Wang_Taiwan"] = 20005] = "Wang_Taiwan";
        Encoding[Encoding["Western_European_IA5_IRV_International_Alphabet_5"] = 20105] = "Western_European_IA5_IRV_International_Alphabet_5";
        Encoding[Encoding["IA5_German_7_bit"] = 20106] = "IA5_German_7_bit";
        Encoding[Encoding["IA5_Swedish_7_bit"] = 20107] = "IA5_Swedish_7_bit";
        Encoding[Encoding["IA5_Norwegian_7_bit"] = 20108] = "IA5_Norwegian_7_bit";
        Encoding[Encoding["US_ASCII_7_bit"] = 20127] = "US_ASCII_7_bit";
        Encoding[Encoding["T_61"] = 20261] = "T_61";
        Encoding[Encoding["ISO_6937_Non_Spacing_Accent"] = 20269] = "ISO_6937_Non_Spacing_Accent";
        Encoding[Encoding["IBM_EBCDIC_Germany"] = 20273] = "IBM_EBCDIC_Germany";
        Encoding[Encoding["IBM_EBCDIC_Denmark_Norway"] = 20277] = "IBM_EBCDIC_Denmark_Norway";
        Encoding[Encoding["IBM_EBCDIC_Finland_Sweden"] = 20278] = "IBM_EBCDIC_Finland_Sweden";
        Encoding[Encoding["IBM_EBCDIC_Italy"] = 20280] = "IBM_EBCDIC_Italy";
        Encoding[Encoding["IBM_EBCDIC_Latin_America_Spain"] = 20284] = "IBM_EBCDIC_Latin_America_Spain";
        Encoding[Encoding["IBM_EBCDIC_United_Kingdom"] = 20285] = "IBM_EBCDIC_United_Kingdom";
        Encoding[Encoding["IBM_EBCDIC_Japanese_Katakana_Extended"] = 20290] = "IBM_EBCDIC_Japanese_Katakana_Extended";
        Encoding[Encoding["IBM_EBCDIC_France"] = 20297] = "IBM_EBCDIC_France";
        Encoding[Encoding["IBM_EBCDIC_Arabic"] = 20420] = "IBM_EBCDIC_Arabic";
        Encoding[Encoding["IBM_EBCDIC_Greek"] = 20423] = "IBM_EBCDIC_Greek";
        Encoding[Encoding["IBM_EBCDIC_Hebrew"] = 20424] = "IBM_EBCDIC_Hebrew";
        Encoding[Encoding["IBM_EBCDIC_Korean_Extended"] = 20833] = "IBM_EBCDIC_Korean_Extended";
        Encoding[Encoding["IBM_EBCDIC_Thai"] = 20838] = "IBM_EBCDIC_Thai";
        Encoding[Encoding["Russian_Cyrillic_KOI8_R"] = 20866] = "Russian_Cyrillic_KOI8_R";
        Encoding[Encoding["IBM_EBCDIC_Icelandic"] = 20871] = "IBM_EBCDIC_Icelandic";
        Encoding[Encoding["IBM_EBCDIC_Cyrillic_Russian"] = 20880] = "IBM_EBCDIC_Cyrillic_Russian";
        Encoding[Encoding["IBM_EBCDIC_Turkish"] = 20905] = "IBM_EBCDIC_Turkish";
        Encoding[Encoding["IBM_EBCDIC_Latin_1_Open_System_1047_Euro_symbol"] = 20924] = "IBM_EBCDIC_Latin_1_Open_System_1047_Euro_symbol";
        Encoding[Encoding["Japanese_JIS_0208_1990_and_0212_1990"] = 20932] = "Japanese_JIS_0208_1990_and_0212_1990";
        Encoding[Encoding["Simplified_Chinese_GB2312_80"] = 20936] = "Simplified_Chinese_GB2312_80";
        Encoding[Encoding["Korean_Wansung"] = 20949] = "Korean_Wansung";
        Encoding[Encoding["IBM_EBCDIC_Cyrillic_Serbian_Bulgarian"] = 21025] = "IBM_EBCDIC_Cyrillic_Serbian_Bulgarian";
        Encoding[Encoding["Extended_Ext_Alpha_Lowercase"] = 21027] = "Extended_Ext_Alpha_Lowercase";
        Encoding[Encoding["Ukrainian_Cyrillic_KOI8_U"] = 21866] = "Ukrainian_Cyrillic_KOI8_U";
        Encoding[Encoding["ISO_8859_1_Latin_1_Western_European"] = 28591] = "ISO_8859_1_Latin_1_Western_European";
        Encoding[Encoding["ISO_8859_2_Latin_2_Central_European"] = 28592] = "ISO_8859_2_Latin_2_Central_European";
        Encoding[Encoding["ISO_8859_3_Latin_3"] = 28593] = "ISO_8859_3_Latin_3";
        Encoding[Encoding["ISO_8859_4_Baltic"] = 28594] = "ISO_8859_4_Baltic";
        Encoding[Encoding["ISO_8859_5_Cyrillic"] = 28595] = "ISO_8859_5_Cyrillic";
        Encoding[Encoding["ISO_8859_6_Arabic"] = 28596] = "ISO_8859_6_Arabic";
        Encoding[Encoding["ISO_8859_7_Greek"] = 28597] = "ISO_8859_7_Greek";
        Encoding[Encoding["ISO_8859_8_Hebrew_ISO_Visual"] = 28598] = "ISO_8859_8_Hebrew_ISO_Visual";
        Encoding[Encoding["ISO_8859_9_Turkish"] = 28599] = "ISO_8859_9_Turkish";
        Encoding[Encoding["ISO_8859_10_Latin_6"] = 28600] = "ISO_8859_10_Latin_6";
        Encoding[Encoding["ISO_8859_11_Latin_Thai"] = 28601] = "ISO_8859_11_Latin_Thai";
        Encoding[Encoding["ISO_8859_13_Latin_7_Estonian"] = 28603] = "ISO_8859_13_Latin_7_Estonian";
        Encoding[Encoding["ISO_8859_14_Latin_8_Celtic"] = 28604] = "ISO_8859_14_Latin_8_Celtic";
        Encoding[Encoding["ISO_8859_15_Latin_9"] = 28605] = "ISO_8859_15_Latin_9";
        Encoding[Encoding["ISO_8859_15_Latin_10"] = 28606] = "ISO_8859_15_Latin_10";
        Encoding[Encoding["Europa_3"] = 29001] = "Europa_3";
        Encoding[Encoding["ISO_8859_8_Hebrew_ISO_Logical"] = 38598] = "ISO_8859_8_Hebrew_ISO_Logical";
        Encoding[Encoding["Atari_ST_TT"] = 47451] = "Atari_ST_TT";
        Encoding[Encoding["ISO_2022_JIS_Japanese_with_no_halfwidth_Katakana"] = 50220] = "ISO_2022_JIS_Japanese_with_no_halfwidth_Katakana";
        Encoding[Encoding["ISO_2022_JIS_Japanese_with_halfwidth_Katakana"] = 50221] = "ISO_2022_JIS_Japanese_with_halfwidth_Katakana";
        Encoding[Encoding["ISO_2022_Japanese_JIS_X_0201_1989_1_byte_Kana_SO_SI"] = 50222] = "ISO_2022_Japanese_JIS_X_0201_1989_1_byte_Kana_SO_SI";
        Encoding[Encoding["ISO_2022_Korean"] = 50225] = "ISO_2022_Korean";
        Encoding[Encoding["ISO_2022_Simplified_Chinese"] = 50227] = "ISO_2022_Simplified_Chinese";
        Encoding[Encoding["EUC_Japanese"] = 51932] = "EUC_Japanese";
        Encoding[Encoding["EUC_Simplified_Chinese"] = 51936] = "EUC_Simplified_Chinese";
        Encoding[Encoding["EUC_Korean"] = 51949] = "EUC_Korean";
        Encoding[Encoding["HZ_GB2312_Simplified_Chinese"] = 52936] = "HZ_GB2312_Simplified_Chinese";
        Encoding[Encoding["GB18030_Simplified_Chinese_4_byte"] = 54936] = "GB18030_Simplified_Chinese_4_byte";
        Encoding[Encoding["ISCII_Devanagari"] = 57002] = "ISCII_Devanagari";
        Encoding[Encoding["ISCII_Bengali"] = 57003] = "ISCII_Bengali";
        Encoding[Encoding["ISCII_Tamil"] = 57004] = "ISCII_Tamil";
        Encoding[Encoding["ISCII_Telugu"] = 57005] = "ISCII_Telugu";
        Encoding[Encoding["ISCII_Assamese"] = 57006] = "ISCII_Assamese";
        Encoding[Encoding["ISCII_Oriya"] = 57007] = "ISCII_Oriya";
        Encoding[Encoding["ISCII_Kannada"] = 57008] = "ISCII_Kannada";
        Encoding[Encoding["ISCII_Malayalam"] = 57009] = "ISCII_Malayalam";
        Encoding[Encoding["ISCII_Gujarati"] = 57010] = "ISCII_Gujarati";
        Encoding[Encoding["ISCII_Punjabi"] = 57011] = "ISCII_Punjabi";
        Encoding[Encoding["Unicode_UTF_7"] = 65000] = "Unicode_UTF_7";
        Encoding[Encoding["Unicode_UTF_8"] = 65001] = "Unicode_UTF_8";
    })(Encoding = JSPM.Encoding || (JSPM.Encoding = {}));
    var DuplexMode;
    (function (DuplexMode) {
        DuplexMode[DuplexMode["Default"] = 0] = "Default";
        DuplexMode[DuplexMode["Simplex"] = 1] = "Simplex";
        DuplexMode[DuplexMode["DuplexLongEdge"] = 2] = "DuplexLongEdge";
        DuplexMode[DuplexMode["DuplexShortEdge"] = 3] = "DuplexShortEdge";
    })(DuplexMode = JSPM.DuplexMode || (JSPM.DuplexMode = {}));
    var Sizing;
    (function (Sizing) {
        Sizing[Sizing["None"] = 0] = "None";
        Sizing[Sizing["Fit"] = 1] = "Fit";
    })(Sizing = JSPM.Sizing || (JSPM.Sizing = {}));
    var ScannerImageFormatOutput;
    (function (ScannerImageFormatOutput) {
        ScannerImageFormatOutput[ScannerImageFormatOutput["JPG"] = 0] = "JPG";
        ScannerImageFormatOutput[ScannerImageFormatOutput["PNG"] = 1] = "PNG";
    })(ScannerImageFormatOutput = JSPM.ScannerImageFormatOutput || (JSPM.ScannerImageFormatOutput = {}));
    var PixelMode;
    (function (PixelMode) {
        PixelMode[PixelMode["Grayscale"] = 0] = "Grayscale";
        PixelMode[PixelMode["Color"] = 1] = "Color";
    })(PixelMode = JSPM.PixelMode || (JSPM.PixelMode = {}));
    var FileSourceType;
    (function (FileSourceType) {
        FileSourceType[FileSourceType["Base64"] = 0] = "Base64";
        FileSourceType[FileSourceType["Text"] = 1] = "Text";
        FileSourceType[FileSourceType["BLOB"] = 2] = "BLOB";
        FileSourceType[FileSourceType["URL"] = 3] = "URL";
    })(FileSourceType = JSPM.FileSourceType || (JSPM.FileSourceType = {}));
    ;
    var WSStatus;
    (function (WSStatus) {
        WSStatus[WSStatus["Open"] = 0] = "Open";
        WSStatus[WSStatus["Closed"] = 1] = "Closed";
        WSStatus[WSStatus["Blocked"] = 2] = "Blocked";
        WSStatus[WSStatus["WaitingForUserResponse"] = 3] = "WaitingForUserResponse";
    })(WSStatus = JSPM.WSStatus || (JSPM.WSStatus = {}));
    ;
    var PrintRotation;
    (function (PrintRotation) {
        PrintRotation[PrintRotation["None"] = 0] = "None";
        PrintRotation[PrintRotation["Rot90"] = 1] = "Rot90";
        PrintRotation[PrintRotation["Rot180"] = 2] = "Rot180";
        PrintRotation[PrintRotation["Rot270"] = 3] = "Rot270";
    })(PrintRotation = JSPM.PrintRotation || (JSPM.PrintRotation = {}));
    var TextAlignment;
    (function (TextAlignment) {
        TextAlignment[TextAlignment["Left"] = 0] = "Left";
        TextAlignment[TextAlignment["Center"] = 1] = "Center";
        TextAlignment[TextAlignment["Right"] = 2] = "Right";
        TextAlignment[TextAlignment["Justify"] = 3] = "Justify";
        TextAlignment[TextAlignment["None"] = 4] = "None";
    })(TextAlignment = JSPM.TextAlignment || (JSPM.TextAlignment = {}));
    var PrintOrientation;
    (function (PrintOrientation) {
        PrintOrientation[PrintOrientation["Portrait"] = 0] = "Portrait";
        PrintOrientation[PrintOrientation["Landscape"] = 1] = "Landscape";
    })(PrintOrientation = JSPM.PrintOrientation || (JSPM.PrintOrientation = {}));
})(JSPM || (JSPM = {}));
(function (JSPM) {
    var Serial;
    (function (Serial) {
        var Parity;
        (function (Parity) {
            Parity[Parity["None"] = 0] = "None";
            Parity[Parity["Odd"] = 1] = "Odd";
            Parity[Parity["Even"] = 2] = "Even";
            Parity[Parity["Mark"] = 3] = "Mark";
            Parity[Parity["Space"] = 4] = "Space";
        })(Parity = Serial.Parity || (Serial.Parity = {}));
        var StopBits;
        (function (StopBits) {
            StopBits[StopBits["One"] = 0] = "One";
            StopBits[StopBits["OnePointFive"] = 1] = "OnePointFive";
            StopBits[StopBits["Two"] = 2] = "Two";
        })(StopBits = Serial.StopBits || (Serial.StopBits = {}));
        var DataBits;
        (function (DataBits) {
            DataBits[DataBits["Eight"] = 0] = "Eight";
            DataBits[DataBits["Seven"] = 1] = "Seven";
            DataBits[DataBits["Six"] = 2] = "Six";
            DataBits[DataBits["Five"] = 3] = "Five";
        })(DataBits = Serial.DataBits || (Serial.DataBits = {}));
        var Handshake;
        (function (Handshake) {
            Handshake[Handshake["None"] = 0] = "None";
            Handshake[Handshake["RequestToSend"] = 1] = "RequestToSend";
            Handshake[Handshake["RequestToSendXOnXOff"] = 2] = "RequestToSendXOnXOff";
            Handshake[Handshake["XOnXOff"] = 3] = "XOnXOff";
        })(Handshake = Serial.Handshake || (Serial.Handshake = {}));
    })(Serial = JSPM.Serial || (JSPM.Serial = {}));
})(JSPM || (JSPM = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var JSPM;
(function (JSPM) {
    var JSPMWebSocket = (function () {
        function JSPMWebSocket(addr, port, secure, auto_reconnect) {
            if (addr === void 0) { addr = 'localhost'; }
            if (port === void 0) { port = 23443; }
            if (secure === void 0) { secure = true; }
            if (auto_reconnect === void 0) { auto_reconnect = false; }
            this._job_list = [];
            this._processing_message = new JSPM.Mutex();
            this.autoReconnect = false;
            this.onClose = function (e) { };
            this.onOpen = function (e) { };
            this.onStatusChanged = function () { };
            this._addr = addr;
            this._port = port;
            this._secure = secure;
            this.autoReconnect = auto_reconnect;
        }
        Object.defineProperty(JSPMWebSocket.prototype, "address", {
            get: function () {
                return this._addr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JSPMWebSocket.prototype, "port", {
            get: function () {
                return this._port;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JSPMWebSocket.prototype, "isSecure", {
            get: function () {
                return this._secure;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JSPMWebSocket.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        JSPMWebSocket.prototype._onOpen = function (e, __this) {
            this._status = JSPM.WSStatus.WaitingForUserResponse;
            this._pingPong();
            __this.onStatusChanged();
            __this.onOpen(e);
        };
        JSPMWebSocket.prototype._onMessage = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var unlock, json_data, job, last, msg_type, data, critical, blob, id_buf, id, data_blob, job, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this._processing_message.lock()];
                        case 1:
                            unlock = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, 7, 8]);
                            if (!(typeof (e.data) == 'string')) return [3, 3];
                            json_data = JSON.parse(e.data);
                            job = this._job_list[json_data.id];
                            if (!job)
                                throw "Job " + json_data.id + " doesn't exist";
                            last = ('last' in json_data) ? json_data.last : false;
                            msg_type = ('type' in json_data) ? json_data.type : 'message';
                            data = ('data' in json_data) ? json_data.data : {};
                            switch (msg_type) {
                                case 'message':
                                    {
                                        if (job.on_update && typeof (job.on_update === "function"))
                                            job.on_update(data, job.first_update, last);
                                    }
                                    break;
                                case 'error':
                                    {
                                        critical = 'critical' in json_data ?
                                            json_data.critical : false;
                                        if (job.on_error && typeof (job.on_error === "function"))
                                            job.on_error(data, job.first_update, critical);
                                    }
                                    break;
                                default: {
                                    if (job.on_update && typeof (job.on_update === "function"))
                                        job.on_update(data, job.first_update, last);
                                }
                            }
                            if (last)
                                delete this._job_list[json_data.id];
                            return [3, 5];
                        case 3:
                            blob = e.data;
                            return [4, blob.slice(blob.size - 8, blob.size).arrayBuffer()];
                        case 4:
                            id_buf = _a.sent();
                            id = new TextDecoder('utf-8').decode(id_buf);
                            data_blob = blob.slice(0, blob.size - 8);
                            job = this._job_list[id];
                            if (!job)
                                throw "Job " + id + " doesn't exist";
                            if (job.on_update && typeof (job.on_update === "function"))
                                job.on_update(data_blob, job.first_update, false);
                            _a.label = 5;
                        case 5:
                            job.first_update = false;
                            return [3, 8];
                        case 6:
                            err_1 = _a.sent();
                            throw "Malformed message. Error: " + err_1 + " Message: " + e.data;
                        case 7:
                            unlock();
                            return [7];
                        case 8: return [2];
                    }
                });
            });
        };
        JSPMWebSocket.prototype._onError = function (e) {
            try {
                var json_data = JSON.parse(e);
                var job = this._job_list[json_data.id];
                if (!job)
                    throw e;
                job.on_error(e, true, true);
            }
            catch (_a) {
                throw e;
            }
        };
        JSPMWebSocket.prototype._pingPong = function () {
            var _this = this;
            setInterval(function (_) {
                if (_this._status != JSPM.WSStatus.Open)
                    return;
                _this.send('', {
                    type: 'ping',
                    on_update: function (_) { },
                    on_error: function (_) { }
                });
            }, 30000);
        };
        JSPMWebSocket.prototype._onClose = function (e, __this) {
            var _this = this;
            if (e.code == 403)
                this._status = JSPM.WSStatus.Blocked;
            else {
                this._status = JSPM.WSStatus.Closed;
                if (this.autoReconnect)
                    setTimeout(function (_) {
                        _this.start();
                    }, 2000);
            }
            __this.onClose(e);
            __this.onStatusChanged();
        };
        ;
        JSPMWebSocket.prototype._genID = function () {
            return Math.floor((1 + Math.random()) * 0x100000000)
                .toString(16)
                .substring(1);
        };
        JSPMWebSocket.prototype._send = function (data, properties) {
            var id = "";
            if ('id' in properties) {
                id = properties.id;
            }
            else {
                do {
                    var id = this._genID();
                } while (this._job_list[id]);
                this._job_list[id] = {
                    id: id,
                    first_update: true,
                    on_update: properties['on_update'],
                    on_error: properties['on_error']
                };
            }
            var _data = '';
            if (data instanceof Blob) {
                var job_id = new Uint8Array(('id' + id).split('')
                    .map(function (a) { return a.charCodeAt(0); }));
                _data = new Blob([data, job_id]);
            }
            else if (typeof data == 'string') {
                _data = { id: id, data: data };
                if ('type' in properties) {
                    _data['type'] = properties.type;
                }
                _data = JSON.stringify(_data);
            }
            else {
                delete this._job_list[id];
                _data = data;
            }
            this._ws.send(_data);
            return id;
        };
        JSPMWebSocket.prototype.start = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                try {
                    _this._ws = new WebSocket((_this._secure ? 'wss://' : 'ws://') +
                        _this._addr + ':' + _this._port);
                    _this._ws.onclose = function (e) { return _this._onClose(e, _this); };
                    _this._ws.onerror = function (i) {
                        err(i);
                    };
                    _this._ws.onopen = function (i) {
                        _this._ws.onopen = function (e) { return _this._onOpen(e, _this); };
                        _this._ws.onmessage = function (e) {
                            try {
                                var json = JSON.parse(e.data);
                                if ('connection' in json) {
                                    if (json.connection == 'CONNECTED') {
                                        _this._status = JSPM.WSStatus.Open;
                                        _this.onStatusChanged();
                                        _this.onOpen(json.certificate);
                                        JSPM.JSPrintManager._ses_cert = json.certificate;
                                        _this.send(JSON.stringify({ url: JSPM.JSPrintManager.license_url }), {
                                            type: "set_license",
                                            on_update: function (v) { console.info("JSPrintManager License:", 'result' in v ? v['result'] : v); },
                                            on_error: function (v) { console.warn("JSPrintManager License:", 'result' in v ? v['result'] : v); },
                                        });
                                        var verArray = json.version.split('.');
                                        if (verArray[0] + '.' + verArray[1] != JSPM.VERSION) {
                                            console.warn("Lib JS version and " +
                                                "desktop version differs Desktop(" +
                                                json.version + ") JS (" + JSPM.VERSION +
                                                ")");
                                        }
                                        _this._ws.onmessage = function (e) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, this._onMessage(e)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2];
                                                }
                                            });
                                        }); };
                                        _this._ws.onerror = _this._onError;
                                        ok();
                                    }
                                    else {
                                        err("WS Connection not established. Reason: " + json.connection);
                                    }
                                }
                            }
                            catch (e) {
                                err("Malformed message. Check if JS version " +
                                    "and Desktop version are the same. Description: " + e);
                            }
                        };
                    };
                }
                catch (e) {
                    if (_this.autoReconnect)
                        setTimeout(function () {
                            _this.start().then(ok).catch(err);
                        }, 2000);
                    else
                        err(e);
                }
            });
        };
        JSPMWebSocket.prototype.send = function (data, properties) {
            if (this._status == JSPM.WSStatus.Closed)
                properties['on_first_error']("The WebSocket connection is closed");
            else if (this._status == JSPM.WSStatus.Blocked)
                properties['on_first_error']("The site is blocked and the connection was closed");
            else if (this._ws.readyState != this._ws.OPEN)
                properties['on_first_error']("The WebSocket isn't ready yet");
            return this._send(data, properties);
        };
        JSPMWebSocket.prototype.stop = function () {
            this._ws.close();
            this._ws = null;
        };
        return JSPMWebSocket;
    }());
    JSPM.JSPMWebSocket = JSPMWebSocket;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var JSPrintManager = (function () {
        function JSPrintManager() {
        }
        Object.defineProperty(JSPrintManager, "session_certificate", {
            get: function () {
                return this._ses_cert;
            },
            enumerable: true,
            configurable: true
        });
        JSPrintManager.start = function (secure, host, port) {
            if (secure === void 0) { secure = true; }
            if (host === void 0) { host = 'localhost'; }
            if (port === void 0) { port = 23443; }
            return __awaiter(this, void 0, void 0, function () {
                var ws;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.WS)
                                this.WS = new JSPM.JSPMWebSocket(host, port, secure, this.auto_reconnect);
                            return [4, this.WS.start()];
                        case 1:
                            ws = _a.sent();
                            return [2, ws];
                    }
                });
            });
        };
        Object.defineProperty(JSPrintManager, "license_url", {
            get: function () {
                return this._license;
            },
            set: function (value) {
                this._license = value;
                if (this.WS && this.WS.status == JSPM.WSStatus.Open)
                    this.WS.send(JSON.stringify({ url: this._license }), {
                        type: "set_license",
                        on_update: function (_) { }, on_error: function (_) { }
                    });
            },
            enumerable: true,
            configurable: true
        });
        JSPrintManager.getPrinters = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.WS.send('', {
                    type: 'printers_list',
                    on_update: function (data) {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        JSPrintManager.getPrintersInfo = function (detail_level, printer_name) {
            var _this = this;
            if (detail_level === void 0) { detail_level = JSPM.PrintersInfoLevel.Basic; }
            if (printer_name === void 0) { printer_name = ''; }
            return new Promise(function (ok, err) {
                var data = { 'detail_level': detail_level };
                if (printer_name)
                    data['printer'] = printer_name;
                _this.WS.send(JSON.stringify(data), {
                    type: 'printers_complete_list',
                    on_update: function (data) {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        Object.defineProperty(JSPrintManager, "websocket_status", {
            get: function () {
                return this.WS ? this.WS.status : JSPM.WSStatus.Closed;
            },
            enumerable: true,
            configurable: true
        });
        JSPrintManager.showAbout = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.WS.send('', {
                    type: 'about',
                    on_update: function (data) {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        JSPrintManager.updateClient = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.WS.send('', {
                    type: 'update',
                    on_update: function (data) {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        JSPrintManager.getSystemFonts = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.WS.send('', {
                    type: 'fonts_list',
                    on_update: function (data) {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        JSPrintManager.getSerialPorts = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.WS.send('', {
                    type: 'serial_ports_list',
                    on_update: function (data) {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        JSPrintManager.getScanners = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.WS.send('', {
                    type: 'scanner_list',
                    on_update: function (data) {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        JSPrintManager.onPrinterCreated = function (callback, error, detail_level) {
            if (detail_level === void 0) { detail_level = JSPM.PrintersInfoLevel.Extended; }
            if (detail_level == JSPM.PrintersInfoLevel.Basic)
                throw "Basic detail level information is not implemented yet";
            if (navigator.platform.toLowerCase().indexOf("win") < 0)
                throw "This functionality is Windows only";
            return this.WS.send('', {
                type: 'on_printer_creation',
                on_update: function (data) { return callback(data); },
                on_error: function (data) { return error(data); }
            });
        };
        JSPrintManager.onPrinterUpdated = function (callback, error, detail_level) {
            if (detail_level === void 0) { detail_level = JSPM.PrintersInfoLevel.Extended; }
            if (detail_level == JSPM.PrintersInfoLevel.Basic)
                throw "Basic detail level information is not implemented yet";
            if (navigator.platform.toLowerCase().indexOf("win") < 0)
                throw "This functionality is Windows only";
            return this.WS.send('', {
                type: 'on_printer_modification',
                on_update: function (data) { return callback(data); },
                on_error: function (data) { return error(data); }
            });
        };
        JSPrintManager.onPrinterDeleted = function (callback, error, detail_level) {
            if (detail_level === void 0) { detail_level = JSPM.PrintersInfoLevel.Extended; }
            if (detail_level == JSPM.PrintersInfoLevel.Basic)
                throw "Basic detail level information is not implemented yet";
            if (navigator.platform.toLowerCase().indexOf("win") < 0)
                throw "This functionality is Windows only";
            return this.WS.send('', {
                type: 'on_printer_deletion',
                on_update: function (data) { return callback(data); },
                on_error: function (data) { return error(data); }
            });
        };
        JSPrintManager.unsubscribePrinterEvent = function (id) {
            var _this = this;
            return new Promise(function (ok, err) {
                return _this.WS.send(JSON.stringify({ close: true }), {
                    id: id,
                    type: 'on_printer_deletion',
                    on_update: function (data) { return ok(data); },
                    on_error: function (data) { return err(data); }
                });
            });
        };
        JSPrintManager.stop = function () {
            this.WS.stop();
        };
        JSPrintManager.auto_reconnect = false;
        JSPrintManager._license = document.location.origin + "/jspm";
        JSPrintManager._ses_cert = "";
        return JSPrintManager;
    }());
    JSPM.JSPrintManager = JSPrintManager;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var PrintFile = (function () {
        function PrintFile(fileContent, fileContentType, fileName, copies) {
            this.fileName = "";
            this._copies = 1;
            this.fileContent = fileContent;
            this.fileContentType = fileContentType;
            if (!fileName)
                throw "You must specify a FileName including the extension.";
            this.fileName = fileName;
            if (copies)
                this.copies = copies;
            this.escapeInvalidFileNameChars();
        }
        Object.defineProperty(PrintFile.prototype, "copies", {
            get: function () {
                return this._copies;
            },
            set: function (value) {
                if (value < 1)
                    throw "Copies must be greater than or equal to 1.";
                this._copies = value;
            },
            enumerable: true,
            configurable: true
        });
        PrintFile.prototype.escapeInvalidFileNameChars = function () {
            if (this.fileName.indexOf("\\") > -1)
                this.fileName = this.fileName.replace("\\", "BACKSLASHCHAR");
        };
        PrintFile.prototype.bool2str = function (value, true_val, false_val) {
            if (true_val === void 0) { true_val = '1'; }
            if (false_val === void 0) { false_val = '0'; }
            return value ? true_val : false_val;
        };
        PrintFile.prototype.getBLOBContent = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                switch (_this.fileContentType) {
                    case JSPM.FileSourceType.BLOB:
                        {
                            ok(_this.fileContent);
                        }
                        break;
                    case JSPM.FileSourceType.Base64:
                        {
                            try {
                                var chars = atob(_this.fileContent);
                                var bytes = new Uint8Array(chars.length);
                                for (var i = 0; i < chars.length; i++) {
                                    bytes[i] = chars.charCodeAt(i);
                                }
                                ok(new Blob([bytes]));
                            }
                            catch (e) {
                                err('Error trying to decode the base64 data.\n' + e);
                            }
                        }
                        break;
                    case JSPM.FileSourceType.Text:
                        {
                            try {
                                var bytes = new Uint8Array(_this.fileContent.length);
                                for (var i = 0; i < _this.fileContent.length; i++) {
                                    bytes[i] = _this.fileContent.charCodeAt(i);
                                }
                                ok(new Blob([bytes]));
                            }
                            catch (e) {
                                err('Error trying to decode the text data.\n' + e);
                            }
                        }
                        break;
                    case JSPM.FileSourceType.URL:
                        {
                            var xhr_1 = new XMLHttpRequest();
                            xhr_1.open('GET', _this.fileContent, true);
                            xhr_1.responseType = 'blob';
                            xhr_1.onload = function (oEvent) {
                                ok(xhr_1.response);
                            };
                            xhr_1.send(null);
                        }
                        break;
                    default: err('FileSourceType not specified');
                }
            });
        };
        PrintFile.prototype.serialize = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                switch (_this.fileContentType) {
                    case JSPM.FileSourceType.Base64:
                        {
                            ok(new zip.Data64URIReader(_this.fileContent));
                        }
                        break;
                    case JSPM.FileSourceType.BLOB:
                        {
                            ok(new zip.BlobReader(_this.fileContent));
                        }
                        break;
                    case JSPM.FileSourceType.Text:
                        {
                            ok(new zip.TextReader(_this.fileContent));
                        }
                        break;
                    case JSPM.FileSourceType.URL:
                        {
                            var xhr_2 = new XMLHttpRequest();
                            xhr_2.open('GET', _this.fileContent, true);
                            xhr_2.responseType = 'blob';
                            xhr_2.onload = function (oEvent) {
                                ok(new zip.BlobReader(xhr_2.response));
                            };
                            xhr_2.send(null);
                        }
                        break;
                    default: err("The file content type is invalid");
                }
            });
        };
        return PrintFile;
    }());
    JSPM.PrintFile = PrintFile;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var PrintFileDOC = (function (_super) {
        __extends(PrintFileDOC, _super);
        function PrintFileDOC(fileContent, fileContentType, fileName, copies) {
            var _this = _super.call(this, fileContent, fileContentType, fileName.substring(0, fileName.lastIndexOf('.')) + '.wdoc', copies) || this;
            _this.manualDuplex = false;
            _this.manualDuplexMessage = "";
            _this.printInReverseOrder = false;
            _this.printRange = '';
            _this.encryptedPassword = "";
            return _this;
        }
        PrintFileDOC.prototype.isValidRange = function (range) {
            if (range == null || range == '')
                return true;
            var reg = /([0-9])+((-[0-9]+)|(,[0-9]+))*/;
            var test = reg.exec(range);
            if (test == null)
                return false;
            if (test[0].length != range.length)
                return false;
            return true;
        };
        PrintFileDOC.prototype._getPropertiesJSON = function () {
            return {
                manual_duplex: this.manualDuplex,
                reverse: this.printInReverseOrder,
                duplex_message: this.manualDuplexMessage,
                range: this.printRange,
                password: this.encryptedPassword,
            };
        };
        PrintFileDOC.prototype.serialize = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                var SEP = ';';
                if (!_this.isValidRange(_this.printRange))
                    err('Invalid Print Range');
                _this.getBLOBContent().then(function (file_content) {
                    var properties = new Uint8Array(JSPM.Utils._str2UTF8Array(JSON.stringify(_this._getPropertiesJSON())));
                    var file_size = JSPM.Utils._intToByteArray(properties.length);
                    var blob = new Blob([file_content, properties, file_size]);
                    ok(new zip.BlobReader(blob));
                }).catch(function (e) {
                    err(e);
                });
            });
        };
        return PrintFileDOC;
    }(JSPM.PrintFile));
    JSPM.PrintFileDOC = PrintFileDOC;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var PrintFilePDF = (function (_super) {
        __extends(PrintFilePDF, _super);
        function PrintFilePDF(fileContent, fileContentType, fileName, copies) {
            var _this = _super.call(this, fileContent, fileContentType, fileName.substring(0, fileName.lastIndexOf('.')) + '.wpdf', copies) || this;
            _this.pageSizing = JSPM.Sizing.None;
            _this.manualDuplex = false;
            _this.printAutoRotate = false;
            _this.printAutoCenter = false;
            _this.manualDuplexMessage = "";
            _this.encryptedPassword = "";
            _this.printAsGrayscale = false;
            _this.printAnnotations = false;
            _this.printRange = '';
            _this.printInReverseOrder = false;
            _this.printRotation = JSPM.PrintRotation.None;
            return _this;
        }
        PrintFilePDF.prototype.isValidRange = function (range) {
            if (range == null || range == '')
                return true;
            var reg = /([0-9])+((-[0-9]+)|(,[0-9]+))*/;
            var test = reg.exec(range);
            if (test == null)
                return false;
            if (test[0].length != range.length)
                return false;
            return true;
        };
        PrintFilePDF.prototype._getPropertiesJSON = function () {
            return {
                manual_duplex: this.manualDuplex,
                grayscale: this.printAsGrayscale,
                annotations: this.printAnnotations,
                reverse: this.printInReverseOrder,
                auto_rotate: this.printAutoRotate,
                auto_center: this.printAutoCenter,
                duplex_message: this.manualDuplexMessage,
                range: this.printRange,
                password: this.encryptedPassword,
                rotation: this.printRotation,
                sizing: this.pageSizing
            };
        };
        PrintFilePDF.prototype.serialize = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                var SEP = ';';
                if (!_this.isValidRange(_this.printRange))
                    err('Invalid Print Range');
                _this.getBLOBContent().then(function (file_content) {
                    var properties = new Uint8Array(JSPM.Utils._str2UTF8Array(JSON.stringify(_this._getPropertiesJSON())));
                    var file_size = JSPM.Utils._intToByteArray(properties.length);
                    var blob = new Blob([file_content, properties, file_size]);
                    ok(new zip.BlobReader(blob));
                }).catch(function (e) {
                    err(e);
                });
            });
        };
        return PrintFilePDF;
    }(JSPM.PrintFile));
    JSPM.PrintFilePDF = PrintFilePDF;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var PrintFileTXT = (function (_super) {
        __extends(PrintFileTXT, _super);
        function PrintFileTXT(fileContent, fileName, copies, fileContentType) {
            var _this = _super.call(this, fileContent, fileContentType ? fileContentType : JSPM.FileSourceType.Text, fileName.substring(0, fileName.lastIndexOf('.')) + '.wtxt', copies) || this;
            _this.textContent = '';
            _this.textAligment = JSPM.TextAlignment.Left;
            _this.fontName = '';
            _this.fontBold = false;
            _this.fontItalic = false;
            _this.fontUnderline = false;
            _this.fontStrikethrough = false;
            _this.fontSize = 10;
            _this.fontColor = '#000000';
            _this.printOrientation = JSPM.PrintOrientation.Portrait;
            _this.marginLeft = 0.5;
            _this.marginRight = 0.5;
            _this.marginTop = 0.5;
            _this.marginBottom = 0.5;
            return _this;
        }
        PrintFileTXT.prototype.serialize = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                var SEP = '|';
                _this.getBLOBContent().then(function (file_content) {
                    var params = new Uint8Array(JSPM.Utils._str2UTF8Array(_this.printOrientation + SEP + _this.textAligment +
                        SEP + _this.fontName + SEP + _this.fontSize + SEP +
                        _this.bool2str(_this.fontBold) + SEP +
                        _this.bool2str(_this.fontItalic) + SEP +
                        _this.bool2str(_this.fontUnderline) + SEP +
                        _this.bool2str(_this.fontStrikethrough) + SEP +
                        _this.fontColor + SEP + _this.marginLeft + SEP + _this.marginTop +
                        SEP + _this.marginRight + SEP + _this.marginBottom + '\n'));
                    var blob = new Blob([params, file_content]);
                    ok(new zip.BlobReader(blob));
                }).catch(function (e) {
                    err(e);
                });
            });
        };
        return PrintFileTXT;
    }(JSPM.PrintFile));
    JSPM.PrintFileTXT = PrintFileTXT;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var PrintFileXLS = (function (_super) {
        __extends(PrintFileXLS, _super);
        function PrintFileXLS(fileContent, fileContentType, fileName, copies) {
            var _this = _super.call(this, fileContent, fileContentType, fileName.substring(0, fileName.lastIndexOf('.')) + '.wxls', copies) || this;
            _this.encryptedPassword = "";
            _this.pageFrom = 0;
            _this.pageTo = 0;
            return _this;
        }
        PrintFileXLS.prototype._getPropertiesJSON = function () {
            return {
                from: this.pageFrom,
                to: this.pageTo,
                password: this.encryptedPassword,
            };
        };
        PrintFileXLS.prototype.serialize = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.getBLOBContent().then(function (file_content) {
                    var properties = new Uint8Array(JSPM.Utils._str2UTF8Array(JSON.stringify(_this._getPropertiesJSON())));
                    var file_size = JSPM.Utils._intToByteArray(properties.length);
                    var blob = new Blob([file_content, properties, file_size]);
                    ok(new zip.BlobReader(blob));
                }).catch(function (e) {
                    err(e);
                });
            });
        };
        return PrintFileXLS;
    }(JSPM.PrintFile));
    JSPM.PrintFileXLS = PrintFileXLS;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var SerialComm = (function () {
        function SerialComm(portName, baudRate, parity, stopBits, dataBits, flowControl) {
            this._id = "";
            this._isOpen = false;
            this._port = "";
            this._baud_rate = 9600;
            this._parity = JSPM.Serial.Parity.None;
            this._stop_bits = JSPM.Serial.StopBits.One;
            this._data_bits = JSPM.Serial.DataBits.Eight;
            this._flow_control = JSPM.Serial.Handshake.XOnXOff;
            if (!portName)
                throw "The specified serial port name is null or empty.";
            this._port = portName;
            this._baud_rate = baudRate;
            this._parity = parity;
            this._stop_bits = stopBits;
            this._data_bits = dataBits;
            this._flow_control = flowControl;
        }
        Object.defineProperty(SerialComm.prototype, "portName", {
            get: function () {
                return this._port;
            },
            set: function (value) {
                this._port = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialComm.prototype, "isOpen", {
            get: function () {
                return this._isOpen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialComm.prototype, "baudRate", {
            get: function () {
                return this._baud_rate;
            },
            set: function (value) {
                this._baud_rate = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialComm.prototype, "parity", {
            get: function () {
                return this._parity;
            },
            set: function (value) {
                this._parity = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialComm.prototype, "stopBits", {
            get: function () {
                return this._stop_bits;
            },
            set: function (value) {
                this._stop_bits = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialComm.prototype, "dataBits", {
            get: function () {
                return this._data_bits;
            },
            set: function (value) {
                this._data_bits = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialComm.prototype, "flowControl", {
            get: function () {
                return this._flow_control;
            },
            set: function (value) {
                this._flow_control = value;
            },
            enumerable: true,
            configurable: true
        });
        SerialComm.prototype.onError = function (data, critical) { };
        SerialComm.prototype.onDataReceived = function (data) { };
        SerialComm.prototype.onClose = function (data) { };
        SerialComm.prototype.open = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                if (_this._isOpen) {
                    throw "Connection is already open";
                }
                var props = _this.propertiesJSON();
                props['on_update'] = function (data, first, last) {
                    if (first) {
                        if (data.result && data.result == "Open" && _this._isOpen == false)
                            _this._isOpen = true;
                        ok(data);
                    }
                    else if (last) {
                        _this.onClose(data);
                        _this._id = "";
                        _this._isOpen = false;
                    }
                    else
                        _this.onDataReceived(data.data);
                };
                props['on_error'] = function (data, first, critical) {
                    if (first)
                        err(data);
                    else
                        _this.onError(data, critical);
                };
                _this._id = JSPM.JSPrintManager.WS.send(JSON.stringify({
                    port: _this._port,
                    baud_rate: _this._baud_rate,
                    data_bits: _this._data_bits,
                    flow_control: _this._flow_control,
                    parity: _this._parity,
                    stop_bits: _this._stop_bits
                }), props);
            });
        };
        SerialComm.prototype.send = function (utf8string) {
            var props = this.propertiesJSON();
            JSPM.JSPrintManager.WS.send(JSON.stringify({ data: utf8string }), props);
        };
        SerialComm.prototype.close = function () {
            JSPM.JSPrintManager.WS.send(JSON.stringify({ close: true }), this.propertiesJSON());
        };
        SerialComm.prototype.propertiesJSON = function () {
            if (!this.portName)
                throw "The specified serial port name is null or empty.";
            var p = {
                type: 'serial'
            };
            if (this._id)
                p['id'] = this._id;
            return p;
        };
        return SerialComm;
    }());
    JSPM.SerialComm = SerialComm;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    JSPM.VERSION = '3.0';
    var Mutex = (function () {
        function Mutex() {
            this.mutex = Promise.resolve();
        }
        Mutex.prototype.lock = function () {
            var begin = function (unlock) { };
            this.mutex = this.mutex.then(function () {
                return new Promise(begin);
            });
            return new Promise(function (res) {
                begin = res;
            });
        };
        return Mutex;
    }());
    JSPM.Mutex = Mutex;
    var Utils = (function () {
        function Utils() {
        }
        Utils._intToByteArray = function (number) {
            return new Uint8Array([number & 0xFF,
                (number >> 8) & 0xFF,
                (number >> 16) & 0xFF,
                (number >> 24) & 0xFF]);
        };
        Utils._str2UTF8Array = function (str) {
            var utf8 = [];
            for (var i = 0; i < str.length; i++) {
                var charcode = str.charCodeAt(i);
                if ((i == 0) && charcode == 0xef &&
                    (i + 1 < str.length && str.charCodeAt(i + 1) == 0xbb) &&
                    (i + 2 < str.length && str.charCodeAt(i + 2) == 0xbf)) {
                    utf8.push(0xef);
                    utf8.push(0xbb);
                    utf8.push(0xbf);
                    i += 2;
                }
                else if (charcode < 0x80)
                    utf8.push(charcode);
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
                }
                else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
                else {
                    i++;
                    charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                        | (str.charCodeAt(i) & 0x3ff));
                    utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        };
        return Utils;
    }());
    JSPM.Utils = Utils;
})(JSPM || (JSPM = {}));

(function() {
    if (typeof define === 'function' && define.amd) {
        define(JSPM);
    } else if (typeof exports === 'object') {
        module.exports = JSPM;
    } else {
        window.JSPM = JSPM;
    }
})();
