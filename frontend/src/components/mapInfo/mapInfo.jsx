import React, {useState} from 'react'
import './MapInfo.css'
import { Table } from 'antd'
import {MdClose} from 'react-icons/md'
import "antd/dist/antd.css";

function MapInfo() {

	const columns = [
		{
			title: 'Cost',
			dataIndex: 'cost',
			key: 'cost',
		},
		{
			title: 'Savings',
			dataIndex: 'savings',
			key: 'savings',
		},
	];

	const data = [
		{
			key: '1',
			cost: '$2.5',
			savings: '$2.5',
		},
	];



	return (
		<div className="info__container">
			<a><MdClose /></a>
			<h2 align='center'>Warragamba Dam</h2>
			<Table columns={columns} dataSource={data} size="small" pagination={false} />
		</div>
	)
}

export default MapInfo