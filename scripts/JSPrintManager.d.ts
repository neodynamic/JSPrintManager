export declare class ClientJob {
    _type: string;
    protected _generateDataAsync(): Promise<Blob | string>;
    protected onUpdate(data: any, last: any): void;
    protected onError(data: any, critical: any): void;
    sendToClient(): Promise<unknown>;
}

export declare class ClientPrintJob extends ClientJob {
    private _clientPrinter;
    get clientPrinter(): IClientPrinter;
    set clientPrinter(value: IClientPrinter);
    private _printerCommandsCopies;
    get printerCommandsCopies(): number;
    set printerCommandsCopies(value: number);
    private _printerCommands;
    private _printerCommandsCodePage;
    get printerCommands(): string;
    set printerCommands(value: string);
    get printerCommandsCodePage(): Encoding;
    set printerCommandsCodePage(value: Encoding);
    private _binaryPrinterCommands;
    get binaryPrinterCommands(): Uint8Array;
    set binaryPrinterCommands(value: Uint8Array);
    private _printFileGroup;
    get files(): PrintFile[];
    onUpdated(data: any): void;
    onFinished(data: any): void;
    onError(data: any, is_critical: any): void;
    onUpdate(data: any, last: any): void;
    _genPFGArrayAsync(printFileGroup: PrintFile[]): Promise<Blob>;
    _genPCArrayAsync(binPrinterCommands: Uint8Array, printerCopies: number): Promise<Blob>;
    _genPrinterArrayAsync(clientPrinter: IClientPrinter): Promise<Uint8Array>;
    _cmd2bin(): void;
    _generateDataAsync(): Promise<Blob>;
}

export declare class ClientPrintJobGroup extends ClientJob {
    _jobs: ClientPrintJob[];
    get jobs(): ClientPrintJob[];
    private _generateMiniJob;
    _generateDataAsync(): Promise<Blob>;
}

export interface IClientPrinter {
    Id: any;
    serialize(): any;
}
export declare class DefaultPrinter implements IClientPrinter {
    Id: number;
    serialize(): string;
}
export declare class InstalledPrinter implements IClientPrinter {
    Id: number;
    private _name;
    private _printDefault;
    private _tray;
    private _paper;
    private _duplex;
    private _autoDetectRawModeDataType;
    private _driverModel;
    private bool2str;
    get printerName(): string;
    set printerName(value: string);
    get printToDefaultIfNotFound(): boolean;
    set printToDefaultIfNotFound(value: boolean);
    get trayName(): string;
    set trayName(value: string);
    get paperName(): string;
    set paperName(value: string);
    get duplex(): DuplexMode;
    set duplex(value: DuplexMode);
    get autoDetectRawModeDataType(): boolean;
    set autoDetectRawModeDataType(value: boolean);
    get driverModel(): number;
    set driverModel(value: number);
    constructor(printerName: string, printToDefaultIfNotFound?: boolean, trayName?: string, paperName?: string, duplex?: DuplexMode, autoDetectRawModeDataType?: boolean, driverModel?: number);
    serialize(): string;
}
export declare class ParallelPortPrinter implements IClientPrinter {
    Id: number;
    private _parallelPortName;
    get portName(): string;
    set portName(value: string);
    constructor(portName: string);
    serialize(): string;
}
export declare class SerialPortPrinter implements IClientPrinter {
    Id: number;
    private _port;
    private _baud_rate;
    private _parity;
    private _stop_bits;
    private _data_bits;
    private _flow_control;
    get portName(): string;
    set portName(value: string);
    get baudRate(): number;
    set baudRate(value: number);
    get parity(): Serial.Parity;
    set parity(value: Serial.Parity);
    get stopBits(): Serial.StopBits;
    set stopBits(value: Serial.StopBits);
    get dataBits(): Serial.DataBits;
    set dataBits(value: Serial.DataBits);
    get flowControl(): Serial.Handshake;
    set flowControl(value: Serial.Handshake);
    constructor(portName: string, baudRate: number, parity: Serial.Parity, stopBits: Serial.StopBits, dataBits: Serial.DataBits, flowControl: Serial.Handshake);
    serialize(): string;
}
export declare class NetworkPrinter implements IClientPrinter {
    Id: number;
    private _ip;
    private _port;
    private _dnsName;
    get dnsName(): string;
    set dnsName(value: string);
    get ipAddress(): string;
    set ipAddress(value: string);
    get port(): number;
    set port(value: number);
    constructor(port: number, ipAddress?: string, dnsName?: string);
    serialize(): string;
}
export declare class UserSelectedPrinter implements IClientPrinter {
    Id: number;
    serialize(): string;
}

