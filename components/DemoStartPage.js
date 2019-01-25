class DemoStartPage extends React.Component {
    render() {
        return (
          <div>
            <h1 className="text-center">Available Demos</h1>
            <hr />
            <div className="row">
              <div className="col-sm-6">
                <h2>
                  <i className="fa fa-barcode" />&nbsp;Raw Data Printing
                </h2>
                <p>
                  Send any raw data &amp; commands supported by the client
        printer like{" "}
        <strong>
          Epson ESC/POS, HP PCL, PostScript, Zebra ZPL and Eltron
        EPL, and more!
      </strong>
    </p>
    <button
        className="btn btn-lg btn-info"
        onClick={() => this.props.setSample(1)}
      >
        Try it now...
      </button>
    </div>
    <div className="col-sm-6">
      <h2>
        <i className="fa fa-file-pdf-o" />&nbsp;Advanced PDF
        Printing
      </h2>
      <p>
        Print <strong>PDF</strong> files{" "}
        <strong>
          without requiring Adobe Reader or any other external
        software!
      </strong>{" "}
        Advanced PDF Printing settings include{" "}
        <strong>Tray Name</strong>, <strong>Paper Size</strong>,{" "}
                    <strong>Print Rotation</strong>,{" "}
                    <strong>Pages Range</strong>, and more!
                  </p>
                  <button
                    className="btn btn-lg btn-info"
                    onClick={() => this.props.setSample(2)}
                  >
    Try it now...
  </button>
</div>
</div>
<br />
<div className="row">
<div className="col-sm-6">
  <h2>
    <i className="fa fa-file-image-o" />&nbsp;Print Images &amp;
    Docs
  </h2>
  <p>
    In addition to print raw commands, you can also print known
    file formats like{" "}
    <strong>PDF, TXT, DOC/x, XLS/x, JPG, PNG, and more!</strong>{" "}
        PDF, TXT, PNG, JPG and BMP are natively supported; others
        will require external software like Word, Excel,
        LibreOffice, etc.
      </p>
      <button
        className="btn btn-lg btn-info"
        onClick={() => this.props.setSample(3)}
      >
        Try it now...
      </button>
    </div>
    <div className="col-sm-6">
      <h2>
        <i className="fa fa-barcode" />+
        <i className="fa fa-file-text" />&nbsp;Print Multiple Jobs
        in one shot!
      </h2>
      <p>
        <strong>
          Print multiple jobs to the same or different printers in
          one shot!
        </strong>{" "}
        You can mix Raw commands and Known File Formats!
      </p>
      <button
        className="btn btn-lg btn-info"
        onClick={() => this.props.setSample(4)}
      >
        Try it now...
      </button>
    </div>
  </div>
  <br />
  <div className="row">
    <div className="col-sm-6">
      <h2>
        <i className="fa fa-file-text-o" />&nbsp;Advanced TXT
        Printing
      </h2>
      <p>
        Print <strong>TXT</strong> files or{" "}
        <strong>just plain text</strong> including settings like{" "}
        <strong>Font (name, size, style)</strong>,{" "}
        <strong>Text Color</strong>,{" "}
        <strong>
          Text Alignments (left, center, right, justify)
        </strong>
        , <strong>Print Orientation</strong>, and more!
      </p>
      <button
        className="btn btn-lg btn-info"
        onClick={() => this.props.setSample(5)}
      >
        Try it now...
      </button>
    </div>
    <div className="col-sm-6">
      <h2>
        <i className="fa fa-print" />&nbsp;Get Printers Info
      </h2>
      <p>
        Get the <strong>list of installed printers</strong>{" "}
        available in the client machine including details like{" "}
        <strong>
          DPI Resolution, PortName, "Is Connected", "Is Shared", "Is
        Local", "Is Network"
      </strong>
      , as well as the{" "}
        <strong>
          list of supported Papers and list of trays/bins!
        </strong>
      </p>
      <button
        className="btn btn-lg btn-info"
        onClick={() => this.props.setSample(6)}
      >
        Try it now...
      </button>
    </div>
  </div>
  <hr />
  <div className="row">
    <div className="col-sm-12">
      <h2>
        <i className="fa fa-mixcloud" />&nbsp;Print from Mobile
        &amp; Sandboxed Devices
      </h2>
      <p>
        Printing from clients such as{" "}
        <strong>
          mobile/sandboxed devices (running iOS, Android,
          ChromeOS...)
        </strong>{" "}
        and <strong>Terminal Services/Citrix environments</strong>{" "}
        is possible with{" "}
        <strong>JSPrintManager in Print Server Mode</strong>,
      </p>
      <a
        className="btn btn-lg btn-info"
        href="https://www.neodynamic.com/articles/How-to-print-raw-commands-pdf-files-from-iOS-Android-ChromeOS-sandboxed-devices-from-Javascript"
        target="_blank"
      >
        Learn how to do it...
  </a>
</div>
</div>
</div>
);
    }
}

window.DemoStartPage = DemoStartPage;