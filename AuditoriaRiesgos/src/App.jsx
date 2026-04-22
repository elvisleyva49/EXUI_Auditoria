import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Modal, Layout, Menu, Typography, message } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Login from './components/Login';
import { isAuthenticated, logout } from './services/LoginService';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const EditableContext = React.createContext(null);

// Editable Row Component
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// Editable Cell Component
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

// Main App Component
const App = () => {
  // Authentication state
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('user') || '');
  
  // Handle successful login
  const handleLoginSuccess = (response) => {
    setAuthenticated(true);
    setCurrentUser(response.user);
    message.success(`Bienvenido, ${response.user}!`);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setCurrentUser('');
    message.info('Sesión cerrada correctamente');
  };
  
  // Application state
  const [isLoading, setIsLoading] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [suggestEnabled, setSuggestEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(1);
  const [newData, setNewData] = useState({
    activo: '',
    riesgo: '',
    impacto: '',
    tratamiento: ''
  });

  // Show modal for adding new asset
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hide modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  // Handle deletion of a row
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  // Handle adding new asset (Real API call)
  const handleOk = async () => {
    if (!newData.activo.trim()) {
      message.error('Por favor ingresa un nombre de activo');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5500/analizar-riesgos', {
        activo: newData.activo
      });

      const { riesgos, impactos, niveles } = response.data;

      if (riesgos && riesgos.length > 0) {
        const newRows = riesgos.map((riesgo, index) => ({
          key: `${count + index}`,
          activo: newData.activo,
          riesgo: riesgo,
          impacto: impactos[index] || 'Condición no definida',
          nivel: niveles[index] || 'Media',
          tratamiento: '-'
        }));

        setDataSource([...dataSource, ...newRows]);
        setCount(count + riesgos.length);
        setSuggestEnabled(true);
        message.success(`Activo "${newData.activo}" analizado con éxito (${riesgos.length} riesgos encontrados)`);
      } else {
        message.warning('No se identificaron riesgos específicos para este activo');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error analizando riesgos:', error);
      message.error('Error al conectar con el motor de IA');
    } finally {
      setIsLoading(false);
      setNewData({ activo: '', riesgo: '', impacto: '', tratamiento: '' });
    }
  };

  // Add a single new row to the table
  const addNewRow = (activo, riesgo, impacto) => {
    // Create a single new row
    const newRow = {
      key: `${count}`,
      activo,
      riesgo,
      impacto,
      tratamiento: '-'
    };
    
    // Add the single row to the dataSource
    setDataSource([...dataSource, newRow]);
    
    // Increment count by 1
    setCount(count + 1);
    
    // Reset form
    setNewData({
      activo: '',
      riesgo: '',
      impacto: '',
      tratamiento: ''
    });
  };

  // Handle recommendation of treatments (Real API call)
  const handleRecommendTreatment = async () => {
    if (dataSource.length === 0) {
      message.warning('No hay riesgos para recomendar tratamientos');
      return;
    }

    setIsRecommending(true);
    
    try {
      const updatedDataSource = [...dataSource];
      
      // Process each item that doesn't have a treatment yet
      for (let i = 0; i < updatedDataSource.length; i++) {
        if (updatedDataSource[i].tratamiento === '-') {
          try {
            const response = await axios.post('http://localhost:5500/sugerir-tratamiento', {
              activo: updatedDataSource[i].activo,
              riesgo: updatedDataSource[i].riesgo,
              impacto: updatedDataSource[i].impacto
            });
            updatedDataSource[i].tratamiento = response.data.tratamiento;
          } catch (err) {
            console.error(`Error al obtener tratamiento para el item ${i}:`, err);
            updatedDataSource[i].tratamiento = 'Error al obtener recomendación';
          }
        }
      }
      
      setDataSource(updatedDataSource);
      message.success('Tratamientos recomendados con éxito');
    } catch (error) {
      console.error('Error general en recomendación:', error);
      message.error('Ocurrió un error al procesar las recomendaciones');
    } finally {
      setIsRecommending(false);
    }
  };

  // Handle save after cell edit
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  // Define table columns
  const defaultColumns = [
    {
      title: 'Activo',
      dataIndex: 'activo',
      width: '15%',
      editable: true,
    },
    {
      title: 'Riesgo',
      dataIndex: 'riesgo',
      width: '20%',
      editable: true,
    },
    {
      title: 'Condición',
      dataIndex: 'impacto',
      width: '30%',
      editable: true,
    },
    {
      title: 'Recomendación',
      dataIndex: 'tratamiento',
      width: '25%',
      editable: true,
    },
    {
      title: 'Nivel',
      dataIndex: 'nivel',
      width: '10%',
      render: (text) => {
        let color = text === 'Alta' ? 'red' : text === 'Media' ? 'orange' : 'green';
        return <b style={{ color }}>{text}</b>;
      },
    },
    {
      title: 'Operación',
      dataIndex: 'operation',
      render: (_, record) => (
        dataSource.length >= 1 ? (
          <Popconfirm title="¿Seguro que quieres eliminar?" onConfirm={() => handleDelete(record.key)}>
            <a>Eliminar</a>
          </Popconfirm>
        ) : null
      ),
    },
  ];

  // Set up table components
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // Configure columns for editing
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  // If not authenticated, show the login page
  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
  
  // If authenticated, show the app with header and content
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>Sistema de Auditoría de Riesgos</Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text style={{ color: 'white', marginRight: 16 }}>
            <UserOutlined /> {currentUser}
          </Text>
          <Button 
            type="link" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            style={{ color: 'white' }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </Header>
      
      <Content style={{ padding: '24px', background: '#fff' }}>
        <div>
          <Button onClick={showModal} type="primary" style={{ marginBottom: 16 }}>
            + Agregar activo
          </Button>
          <Button 
            onClick={handleRecommendTreatment} 
            type="primary" 
            loading={isRecommending} 
            disabled={!suggestEnabled} 
            style={{ marginBottom: 16, marginLeft: 8 }}
          >
            Recomendar tratamientos
          </Button>
          
          <Modal
            title="Agregar nuevo activo"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Agregar"
            cancelText="Cancelar"
            confirmLoading={isLoading}
          >
            <Form layout="vertical">
              <Form.Item 
                label="Activo" 
                rules={[{ required: true, message: 'Por favor ingresa un nombre de activo' }]}
              >
                <Input 
                  name="activo" 
                  value={newData.activo} 
                  onChange={(e) => setNewData({ ...newData, activo: e.target.value })}
                  placeholder="Ej: Base de datos de clientes" 
                />
              </Form.Item>
            </Form>
          </Modal>

          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Sistema de Auditoría de Riesgos ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;