export declare class ClientScanJob extends ClientJob {
    _type: string;
    _scannerName: string;
    _pixelMode: PixelMode;
    _resolution: number;
    _imageFormat: ScannerImageFormatOutput;
    _enableDuplex: boolean;
    _enableFeeder: boolean;
    _feederCount: number;
    _jpgCompressionQuality: number;
    _threshold: number;
    _dither: Dither;
    _pdfTitle: string;
    get scannerName(): string;
    set scannerName(val: string);
    get pixelMode(): PixelMode;
    set pixelMode(val: PixelMode);
    get resolution(): number;
    set resolution(val: number);
    get imageFormat(): ScannerImageFormatOutput;
    set imageFormat(val: ScannerImageFormatOutput);
    get enableDuplex(): boolean;
    set enableDuplex(val: boolean);
    get enableFeeder(): boolean;
    set enableFeeder(val: boolean);
    get feederCount(): number;
    set feederCount(val: number);
    get jpgCompressionQuality(): number;
    set jpgCompressionQuality(val: number);
    get threshold(): number;
    set threshold(val: number);
    get dither(): Dither;
    set dither(val: Dither);
    get pdfTitle(): string;
    set pdfTitle(val: string);
    onFinished(data: any): void;
    onError(data: any, is_critical: any): void;
    onUpdate(data: any, last: any): void;
    protected _generateDataAsync(): Promise<string>;
}

