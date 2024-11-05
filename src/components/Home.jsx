import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [archivo, setArchivo] = useState(null);
  const [avatar, setAvatar] = useState("/imagenes/avatar.jpg");

  const url = "http://localhost:3000/subida";

  function controlCambioImagen(event) {
    const archivoSubido = event.target.files[0]; // imagen
    console.log(archivoSubido);

    if (archivoSubido) {
      const fileName = archivoSubido.name.toLowerCase();

      // Solamente archivos jpg
      if (fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg")) {
        setArchivo(archivoSubido);
      } // si es jpg, entonces guardamos en archivo.
      else {
        console.log("sube un archivo .jpg");
      }
    }
  }

  async function controlSubida(event) {
    event.preventDefault();

    if (!archivo) {
      console.log("sube un archivo");
    } else {
      const formData = new FormData();
      formData.append("file", archivo);

      // Enviar la imagen al servidor
      await axios
        .post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(async function (response) {
          console.log(response);

          if (response.status === 200) {
            console.log("exito");
            let urlImagen = response.data.urlImagen;
            setAvatar(urlImagen);
          } else {
            console.log("error");
          }
        });
    }
  }

  async function controlEliminar() {
    await axios.post("/eliminar").then(async function (response) {
      console.log(response);
      if (response === 200) {
        console.log("imagen eliminada correctamente");
        setAvatar("/imagenes/avatar.jpg");
      } else {
        console.log("error");
      }
    });
  }

  return (
    <div
      className="container my-5 p-4 rounded shadow-lg bg-light"
      style={{ maxWidth: "500px" }}
    >

      <div className="text-center mb-4">
        <h1 className="display-5 text-primary">AWS S3</h1>
        <p className="text-muted">Gestiona tus fotos fácilmente</p>
      </div>

      
      <div className="d-flex justify-content-center mb-5">
        <img
          src={avatar}
          alt="avatar"
          className="rounded-circle img-thumbnail shadow"
          style={{ width: "150px", height: "150px" }}
        />
      </div>

      
      <div className="row justify-content-center">
        <div className="col-12">
          <form>
            
            <div className="mb-4">
              <input
                type="file"
                className="form-control form-control-lg"
                id="formFile"
                onChange={controlCambioImagen}
              />
            </div>


            <div className="d-grid gap-3">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={controlSubida}
              >
                Subir Foto
              </button>
              <button
                type="button"
                className="btn btn-danger btn-lg"
                onClick={controlEliminar}
              >
                Eliminar Foto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
