class PrintJobForRawCommands extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printerCommands: "",
            printerCommandsCodePage: -1
        };
    }

    setPrinterCommands(cmds) {
        this.state.printerCommands = cmds;
        this.props.onPrinterCommandsChange(this.state.printerCommands);
    }

    setPrinterCommandsCodePage(codepage) {
        this.state.printerCommandsCodePage = codepage;
        this.props.onPrinterCommandsCodePageChange(this.state.printerCommandsCodePage);
    }

    setPredefinedCommands(cmdId) {
        let cmds = "";
        if (cmdId == "zpl") cmds = "^XA^FO30,40^ADN,36,20^FDZPL Printed from JSPrintManager^FS^FO30,70^BY4^B3N,,200^FD12345678^FS^XZ";
        else if (cmdId == "epl") cmds = '\x0AN\x0AQ609,24\x0Aq784\x0AA170,5,0,1,5,5,N,"EPL Printed from JSPrintManager"\x0AB170,50,0,3C,2,6,120,B,"BCP-1234"\x0AP1\x0A';
        else if (cmdId == "escpos") cmds = "\x1b@\x1bE\x01ESC POS Printed from JSPrintManager\x1bd\x01\x1dk\x04987654321\x00\x1bd\x01987654321\x1dV\x41\x03";
        else if (cmdId == "ipl") cmds = "<STX><ESC>C<ETX><STX><ESC>P<ETX><STX>E4;F4<ETX><STX>H0;o200,100;f0;c25;h20;w20;d0,30<ETX><STX>L1;o200,150;f0;l575;w5<ETX><STX>B2;o200,200;c0,0;h100;w2;i1;d0,10<ETX><STX>I2;h1;w1;c20<ETX><STX>R<ETX><STX><ESC>E4<ETX><STX><CAN><ETX><STX>IPL Printed from JSPrintManager<CR><ETX><STX>SAMPLE<ETX><STX><ETB><ETX>";
        else if (cmdId == "dpl") cmds = "\x02L\x0dH07\x0dD11\x0d191100801000025DPL Printed from JSPrintManager\x0d1a6210000000050590PCS\x0dE\x0d";

        document.getElementById("cmds-" + this.props.jobIndex).value = cmds;
        this.setPrinterCommands(cmds);
    }

    render() {

        let codepages = [];
        for (let item in JSPM.Encoding) {
            if (isNaN(Number(item))) {
                codepages.push(<option key={JSPM.Encoding[item]} value={JSPM.Encoding[item]}>{JSPM.Encoding[item]} » {item}</option>);  
            }
        }

        return (
            <div className="col-md-12">
                <hr />
                <strong>Enter the raw printer commands</strong>
                <div className="alert alert-warning">
                    <small>
                        Enter the printer's commands you want to send and is supported by the specified printer (e.g. ESC/POS, ZPL, EPL, etc).
                        <br />
                        For non-printable characters, use the JS hex notation (e.g. \x0D for carriage return, \x1B for ESC)
                        <br />
                        <strong>Refer to your target printer programming manual to know how to write the raw commands!</strong>
                    </small>
                </div>
                <div>
                    <small>
                        <strong>Predefined Samples:</strong>
                    </small>
                    &nbsp;&nbsp;
                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedCommands("zpl")}>
                        <i className="fa fa-arrow-circle-down" /> Zebra ZPL
                    </button>
                    &nbsp;&nbsp;
                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedCommands("epl")}>
                        <i className="fa fa-arrow-circle-down" /> Zebra EPL
                    </button>
                    &nbsp;&nbsp;
                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedCommands("escpos")}>
                        <i className="fa fa-arrow-circle-down" /> EPSON ESC/POS
                    </button>
                    &nbsp;&nbsp;
                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedCommands("ipl")}>
                        <i className="fa fa-arrow-circle-down" /> Intermec IPL
                    </button>
                    &nbsp;&nbsp;
                    <button type="button" className="btn btn-light btn-sm" onClick={e => this.setPredefinedCommands("dpl")}>
                        <i className="fa fa-arrow-circle-down" /> Datamax DPL
                    </button>
                </div>
                <textarea id={"cmds-" + this.props.jobIndex} className="form-control form-control-sm text-monospace" onChange={e => this.setPrinterCommands(e.target.value)} />
                <br />
                <label><strong>Commands CodePage/Encoding:</strong></label>
                <select id={"cmds-encoding-" + this.props.jobIndex} className="form-control form-control-sm" onChange={e => this.setPrinterCommandsCodePage(e.target.value)}>
                    {codepages}
                </select>
            </div>
        );
    }
}

window.PrintJobForRawCommands = PrintJobForRawCommands;