export declare enum PrintFileType {
    Image = 0,
    Generic = 1,
    Document = 2,
    WDOC = 3,
    WXLS = 4,
    WPDF = 5,
    WTXT = 6,
    Group = 7,
    WTIF = 8
}
export declare enum PrintersInfoLevel {
    Basic = 0,
    Extended = 1
}
export declare enum Encoding {
    Default = -1,
    IBM_EBCDIC_US_Canada = 37,
    OEM_United_States = 437,
    IBM_EBCDIC_International = 500,
    Polish_MS_DOS = 620,
    Arabic_ASMO_708 = 708,
    Arabic_Transparent_ASMO_Arabic_DOS = 720,
    OEM_Greek_formerly_437G_Greek_DOS = 737,
    OEM_Baltic_Baltic_DOS = 775,
    OEM_Russian_Cyrillic_Euro_symbol = 808,
    OEM_Multilingual_Latin_1_Western_European_DOS = 850,
    OEM_Latin_2_Central_European_DOS = 852,
    OEM_Cyrillic_primarily_Russian = 855,
    OEM_Turkish_Turkish_DOS = 857,
    OEM_Multilingual_Latin_1_Euro_symbol = 858,
    OEM_Portuguese_Portuguese_DOS = 860,
    OEM_Icelandic_Icelandic_DOS = 861,
    OEM_Hebrew_Hebrew_DOS = 862,
    OEM_French_Canadian_French_Canadian_DOS = 863,
    OEM_Arabic_Arabic_864 = 864,
    OEM_Nordic_Nordic_DOS = 865,
    OEM_Russian_Cyrillic_DOS = 866,
    OEM_Modern_Greek_Greek_Modern_DOS = 869,
    IBM_EBCDIC_Multilingual_ROECE_Latin_2 = 870,
    OEM_Cyrillic_primarily_Russian_Euro_Symbol = 872,
    Windows_Thai = 874,
    IBM_EBCDIC_Greek_Modern = 875,
    Kamenicky_Czech_MS_DOS = 895,
    Japanese_Shift_JIS = 932,
    Simplified_Chinese_GBK = 936,
    Korean = 949,
    Traditional_Chinese_Big5 = 950,
    IBM_EBCDIC_French = 1010,
    IBM_EBCDIC_Turkish_Latin_5 = 1026,
    IBM_EBCDIC_Latin_1_Open_System = 1047,
    IBM_EBCDIC_Lao_1132_1133_1341 = 1132,
    IBM_EBCDIC_US_Canada_037_Euro_symbol = 1140,
    IBM_EBCDIC_Germany_20273_Euro_symbol = 1141,
    IBM_EBCDIC_Denmark_Norway_20277_Euro_symbol = 1142,
    IBM_EBCDIC_Finland_Sweden_20278_Euro_symbol = 1143,
    IBM_EBCDIC_Italy_20280_Euro_symbol = 1144,
    IBM_EBCDIC_Latin_America_Spain_20284_Euro_symbol = 1145,
    IBM_EBCDIC_United_Kingdom_20285_Euro_symbol = 1146,
    IBM_EBCDIC_France_20297_Euro_symbol = 1147,
    IBM_EBCDIC_International_500_Euro_symbol = 1148,
    IBM_EBCDIC_Icelandic_20871_Euro_symbol = 1149,
    Unicode_UTF_16_little_endian_BMP_of_ISO_10646 = 1200,
    Unicode_UTF_16_big_endian = 1201,
    Windows_Central_Europe = 1250,
    Windows_Cyrillic = 1251,
    Windows_Latin_I = 1252,
    Windows_Greek = 1253,
    Windows_Turkish = 1254,
    Windows_Hebrew = 1255,
    Windows_Arabic = 1256,
    Windows_Baltic = 1257,
    Windows_Vietnam = 1258,
    Korean_Johab = 1361,
    MAC_Roman = 10000,
    Japanese_Mac = 10001,
    MAC_Traditional_Chinese_Big5 = 10002,
    Korean_Mac = 10003,
    Arabic_Mac = 10004,
    Hebrew_Mac = 10005,
    Greek_Mac = 10006,
    Cyrillic_Mac = 10007,
    MAC_Simplified_Chinese_GB_2312 = 10008,
    Romanian_Mac = 10010,
    Ukrainian_Mac = 10017,
    Thai_Mac = 10021,
    MAC_Latin_2_Central_European = 10029,
    Icelandic_Mac = 10079,
    Turkish_Mac = 10081,
    Croatian_Mac = 10082,
    Unicode_UTF_32_little_endian_byte_order = 12000,
    Unicode_UTF_32_big_endian_byte_order = 12001,
    CNS_Taiwan_Chinese_Traditional = 20000,
    TCA_Taiwan = 20001,
    ETEN_Taiwan_Chinese_Traditional = 20002,
    IBM5550_Taiwan = 20003,
    TeleText_Taiwan = 20004,
    Wang_Taiwan = 20005,
    Western_European_IA5_IRV_International_Alphabet_5 = 20105,
    IA5_German_7_bit = 20106,
    IA5_Swedish_7_bit = 20107,
    IA5_Norwegian_7_bit = 20108,
    US_ASCII_7_bit = 20127,
    T_61 = 20261,
    ISO_6937_Non_Spacing_Accent = 20269,
    IBM_EBCDIC_Germany = 20273,
    IBM_EBCDIC_Denmark_Norway = 20277,
    IBM_EBCDIC_Finland_Sweden = 20278,
    IBM_EBCDIC_Italy = 20280,
    IBM_EBCDIC_Latin_America_Spain = 20284,
    IBM_EBCDIC_United_Kingdom = 20285,
    IBM_EBCDIC_Japanese_Katakana_Extended = 20290,
    IBM_EBCDIC_France = 20297,
    IBM_EBCDIC_Arabic = 20420,
    IBM_EBCDIC_Greek = 20423,
    IBM_EBCDIC_Hebrew = 20424,
    IBM_EBCDIC_Korean_Extended = 20833,
    IBM_EBCDIC_Thai = 20838,
    Russian_Cyrillic_KOI8_R = 20866,
    IBM_EBCDIC_Icelandic = 20871,
    IBM_EBCDIC_Cyrillic_Russian = 20880,
    IBM_EBCDIC_Turkish = 20905,
    IBM_EBCDIC_Latin_1_Open_System_1047_Euro_symbol = 20924,
    Japanese_JIS_0208_1990_and_0212_1990 = 20932,
    Simplified_Chinese_GB2312_80 = 20936,
    Korean_Wansung = 20949,
    IBM_EBCDIC_Cyrillic_Serbian_Bulgarian = 21025,
    Extended_Ext_Alpha_Lowercase = 21027,
    Ukrainian_Cyrillic_KOI8_U = 21866,
    ISO_8859_1_Latin_1_Western_European = 28591,
    ISO_8859_2_Latin_2_Central_European = 28592,
    ISO_8859_3_Latin_3 = 28593,
    ISO_8859_4_Baltic = 28594,
    ISO_8859_5_Cyrillic = 28595,
    ISO_8859_6_Arabic = 28596,
    ISO_8859_7_Greek = 28597,
    ISO_8859_8_Hebrew_ISO_Visual = 28598,
    ISO_8859_9_Turkish = 28599,
    ISO_8859_10_Latin_6 = 28600,
    ISO_8859_11_Latin_Thai = 28601,
    ISO_8859_13_Latin_7_Estonian = 28603,
    ISO_8859_14_Latin_8_Celtic = 28604,
    ISO_8859_15_Latin_9 = 28605,
    ISO_8859_15_Latin_10 = 28606,
    Europa_3 = 29001,
    ISO_8859_8_Hebrew_ISO_Logical = 38598,
    Atari_ST_TT = 47451,
    ISO_2022_JIS_Japanese_with_no_halfwidth_Katakana = 50220,
    ISO_2022_JIS_Japanese_with_halfwidth_Katakana = 50221,
    ISO_2022_Japanese_JIS_X_0201_1989_1_byte_Kana_SO_SI = 50222,
    ISO_2022_Korean = 50225,
    ISO_2022_Simplified_Chinese = 50227,
    EUC_Japanese = 51932,
    EUC_Simplified_Chinese = 51936,
    EUC_Korean = 51949,
    HZ_GB2312_Simplified_Chinese = 52936,
    GB18030_Simplified_Chinese_4_byte = 54936,
    ISCII_Devanagari = 57002,
    ISCII_Bengali = 57003,
    ISCII_Tamil = 57004,
    ISCII_Telugu = 57005,
    ISCII_Assamese = 57006,
    ISCII_Oriya = 57007,
    ISCII_Kannada = 57008,
    ISCII_Malayalam = 57009,
    ISCII_Gujarati = 57010,
    ISCII_Punjabi = 57011,
    Unicode_UTF_7 = 65000,
    Unicode_UTF_8 = 65001
}
export declare enum DuplexMode {
    Default = 0,
    Simplex = 1,
    DuplexLongEdge = 2,
    DuplexShortEdge = 3
}
export declare enum Sizing {
    None = 0,
    Fit = 1
}
export declare enum ScannerImageFormatOutput {
    JPG = 0,
    PNG = 1,
    TIFF = 2,
    PDF = 3
}
export declare enum PixelMode {
    Grayscale = 0,
    Color = 1,
    BlackAndWhite = 2
}
export declare enum FileSourceType {
    Base64 = 0,
    Text = 1,
    BLOB = 2,
    URL = 3,
    ExternalURL = 4
}
export declare enum WSStatus {
    Open = 0,
    Closed = 1,
    Blocked = 2,
    WaitingForUserResponse = 3
}
export declare enum PrintRotation {
    None = 0,
    Rot90 = 1,
    Rot180 = 2,
    Rot270 = 3
}
export declare enum TextAlignment {
    Left = 0,
    Center = 1,
    Right = 2,
    Justify = 3,
    None = 4
}
export declare enum PrintOrientation {
    Portrait = 0,
    Landscape = 1
}
export declare module Serial {
    enum Parity {
        None = 0,
        Odd = 1,
        Even = 2,
        Mark = 3,
        Space = 4
    }
    enum StopBits {
        One = 0,
        OnePointFive = 1,
        Two = 2
    }
    enum DataBits {
        Eight = 0,
        Seven = 1,
        Six = 2,
        Five = 3
    }
    enum Handshake {
        None = 0,
        RequestToSend = 1,
        RequestToSendXOnXOff = 2,
        XOnXOff = 3
    }
}
export declare enum PrinterIcon {
    None = 0,
    Small = 1,
    Large = 2,
    ExtraLarge = 3,
    Jumbo = 4
}
export declare enum Dither {
    Threshold = 0,
    FloydSteinberg = 1,
    Bayer4x4 = 2,
    Bayer8x8 = 3,
    Cluster6x6 = 4,
    Cluster8x8 = 5,
    Cluster16x16 = 6
}


