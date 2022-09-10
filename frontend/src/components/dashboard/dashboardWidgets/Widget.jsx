import React from 'react'
import './widget.css'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import "antd/dist/antd.css";

function Widget() {
	return (
		<div className='container widget__container'>
			<Statistic
									title="Locations"
									value={1}
									precision={0}
									valueStyle={{ color: '#00000' }}
								/>			
			<Statistic
									title="Suggested Changes"
									value={1}
									precision={0}
									valueStyle={{ color: '#3f8600' }}
									prefix={<ArrowUpOutlined />}
								/>
			<Statistic
								title="Potential Savings"
								value={5.3}
								precision={2}
								// valueStyle={{ color: '#cf1322' }}
								valueStyle={{ color: '#3f8600' }}
								prefix={<ArrowDownOutlined />}
								suffix="%"
							/>
		</div>
	)
}

export default Widget