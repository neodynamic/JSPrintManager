class Printers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPrinterIndex: 0,
            clientPrinter: null,
            installedPrinters: [],
            printerName: "",
            printerNetworkIp: "",
            printerNetworkPort: 0,
            printerNetworkDns: "",
            printerLptPort: "",
            printerSerialPort: "",
            printerSerialPortBaudRate: 0,
            printerSerialPortParity: 0,
            printerSerialPortStopBit: 0,
            printerSerialPortDataBits: 0,
            printerSerialPortFlowControl: 0
        };
    }

    setInstalledPrinters(printersList) {
        //no need to re-render
        this.state.installedPrinters = printersList;
        this.state.printerName = printersList[0];
        this.updateClientPrinter();
    }

    setPrinterState(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.state[event.target.name] = event.target.value;
        this.updateClientPrinter();
    }

    updateClientPrinter() {
        //no need to re-render
        if (this.state.selectedPrinterIndex == 0) {
            this.state.clientPrinter = new JSPM.DefaultPrinter();
        } else if (this.state.selectedPrinterIndex == 1) {
            this.state.clientPrinter = new JSPM.UserSelectedPrinter();
        } else if (this.state.selectedPrinterIndex == 2) {
            this.state.clientPrinter = new JSPM.InstalledPrinter(
              this.state.printerName
            );
        } else if (this.state.selectedPrinterIndex == 3) {
            this.state.clientPrinter = new JSPM.NetworkPrinter(
              this.state.printerNetworkPort,
              this.state.printerNetworkIp,
              this.state.printerNetworkDns
            );
        } else if (this.state.selectedPrinterIndex == 4) {
            this.state.clientPrinter = new JSPM.ParallelPortPrinter(
              this.state.printerLptPort
            );
        } else if (this.state.selectedPrinterIndex == 5) {
            this.state.clientPrinter = new JSPM.SerialPortPrinter(
              this.state.printerSerialPort,
              this.state.printerSerialPortBaudRate,
              this.state.printerSerialPortParity,
              this.state.printerSerialPortStopBits,
              this.state.printerSerialPortDataBits,
              this.state.printerSerialPortFlowControl
            );
        }
        this.props.onPrinterChange(this.state.clientPrinter);
    }

    componentDidMount() {
        //get client installed printers
        JSPM.JSPrintManager.Caller = this;
        JSPM.JSPrintManager.getPrinters().then(function(printersList) {
            JSPM.JSPrintManager.Caller.setInstalledPrinters(printersList);
        });
    }

    render() {
        let netPrinter =
          this.props.JobContentType == 0 ? (
            <option value="3">Use an IP/Ethernet Printer</option>
        ) : (
          ""
        );
        let lptPrinter =
          this.props.JobContentType == 0 ? (
            <option value="4">Use a Parallel LPT Port</option>
        ) : (
          ""
        );
        let rs232Printer =
          this.props.JobContentType == 0 ? (
            <option value="5">Use a Serial (RS232) Port</option>
        ) : (
          ""
        );

        let printerSettings = (
          <div>The Printer set as Default in this machine will be used.</div>
      );

        if (this.state.selectedPrinterIndex == 1) {
            printerSettings = (
              <div>
                The OS Printer Dialog will be displayed at printing time!
              </div>
          );
        } else if (this.state.selectedPrinterIndex == 2) {
            let items = this.state.installedPrinters;
            printerSettings = (
              <div>
                Installed Printers
                <select
            className="form-control form-control-sm"
            name="printerName"
            onChange={this.setPrinterState.bind(this)}
          >
            {items.map(function(i) {
                let opt = (
                  <option key={i} value={i}>
                  {i}
                </option>
                  );
            return opt;
        })}
                </select>
              </div>
            );
                } else if (
                  this.state.selectedPrinterIndex == 3 &&
                  this.props.JobContentType == 0
                ) {
                    printerSettings = (
                      <div>
                        <label>
                          IP
                          <input
                            className="form-control form-control-sm"
                          name="printerNetworkIp"
                          onChange={this.setPrinterState.bind(this)}
                  />
                </label>
                <label>
                  Port
                  <input
                    className="form-control form-control-sm"
                    name="printerNetworkPort"
                    onChange={this.setPrinterState.bind(this)}
                  />
                    </label>
                    <label>
                      DNS Name
                      <input
                    className="form-control form-control-sm"
                    name="printerNetworkDns"
                    onChange={this.setPrinterState.bind(this)}
                  />
                </label>
              </div>
            );
                } else if (
                  this.state.selectedPrinterIndex == 4 &&
                  this.props.JobContentType == 0
                ) {
                    printerSettings = (
                      <div>
                        <label>
                          LPT Port
                          <input
                    className="form-control form-control-sm"
                    name="printerLptPort"
                    onChange={this.setPrinterState.bind(this)}
                  />
                </label>
              </div>
                  );
                } else if (
                  this.state.selectedPrinterIndex == 5 &&
                  this.props.JobContentType == 0
                ) {
                    printerSettings = (
                      <div>
                        <label>
                          Serial Port
                          <input
                    className="form-control form-control-sm"
                    name="printerSerialPort"
                    onChange={this.setPrinterState.bind(this)}
                  />
                </label>
                <label>
                  Baud Rate
                  <input
                    className="form-control form-control-sm"
                    name="printerSerialPortBaudRate"
                    onChange={this.setPrinterState.bind(this)}
                  />
                </label>
                <label>
                  Data Bits
                  <input
                    className="form-control form-control-sm"
                    name="printerSerialPortDataBits"
                    onChange={this.setPrinterState.bind(this)}
                  />
                </label>
                <label>
                  Parity
                  <select
                    className="form-control form-control-sm"
                    name="printerSerialPortParity"
                    onChange={this.setPrinterState.bind(this)}
                  >
                    <option value="0">None</option>
                    <option value="1">Odd</option>
                    <option value="2">Even</option>
                    <option value="3">Mark</option>
                    <option value="4">Space</option>
                  </select>
                </label>
                <label>
                  Stop bits
                  <select
                    className="form-control form-control-sm"
                    name="printerSerialPortStopBits"
                    onChange={this.setPrinterState.bind(this)}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="3">1.5</option>
                    <option value="2">2</option>
                  </select>
                </label>
                <label>
                  Flow control
                  <select
                    className="form-control form-control-sm"
                    name="printerSerialPortFlowControl"
                    onChange={this.setPrinterState.bind(this)}
                  >
                    <option value="0">None</option>
                    <option value="3">XOnXOff</option>
                    <option value="1">RTS (Request to send)</option>
                    <option value="2">RTS XOnXOff</option>
                  </select>
                </label>
              </div>
                  );
                }

    return (
      <div className="col-md-12">
        <strong>Client Printer</strong>
        <select
          required
          className="form-control form-control-sm"
          name="selectedPrinterIndex"
          onChange={this.setPrinterState.bind(this)}
        >
          <option value="0">Default Printer</option>
          <option value="1">
            Select one through the OS Printer Dialog
          </option>
          <option value="2">Select an Installed Printer</option>
        {netPrinter}
        {lptPrinter}
        {rs232Printer}
        </select>
        <br />
        <div className="small alert alert-warning">{printerSettings}</div>
      </div>
    );
    }
}

window.Printers = Printers;