export declare class JSPrintManager {
    static WS: NDWS | undefined;
    static auto_reconnect: boolean;
    private static _license;
    static start(secure?: boolean, host?: string, port?: number): Promise<void>;
    static get license_url(): string;
    static set license_url(value: string);
    static getPrinters(): Promise<unknown>;
    static getSessionCertificate(): Promise<unknown>;
    static getPrintersInfo(detail_level: PrintersInfoLevel, printer_name: string, printer_icon: PrinterIcon.None): Promise<unknown>;
    static get websocket_status(): WSStatus.Open | WSStatus;
    static showAbout(): Promise<any>;
    static updateClient(): Promise<any>;
    static getSystemFonts(): Promise<any>;
    static getSerialPorts(): Promise<any>;
    static getScanners(): Promise<any>;
    static onPrinterCreated(callback: any, error: any, detail_level?: PrintersInfoLevel): string;
    static onPrinterUpdated(callback: any, error: any, detail_level?: PrintersInfoLevel): string;
    static onPrinterDeleted(callback: any, error: any, detail_level?: PrintersInfoLevel): string;
    static unsubscribePrinterEvent(id: any): Promise<unknown>;
    static stop(): void;
    static getClientAppInfo(secure?: boolean, host?: string, port?: number): Promise<unknown>;
    static getMAC(): Promise<any>;
    static getDefaultPaperName(printer_name: string): Promise<any>;
    static getDefaultTrayName(printer_name: string): Promise<any>;
    static getPaperInfo(printer_name: string, paper_name: string): Promise<any>;
    static getPapers(printer_name: string): Promise<any>;
    static getTrays(printer_name: string): Promise<any>;
    static getInstances(secure?: boolean, host?: string, port?: number): Promise<unknown>;
    static getUser(): Promise<any>;
}

