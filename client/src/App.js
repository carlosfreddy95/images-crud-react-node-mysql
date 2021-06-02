import React, { Fragment, useState, useEffect } from 'react'
import './App.css';
import Modal from 'react-modal'

function App() {

  const [file, setFile] = useState(null)
  const [imageList, setimageList] = useState([])
  const [listUpdate, setlistUpdate] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)

  useEffect(() => {

    Modal.setAppElement('body')

    fetch('http://localhost:3001/images/get')
    .then(res => res.json())
      .then(res => setimageList(res))
      .catch(err => {
        console.error(err)
      })
      setlistUpdate(false)
  }, [listUpdate])

  const selectedHandler = e => {
    setFile(e.target.files[0])
  }

  const sendHandler = () => {
    if(!file){
      alert('you must select a file')
      return
    } 

    const formdata = new FormData()
    formdata.append('image', file)

    fetch('http://localhost:3001/images/post', {
      method: 'POST',
      body: formdata
    })
    .then(res => res.text())
      .then(res => {
        console.log(res)
        setlistUpdate(true)
      })
      .catch(err => {
        console.error(err)
      })

    document.getElementById('fileInput').value = null

    setFile(null)
  }

  //set currentImage
  const modalHandler = (isOpen, image) => {
    setModalIsOpen(isOpen)
    setCurrentImage(image)
  }

  //delete image
  const deleteHandler = () => {

    let imageID = currentImage.split('-')
    imageID = parseInt(imageID[0])

    fetch('http://localhost:3001/images/delete/' + imageID, {
      method: 'DELETE'
    })
    .then(res => res.text())
      .then(res => console.log(res))

    setModalIsOpen(false)
    setlistUpdate(true)
  }

  return (
    <Fragment>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a href="#" className="navbar-brand">Image App</a>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card p-3">
          <div className="row">
            <div className="col-10">
              <input id="fileInput" className="form-control" type="file" onChange={selectedHandler}/>
            </div>
            <div className="col-2">
            <button className="btn btn-primary col-12" type="button" onClick={sendHandler}>
              Upload
            </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3" style={{display: "flex", flexWrap: "wrap"}}>
        {
          imageList.map(image => (
            <div key={image} className="card m-2">
              <img src={'http://localhost:3001/' + image} alt="image" className="card-img-top" style={{height: "300px", width: "300px"}}/>
              <div className="card-body">
                <button className="btn btn-dark" onClick={() => modalHandler(true, image)}>
                  View image
                </button>
              </div>
            </div>
          ))
        }
      </div>

      <Modal style={{content: {right: "20%", left: "20%"}}} isOpen={modalIsOpen} onRequestClose={() => modalHandler(false, null)}>
        <div className="card">
          <img src={'http://localhost:3001/' + currentImage} alt="image"/>
          <div className="card-body">
            <button className="btn btn-danger" onClick={() => deleteHandler()}>
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </Fragment>
  );
}

export default App;
