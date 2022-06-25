class JSPMStatus extends React.Component {
    render() {
        let jspm_status;
        if (this.props.JSPM_WS_Status == "Open")
            jspm_status = (
                <span className="badge badge-success">
                    <i className="fa fa-check" /> Open
                </span>
            );
    else if (this.props.JSPM_WS_Status == "Closed")
        jspm_status = (
            <span className="badge badge-danger">
                <i className="fa fa-exclamation-circle" /> Closed!
            </span>
            );
    else if (this.props.JSPM_WS_Status == "Blocked")
        jspm_status = (
            <span className="badge badge-warning">
                <i className="fa fa-times-circle" /> This Website is Blocked!
            </span>
            );
    else
            jspm_status = (
                <span className="badge badge-warning">
                    <i className="fa fa-user-circle" /> Waiting for user response...
                </span>
            );


        let jspm_port = this.props.JSPM_WS_Port == 25443 ? "" : (<span style={{fontSize: '1.3em'}} className="badge badge-light">
                        <i className="icon fa fa-tag"></i> WHITE LABEL PORT <span className="badge badge-dark">{this.props.JSPM_WS_Port}</span>
                </span>);

        return (
            <span>
                {jspm_port}
                <span className="jspmStatus">
                    <strong>JSPM</strong> WebSocket Status {jspm_status}
                </span>
            </span>
        );
    }
}

window.JSPMStatus = JSPMStatus;