export declare class NDWS {
    private _ws;
    private _addr;
    private _port;
    private _secure;
    private _status;
    private _job_list;
    private _processing_message;
    get address(): string;
    get port(): number;
    get isSecure(): boolean;
    get status(): WSStatus;
    autoReconnect: boolean;
    onClose: (e: any) => void;
    onOpen: (e: any) => void;
    onStatusChanged: () => void;
    onError: (e: any) => never;
    constructor(addr?: string, port?: number, secure?: boolean, auto_reconnect?: boolean);
    private _onOpen;
    private _onMessage;
    private _onError;
    private _pingPong;
    private _onClose;
    private _genID;
    private _send;
    start(): Promise<void>;
    send(data: any, properties: any): string;
    stop(): void;
}

export interface IPrintFileProperties {
    file_type: PrintFileType;
    file_name: string | string[];
    file_content_type: FileSourceType;
    copies: number;
}
export interface IPrintFileDuplexableProperties extends IPrintFileProperties {
    manual_duplex: boolean;
    duplex_message: string;
    range: string;
    reverse: boolean;
}
export declare class PrintFile {
    fileContentType: FileSourceType;
    fileContent: any;
    fileName: string;
    private _copies;
    get copies(): number;
    set copies(value: number);
    private escapeInvalidFileNameChars;
    constructor(fileContent: any, fileContentType: FileSourceType, fileName: string, copies?: number);
    protected bool2str(value: any, true_val?: string, false_val?: string): string;
    getProperties(): IPrintFileProperties;
    protected isValidRange(range: string): boolean;
    protected _getBLOBContent(fileContentType: FileSourceType, fileContent: any): Promise<Blob>;
    getContent(): Promise<Blob>;
}
export declare class PrintFileDuplexable extends PrintFile {
    manualDuplexMessage: string;
    manualDuplex: boolean;
    printInReverseOrder: boolean;
    printRange: string;
    getContent(): Promise<Blob>;
}

interface IPrintFileDOCProperties extends IPrintFileDuplexableProperties {
    password: string;
}
export declare class PrintFileDOC extends PrintFileDuplexable {
    encryptedPassword: string;
    constructor(fileContent: any, fileContentType: FileSourceType, fileName: string, copies?: number);
    getProperties(): IPrintFileDOCProperties;
}

interface IPrintFileGroupProperties extends IPrintFileDuplexableProperties {
}
export declare class PrintFileGroup extends PrintFileDuplexable {
    fileContent: any;
    constructor(fileContent: PrintFile[], fileName?: string, copies?: number);
    getProperties(): IPrintFileGroupProperties;
    protected _getBLOBContent(): Promise<Blob>;
}

interface IPrintFilePDFProperties extends IPrintFileDuplexableProperties {
    grayscale: boolean;
    annotations: boolean;
    auto_rotate: boolean;
    auto_center: boolean;
    password: string;
    rotation: PrintRotation;
    sizing: Sizing;
}
export declare class PrintFilePDF extends PrintFileDuplexable {
    pageSizing: Sizing;
    printAutoRotate: boolean;
    printAutoCenter: boolean;
    encryptedPassword: string;
    printAsGrayscale: boolean;
    printAnnotations: boolean;
    printRotation: PrintRotation;
    constructor(fileContent: any, fileContentType: FileSourceType, fileName: string, copies?: number);
    getProperties(): IPrintFilePDFProperties;
}

