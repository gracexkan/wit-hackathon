import React from 'react'
import Name from './Name'
import Offices from './Offices'
import AddNew from './AddNew'
import Widget from './dashboardWidgets/Widget'
import './dashboard.css'

function Dashboard() {
	return (
		<>
			<Name />
			<Widget />
			<AddNew />
			<Offices />
		</>
	)
}

export default Dashboard