/*!
 * JSPrintManager v3.0.0
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
 * Date: 2020-04-25
 */
var JSPM;
(function (JSPM) {
    class ClientJob {
        constructor() {
            this._type = '';
        }
        _generateDataAsync() {
            return new Promise(_ => {
            });
        }
        onUpdate(data, last) { }
        ;
        onError(data, critical) { }
        ;
        sendToClient() {
            return new Promise((ok, err) => {
                this._generateDataAsync().then((data) => {
                    let properties = {
                        type: this._type,
                        on_update: (data, first, last) => {
                            if (first)
                                ok(data);
                            else
                                this.onUpdate(data, last);
                        },
                        on_error: (data, first, critical) => {
                            if (first)
                                err(data);
                            else
                                this.onError(data, critical);
                        }
                    };
                    JSPM.JSPrintManager.WS.send(data, properties);
                }).catch((e) => err(e));
            });
        }
    }
    JSPM.ClientJob = ClientJob;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class ClientPrintJob extends JSPM.ClientJob {
        constructor() {
            super(...arguments);
            this._clientPrinter = null;
            this._printerCommandsCopies = 1;
            this._printerCommands = "";
            this._printerCommandsCodePage = JSPM.Encoding.Default;
            this._binaryPrinterCommands = null;
            this._printFileGroup = [];
        }
        get clientPrinter() {
            return this._clientPrinter;
        }
        set clientPrinter(value) {
            this._clientPrinter = value;
        }
        get printerCommandsCopies() {
            return this._printerCommandsCopies;
        }
        set printerCommandsCopies(value) {
            if (value < 1)
                throw "Copies must be greater than or equal to 1.";
            this._printerCommandsCopies = value;
        }
        get printerCommands() {
            return this._printerCommands;
        }
        set printerCommands(value) {
            this._printerCommands = value;
        }
        get printerCommandsCodePage() {
            return this._printerCommandsCodePage;
        }
        set printerCommandsCodePage(value) {
            this._printerCommandsCodePage = value;
        }
        get binaryPrinterCommands() {
            return this._binaryPrinterCommands;
        }
        set binaryPrinterCommands(value) {
            this._binaryPrinterCommands = value;
            this._printerCommands = "";
        }
        get files() {
            return this._printFileGroup;
        }
        onUpdated(data) { }
        ;
        onFinished(data) { }
        ;
        onError(data, is_critical) { }
        ;
        onUpdate(data, last) {
            if (last) {
                this.onFinished(data);
            }
            else {
                this.onUpdated(data);
            }
        }
        _genPFGArrayAsync(printFileGroup) {
            const SEPARATOR = ',';
            return new Promise((resolve, reject) => {
                if (!zip)
                    reject("zip.js, zip-ext.js, and deflate.js files from https://github.com/gildas-lormeau/zip.js project are missing.");
                else {
                    zip.useWebWorkers = false;
                    zip.createWriter(new zip.BlobWriter("application/zip"), (zipWriter) => {
                        function addPrintFile2Zip(pf_idx) {
                            if (pf_idx >= printFileGroup.length) {
                                zipWriter.close(function (zipBlob) {
                                    resolve(zipBlob);
                                });
                            }
                            else {
                                let printFile = printFileGroup[pf_idx];
                                let file = pf_idx + SEPARATOR + printFile.copies + SEPARATOR + printFile.fileName;
                                printFile.serialize().then((reader) => {
                                    zipWriter.add(file, reader, () => { addPrintFile2Zip(pf_idx + 1); });
                                }).catch((e) => {
                                    reject(e);
                                });
                            }
                        }
                        if (printFileGroup.length != 0)
                            addPrintFile2Zip(0);
                    }, (e) => { reject(e); });
                }
            });
        }
        _genPCArrayAsync(binPrinterCommands, printerCopies) {
            return new Promise((resolve, reject) => {
                try {
                    let copies = JSPM.Utils._str2UTF8Array(printerCopies.toString());
                    let pcc_copies = new Uint8Array(0);
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
        }
        _genPrinterArrayAsync(clientPrinter) {
            return new Promise((resolve, reject) => {
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
        }
        _cmd2bin() {
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
        }
        _generateDataAsync() {
            return new Promise((resolve, reject) => {
                this._cmd2bin();
                let header = new Uint8Array([99, 112, 106, 2]);
                Promise.race([
                    this._genPCArrayAsync(this.binaryPrinterCommands, this._printerCommandsCopies),
                    this._genPFGArrayAsync(this._printFileGroup)
                ])
                    .then((file_data) => {
                    this._genPrinterArrayAsync(this._clientPrinter)
                        .then((printer_data) => {
                        let idx1 = JSPM.Utils._intToByteArray(file_data.size);
                        resolve(new Blob([header, idx1, file_data, printer_data]));
                    })
                        .catch((e) => { reject(e); });
                })
                    .catch((e) => { reject(e); });
            });
        }
    }
    JSPM.ClientPrintJob = ClientPrintJob;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class ClientPrintJobGroup extends JSPM.ClientJob {
        constructor() {
            super(...arguments);
            this._jobs = [];
        }
        get jobs() {
            return this._jobs;
        }
        _generateMiniJob(cj) {
            const INDEXES_SIZE = 8;
            return new Promise((ok, error) => {
                cj._cmd2bin();
                Promise
                    .race([cj._genPCArrayAsync(cj.binaryPrinterCommands, cj.printerCommandsCopies),
                    cj._genPFGArrayAsync(cj.files)])
                    .then((file_data) => {
                    cj._genPrinterArrayAsync(cj.clientPrinter).then((printer_data) => {
                        let idx1 = JSPM.Utils._intToByteArray(file_data.size);
                        ok(new Blob([idx1, file_data, printer_data]));
                    }).catch((e) => { error(e); });
                }).catch((e) => { error(e); });
            });
        }
        _generateDataAsync() {
            return new Promise((resolve, reject) => {
                let header = new Uint8Array([99, 112, 106, 103, 2]);
                let jobs_qty = new Uint8Array(JSPM.Utils._intToByteArray(this.jobs.length));
                let promises = [];
                for (let i = 0; i < this.jobs.length; i++) {
                    promises.push(this._generateMiniJob(this.jobs[i]));
                }
                Promise.all(promises).then((data_arr) => {
                    let jobs_metadata = data_arr.map((x) => {
                        return {
                            startIndex: 0,
                            endIndex: x.size - 1
                        };
                    });
                    for (var i = 1; i < jobs_metadata.length; i++) {
                        jobs_metadata[i].startIndex = jobs_metadata[i - 1].endIndex + 1;
                        jobs_metadata[i].endIndex += jobs_metadata[i].startIndex;
                    }
                    let metadata = JSON.stringify(jobs_metadata);
                    let jobs = data_arr.reduce((prev, curr) => new Blob([prev, curr]));
                    let jobs_offset = new Uint8Array(JSPM.Utils._intToByteArray(jobs.size));
                    resolve(new Blob([header, jobs_qty, jobs_offset, jobs, metadata]));
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        }
    }
    JSPM.ClientPrintJobGroup = ClientPrintJobGroup;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class DefaultPrinter {
        constructor() {
            this.Id = 0;
        }
        serialize() {
            return JSON.stringify({
                'type': this.Id
            });
        }
    }
    JSPM.DefaultPrinter = DefaultPrinter;
    class InstalledPrinter {
        constructor(printerName, printToDefaultIfNotFound = false, trayName = '', paperName = '', duplex = JSPM.DuplexMode.Default) {
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
        bool2str(value, true_val = '1', false_val = '0') {
            return value ? true_val : false_val;
        }
        get printerName() {
            return this._name;
        }
        set printerName(value) {
            this._name = value;
        }
        get printToDefaultIfNotFound() {
            return this._printDefault;
        }
        set printToDefaultIfNotFound(value) {
            this._printDefault = value;
        }
        get trayName() {
            return this._tray;
        }
        set trayName(value) {
            this._tray = value;
        }
        get paperName() {
            return this._paper;
        }
        set paperName(value) {
            this._paper = value;
        }
        get duplex() {
            return this._duplex;
        }
        set duplex(value) {
            this._duplex = value;
        }
        serialize() {
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
        }
    }
    JSPM.InstalledPrinter = InstalledPrinter;
    class ParallelPortPrinter {
        constructor(portName) {
            this.Id = 2;
            this._parallelPortName = "LPT1";
            if (!portName)
                throw "The specified parallel port name is null or empty.";
            this._parallelPortName = portName;
        }
        get portName() {
            return this._parallelPortName;
        }
        set portName(value) {
            this._parallelPortName = value;
        }
        serialize() {
            if (!this.portName)
                throw "The specified parallel port name is null or empty.";
            return JSON.stringify({
                type: this.Id,
                port: this._parallelPortName
            });
        }
    }
    JSPM.ParallelPortPrinter = ParallelPortPrinter;
    class SerialPortPrinter {
        constructor(portName, baudRate, parity, stopBits, dataBits, flowControl) {
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
        get portName() {
            return this._port;
        }
        set portName(value) {
            this._port = value;
        }
        get baudRate() {
            return this._baud_rate;
        }
        set baudRate(value) {
            this._baud_rate = value;
        }
        get parity() {
            return this._parity;
        }
        set parity(value) {
            this._parity = value;
        }
        get stopBits() {
            return this._stop_bits;
        }
        set stopBits(value) {
            this._stop_bits = value;
        }
        get dataBits() {
            return this._data_bits;
        }
        set dataBits(value) {
            this._data_bits = value;
        }
        get flowControl() {
            return this._flow_control;
        }
        set flowControl(value) {
            this._flow_control = value;
        }
        serialize() {
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
        }
    }
    JSPM.SerialPortPrinter = SerialPortPrinter;
    class NetworkPrinter {
        constructor(port, ipAddress, dnsName) {
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
        get dnsName() {
            return this._dnsName;
        }
        set dnsName(value) {
            this._dnsName = value;
        }
        get ipAddress() {
            return this._ip;
        }
        set ipAddress(value) {
            this._ip = value;
        }
        get port() {
            return this._port;
        }
        set port(value) {
            if (!(value >= 0 && value <= 65535))
                throw "Invalid Port Number";
            this._port = Math.floor(value);
        }
        serialize() {
            if (!(this.dnsName || this.ipAddress))
                throw "You have to specify an IP address or a DNS name";
            return JSON.stringify({
                type: this.Id,
                ip: this._ip,
                dns: this._dnsName,
                port: this._port
            });
        }
    }
    JSPM.NetworkPrinter = NetworkPrinter;
    class UserSelectedPrinter {
        constructor() {
            this.Id = 5;
        }
        serialize() {
            return JSON.stringify({
                type: this.Id
            });
        }
    }
    JSPM.UserSelectedPrinter = UserSelectedPrinter;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class ClientScanJob extends JSPM.ClientJob {
        constructor() {
            super(...arguments);
            this._type = 'scan_job';
            this._scannerName = "";
            this._pixelMode = JSPM.PixelMode.Color;
            this._resolution = 200;
            this._imageFormat = JSPM.ScannerImageFormatOutput.JPG;
        }
        get scannerName() {
            return this._scannerName;
        }
        set scannerName(val) {
            this._scannerName = val;
        }
        get pixelMode() {
            return this._pixelMode;
        }
        set pixelMode(val) {
            this._pixelMode = val;
        }
        get resolution() {
            return this._resolution;
        }
        set resolution(val) {
            this._resolution = val;
        }
        get imageFormat() {
            return this._imageFormat;
        }
        set imageFormat(val) {
            this._imageFormat = val;
        }
        onFinished(data) { }
        ;
        onError(data, is_critical) { }
        ;
        onUpdate(data, last) {
            if (data.result) {
                this.onFinished(data);
            }
        }
        _generateDataAsync() {
            return new Promise((ok, err) => {
                if (!this._resolution)
                    err("Scan resolution is required");
                if (!this._scannerName)
                    err("Scanner name is required");
                let json = {
                    output_image_format: this._imageFormat,
                    pixel_mode: this._pixelMode,
                    scanner_name: this._scannerName,
                    resolution: this._resolution
                };
                ok(JSON.stringify(json));
            });
        }
    }
    JSPM.ClientScanJob = ClientScanJob;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    let PrintersInfoLevel;
    (function (PrintersInfoLevel) {
        PrintersInfoLevel[PrintersInfoLevel["Basic"] = 0] = "Basic";
        PrintersInfoLevel[PrintersInfoLevel["Extended"] = 1] = "Extended";
    })(PrintersInfoLevel = JSPM.PrintersInfoLevel || (JSPM.PrintersInfoLevel = {}));
    let Encoding;
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
    let DuplexMode;
    (function (DuplexMode) {
        DuplexMode[DuplexMode["Default"] = 0] = "Default";
        DuplexMode[DuplexMode["Simplex"] = 1] = "Simplex";
        DuplexMode[DuplexMode["DuplexLongEdge"] = 2] = "DuplexLongEdge";
        DuplexMode[DuplexMode["DuplexShortEdge"] = 3] = "DuplexShortEdge";
    })(DuplexMode = JSPM.DuplexMode || (JSPM.DuplexMode = {}));
    let Sizing;
    (function (Sizing) {
        Sizing[Sizing["None"] = 0] = "None";
        Sizing[Sizing["Fit"] = 1] = "Fit";
    })(Sizing = JSPM.Sizing || (JSPM.Sizing = {}));
    let ScannerImageFormatOutput;
    (function (ScannerImageFormatOutput) {
        ScannerImageFormatOutput[ScannerImageFormatOutput["JPG"] = 0] = "JPG";
        ScannerImageFormatOutput[ScannerImageFormatOutput["PNG"] = 1] = "PNG";
    })(ScannerImageFormatOutput = JSPM.ScannerImageFormatOutput || (JSPM.ScannerImageFormatOutput = {}));
    let PixelMode;
    (function (PixelMode) {
        PixelMode[PixelMode["Grayscale"] = 0] = "Grayscale";
        PixelMode[PixelMode["Color"] = 1] = "Color";
    })(PixelMode = JSPM.PixelMode || (JSPM.PixelMode = {}));
    let FileSourceType;
    (function (FileSourceType) {
        FileSourceType[FileSourceType["Base64"] = 0] = "Base64";
        FileSourceType[FileSourceType["Text"] = 1] = "Text";
        FileSourceType[FileSourceType["BLOB"] = 2] = "BLOB";
        FileSourceType[FileSourceType["URL"] = 3] = "URL";
    })(FileSourceType = JSPM.FileSourceType || (JSPM.FileSourceType = {}));
    ;
    let WSStatus;
    (function (WSStatus) {
        WSStatus[WSStatus["Open"] = 0] = "Open";
        WSStatus[WSStatus["Closed"] = 1] = "Closed";
        WSStatus[WSStatus["Blocked"] = 2] = "Blocked";
        WSStatus[WSStatus["WaitingForUserResponse"] = 3] = "WaitingForUserResponse";
    })(WSStatus = JSPM.WSStatus || (JSPM.WSStatus = {}));
    ;
    let PrintRotation;
    (function (PrintRotation) {
        PrintRotation[PrintRotation["None"] = 0] = "None";
        PrintRotation[PrintRotation["Rot90"] = 1] = "Rot90";
        PrintRotation[PrintRotation["Rot180"] = 2] = "Rot180";
        PrintRotation[PrintRotation["Rot270"] = 3] = "Rot270";
    })(PrintRotation = JSPM.PrintRotation || (JSPM.PrintRotation = {}));
    let TextAlignment;
    (function (TextAlignment) {
        TextAlignment[TextAlignment["Left"] = 0] = "Left";
        TextAlignment[TextAlignment["Center"] = 1] = "Center";
        TextAlignment[TextAlignment["Right"] = 2] = "Right";
        TextAlignment[TextAlignment["Justify"] = 3] = "Justify";
        TextAlignment[TextAlignment["None"] = 4] = "None";
    })(TextAlignment = JSPM.TextAlignment || (JSPM.TextAlignment = {}));
    let PrintOrientation;
    (function (PrintOrientation) {
        PrintOrientation[PrintOrientation["Portrait"] = 0] = "Portrait";
        PrintOrientation[PrintOrientation["Landscape"] = 1] = "Landscape";
    })(PrintOrientation = JSPM.PrintOrientation || (JSPM.PrintOrientation = {}));
})(JSPM || (JSPM = {}));
(function (JSPM) {
    var Serial;
    (function (Serial) {
        let Parity;
        (function (Parity) {
            Parity[Parity["None"] = 0] = "None";
            Parity[Parity["Odd"] = 1] = "Odd";
            Parity[Parity["Even"] = 2] = "Even";
            Parity[Parity["Mark"] = 3] = "Mark";
            Parity[Parity["Space"] = 4] = "Space";
        })(Parity = Serial.Parity || (Serial.Parity = {}));
        let StopBits;
        (function (StopBits) {
            StopBits[StopBits["None"] = 0] = "None";
            StopBits[StopBits["One"] = 1] = "One";
            StopBits[StopBits["Two"] = 2] = "Two";
            StopBits[StopBits["OnePointFive"] = 3] = "OnePointFive";
        })(StopBits = Serial.StopBits || (Serial.StopBits = {}));
        let DataBits;
        (function (DataBits) {
            DataBits[DataBits["Eight"] = 0] = "Eight";
            DataBits[DataBits["Seven"] = 1] = "Seven";
            DataBits[DataBits["Six"] = 2] = "Six";
            DataBits[DataBits["Five"] = 3] = "Five";
        })(DataBits = Serial.DataBits || (Serial.DataBits = {}));
        let Handshake;
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
var JSPM;
(function (JSPM) {
    class JSPMWebSocket {
        constructor(addr = 'localhost', port = 23443, secure = true, auto_reconnect = false) {
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
        get address() {
            return this._addr;
        }
        get port() {
            return this._port;
        }
        get isSecure() {
            return this._secure;
        }
        get status() {
            return this._status;
        }
        _onOpen(e, __this) {
            this._status = JSPM.WSStatus.WaitingForUserResponse;
            this._pingPong();
            __this.onStatusChanged();
            __this.onOpen(e);
        }
        _onMessage(e) {
            return __awaiter(this, void 0, void 0, function* () {
                const unlock = yield this._processing_message.lock();
                try {
                    if (typeof (e.data) == 'string') {
                        let json_data = JSON.parse(e.data);
                        var job = this._job_list[json_data.id];
                        if (!job)
                            throw "Job " + json_data.id + " doesn't exist";
                        let last = ('last' in json_data) ? json_data.last : false;
                        let msg_type = ('type' in json_data) ? json_data.type : 'message';
                        let data = ('data' in json_data) ? json_data.data : {};
                        switch (msg_type) {
                            case 'message':
                                {
                                    job.on_update(data, job.first_update, last);
                                }
                                break;
                            case 'error':
                                {
                                    let critical = 'critical' in json_data ?
                                        json_data.critical : false;
                                    job.on_error(data, job.first_update, critical);
                                }
                                break;
                            default: {
                                job.on_update(data, job.first_update, last);
                            }
                        }
                        if (last)
                            delete this._job_list[json_data.id];
                    }
                    else {
                        let blob = e.data;
                        let id_buf = yield blob.slice(blob.size - 8, blob.size).arrayBuffer();
                        let id = new TextDecoder('utf-8').decode(id_buf);
                        let data_blob = blob.slice(0, blob.size - 8);
                        var job = this._job_list[id];
                        if (!job)
                            throw "Job " + id + " doesn't exist";
                        job.on_update(data_blob, job.first_update, false);
                    }
                    job.first_update = false;
                }
                catch (_a) {
                    throw "Malformed message. Error: " + e.data;
                }
                finally {
                    unlock();
                }
            });
        }
        _onError(e) {
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
        }
        _pingPong() {
            setInterval(_ => {
                if (this._status != JSPM.WSStatus.Open)
                    return;
                this.send('', {
                    type: 'ping',
                    on_update: _ => { },
                    on_error: _ => { }
                });
            }, 30000);
        }
        _onClose(e, __this) {
            if (e.code == 403)
                this._status = JSPM.WSStatus.Blocked;
            else {
                this._status = JSPM.WSStatus.Closed;
                if (this.autoReconnect)
                    setTimeout(_ => {
                        this.start();
                    }, 2000);
            }
            __this.onClose(e);
            __this.onStatusChanged();
        }
        ;
        _genID() {
            return Math.floor((1 + Math.random()) * 0x100000000)
                .toString(16)
                .substring(1);
        }
        _send(data, properties) {
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
                let job_id = new Uint8Array(('id' + id).split('')
                    .map(a => a.charCodeAt(0)));
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
        }
        start() {
            return new Promise((ok, err) => {
                try {
                    this._ws = new WebSocket((this._secure ? 'wss://' : 'ws://') +
                        this._addr + ':' + this._port);
                    this._ws.onclose = (e) => this._onClose(e, this);
                    this._ws.onerror = (i) => {
                        err(i);
                    };
                    this._ws.onopen = (i) => {
                        this._ws.onopen = (e) => this._onOpen(e, this);
                        this._ws.onmessage = (e) => {
                            try {
                                let json = JSON.parse(e.data);
                                if ('connection' in json) {
                                    if (json.connection == 'CONNECTED') {
                                        this._status = JSPM.WSStatus.Open;
                                        this.onStatusChanged();
                                        this.onOpen(json.certificate);
                                        JSPM.JSPrintManager._ses_cert = json.certificate;
                                        this.send(JSON.stringify({ url: JSPM.JSPrintManager.license_url }), { type: "set_license" });
                                        let verArray = json.version.split('.');
                                        if (verArray[0] + '.' + verArray[1] != JSPM.VERSION) {
                                            console.warn("Lib JS version and " +
                                                "desktop version differs Desktop(" +
                                                json.version + ") JS (" + JSPM.VERSION +
                                                ")");
                                        }
                                        this._ws.onmessage = (e) => __awaiter(this, void 0, void 0, function* () {
                                            yield this._onMessage(e);
                                        });
                                        this._ws.onerror = this._onError;
                                        ok();
                                    }
                                    else {
                                        err("WS Connection not established. Reason: " + json.connection);
                                    }
                                }
                            }
                            catch (_a) {
                                err("Malformed message. Check if JS version " +
                                    "and Desktop version are the same");
                            }
                        };
                    };
                }
                catch (e) {
                    if (this.autoReconnect)
                        setTimeout(() => {
                            this.start().then(ok).catch(err);
                        }, 2000);
                    else
                        err(e);
                }
            });
        }
        send(data, properties) {
            if (this._status == JSPM.WSStatus.Closed)
                properties['on_first_error']("The WebSocket connection is closed");
            else if (this._status == JSPM.WSStatus.Blocked)
                properties['on_first_error']("The site is blocked and the connection was closed");
            else if (this._ws.readyState != this._ws.OPEN)
                properties['on_first_error']("The WebSocket isn't ready yet");
            return this._send(data, properties);
        }
        stop() {
            this._ws.close();
            this._ws = null;
        }
    }
    JSPM.JSPMWebSocket = JSPMWebSocket;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class JSPrintManager {
        static get session_certificate() {
            return this._ses_cert;
        }
        static start(secure = true, host = 'localhost', port = 23443) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.WS)
                    this.WS = new JSPM.JSPMWebSocket(host, port, secure, this.auto_reconnect);
                let ws = yield this.WS.start();
                return ws;
            });
        }
        static get license_url() {
            return this._license;
        }
        static set license_url(value) {
            this._license = value;
            this.WS.send(JSON.stringify({ url: this._license }), { type: "set_license" });
        }
        static getPrinters() {
            return new Promise((ok, err) => {
                this.WS.send('', {
                    type: 'printers_list',
                    on_update: (data) => {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: (data) => err(data)
                });
            });
        }
        static getPrintersInfo(detail_level = JSPM.PrintersInfoLevel.Basic, printer_name = '') {
            return new Promise((ok, err) => {
                let data = { 'detail_level': detail_level };
                if (printer_name)
                    data['printer'] = printer_name;
                this.WS.send(JSON.stringify(data), {
                    type: 'printers_complete_list',
                    on_update: (data) => {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: (data) => err(data)
                });
            });
        }
        static get websocket_status() {
            return this.WS ? this.WS.status : JSPM.WSStatus.Closed;
        }
        static showAbout() {
            return new Promise((ok, err) => {
                this.WS.send('', {
                    type: 'about',
                    on_update: (data) => {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: (data) => err(data)
                });
            });
        }
        static updateClient() {
            return new Promise((ok, err) => {
                this.WS.send('', {
                    type: 'update',
                    on_update: (data) => {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: (data) => err(data)
                });
            });
        }
        static getSystemFonts() {
            return new Promise((ok, err) => {
                this.WS.send('', {
                    type: 'fonts_list',
                    on_update: (data) => {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: (data) => err(data)
                });
            });
        }
        static getSerialPorts() {
            return new Promise((ok, err) => {
                this.WS.send('', {
                    type: 'serial_ports_list',
                    on_update: (data) => {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: (data) => err(data)
                });
            });
        }
        static getScanners() {
            return new Promise((ok, err) => {
                this.WS.send('', {
                    type: 'scanner_list',
                    on_update: (data) => {
                        if (data && 'result' in data)
                            ok(data.result);
                        else
                            ok(data);
                    },
                    on_error: (data) => err(data)
                });
            });
        }
        static onPrinterCreated(callback, error, detail_level = JSPM.PrintersInfoLevel.Extended) {
            if (detail_level == JSPM.PrintersInfoLevel.Basic)
                throw "Basic detail level information is not implemented yet";
            if (navigator.platform.toLowerCase().indexOf("win") < 0)
                throw "This functionality is Windows only";
            return this.WS.send('', {
                type: 'on_printer_creation',
                on_update: (data) => callback(data),
                on_error: (data) => error(data)
            });
        }
        static onPrinterUpdated(callback, error, detail_level = JSPM.PrintersInfoLevel.Extended) {
            if (detail_level == JSPM.PrintersInfoLevel.Basic)
                throw "Basic detail level information is not implemented yet";
            if (navigator.platform.toLowerCase().indexOf("win") < 0)
                throw "This functionality is Windows only";
            return this.WS.send('', {
                type: 'on_printer_modification',
                on_update: (data) => callback(data),
                on_error: (data) => error(data)
            });
        }
        static onPrinterDeleted(callback, error, detail_level = JSPM.PrintersInfoLevel.Extended) {
            if (detail_level == JSPM.PrintersInfoLevel.Basic)
                throw "Basic detail level information is not implemented yet";
            if (navigator.platform.toLowerCase().indexOf("win") < 0)
                throw "This functionality is Windows only";
            return this.WS.send('', {
                type: 'on_printer_deletion',
                on_update: (data) => callback(data),
                on_error: (data) => error(data)
            });
        }
        static unsubscribePrinterEvent(id) {
            return new Promise((ok, err) => {
                return this.WS.send(JSON.stringify({ close: true }), {
                    id: id,
                    type: 'on_printer_deletion',
                    on_update: (data) => ok(data),
                    on_error: (data) => err(data)
                });
            });
        }
        static stop() {
            this.WS.stop();
        }
    }
    JSPrintManager.auto_reconnect = false;
    JSPrintManager._license = document.location.origin + "/jspm";
    JSPrintManager._ses_cert = "";
    JSPM.JSPrintManager = JSPrintManager;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class PrintFile {
        constructor(fileContent, fileContentType, fileName, copies) {
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
        get copies() {
            return this._copies;
        }
        set copies(value) {
            if (value < 1)
                throw "Copies must be greater than or equal to 1.";
            this._copies = value;
        }
        escapeInvalidFileNameChars() {
            if (this.fileName.indexOf("\\") > -1)
                this.fileName = this.fileName.replace("\\", "BACKSLASHCHAR");
        }
        bool2str(value, true_val = '1', false_val = '0') {
            return value ? true_val : false_val;
        }
        getBLOBContent() {
            return new Promise((ok, err) => {
                switch (this.fileContentType) {
                    case JSPM.FileSourceType.BLOB:
                        {
                            ok(this.fileContent);
                        }
                        break;
                    case JSPM.FileSourceType.Base64:
                        {
                            try {
                                let chars = atob(this.fileContent);
                                let bytes = new Uint8Array(chars.length);
                                for (let i = 0; i < chars.length; i++) {
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
                                let bytes = new Uint8Array(this.fileContent.length);
                                for (let i = 0; i < this.fileContent.length; i++) {
                                    bytes[i] = this.fileContent.charCodeAt(i);
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
                            let xhr = new XMLHttpRequest();
                            xhr.open('GET', this.fileContent, true);
                            xhr.responseType = 'blob';
                            xhr.onload = (oEvent) => {
                                ok(xhr.response);
                            };
                            xhr.send(null);
                        }
                        break;
                    default: err('FileSourceType not specified');
                }
            });
        }
        serialize() {
            return new Promise((ok, err) => {
                switch (this.fileContentType) {
                    case JSPM.FileSourceType.Base64:
                        {
                            ok(new zip.Data64URIReader(this.fileContent));
                        }
                        break;
                    case JSPM.FileSourceType.BLOB:
                        {
                            ok(new zip.BlobReader(this.fileContent));
                        }
                        break;
                    case JSPM.FileSourceType.Text:
                        {
                            ok(new zip.TextReader(this.fileContent));
                        }
                        break;
                    case JSPM.FileSourceType.URL:
                        {
                            let xhr = new XMLHttpRequest();
                            xhr.open('GET', this.fileContent, true);
                            xhr.responseType = 'blob';
                            xhr.onload = (oEvent) => {
                                ok(new zip.BlobReader(xhr.response));
                            };
                            xhr.send(null);
                        }
                        break;
                    default: err("The file content type is invalid");
                }
            });
        }
    }
    JSPM.PrintFile = PrintFile;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class PrintFileDOC extends JSPM.PrintFile {
        constructor(fileContent, fileContentType, fileName, copies) {
            super(fileContent, fileContentType, fileName.substring(0, fileName.lastIndexOf('.')) + '.wdoc', copies);
            this.manualDuplex = false;
            this.manualDuplexMessage = "";
            this.printInReverseOrder = false;
            this.printRange = '';
            this.encryptedPassword = "";
        }
        isValidRange(range) {
            if (range == null || range == '')
                return true;
            let reg = /([0-9])+((-[0-9]+)|(,[0-9]+))*/;
            let test = reg.exec(range);
            if (test == null)
                return false;
            if (test[0].length != range.length)
                return false;
            return true;
        }
        _getPropertiesJSON() {
            return {
                manual_duplex: this.manualDuplex,
                reverse: this.printInReverseOrder,
                duplex_message: this.manualDuplexMessage,
                range: this.printRange,
                password: this.encryptedPassword,
            };
        }
        serialize() {
            return new Promise((ok, err) => {
                const SEP = ';';
                if (!this.isValidRange(this.printRange))
                    err('Invalid Print Range');
                this.getBLOBContent().then((file_content) => {
                    let properties = new Uint8Array(JSPM.Utils._str2UTF8Array(JSON.stringify(this._getPropertiesJSON())));
                    let file_size = JSPM.Utils._intToByteArray(properties.length);
                    let blob = new Blob([file_content, properties, file_size]);
                    ok(new zip.BlobReader(blob));
                }).catch((e) => {
                    err(e);
                });
            });
        }
    }
    JSPM.PrintFileDOC = PrintFileDOC;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class PrintFilePDF extends JSPM.PrintFile {
        constructor(fileContent, fileContentType, fileName, copies) {
            super(fileContent, fileContentType, fileName.substring(0, fileName.lastIndexOf('.')) + '.wpdf', copies);
            this.pageSizing = JSPM.Sizing.None;
            this.manualDuplex = false;
            this.printAutoRotate = false;
            this.printAutoCenter = false;
            this.manualDuplexMessage = "";
            this.encryptedPassword = "";
            this.printAsGrayscale = false;
            this.printAnnotations = false;
            this.printRange = '';
            this.printInReverseOrder = false;
            this.printRotation = JSPM.PrintRotation.None;
        }
        isValidRange(range) {
            if (range == null || range == '')
                return true;
            let reg = /([0-9])+((-[0-9]+)|(,[0-9]+))*/;
            let test = reg.exec(range);
            if (test == null)
                return false;
            if (test[0].length != range.length)
                return false;
            return true;
        }
        _getPropertiesJSON() {
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
        }
        serialize() {
            return new Promise((ok, err) => {
                const SEP = ';';
                if (!this.isValidRange(this.printRange))
                    err('Invalid Print Range');
                this.getBLOBContent().then((file_content) => {
                    let properties = new Uint8Array(JSPM.Utils._str2UTF8Array(JSON.stringify(this._getPropertiesJSON())));
                    let file_size = JSPM.Utils._intToByteArray(properties.length);
                    let blob = new Blob([file_content, properties, file_size]);
                    ok(new zip.BlobReader(blob));
                }).catch((e) => {
                    err(e);
                });
            });
        }
    }
    JSPM.PrintFilePDF = PrintFilePDF;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class PrintFileTXT extends JSPM.PrintFile {
        constructor(fileContent, fileName, copies, fileContentType) {
            super(fileContent, fileContentType ? fileContentType : JSPM.FileSourceType.Text, fileName.substring(0, fileName.lastIndexOf('.')) + '.wtxt', copies);
            this.textContent = '';
            this.textAligment = JSPM.TextAlignment.Left;
            this.fontName = '';
            this.fontBold = false;
            this.fontItalic = false;
            this.fontUnderline = false;
            this.fontStrikethrough = false;
            this.fontSize = 10;
            this.fontColor = '#000000';
            this.printOrientation = JSPM.PrintOrientation.Portrait;
            this.marginLeft = 0.5;
            this.marginRight = 0.5;
            this.marginTop = 0.5;
            this.marginBottom = 0.5;
        }
        serialize() {
            return new Promise((ok, err) => {
                const SEP = '|';
                this.getBLOBContent().then((file_content) => {
                    let params = new Uint8Array(JSPM.Utils._str2UTF8Array(this.printOrientation + SEP + this.textAligment +
                        SEP + this.fontName + SEP + this.fontSize + SEP +
                        this.bool2str(this.fontBold) + SEP +
                        this.bool2str(this.fontItalic) + SEP +
                        this.bool2str(this.fontUnderline) + SEP +
                        this.bool2str(this.fontStrikethrough) + SEP +
                        this.fontColor + SEP + this.marginLeft + SEP + this.marginTop +
                        SEP + this.marginRight + SEP + this.marginBottom + '\n'));
                    let blob = new Blob([params, file_content]);
                    ok(new zip.BlobReader(blob));
                }).catch((e) => {
                    err(e);
                });
            });
        }
    }
    JSPM.PrintFileTXT = PrintFileTXT;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class PrintFileXLS extends JSPM.PrintFile {
        constructor(fileContent, fileContentType, fileName, copies) {
            super(fileContent, fileContentType, fileName.substring(0, fileName.lastIndexOf('.')) + '.wxls', copies);
            this.encryptedPassword = "";
            this.pageFrom = 0;
            this.pageTo = 0;
        }
        _getPropertiesJSON() {
            return {
                from: this.pageFrom,
                to: this.pageTo,
                password: this.encryptedPassword,
            };
        }
        serialize() {
            return new Promise((ok, err) => {
                this.getBLOBContent().then((file_content) => {
                    let properties = new Uint8Array(JSPM.Utils._str2UTF8Array(JSON.stringify(this._getPropertiesJSON())));
                    let file_size = JSPM.Utils._intToByteArray(properties.length);
                    let blob = new Blob([file_content, properties, file_size]);
                    ok(new zip.BlobReader(blob));
                }).catch((e) => {
                    err(e);
                });
            });
        }
    }
    JSPM.PrintFileXLS = PrintFileXLS;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    class SerialComm {
        constructor(portName, baudRate, parity, stopBits, dataBits, flowControl) {
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
        get portName() {
            return this._port;
        }
        set portName(value) {
            this._port = value;
        }
        get isOpen() {
            return this._isOpen;
        }
        get baudRate() {
            return this._baud_rate;
        }
        set baudRate(value) {
            this._baud_rate = value;
        }
        get parity() {
            return this._parity;
        }
        set parity(value) {
            this._parity = value;
        }
        get stopBits() {
            return this._stop_bits;
        }
        set stopBits(value) {
            this._stop_bits = value;
        }
        get dataBits() {
            return this._data_bits;
        }
        set dataBits(value) {
            this._data_bits = value;
        }
        get flowControl() {
            return this._flow_control;
        }
        set flowControl(value) {
            this._flow_control = value;
        }
        onError(data, critical) { }
        onDataReceived(data) { }
        onClose(data) { }
        open() {
            return new Promise((ok, err) => {
                if (this._isOpen) {
                    throw "Connection is already open";
                }
                let props = this.propertiesJSON();
                props['on_update'] = (data, first, last) => {
                    if (first) {
                        if (data.result && data.result == "Open" && this._isOpen == false)
                            this._isOpen = true;
                        ok(data);
                    }
                    else if (last) {
                        this.onClose(data);
                        this._id = "";
                        this._isOpen = false;
                    }
                    else
                        this.onDataReceived(data.data);
                };
                props['on_error'] = (data, first, critical) => {
                    if (first)
                        err(data);
                    else
                        this.onError(data, critical);
                };
                this._id = JSPM.JSPrintManager.WS.send(JSON.stringify({
                    port: this._port,
                    baud_rate: this._baud_rate,
                    data_bits: this._data_bits,
                    flow_control: this._flow_control,
                    parity: this._parity,
                    stop_bits: this._stop_bits
                }), props);
            });
        }
        send(utf8string) {
            let props = this.propertiesJSON();
            JSPM.JSPrintManager.WS.send(JSON.stringify({ data: utf8string }), props);
        }
        close() {
            JSPM.JSPrintManager.WS.send(JSON.stringify({ close: true }), this.propertiesJSON());
        }
        propertiesJSON() {
            if (!this.portName)
                throw "The specified serial port name is null or empty.";
            let p = {
                type: 'serial'
            };
            if (this._id)
                p['id'] = this._id;
            return p;
        }
    }
    JSPM.SerialComm = SerialComm;
})(JSPM || (JSPM = {}));
var JSPM;
(function (JSPM) {
    JSPM.VERSION = '3.0';
    class Mutex {
        constructor() {
            this.mutex = Promise.resolve();
        }
        lock() {
            let begin = unlock => { };
            this.mutex = this.mutex.then(() => {
                return new Promise(begin);
            });
            return new Promise(res => {
                begin = res;
            });
        }
    }
    JSPM.Mutex = Mutex;
    class Utils {
        static _intToByteArray(number) {
            return new Uint8Array([number & 0xFF,
                (number >> 8) & 0xFF,
                (number >> 16) & 0xFF,
                (number >> 24) & 0xFF]);
        }
        static _str2UTF8Array(str) {
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
        }
    }
    JSPM.Utils = Utils;
})(JSPM || (JSPM = {}));
