import React from 'react'
import { render } from 'react-dom'
import App from './app'

class AppContainer extends React.Component {
  state = {
    name: 'Parcel Example'
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({ name: 'parcel dabaobao'})
    }, 2000)
  }

  render () {
    return <App name={this.state.name } />
  }
}