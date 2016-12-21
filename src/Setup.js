import React from 'react'

class Setup extends React.Component {
  render () {
    return (
    <div className="Setup">
      <div className="App-header">
        <h2>Welcome to Connector Health Monitor Setup</h2>
      </div>
      <div className="content">
        <h2>Installing Health Agent</h2>
        <p>Agent installs in seconds...</p>

        <pre>
          <code className="text no-lines hljs">
              New-Object System.Net.WebClient.DownloadString('https://auth0.com.org/install.ps1')
          </code>
        </pre>
      </div>
    </div>
  )
  }
}

export default Setup;
