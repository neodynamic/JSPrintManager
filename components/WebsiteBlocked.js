class WebsiteBlocked extends React.Component {
    render() {
        return (
            <div>
                <h2>This site is blocked!</h2>
                <hr />
                This website is
                <strong>blocked and cannot print through JSPrintManager</strong>
                <br />
                <br />
            </div>
        );
    }
}

window.WebsiteBlocked = WebsiteBlocked;
