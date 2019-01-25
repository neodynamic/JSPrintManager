class PrintJobForFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printFiles: null
        };
    }


    setPrintFiles(event) {
        //no need to re-render
        if (event.target.name == "input-local-files")
            this.state.printFiles = Array.from(event.target.files);
        else this.state.printFiles = [event.target.value];
        this.props.onPrintFilesChange(this.state.printFiles);
    }

    render() {
        return (
          <div className="col-md-12">
            <hr />
            <strong>Select the File(s) to print</strong>
            <div className="alert alert-warning">
              <small>
                Remember to check if you meet the requeriments before printing
        files!&nbsp;
        <a
        data-toggle="modal"
        data-target="#files-requirements-dialog"
        href=""
      >
        <strong>Check them here...</strong>
      </a>
    </small>
  </div>
  <ul
        className="nav nav-tabs"
        id={"myTab-" + this.props.jobIndex}
        role="tablist"
      >
        <li className="nav-item">
          <a
        className="nav-link active"
        id={"local-files-tab-" + this.props.jobIndex}
        data-toggle="tab"
        href={"#local-files-" + this.props.jobIndex}
        role="tab"
        aria-controls={"local-files-" + this.props.jobIndex}
        aria-selected="true"
      >
        Local Files
      </a>
    </li>
    <li className="nav-item">
      <a
        className="nav-link"
        id={"remote-file-tab-" + this.props.jobIndex}
        data-toggle="tab"
        href={"#remote-file-" + this.props.jobIndex}
        role="tab"
        aria-controls={"remote-file-" + this.props.jobIndex}
        aria-selected="false"
      >
        File from URL
      </a>
    </li>
  </ul>
  <div
        className="tab-content"
        id={"myTabContent-" + this.props.jobIndex}
      >
        <div
        className="tab-pane fade show active"
        id={"local-files-" + this.props.jobIndex}
        role="tabpanel"
        aria-labelledby={"local-files-tab-" + this.props.jobIndex}
      >
        <br />
        <input
        name="input-local-files"
        type="file"
        multiple="multiple"
        className="form-control-file"
        onChange={this.setPrintFiles.bind(this)}
      />
    </div>
    <div
        className="tab-pane fade"
        id={"remote-file-" + this.props.jobIndex}
        role="tabpanel"
        aria-labelledby={"remote-file-tab-" + this.props.jobIndex}
      >
        <br />
        URL File <strong>must include file extension!</strong>
        <input
        name="input-file-url"
        className="form-control form-control-sm"
        onChange={this.setPrintFiles.bind(this)}
      />
    </div>
  </div>
</div>
      );
    }
}

window.PrintJobForFiles = PrintJobForFiles;