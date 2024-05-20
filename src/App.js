import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

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

  const updateNode = () => {
    if (!selectedNode) return;
    axios.put(`https://banco-grafos-api.onrender.com/api/nodes/${selectedNode.data.id}`, { name, label })
      .then(() => {
        fetchNodes();
        setName('');
        setLabel('');
        setSelectedNode(null);
      })
      .catch(error => {
        console.error('Error updating node:', error);
      });
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    axios.delete(`https://banco-grafos-api.onrender.com/api/nodes/${selectedNode.data.id}`)
      .then(() => {
        fetchNodes();
        setSelectedNode(null);
      })
      .catch(error => {
        console.error('Error deleting node:', error);
      });
  };

  const deleteEdge = () => {
    if (!selectedEdge) return;
    axios.delete(`https://banco-grafos-api.onrender.com/api/edges/${selectedEdge.data.id}`)
      .then(() => {
        fetchEdges();
        setSelectedEdge(null);
      })
      .catch(error => {
        console.error('Error deleting edge:', error);
      });
  };

  const handleNodeTap = (event) => {
    setSelectedNode(event.target);
    setSelectedEdge(null);
    setName(event.target.data().name);
    setLabel(event.target.data().label);
  };

  const handleEdgeTap = (event) => {
    setSelectedEdge(event.target);
    setSelectedNode(null);
  };

  const handleBackgroundTap = (event) => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const handleShowGraph = () => {
    setShowGraph(true);
  };

  const handleAddData = () => {
    setShowGraph(false);
  };

  return (
    <div>
 <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Graph App</a>
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
          <CytoscapeComponent
            elements={nodes.concat(edges)}
            style={{ width: '100%', height: '500px' }}
            cy={(cy) => {
              cy.on('tap', 'node', handleNodeTap);
              cy.on('tap', 'edge', handleEdgeTap);
              cy.on('tap', handleBackgroundTap);
              cy.center(); 
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
                value={name}                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="d-flex mb-2 align-items-center">            <div className="input-group mb-2">
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

