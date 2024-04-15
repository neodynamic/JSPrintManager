class ClientInfo extends React.Component {
    render() {
        let cInfo = this.props.JSPM_Client_Info;
        let deviceId = this.props.JSPM_Device_Id;

        return (            
            <span>
                <span className="badge badge-secondary">Client App Info</span>&nbsp;<small>{cInfo}</small>&nbsp;<span className="badge badge-secondary">Device ID:</span>&nbsp;<small>{deviceId}</small>
            </span>
        );
    }
}

window.ClientInfo = ClientInfo;
