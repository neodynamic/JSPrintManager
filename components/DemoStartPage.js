class DemoStartPage extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-barcode iconDemo" />&nbsp;Raw Data Printing
                        </h2>
                        <p>
                            Send any raw data &amp; commands supported by the client printer like <strong>Epson ESC/POS, HP PCL, PostScript, Zebra ZPL and Eltron EPL, and more!</strong>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(1)}>
                            TRY NOW
                        </button>
                    </div>
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-file-image-o iconDemo" />&nbsp;Print Images &amp; Docs
                        </h2>
                        <p>
                            Print known file formats like <strong>PDF, TXT, DOC/x, XLS/x, JPG, PNG, and more! </strong> <span className="badge badge-info">NEW!</span> <strong>Print Job Status & Trace</strong> now available!
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(3)}>
                            TRY NOW
                        </button>
                    </div>
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-file-pdf-o iconDemo" />&nbsp;Advanced PDF Printing
                        </h2>
                        <p>
                            Print <strong>PDF</strong> files specifying advanced settings like <strong>tray, paper source, print rotation, duplex printing, pages range and more!</strong>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(2)}>
                            TRY NOW
                        </button>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-file-word-o iconDemo" />&nbsp;Advanced DOC/x Printing
                        </h2>
                        <p>
                            Print <strong>DOC</strong> files specifying advanced settings like <strong>duplex printing, pages range, print in reverse and more!</strong> <span className="badge badge-info">Windows Only</span>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(7)}>
                            TRY NOW
                        </button>
                    </div>

                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-file-excel-o iconDemo" />&nbsp;Advanced XLS/x Printing
                        </h2>
                        <p>
                            Print <strong>XLS</strong> files specifying advanced settings like <strong>pages range (From - To) and more!</strong> <span className="badge badge-info">Windows Only</span>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(8)}>
                            TRY NOW
                        </button>
                    </div>

                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-file-text-o iconDemo" />&nbsp;Advanced TXT Printing
                        </h2>
                        <p>
                            Print <strong>TXT</strong> files or <strong>just plain text</strong> including settings like <strong>Font (name, size, style)</strong>, <strong>Text Color</strong>, <strong>Text Alignments (left, center, right, justify)</strong> , <strong>Print Orientation</strong>, and more!
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(5)}>
                            TRY NOW
                        </button>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-files-o iconDemo" />&nbsp;Advanced TIF Printing
                        </h2>
                        <p>
                            Print <strong>Multipage TIF</strong> files specifying advanced settings like <strong>tray, paper source, print rotation, duplex printing, pages range and more!</strong>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(13)}>
                            TRY NOW
                        </button>
                    </div>

                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-files-o iconDemo" />&nbsp;Print File Group
                        </h2>
                        <p>
                            Print a <strong>Group of Files</strong> as they were part of a single multipage document with advanced settings like <strong>tray, paper source, duplex printing, pages range and more!</strong>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(14)}>
                            TRY NOW
                        </button>
                    </div>

                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-key iconDemo" />&nbsp;Print Password Protected Files
                        </h2>
                        <p>
                            <strong>Print Password Protected PDF <span className="badge badge-success">All OSes</span>, DOC/x & XLS/x <span className="badge badge-info">Windows Only</span> files!</strong>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(12)}>
                            TRY NOW
                        </button>
                    </div>
                </div>
                <br />
                <div className="row">
                    

                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-arrows-alt iconDemo" />&nbsp;Print Multiple Jobs in one shot!
                        </h2>
                        <p>
                            <strong>Print multiple jobs to the same or different printers in one shot!</strong>&nbsp; You can mix Raw commands and Known File Formats!
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(4)}>
                            TRY NOW
                        </button>
                    </div>
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-crosshairs iconDemo" />&nbsp;Scan Docs &amp; Images
                        </h2>
                        <p>
                            <strong>Scan docs &amp; images</strong>
                            &nbsp;specifying settings like&nbsp;
                            <strong>DPI Resolution, Pixel Mode (Grayscale &amp; Color), and Output Image Format (JPG &amp; PNG)!</strong>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(9)}>
                            TRY NOW
                        </button>
                    </div>
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-exchange iconDemo" />&nbsp;BIDI Serial Comm
                        </h2>
                        <p>
                            Bidirectional Serial Port Communication support! <strong>Send/Write &amp; Receive/Read</strong> data strings to any <strong>RS-232, COM &amp; TTY</strong> port available on client system.
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(10)}>
                            TRY NOW
                        </button>
                    </div>
                </div>

                <br />
                <div className="row">
                    
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-print iconDemo" />&nbsp;Get Printers Info
                        </h2>
                        <p>
                            Get the <strong>list of installed printers</strong> available in the client machine including details like <strong>DPI Resolution, PortName, "Is Connected", "Is Shared", "Is Local", "Is Network"</strong> , as well as the <strong>list of supported Papers and list of trays/bins!</strong>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(6)}>
                            TRY NOW
                        </button>
                    </div>
                    <div className="col-sm-4">
                        <h2>
                            <i className="fa fa-eye iconDemo" />&nbsp;Printers Watcher
                        </h2>
                        <p>
                            Detect when a <strong>new printer</strong> is added, when a printer is <strong>removed/deleted</strong>, and when <strong>any changes or modifications</strong> are done on any printers available at the client machine. <span className="badge badge-info">Windows Only</span>
                        </p>
                        <button className="btn btn-danger" onClick={() => this.props.setSample(11)}>
                            TRY NOW
                        </button>
                    </div>
                    <div className="col-sm-4">
                       
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-sm-12">
                        <h2>
                            <i className="fa fa-mixcloud iconDemo" />&nbsp;Print from Mobile &amp; Sandboxed Devices
                        </h2>
                        <p>
                            Printing from clients such as <strong>mobile/sandboxed devices (running iOS, Android, ChromeOS...)</strong> and <strong>Terminal Services/Citrix environments</strong> is possible with <strong>JSPrintManager in Print Server Mode</strong>,
                        </p>
                        <a className="btn btn-danger" href="https://www.neodynamic.com/articles/How-to-print-raw-commands-pdf-files-from-iOS-Android-ChromeOS-sandboxed-devices-from-Javascript" target="_blank">
                            Learn how to do it...
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

window.DemoStartPage = DemoStartPage;
