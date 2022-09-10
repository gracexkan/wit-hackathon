import { Form, Input, InputNumber, Table } from 'antd';
import React, { useState } from 'react';
import {AiFillDelete} from 'react-icons/ai'
const originData = [];

for (let i = 0; i < 1; i++) {
  originData.push({
    key: i.toString(),
    name: `McDonald's Chatswood`,
		curr_source: `Warragamba Dam`,
		dam_level: `97.8%`,
    curr: '$2.5 per kL',
    address: `Shop 20/21, 436 Victoria Ave, Chatswood NSW 2067`,
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Offices = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
			render: (text) => <a>{text}</a>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '40%',
    },
    {
      title: 'Current Source',
      dataIndex: 'curr_source',
      width: '15%',
    },
    {
      title: 'Dam Level',
      dataIndex: 'dam_level',
      width: '10%',
    },
    {
      title: 'Current Cost',
      dataIndex: 'curr',
      width: '15%',
    },
		{
			title: 'Delete',
			dataIndex: '',
			key: 'x',
			render: () => <a><AiFillDelete /></a>,
		},
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
				className='container'
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default Offices