class InstallJSPMClientApp extends React.Component {
    render() {
        return (
            <div>
                <h2>Download &amp; Install JSPM Client App</h2>
                <hr />
                It seems that <strong>JSPM Client App is not installed or not running</strong> in this machine!
                <br />
                <br />
                <strong>JSPM Client App</strong> is a small utility (
                <strong>
                    <em>without any dependencies</em>
                </strong>
                ) that handles all the <strong>Print Jobs</strong> and runs on <strong>Windows, Linux, Mac &amp; Raspberry Pi</strong> devices!
                <br />
                <br />
                <div className="text-center">
                    <a href="//neodynamic.com/downloads/jspm" target="_blank" className="btn btn-lg btn-primary center">
                        <i className="fa fa-download" /> Download JSPM Client App...
                    </a>
                </div>
                <br />
                <div className="alert alert-warning">
                    <i className="fa fa-exclamation-circle" /> Browser needs to be restarted after package installation! Firefox-based browser must be closed (all open instances) before installing JSPM utility.
                </div>
            </div>
        );
    }
}

window.InstallJSPMClientApp = InstallJSPMClientApp;
