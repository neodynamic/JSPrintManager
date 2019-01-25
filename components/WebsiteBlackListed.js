class WebsiteBlackListed extends React.Component {
    render() {
        return (
          <div>
            <h2>This site is blacklisted!</h2>
            <hr />
            This website is
        <strong>
          Blacklisted and cannot print through JSPrintManager
        </strong>
        <br />
        <br />
      </div>
      );
    }
}

window.WebsiteBlackListed = WebsiteBlackListed;