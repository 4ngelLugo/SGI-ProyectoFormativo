import { useState } from 'react'
import AppWindow from './components/AppWindow'
import './styles/desktop.css'

export default function App() {
    // State to track which window is on top
    const [topWindowId, setTopWindowId] = useState(null)

    // State to track minimized windows
    const [minimizedWindows, setMinimizedWindows] = useState([])

    // Handle window click to bring it to top
    const handleWindowClick = (id) => {
        setTopWindowId(id)
    }

    // Handle window close
    const handleWindowClose = (id) => {
        if (topWindowId === id) {
            setTopWindowId(null)
        }
        // Add the window to minimized windows if it's not already there
        if (!minimizedWindows.includes(id)) {
            setMinimizedWindows([...minimizedWindows, id])
        }
    }

    // Handle window toggle (minimize/restore)
    const handleWindowToggle = (id) => {
        if (minimizedWindows.includes(id)) {
            setMinimizedWindows(minimizedWindows.filter(winId => winId !== id))
        } else {
            setMinimizedWindows([...minimizedWindows, id])
        }
    }

    return (
        <div className="mainScreen">
            <div className="topBar">
                <div className="topBar--fileOptions">
                    <img src="/path-to-logo.png" alt="Logo" />
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Help</span>
                </div>
            </div>

            <div className="screen">
                {/* Here is where you place your AppWindow component */}
                <AppWindow
                    id="dataTableWindow"
                    title="Data Table"
                    isTop={topWindowId === "dataTableWindow"}
                    onWindowClick={handleWindowClick}
                    onWindowClose={handleWindowClose}
                    onWindowToggle={handleWindowToggle}
                    isToggled={!minimizedWindows.includes("dataTableWindow")}
                    windowType="dataTable"
                />

                {/* You can add more windows here */}
            </div>

            <div className="rocketDock">
                <div className="rocketDock--item" onClick={() => handleWindowToggle("dataTableWindow")}>
                    <img src="/path-to-table-icon.png" alt="Data Table" />
                </div>
                {/* More dock items */}
            </div>
        </div>
    )
}