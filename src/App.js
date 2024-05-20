import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null); 

  useEffect(() => {
    if (showGraph) {
      fetchNodes();
      fetchEdges();
    }
  }, [showGraph]);

  const fetchNodes = () => {
    axios.get('https://banco-grafos-api.onrender.com/api/nodes')
      .then(response => {
        setNodes(response.data);
      })
      .catch(error => {
        console.error('Error fetching nodes:', error);
      });
  };

  const fetchEdges = () => {
    axios.get('https://banco-grafos-api.onrender.com/api/edges')
      .then(response => {
        setEdges(response.data);
      })
      .catch(error => {
        console.error('Error fetching edges:', error);
      });
  };

  const createNode = () => {
    axios.post('https://banco-grafos-api.onrender.com/api/nodes', { name, label })
      .then(() => {
        fetchNodes();
        setName('');
        setLabel('');
      })
      .catch(error => {
        console.error('Error creating node:', error);
      });
  };
  const editNode = () => {
    if (selectedNodeId !== null) {
      const newName = prompt('Digite o novo nome:');
      const newLabel = prompt('Digite o novo rótulo:');
  
      if (newName !== null && newLabel !== null) {
        // Exclui o nó existente
        axios.delete(`https://banco-grafos-api.onrender.com/api/nodes/${selectedNodeId}`)
          .then(() => {
            // Cria um novo nó com os dados atualizados
            axios.post('https://banco-grafos-api.onrender.com/api/nodes', { id: selectedNodeId, name: newName, label: newLabel })
              .then(() => {
                alert('Nó atualizado com sucesso.');
                fetchNodes(); // Atualiza a lista de nós
              })
              .catch(error => {
                console.error('Error creating node:', error);
                alert('Erro ao criar o novo nó. Consulte o console para mais detalhes.');
              });
          })
          .catch(error => {
            console.error('Error deleting node:', error);
            alert('Erro ao excluir o nó existente. Consulte o console para mais detalhes.');
          });
      }
    } else {
      alert('Por favor, selecione um nó para editar.');
    }
  };
  
  
  
// Função para excluir um nó
const deleteNode = () => {
  // Verifica se há um nó selecionado
  if (selectedNodeId) {
    // Envia uma solicitação DELETE para o servidor para excluir o nó no banco de dados
    axios.delete(`https://banco-grafos-api.onrender.com/api/nodes/${selectedNodeId}`)
      .then(() => {
        const filteredNodes = nodes.filter(node => node.data.id !== selectedNodeId);

        // Remove todas as arestas relacionadas ao nó selecionado
        const filteredEdges = edges.filter(edge => edge.data.source !== selectedNodeId && edge.data.target !== selectedNodeId);
    
        // Atualiza o estado dos nós e das arestas
        setNodes(filteredNodes);
        setEdges(filteredEdges);
    
        // Limpa o estado do nó selecionado
        setSelectedNodeId(null);
      })
      .catch(error => {
        console.error('Error deleting node:', error);
        alert('Erro ao excluir o nó. Consulte o console para mais detalhes.');
      });
  } else {
    alert('Por favor, selecione um nó para excluir.');
  }
};

  const handleShowGraph = () => {
    setShowGraph(true);
  };

  const handleAddData = () => {
    setShowGraph(false);
  };
    // Função para selecionar um nó
    const selectNode = (nodeId) => {
      setSelectedNodeId(nodeId);
    };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
        <div className="container-fluid">
          <li className="navbar-brand" >Graph App</li>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <button className={`nav-link ${!showGraph ? 'active' : ''}`} onClick={handleAddData}>Adicionar Dados</button>
              </li>
              <li className="nav-item active">
                <button className={`nav-link ${showGraph ? 'active' : ''}`} onClick={handleShowGraph}>Mostrar Gráficos</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {showGraph ? (
        <div className="container mt-4">
          <h1 className="mb-2">Gráficos</h1>
          <>
              <button className="btn btn-primary me-2" onClick={editNode} disabled={!selectedNodeId}>Editar Nó</button>
              <button className="btn btn-danger" onClick={deleteNode} disabled={!selectedNodeId}>Excluir Nó</button>
            </>
          <CytoscapeComponent
            elements={nodes.concat(edges)}
            style={{ width: '100%', height: '500px' }}
            cy={(cy) => {
              cy.center();
              // Adicione um evento de clique para selecionar o nó
              cy.on('tap', 'node', (event) => {
                selectNode(event.target.id());
              });
            }}
          />
        </div>
      ) : (
        <div className="container mt-4">
          <h1 className="mb-4">Adicionar Dados</h1>
          <div className="mb-4">
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="d-flex mb-2 align-items-center">
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control "
                  placeholder="Label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary me-2" onClick={createNode}>Create Node</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