interface IPrintFileTIFProperties extends IPrintFileDuplexableProperties {
    grayscale: boolean;
    auto_rotate: boolean;
    auto_center: boolean;
    rotation: PrintRotation;
    sizing: Sizing;
}
export declare class PrintFileTIF extends PrintFileDuplexable {
    printAutoRotate: boolean;
    printAutoCenter: boolean;
    printAsGrayscale: boolean;
    printRotation: PrintRotation;
    pageSizing: Sizing;
    constructor(fileContent: any, fileContentType: FileSourceType, fileName: string, copies?: number);
    isValidRange(range: string): boolean;
    getProperties(): IPrintFileTIFProperties;
}

interface IPrintFileTXTProperties extends IPrintFileDuplexableProperties {
    alignment: TextAlignment;
    font_name: String;
    font_size: number;
    bold: Boolean;
    italic: Boolean;
    underline: Boolean;
    strikethrough: Boolean;
    color: String;
    margin_left: number;
    margin_top: number;
    margin_right: number;
    margin_bottom: number;
    orientation: PrintOrientation;
}
export declare class PrintFileTXT extends PrintFileDuplexable {
    textContent: string;
    textAligment: TextAlignment;
    fontName: string;
    fontBold: boolean;
    fontItalic: boolean;
    fontUnderline: boolean;
    fontStrikethrough: boolean;
    fontSize: number;
    fontColor: string;
    printOrientation: PrintOrientation;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    constructor(fileContent: string, fileName: string, copies?: number, fileContentType?: FileSourceType);
    getProperties(): IPrintFileTXTProperties;
}

interface IPrintFileXLSProperties extends IPrintFileProperties {
    from_page: number;
    to_page: number;
    password: string;
}
export declare class PrintFileXLS extends PrintFile {
    encryptedPassword: string;
    pageFrom: number;
    pageTo: number;
    constructor(fileContent: any, fileContentType: FileSourceType, fileName: string, copies?: number);
    getProperties(): IPrintFileXLSProperties;
    getContent(): Promise<Blob>;
}

export declare class SerialComm {
    private _id;
    private _isOpen;
    private _port;
    private _baud_rate;
    private _parity;
    private _stop_bits;
    private _data_bits;
    private _flow_control;
    private _updated_values;
    SERIAL_TIMEOUT: number;
    get portName(): string;
    set portName(value: string);
    get isOpen(): Boolean;
    get baudRate(): number;
    set baudRate(value: number);
    get parity(): Serial.Parity;
    set parity(value: Serial.Parity);
    get stopBits(): Serial.StopBits;
    set stopBits(value: Serial.StopBits);
    get dataBits(): Serial.DataBits;
    set dataBits(value: Serial.DataBits);
    get flowControl(): Serial.Handshake;
    set flowControl(value: Serial.Handshake);
    get dsr(): Promise<boolean>;
    get cts(): Promise<boolean>;
    set rts(value: boolean);
    set dtr(value: boolean);
    constructor(portName: string, baudRate: number, parity: Serial.Parity, stopBits: Serial.StopBits, dataBits: Serial.DataBits, flowControl: Serial.Handshake);
    onError(data: any, critical: any): void;
    onDataReceived(data: any): void;
    private _onDataReceived;
    onClose(data: any): void;
    open(): Promise<unknown>;
    send(utf8string: string): void;
    close(): void;
    propertiesJSON(): {
        type: string;
    };
}

export declare class TcpComm {
    private _id;
    private _address;
    private _port;
    private _timeout;
    private _receiveBufferSize;
    get timeout(): number;
    set timeout(value: number);
    get receiveBufferSize(): number;
    set receiveBufferSize(value: number);
    constructor(address: string, port: number);
    onError(data: any, critical: any): void;
    onDataReceived(data: any): void;
    private _onDataReceived;
    onClose(data: any): void;
    connect(): Promise<unknown>;
    send(utf8string: string): void;
    close(): void;
    propertiesJSON(): {
        type: string;
    };
}

export declare const VERSION = "5.0";
export declare const WSPORT = 25443;
export declare class Mutex {
    private mutex;
    lock(): PromiseLike<() => void>;
}
export declare class Utils {
    static _intToByteArray(number: number): Uint8Array;
    static _str2UTF8Array(str: string): number[];
}
