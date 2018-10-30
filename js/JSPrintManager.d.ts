declare namespace JSPM {
    class ClientPrintJob {
        private _clientPrinter;
        clientPrinter: IClientPrinter;
        private _printerCommandsCopies;
        printerCommandsCopies: number;
        private _printerCommands;
        printerCommands: string;
        private _binaryPrinterCommands;
        binaryPrinterCommands: Uint8Array;
        private _printFileGroup;
        readonly files: PrintFile[];
        sendToClient(): Promise<{}>;
        _intToByteArray(number: number): Uint8Array;
        _genPFGArrayAsync(printFileGroup: PrintFile[]): Promise<Uint8Array>;
        _genPCArrayAsync(printerCommands: string, binPrinterCommands: Uint8Array, printerCopies: number): Promise<Uint8Array>;
        _str2UTF8Array(str: string): number[];
        _genPrinterArrayAsync(clientPrinter: IClientPrinter): Promise<Uint8Array>;
        _generateDataAsync(): Promise<Uint8Array>;
    }
}
declare namespace JSPM {
    class ClientPrintJobGroup {
        _jobs: ClientPrintJob[];
        readonly jobs: ClientPrintJob[];
        sendToClient(): Promise<{}>;
        private _generateMiniJob(cj);
        private _generateDataAsync();
        private _intToArray(number);
    }
}
declare namespace JSPM {
    interface IClientPrinter {
        Id: any;
        serialize(): any;
    }
    class DefaultPrinter implements IClientPrinter {
        Id: string;
        serialize(): string;
    }
    class InstalledPrinter implements IClientPrinter {
        Id: string;
        private _printerName;
        printerName: string;
        private _printToDefaultIfNotFound;
        printToDefaultIfNotFound: boolean;
        constructor(printerName: string, printToDefaultIfNotFound?: boolean);
        serialize(): string;
    }
    class ParallelPortPrinter implements IClientPrinter {
        Id: string;
        private _parallelPortName;
        portName: string;
        constructor(portName: string);
        serialize(): string;
    }
    class SerialPortPrinter implements IClientPrinter {
        Id: string;
        private _serialPortName;
        private _serialPortBaudRate;
        private _serialPortParity;
        private _serialPortStopBits;
        private _serialPortDataBits;
        private _serialPortFlowControl;
        portName: string;
        baudRate: number;
        parity: Serial.Parity;
        stopBits: Serial.StopBits;
        dataBits: number;
        flowControl: Serial.Handshake;
        constructor(portName: string, baudRate: number, parity: Serial.Parity, stopBits: Serial.StopBits, dataBits: number, flowControl: Serial.Handshake);
        serialize(): string;
    }
    class NetworkPrinter implements IClientPrinter {
        Id: number;
        private _networkIPAddress;
        private _networkPort;
        private _dnsName;
        dnsName: string;
        ipAddress: string;
        port: number;
        constructor(port: number, ipAddress?: string, dnsName?: string);
        serialize(): string;
    }
    class UserSelectedPrinter implements IClientPrinter {
        Id: string;
        serialize(): string;
    }
}
declare namespace JSPM {
    enum FileSourceType {
        Base64 = 0,
        Text = 1,
        BLOB = 2,
        URL = 3,
    }
    enum WSStatus {
        Open = 0,
        Closed = 1,
        BlackListed = 2,
    }
}
declare namespace JSPM.Serial {
    enum Parity {
        None = 0,
        Odd = 1,
        Even = 2,
        Mark = 3,
        Space = 4,
    }
    enum StopBits {
        None = 0,
        One = 1,
        Two = 2,
        OnePointFive = 3,
    }
    enum Handshake {
        None = 0,
        RequestToSend = 1,
        RequestToSendXOnXOff = 2,
        XOnXOff = 3,
    }
}
declare namespace JSPM {
    class JSPrintManager {
        protected static WS: WebSocket;
        private static _ws_status;
        private static _thread_busy;
        private static _saved_port;
        private static _saved_secure;
        private static LockThread();
        private static UnlockThread();
        static auto_reconnect: boolean;
        static onClose: (e: any) => void;
        static onOpen: (e: any) => void;
        static _onClose(e: any): void;
        static _onOpen(e: any): void;
        static start(secure?: boolean, port?: number): Promise<{}>;
        private static _start(times, secure, port);
        static getPrinters(): Promise<{}>;
        static readonly websocket_status: WSStatus;
        static showAbout(): Promise<any>;
        static updateClient(): Promise<any>;
        static send(data: any): Promise<any>;
        static stop(): void;
    }
}
declare namespace JSPM {
    class PrintFile {
        fileContentType: FileSourceType;
        fileContent: any;
        fileName: string;
        private _copies;
        copies: number;
        constructor(fileContent: any, fileContentType: FileSourceType, fileName: string, copies?: number);
        private escapeInvalidFileNameChars();
    }
}
