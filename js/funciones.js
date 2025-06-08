const SERVER = "https://bryancas.com:4004/almacen";

// -------------------------FUNCIONES DE CATEGORIAS

// obtener la tabla de categorias inicial
export function getCategorias() {
  const tablaCategorias = document.querySelector("#tabla-categorias");

  const peticion = new XMLHttpRequest();
  peticion.open("GET", SERVER + "/categorias/all");
  peticion.send();
  peticion.addEventListener("load", () => {
    if (peticion.status === 200) {
      const datos = JSON.parse(peticion.responseText);

      datos.forEach((element) => {
        let filaCategorias = document.createElement("tr");
        filaCategorias.classList.add("filaCategorias");
        let idCategorias = document.createElement("td");
        idCategorias.classList.add("idCategorias");
        let nombreCategorias = document.createElement("td");
        nombreCategorias.classList.add("nombreCategorias");

        idCategorias.textContent = element.id;
        nombreCategorias.textContent = element.nombre;

        filaCategorias.appendChild(idCategorias);
        filaCategorias.appendChild(nombreCategorias);
        tablaCategorias.appendChild(filaCategorias);
      });
    } else {
      console.log(
        "Error " +
          peticion.status +
          " (" +
          peticion.statusText +
          ") en la petición"
      );
    }
  });
  peticion.addEventListener("error", () => {
    console.log("Error en la petición");
  });
}

