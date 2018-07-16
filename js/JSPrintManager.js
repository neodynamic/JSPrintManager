var JSPM;
(function (JSPM) {
    var ClientPrintJob = (function () {
        function ClientPrintJob() {
            this._clientPrinter = null;
            this._printerCommandsCopies = 1;
            this._printerCommands = "";
            this._binaryPrinterCommands = null;
            this._printFileGroup = [];
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
        Object.defineProperty(ClientPrintJob.prototype, "binaryPrinterCommands", {
            get: function () {
                return this._binaryPrinterCommands;
            },
            set: function (value) {
                this._binaryPrinterCommands = value;
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
        ClientPrintJob.prototype.sendToClient = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this._generateDataAsync().
                    then(function (data) {
                    JSPM.JSPrintManager.send(data)
                        .then(function (i) { ok(i); })
                        .catch(function (e) { err(e); });
                }).
                    catch(function (e) {
                    err(e);
                });
            });
        };
        ClientPrintJob.prototype._intToByteArray = function (number) {
            return new Uint8Array([number & 0xFF,
                (number >> 8) & 0xFF,
                (number >> 16) & 0xFF,
                (number >> 24) & 0xFF]);
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
                                    var fr = new FileReader();
                                    fr.onloadend = function () {
                                        var byte_array = new Uint8Array(fr.result);
                                        resolve(byte_array);
                                    };
                                    fr.readAsArrayBuffer(zipBlob);
                                });
                            }
                            else {
                                var printFile = printFileGroup[pf_idx];
                                var file = pf_idx + SEPARATOR + printFile.copies + SEPARATOR + printFile.fileName;
                                var reader = void 0;
                                switch (printFile.fileContentType) {
                                    case JSPM.FileSourceType.Base64:
                                        {
                                            reader = new zip.Data64URIReader(printFile.fileContent);
                                        }
                                        break;
                                    case JSPM.FileSourceType.BLOB:
                                        {
                                            reader = new zip.BlobReader(printFile.fileContent);
                                        }
                                        break;
                                    case JSPM.FileSourceType.Text:
                                        {
                                            reader = new zip.TextReader(printFile.fileContent);
                                        }
                                        break;
                                    case JSPM.FileSourceType.URL:
                                        {
                                            reader = new zip.HttpReader(printFile.fileContent);
                                        }
                                        break;
                                    default: reject("The file content type is invalid");
                                }
                                zipWriter.add(file, reader, function () { addPrintFile2Zip(pf_idx + 1); });
                            }
                        }
                        if (printFileGroup.length != 0)
                            addPrintFile2Zip(0);
                    }, function (e) { reject(e); });
                }
            });
        };
        ClientPrintJob.prototype._genPCArrayAsync = function (printerCommands, binPrinterCommands, printerCopies) {
            return new Promise(function (resolve, reject) {
                try {
                    if (binPrinterCommands != null && binPrinterCommands.length > 0)
                        resolve(binPrinterCommands);
                    if (printerCommands.length != 0) {
                        var buffer = "";
                        if (printerCopies > 1)
                            buffer += "PCC=" + printerCopies + '|';
                        else
                            buffer += printerCommands;
                        resolve(new Uint8Array(buffer.split('').map(function (x) { return x.charCodeAt(0); })));
                    }
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
                    var toRet = new Uint8Array(clientPrinter.serialize().split('').map(function (x) { return x.charCodeAt(0); }));
                    resolve(toRet);
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        ClientPrintJob.prototype._generateDataAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var header = new Uint8Array([99, 112, 106, 2]);
                var HEADER_OFFSET = 12;
                Promise.race([
                    _this._genPCArrayAsync(_this._printerCommands, _this.binaryPrinterCommands, _this._printerCommandsCopies),
                    _this._genPFGArrayAsync(_this._printFileGroup)
                ])
                    .then(function (file_data) {
                    _this._genPrinterArrayAsync(_this._clientPrinter)
                        .then(function (printer_data) {
                        var idx1 = _this._intToByteArray(file_data.length);
                        var idx2 = _this._intToByteArray(file_data.length + printer_data.length);
                        var toReturn = new Uint8Array(HEADER_OFFSET + file_data.length + printer_data.length);
                        toReturn.set(header);
                        toReturn.set(idx1, 4);
                        toReturn.set(idx2, 8);
                        toReturn.set(file_data, 12);
                        toReturn.set(printer_data, 12 + file_data.length);
                        resolve(toReturn);
                    })
                        .catch(function (e) { reject(e); });
                })
                    .catch(function (e) { reject(e); });
            });
        };
        return ClientPrintJob;
    }());
    JSPM.ClientPrintJob = ClientPrintJob;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var ClientPrintJobGroup = (function () {
        function ClientPrintJobGroup() {
            this._jobs = [];
        }
        Object.defineProperty(ClientPrintJobGroup.prototype, "jobs", {
            get: function () {
                return this._jobs;
            },
            enumerable: true,
            configurable: true
        });
        ClientPrintJobGroup.prototype.sendToClient = function () {
            var _this = this;
            return new Promise(function (ok, err) {
                _this._generateDataAsync().
                    then(function (data) {
                    JSPM.JSPrintManager.send(data)
                        .then(function (i) { ok(i); })
                        .catch(function (e) { err(e); });
                }).
                    catch(function (e) {
                    err(e);
                });
            });
        };
        ClientPrintJobGroup.prototype._generateMiniJob = function (cj) {
            var INDEXES_SIZE = 8;
            return new Promise(function (ok, error) {
                Promise
                    .race([cj._genPCArrayAsync(cj.printerCommands, cj.binaryPrinterCommands, cj.printerCommandsCopies),
                    cj._genPFGArrayAsync(cj.files)])
                    .then(function (file_data) {
                    cj._genPrinterArrayAsync(cj.clientPrinter).then(function (printer_data) {
                        var idx1 = cj._intToByteArray(file_data.length);
                        var idx2 = cj._intToByteArray(file_data.length + printer_data.length);
                        var toAppend = new Uint8Array(INDEXES_SIZE + file_data.length + printer_data.length);
                        toAppend.set(idx1);
                        toAppend.set(idx2, 4);
                        toAppend.set(file_data, 8);
                        toAppend.set(printer_data, 8 + file_data.length);
                        ok(toAppend);
                    }).catch(function (e) { error(e); });
                }).catch(function (e) { error(e); });
            });
        };
        ClientPrintJobGroup.prototype._generateDataAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var header = new Uint8Array([99, 112, 106, 103, 2].concat(_this._intToArray(_this.jobs.length)));
                var promises = [];
                for (var i = 0; i < _this.jobs.length; i++) {
                    promises.push(_this._generateMiniJob(_this.jobs[i]));
                }
                Promise.all(promises).then(function (data_arr) {
                    var jobs_size = data_arr.reduce(function (prevVal, elem) { return prevVal + elem.length; }, 0);
                    var toReturn = new Uint8Array(header.length + jobs_size);
                    var offset = header.length;
                    toReturn.set(header);
                    for (var i = 0; i < data_arr.length; i++) {
                        toReturn.set(data_arr[i], offset);
                        offset += data_arr[i].length;
                    }
                    resolve(toReturn);
                })
                    .catch(function (error) {
                    reject(error);
                });
            });
        };
        ClientPrintJobGroup.prototype._intToArray = function (number) {
            return [number & 0xFF,
                (number >> 8) & 0xFF,
                (number >> 16) & 0xFF,
                (number >> 24) & 0xFF];
        };
        return ClientPrintJobGroup;
    }());
    JSPM.ClientPrintJobGroup = ClientPrintJobGroup;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var DefaultPrinter = (function () {
        function DefaultPrinter() {
            this.Id = String.fromCharCode(0);
        }
        DefaultPrinter.prototype.serialize = function () {
            return this.Id;
        };
        return DefaultPrinter;
    }());
    JSPM.DefaultPrinter = DefaultPrinter;
    var InstalledPrinter = (function () {
        function InstalledPrinter(printerName, printToDefaultIfNotFound) {
            if (printToDefaultIfNotFound === void 0) { printToDefaultIfNotFound = false; }
            this.Id = String.fromCharCode(1);
            this._printerName = "";
            this._printToDefaultIfNotFound = false;
            if (!printerName)
                throw "The specified printer name is null or empty.";
            this._printerName = printerName;
            this._printToDefaultIfNotFound = printToDefaultIfNotFound;
        }
        Object.defineProperty(InstalledPrinter.prototype, "printerName", {
            get: function () {
                return this._printerName;
            },
            set: function (value) {
                this._printerName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstalledPrinter.prototype, "printToDefaultIfNotFound", {
            get: function () {
                return this._printToDefaultIfNotFound;
            },
            set: function (value) {
                this._printToDefaultIfNotFound = value;
            },
            enumerable: true,
            configurable: true
        });
        InstalledPrinter.prototype.serialize = function () {
            if (!this.printerName) {
                throw "The specified printer name is null or empty.";
            }
            if (this.printToDefaultIfNotFound) {
                return this.Id + this.printerName + '|' + '1';
            }
            else {
                return this.Id + this.printerName;
            }
        };
        return InstalledPrinter;
    }());
    JSPM.InstalledPrinter = InstalledPrinter;
    var ParallelPortPrinter = (function () {
        function ParallelPortPrinter(portName) {
            this.Id = String.fromCharCode(2);
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
            return this.Id + this.portName;
        };
        return ParallelPortPrinter;
    }());
    JSPM.ParallelPortPrinter = ParallelPortPrinter;
    var SerialPortPrinter = (function () {
        function SerialPortPrinter(portName, baudRate, parity, stopBits, dataBits, flowControl) {
            this.Id = String.fromCharCode(3);
            this._serialPortName = "COM1";
            this._serialPortBaudRate = 9600;
            this._serialPortParity = JSPM.Serial.Parity.None;
            this._serialPortStopBits = JSPM.Serial.StopBits.One;
            this._serialPortDataBits = 8;
            this._serialPortFlowControl = JSPM.Serial.Handshake.XOnXOff;
            if (!portName)
                throw "The specified serial port name is null or empty.";
            this._serialPortName = portName;
            this._serialPortBaudRate = baudRate;
            this._serialPortParity = parity;
            this._serialPortStopBits = stopBits;
            this._serialPortDataBits = dataBits;
            this._serialPortFlowControl = flowControl;
        }
        Object.defineProperty(SerialPortPrinter.prototype, "portName", {
            get: function () {
                return this._serialPortName;
            },
            set: function (value) {
                this._serialPortName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "baudRate", {
            get: function () {
                return this._serialPortBaudRate;
            },
            set: function (value) {
                this._serialPortBaudRate = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "parity", {
            get: function () {
                return this._serialPortParity;
            },
            set: function (value) {
                this._serialPortParity = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "stopBits", {
            get: function () {
                return this._serialPortStopBits;
            },
            set: function (value) {
                this._serialPortStopBits = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "dataBits", {
            get: function () {
                return this._serialPortDataBits;
            },
            set: function (value) {
                this._serialPortDataBits = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SerialPortPrinter.prototype, "flowControl", {
            get: function () {
                return this._serialPortFlowControl;
            },
            set: function (value) {
                this._serialPortFlowControl = value;
            },
            enumerable: true,
            configurable: true
        });
        SerialPortPrinter.prototype.serialize = function () {
            if (!this.portName)
                throw "The specified serial port name is null or empty.";
            return this.Id + this.portName + '|' +
                this.baudRate + '|' +
                this.dataBits + '|' +
                this.flowControl + '|' +
                this.parity + '|' +
                this.stopBits;
        };
        return SerialPortPrinter;
    }());
    JSPM.SerialPortPrinter = SerialPortPrinter;
    var NetworkPrinter = (function () {
        function NetworkPrinter(port, ipAddress, dnsName) {
            this.Id = 4;
            this._networkIPAddress = "0.0.0.0";
            this._networkPort = 0;
            this._dnsName = "";
            if (!(ipAddress || dnsName))
                throw "You have to specify an IP address or a DNS name";
            if (ipAddress)
                this._networkIPAddress = ipAddress;
            if (dnsName)
                this._dnsName = dnsName;
            this._networkPort = port;
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
                return this._networkIPAddress;
            },
            set: function (value) {
                this._networkIPAddress = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NetworkPrinter.prototype, "port", {
            get: function () {
                return this._networkPort;
            },
            set: function (value) {
                if (!(value >= 0 && value <= 65535))
                    throw "Invalid Port Number";
                this._networkPort = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        NetworkPrinter.prototype.serialize = function () {
            if (!(this.dnsName || this.ipAddress))
                throw "You have to specify an IP address or a DNS name";
            return this.Id + this.dnsName + '|' + this.ipAddress + '|' + this.port;
        };
        return NetworkPrinter;
    }());
    JSPM.NetworkPrinter = NetworkPrinter;
    var UserSelectedPrinter = (function () {
        function UserSelectedPrinter() {
            this.Id = String.fromCharCode(5);
        }
        UserSelectedPrinter.prototype.serialize = function () {
            return this.Id;
        };
        return UserSelectedPrinter;
    }());
    JSPM.UserSelectedPrinter = UserSelectedPrinter;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
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
        WSStatus[WSStatus["BlackListed"] = 2] = "BlackListed";
    })(WSStatus = JSPM.WSStatus || (JSPM.WSStatus = {}));
    ;
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
            StopBits[StopBits["None"] = 0] = "None";
            StopBits[StopBits["One"] = 1] = "One";
            StopBits[StopBits["Two"] = 2] = "Two";
            StopBits[StopBits["OnePointFive"] = 3] = "OnePointFive";
        })(StopBits = Serial.StopBits || (Serial.StopBits = {}));
        var Handshake;
        (function (Handshake) {
            Handshake[Handshake["None"] = 0] = "None";
            Handshake[Handshake["RequestToSend"] = 1] = "RequestToSend";
            Handshake[Handshake["RequestToSendXOnXOff"] = 2] = "RequestToSendXOnXOff";
            Handshake[Handshake["XOnXOff"] = 3] = "XOnXOff";
        })(Handshake = Serial.Handshake || (Serial.Handshake = {}));
    })(Serial = JSPM.Serial || (JSPM.Serial = {}));
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    var JSPrintManager = (function () {
        function JSPrintManager() {
        }
        JSPrintManager.LockThread = function () {
            var _this = this;
            if (this._thread_busy)
                setTimeout(function () { _this.LockThread(); }, 100);
            this._thread_busy = true;
        };
        JSPrintManager.UnlockThread = function () {
            this._thread_busy = false;
        };
        JSPrintManager._onClose = function (e) {
            var _this = this;
            if (e.code == 403)
                JSPrintManager._ws_status = JSPM.WSStatus.BlackListed;
            else {
                JSPrintManager._ws_status = JSPM.WSStatus.Closed;
                if (JSPrintManager.auto_reconnect)
                    setTimeout(function (_) {
                        JSPrintManager.start(_this._saved_secure, _this._saved_port);
                    }, 2000);
            }
            JSPrintManager.onClose(e);
        };
        ;
        JSPrintManager._onOpen = function (e) {
            this._ws_status = JSPM.WSStatus.Open;
            JSPrintManager.onOpen(e);
        };
        JSPrintManager.start = function (secure, port) {
            var _this = this;
            if (secure === void 0) { secure = true; }
            if (port === void 0) { port = 20443; }
            return new Promise(function (ok, err) {
                try {
                    _this.LockThread();
                    _this._start(1, secure, port);
                    _this.WS.onopen = function (i) {
                        _this._saved_port = port;
                        _this._saved_secure = secure;
                        _this._ws_status = JSPM.WSStatus.Open;
                        _this.WS.onopen = _this._onOpen;
                        _this.WS.onclose = _this._onClose;
                        _this._onOpen(null);
                        _this.UnlockThread();
                        ok();
                    };
                    _this.WS.onerror = function (i) {
                        _this.WS.onclose = _this._onClose;
                        _this.UnlockThread();
                        err(i);
                    };
                }
                catch (e) {
                    err(e);
                }
            });
        };
        JSPrintManager._start = function (times, secure, port) {
            var _this = this;
            try {
                this.WS = new WebSocket((secure ? "wss://" : "ws://") + "localhost:" + port);
                this.WS.onerror = function (i) {
                    if (times < 1 && _this.auto_reconnect == false)
                        throw "Could not start the WebSocket";
                    setTimeout(function () {
                        _this._start(--times, secure, port);
                    }, 1500);
                };
            }
            catch (e) {
                if (times < 1)
                    throw "Could not start the WebSocket";
                setTimeout(function () {
                    _this._start(--times, secure, port);
                }, 1500);
            }
        };
        JSPrintManager.getPrinters = function () {
            var _this = this;
            var me = this;
            return new Promise(function (ok, err) {
                _this.send("get_printers")
                    .then(function (data) {
                    var list = data.split('|');
                    ok(list);
                })
                    .catch(function (e) {
                    err(e);
                });
            });
        };
        Object.defineProperty(JSPrintManager, "websocket_status", {
            get: function () {
                return this._ws_status;
            },
            enumerable: true,
            configurable: true
        });
        JSPrintManager.showAbout = function () {
            return this.send("about");
        };
        JSPrintManager.updateClient = function () {
            return this.send("update");
        };
        JSPrintManager.send = function (data) {
            var _this = this;
            return new Promise(function (ok, err) {
                _this.WS.onmessage = function (e) {
                    _this.UnlockThread();
                    ok(e.data);
                };
                _this.WS.onerror = function (e) {
                    _this.UnlockThread();
                    err(e);
                };
                if (_this._ws_status == JSPM.WSStatus.Closed)
                    err("The WebSocket connection is closed");
                else if (_this._ws_status == JSPM.WSStatus.BlackListed)
                    err("The site is blacklisted and the connection was closed");
                _this.LockThread();
                _this.WS.send(data);
            });
        };
        JSPrintManager.stop = function () {
            this.WS.close();
        };
        JSPrintManager._ws_status = JSPM.WSStatus.Closed;
        JSPrintManager._thread_busy = false;
        JSPrintManager.auto_reconnect = false;
        JSPrintManager.onClose = function (e) { };
        JSPrintManager.onOpen = function (e) { };
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
        return PrintFile;
    }());
    JSPM.PrintFile = PrintFile;
})(JSPM || (JSPM = {}));
//# sourceMappingURL=JSPrintManager.js.map