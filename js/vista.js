import funciones from "./funciones.js";


window.addEventListener("DOMContentLoaded", () => {
  funciones.getTablaProd();
  funciones.getCategorias();

  const contenidoMain = document.getElementById("contenido-main");
  const loadForm = async (section) => {
    try {
      switch (section) {
        case "productos":
          const productos = await fetch("forms/productoAnadir.html");
          contenidoMain.innerHTML = await productos.text();
          funciones.getTablaProdEditar();
          const selectCategorias = document.querySelector(
            ".categorias-select-anadir"
          );
          funciones.getCategoriasSelect(selectCategorias);
          document
            .querySelector(".productos-form-anadir")
            .addEventListener("submit", (e) => {
              e.preventDefault();

              funciones.agregarProducto();
            });
          break;
        case "buscarProductos":
          const buscarProductos = await fetch("forms/buscarProductos.html");
          contenidoMain.innerHTML = await buscarProductos.text();

          let debounceTimeout;
document
  .querySelector("#nombre-producto-buscar")
  .addEventListener("keyup", (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      funciones.getProductoporNombre(e.target.value);
    }, 300); // 300ms tras la última tecla
  });

          break;
        case "categorias":
          const categorias = await fetch("forms/categoriaAnadir.html");

          contenidoMain.innerHTML = await categorias.text();
          funciones.getTablaCategorias();
          document
            .querySelector(".categorias-form-anadir")
            .addEventListener("submit", (e) => {
              e.preventDefault();
              funciones.agregarCategoria();
            });
          break;
        case "almacen":
          const almacen = await fetch("forms/almacen.html");
          contenidoMain.innerHTML = await almacen.text();
          funciones.getTablaProd();
          funciones.getCategorias();
          break;

        default:
          funciones.getTablaProd();
          funciones.getCategorias();
        // contenidoMain.innerHTML = "<p>Seleccione una opción.</p>";
      }

      // Hacemos visible la sección cargada
      const seccionDiv = document.getElementById(section);
      // seccionDiv.classList.remove('hidden');  // Elimina la clase 'hidden'
    } catch (error) {
      console.log("Error al cargar el formulario:", error);
    }
  };

  document.querySelectorAll(" .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = e.target.getAttribute("data-section");
      loadForm(targetSection);
    });
  });
});