// Obtener la tabla con botones para su gestion
export function getTablaCategorias() {
  const tablaCategorias = document.querySelector(".categorias-dinamicas");
  const peticion = new XMLHttpRequest();
  peticion.open("GET", SERVER + "/categorias/all");
  peticion.send();
  peticion.addEventListener("load", () => {
    if (peticion.status === 200) {
      const datos = JSON.parse(peticion.responseText);
      
      datos.forEach((element) => {
        // tabla de categorias
        let filaCategorias = document.createElement("tr");
        filaCategorias.classList.add("filaCategorias");
        let idCategorias = document.createElement("td");
        idCategorias.classList.add("idCategorias");
        let nombreCategorias = document.createElement("td");
        nombreCategorias.classList.add("nombreCategorias");
        let botonesCategorias = document.createElement("td");
        botonesCategorias.classList.add("botonesCategorias");

        let editarCategorias = document.createElement("button");
        editarCategorias.classList.add(
          "editarCategorias",
          "btn",
          "btn-warning", // Color amarillo sólido
          "btn-sm",
          "mx-2"
        );

        editarCategorias.innerHTML = '<i class="bi bi-pencil-fill"></i> Editar';

        let eliminarCategorias = document.createElement("button");
        eliminarCategorias.classList.add(
          "eliminarCategorias",
          "btn",
          "btn-danger", // Color rojo sólido
          "btn-sm",
          "mx-2"
        );
        eliminarCategorias.innerHTML =
          '<i class="bi bi-trash-fill"></i> Eliminar';

        idCategorias.textContent = element.id;
        nombreCategorias.textContent = element.nombre;

        botonesCategorias.appendChild(editarCategorias);
        botonesCategorias.appendChild(eliminarCategorias);
        filaCategorias.appendChild(idCategorias);
        filaCategorias.appendChild(nombreCategorias);
        filaCategorias.appendChild(botonesCategorias);
        tablaCategorias.appendChild(filaCategorias);
        // los listeners de los botones editar y borrar
        // ------------------------
        editarCategorias.addEventListener("click", (e) => {
          
          console.log(filaCategorias);

          // Crear una nueva fila con el formulario de edición
          const filaEdicion = document.createElement("tr");
          filaEdicion.classList.add("fila-edicion", "table-warning"); // Clase para identificar el formulario

          filaEdicion.innerHTML = `
          <td class="id-categoria">${
            filaCategorias.querySelector(".idCategorias").textContent
          }</td>
        <td>
            <input type="text" class="form-control nombre-editar" value="${
              filaCategorias.querySelector(".nombreCategorias").textContent
            }">
        </td>
        
        
        <td>
            <button class="btn btn-success btn-sm guardar-edicion">
                <i class="bi bi-check-circle"></i> Guardar
            </button>
            <button class="btn btn-secondary btn-sm cancelar-edicion">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </td>`;
          // Insertar la fila de edición después de la fila seleccionada
          filaCategorias.insertAdjacentElement("afterend", filaEdicion);
          // Agregar eventos a los botones del formulario
          filaEdicion
            .querySelector(".guardar-edicion")
            .addEventListener("click", () => {
              modificarCategoriaPUT(filaCategorias);

              filaEdicion.remove();
            });
          filaEdicion
            .querySelector(".cancelar-edicion")
            .addEventListener("click", () => filaEdicion.remove());
        });
        eliminarCategorias.addEventListener("click", (e) => {
          const fila = e.target.closest("tr");
          const nombreCategoria =
            fila.querySelector(".nombreCategorias").textContent;

          // Crear la ventana modal
          const modal = document.createElement("div");
          modal.classList.add("modal-confirmacion");

          modal.innerHTML = `
    <div class="modal-contenido">
      <h3>Confirmar eliminación</h3>
      <p>¿Seguro que deseas eliminar la categoría <strong>${nombreCategoria}</strong>?</p>
      <button id="btnConfirmarEliminar" class="btn btn-danger">Eliminar</button>
      <button id="btnCancelarEliminar" class="btn btn-secondary">Cancelar</button>
    </div>
  `;

          document.body.appendChild(modal);

          // Manejo de botones dentro del modal
          document
            .getElementById("btnConfirmarEliminar")
            .addEventListener("click", () => {
              modal.remove(); // Cerrar modal antes de eliminar
              funcionEliminarCategorias(fila); // Llamar a la función de eliminación
              console.log(`Categoría "${nombreCategoria}" eliminada`);
            });

          document
            .getElementById("btnCancelarEliminar")
            .addEventListener("click", () => {
              modal.remove(); // Cerrar modal sin eliminar
              console.log(`Cancelada eliminación de "${nombreCategoria}"`);
            });
        });
      });
    } else {
      console.log(
        "Error " +
          peticion.status +
          " (" +
          peticion.statusText +
          ") en la petición"
      );
    }
  });
  peticion.addEventListener("error", () => {
    console.log("Error en la petición");
  });
}
// añadir categoria
export function agregarCategoria() {
  const formularioAnadirCategoria = document.querySelector(
    ".categorias-form-anadir"
  );
  

  const nuevaCategoria = {
    nombre: formularioAnadirCategoria.querySelector("#nombre-categoria").value,
  };
  

  const response = fetch(SERVER + "/categorias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevaCategoria),
  });

  response
    .then((dato1) => {
      if (!dato1.ok) {
        throw Error`${dato1.status} de la BBDD: ${dato1.statusText}`;
      }
      return dato1.json();
    })
    .then(async (dato2) => {
      if (dato2.id.affectedRows > 0) {
        document.querySelector(".categorias-dinamicas").innerHTML = "";
        await getTablaCategorias();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
// modificar categoria
export function modificarCategoriaPUT(elemento) {
  const nuevoCategoria = {
    nombre: document.querySelector(".nombre-editar").value,
  };
  const idCategoria = elemento.querySelector(".idCategorias").textContent;

  const responsePUT = fetch(SERVER + "/categorias/" + idCategoria, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoCategoria),
  });

  responsePUT
    .then((dato1) => {
      if (!dato1.ok) {
        throw Error`${dato1.status} de la BBDD: ${dato1.statusText}`;
      }
      return dato1.json();
    })
    .then(async (dato2) => {
      if (dato2.id.affectedRows > 0) {
        document.querySelector(".categorias-dinamicas").innerHTML = "";
        await getTablaCategorias();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
// eliminar categoria
export function funcionEliminarCategorias(elemento) {
  const idCategoria = elemento.querySelector(".idCategorias").textContent;
  

  const responseDelete = fetch(SERVER + "/categorias/" + idCategoria, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  responseDelete
    .then((dato1) => {
      if (!dato1.ok) {
        throw `Error ${dato1.status} de la BBDD: ${dato1.statusText}`;
      }
      return dato1.json();
    })
    .then(async (dato2) => {
      if (dato2.id.affectedRows > 0) {
        document.querySelector(".categorias-dinamicas").innerHTML = "";
        await getTablaCategorias();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// -------------------------FUNCIONES PRODUCTOS
// modificar producto put
export function modificarProductoPUT(elemento) {
  const nuevoProducto = {
    nombre: document.querySelector(".nombre-editar").value,
    precio: document.querySelector(".precio-editar").value,
    id_cat: document.querySelector(".select-editar-producto").value,
  };
  

  const idProducto = elemento.querySelector(".idProducto").textContent;


  const responsePUT = fetch(SERVER + "/productos/" + idProducto, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoProducto),
  });

  responsePUT
    .then((dato1) => {
      if (!dato1.ok) {
        throw Error`${dato1.status} de la BBDD: ${dato1.statusText}`;
      }

      return dato1.json();
    })
    .then(async (dato2) => {
      if (dato2.id.affectedRows > 0) {
        document.querySelector(".productos-dinamicos").innerHTML = "";
        await getTablaProdEditar();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// obtener la tabla para editar y eliminar
async function getTablaProdEditar() {
  const tablaProductos = document.querySelector(".productos-dinamicos");
  const peticion = new XMLHttpRequest();
  peticion.open("GET", SERVER + "/productos/all");
  peticion.send();
  peticion.addEventListener("load", async () => {
    if (peticion.status === 200) {
      const datos = JSON.parse(peticion.responseText);
      

      for (const element of datos) {
        let filaProducto = document.createElement("tr");
        let idProducto = document.createElement("td");
        idProducto.classList.add("idProducto");
        let nombreProducto = document.createElement("td");
        nombreProducto.classList.add("nombreProducto");
        let precioProducto = document.createElement("td");
        precioProducto.classList.add("precioProducto");
        let id_catProducto = document.createElement("td");
        id_catProducto.classList.add("id_catProducto");
        let botonesProducto = document.createElement("td");
        botonesProducto.classList.add("botonesProducto");
        let editarProducto = document.createElement("button");
        editarProducto.classList.add(
          "editarProducto",
          "btn",
          "btn-warning", // Color amarillo sólido
          "btn-sm",
          "mx-2"
        );

        editarProducto.innerHTML = '<i class="bi bi-pencil-fill"></i> Editar';

        let eliminarProducto = document.createElement("button");
        eliminarProducto.classList.add(
          "btn",
          "btn-danger", // Color rojo sólido
          "btn-sm",
          "mx-2",
          "eliminarProducto"
        );
        eliminarProducto.innerHTML =
          '<i class="bi bi-trash-fill btn-danger"></i> Eliminar';

        idProducto.textContent = element.id;
        nombreProducto.textContent = element.nombre;
        precioProducto.textContent = element.precio;

        // buscar el nombre de la categoria
        id_catProducto.textContent = await getNombreCategoriaProducto(
          element.id_cat
        );

        botonesProducto.appendChild(editarProducto);
        botonesProducto.appendChild(eliminarProducto);
        filaProducto.appendChild(idProducto);
        filaProducto.appendChild(nombreProducto);
        filaProducto.appendChild(precioProducto);
        filaProducto.appendChild(id_catProducto);
        filaProducto.appendChild(botonesProducto);

        tablaProductos.appendChild(filaProducto);

        // los listeners de los botones editar y borrar
        editarProducto.addEventListener("click", async (e) => {
          const elemento = e.target.closest("tr");
          

          const idEditar = elemento.querySelector(".idProducto").textContent;
          const nombreEditar =
            elemento.querySelector(".nombreProducto").textContent;
          const precioEditar =
            elemento.querySelector(".precioProducto").textContent;
          const categoriaEditar =
            elemento.querySelector(".id_catProducto").textContent;
          // const idProducto = formularioEditar.querySelector(".id-producto");

          // idProducto.textContent = idEditar;
          // nombreProductoInput.value = nombreEditar;
          // precioProductoInput.value = precioEditar;

          // Crear una nueva fila con el formulario de edición
          const filaEdicion = document.createElement("tr");
          filaEdicion.classList.add("fila-edicion", "table-warning"); // Clase para identificar el formulario

          filaEdicion.innerHTML = `
          <td class="id-producto">${idEditar}</td>
        <td>
            <input type="text" class="form-control nombre-editar" value="${nombreEditar}" required maxlength="50">
        </td>
        <td>
            <input type="number" class="form-control precio-editar" value="${precioEditar}" required>
        </td>
        <td>
            <select class="form-select select-editar-producto" required>
                <option value="" disabled selected>Seleccione una categoría</option>
            </select>
        </td>
        <td>
            <button class="btn btn-success btn-sm guardar-edicion">
                <i class="bi bi-check-circle"></i> Guardar
            </button>
            <button class="btn btn-secondary btn-sm cancelar-edicion">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </td>`;
          const categoriasSelectEditar = filaEdicion.querySelector(
            ".select-editar-producto"
          );
          // obtener las categorias en el select
          await getCategoriasSelect(categoriasSelectEditar);

          Array.from(categoriasSelectEditar.options).forEach((option) => {
            if (option.textContent == categoriaEditar) {
              option.selected = true;
            }
          });
          // Insertar la fila de edición después de la fila seleccionada
          elemento.insertAdjacentElement("afterend", filaEdicion);

          // Agregar eventos a los botones del formulario
          filaEdicion
            .querySelector(".guardar-edicion")
            .addEventListener("click", async () => {
              modificarProductoPUT(e.target.closest("tr"));

              filaEdicion.remove();
            });
          filaEdicion
            .querySelector(".cancelar-edicion")
            .addEventListener("click", () => filaEdicion.remove());
        });
        eliminarProducto.addEventListener("click", (e) => {
          const fila = e.target.closest("tr");
          const nombreProducto =
            fila.querySelector(".nombreProducto").textContent;

          // Crear la ventana modal
          const modal = document.createElement("div");
          modal.classList.add("modal-confirmacion");

          modal.innerHTML = `
            <div class="modal-contenido">
              <h3>Confirmar eliminación</h3>
              <p>¿Seguro que deseas eliminar <strong>${nombreProducto}</strong>?</p>
              <button id="btnConfirmarEliminar" class="btn btn-danger">Eliminar</button>
              <button id="btnCancelarEliminar" class="btn btn-secondary">Cancelar</button>
            </div>
          `;

          document.body.appendChild(modal);

          // Manejo de botones dentro del modal
          document
            .getElementById("btnConfirmarEliminar")
            .addEventListener("click", () => {
              modal.remove(); // Cerrar modal antes de eliminar
              eliminarProductoFuncion(fila); // Llamar a la función de eliminación
              console.log(`Producto "${nombreProducto}" eliminado`);
            });

          document
            .getElementById("btnCancelarEliminar")
            .addEventListener("click", () => {
              modal.remove(); // Cerrar modal sin eliminar
              console.log(`Cancelada eliminación de "${nombreProducto}"`);
            });
        });
      }
    } else {
      console.log(
        "Error " +
          peticion.status +
          " (" +
          peticion.statusText +
          ") en la petición"
      );
    }
  });
  peticion.addEventListener("error", () => {
    
  });
}

// funcion para eliminar un producto
export function eliminarProductoFuncion(elemento) {
  const idProducto = elemento.querySelector(".idProducto").textContent;
  

  const responseDelete = fetch(SERVER + "/productos/" + idProducto, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  responseDelete
    .then((dato1) => {
      if (!dato1.ok) {
        throw Error`${dato1.status} de la BBDD: ${dato1.statusText}`;
      }
      return dato1.json();
    })
    .then(async (dato2) => {
      if (dato2.id.affectedRows > 0) {
        document.querySelector(".productos-dinamicos").innerHTML = "";
        await getTablaProdEditar();
        const mensaje = document.querySelector(".mensaje-productos");
        mensaje.innerHTML = `<div class="alert alert-success" role="alert">
                              <i class="bi bi-check-circle-fill"></i> Producto borrado con éxito
                           </div>`;
        setTimeout(() => {
          mensaje.innerHTML = "";
        }, 3000);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
// obtener las categorias dinamicamente en un select para agregar producto
export function getCategoriasSelect(elemento) {
  return new Promise((resolve, reject) => {
    const selectID = elemento;

    const peticion = new XMLHttpRequest();
    peticion.open("GET", SERVER + "/categorias/all");
    peticion.send();

    peticion.addEventListener("load", () => {
      if (peticion.status === 200) {
        const datos = JSON.parse(peticion.responseText);
        

        // Limpiar el select antes de agregar nuevas opciones
        // selectID.innerHTML = "";

        datos.forEach((element) => {
          const optionID = document.createElement("option");
          optionID.id = "opcion";
          optionID.value = element.id;
          optionID.textContent = element.nombre;
          selectID.appendChild(optionID);
        });

        resolve(); // Resolvemos la promesa cuando las opciones se han llenado
      } else {
        console.log(
          "Error " +
            peticion.status +
            " (" +
            peticion.statusText +
            ") en la petición"
        );
        reject(new Error(`Error ${peticion.status}: ${peticion.statusText}`));
      }
    });

    peticion.addEventListener("error", () => {
      console.log("Error en la petición");
      reject(new Error("Error en la petición"));
    });
  });
}

// obtener tabla productos principal
export async function getTablaProd(cuales = "/all") {
  const tablaProductos = document.querySelector("#tabla-productos");
  tablaProductos.innerHTML = "";


  try {
    const response = await fetch(SERVER + "/productos" + cuales);
    const datos = await response.json();
    console.log(datos);

    for (const element of datos) {
      let filaProducto = document.createElement("tr");
      let idProducto = document.createElement("td");
      idProducto.classList.add("idProducto");
      let nombreProducto = document.createElement("td");
      nombreProducto.classList.add("nombreProducto");
      let precioProducto = document.createElement("td");
      precioProducto.classList.add("precioProducto");
      let id_catProducto = document.createElement("td");
      id_catProducto.classList.add("id_catProducto");

      idProducto.textContent = element.id;
      nombreProducto.textContent = element.nombre;
      precioProducto.textContent = element.precio;

      id_catProducto.textContent = await getNombreCategoriaProducto(
        element.id_cat
      );

      filaProducto.appendChild(idProducto);
      filaProducto.appendChild(nombreProducto);
      filaProducto.appendChild(precioProducto);
      filaProducto.appendChild(id_catProducto);

      tablaProductos.appendChild(filaProducto);
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}

// obtener el nombre de la categoria por id para los productos
function getNombreCategoriaProducto(id_cat) {
  return fetch(SERVER + "/categorias?id=" + id_cat)
    .then((response) => {
      if (!response.ok) {
        // lanzamos un error que interceptará el .catch()
        throw Error` ${response.status} de la BBDD: ${response.statusText}`;
      }
      return response.json(); // devolvemos la promesa que hará el JSON.parse
    })
    .then((datos) => {
      return datos.nombre;
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("p1").innerHTML = error;
    });
}

// agregar un producto
function agregarProducto() {
  const nuevoProducto = {
    nombre: document.getElementById("nombre-producto-anadir").value,
    precio: document.getElementById("precio-producto-anadir").value,
    id_cat: document.querySelector(".categorias-select-anadir").value,
  };
  

  const response = fetch(SERVER + "/productos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoProducto),
  });

  response
    .then((dato1) => {
      if (!dato1.ok) {
        throw Error`${dato1.status} de la BBDD: ${dato1.statusText}`;
      }
      return dato1.json();
    })
    .then((dato2) => {
     
      document.getElementById("nombre-producto-anadir").value = "";
      document.getElementById("precio-producto-anadir").value = "";
      document.querySelector(".categorias-select-anadir").selectedIndex = 0;
      const mensaje = document.querySelector(".mensaje-productos");
      mensaje.innerHTML = `<div class="alert alert-success" role="alert">
                              <i class="bi bi-check-circle-fill"></i> ${dato2.mensaje}
                           </div>`;
      setTimeout(() => {
        mensaje.innerHTML = "";
      }, 3000);
    })
    .catch((error) => {
      const mensaje = document.querySelector(".mensaje-productos");
      mensaje.innerHTML = `<div class="alert alert-danger" role="alert">
                              <i class="bi bi-exclamation-triangle-fill"></i> ${error.mensaje}
                           </div>`;
      setTimeout(() => {
        mensaje.innerHTML = "";
      }, 3000);
    });
}

export async function getProductoporNombre(nombre) {
  document.querySelector("#tabla-productos").innerHTML = "";

  await getTablaProd("?nombre=" + nombre);

  const tabla = document.querySelector("#tabla-productos");



  if (tabla.children.length === 0) {
    let fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="4" style="text-align:center; color:red;">No hay productos con ese nombre</td>`;
    tabla.appendChild(fila);
  }
}

const funciones = {
  getTablaProd,
  getTablaProdEditar,
  getCategoriasSelect,
  agregarProducto,
  modificarProductoPUT,
  getCategorias,
  agregarCategoria,
  getTablaCategorias,
  modificarCategoriaPUT,
  getProductoporNombre,
};
export default funciones;
