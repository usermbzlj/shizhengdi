import { Component, type ReactNode } from 'react'
import { clearSaves } from '../game/saves'

interface Props {
  children: ReactNode
}

interface FailState {
  failed: boolean
}

export class ErrorBoundary extends Component<Props, FailState> {
  state: FailState = { failed: false }

  static getDerivedStateFromError(): FailState {
    return { failed: true }
  }

  reset = () => {
    clearSaves()
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = ''
    window.location.assign(url.toString())
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: '#12141a',
          color: '#f4efe4',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div>
          <p style={{ fontSize: 18, margin: '0 0 16px' }}>这一页出错了。</p>
          <button
            type="button"
            onClick={this.reset}
            style={{ fontSize: 16, padding: '12px 18px', borderRadius: 999, border: 0, background: '#f1c97a', color: '#1a1408' }}
          >
            清除存档，回到大厅
          </button>
        </div>
      </div>
    )
  }
}
