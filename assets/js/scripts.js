document.addEventListener("DOMContentLoaded", () => {
  const panelCarrito = document.getElementById("panel-carrito") || document.getElementById("carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");
  const subtotalCarrito = document.getElementById("subtotal-carrito");
  const impuestosCarrito = document.getElementById("impuestos-carrito");
  const badge = document.getElementById("carrito-badge");

  const btnAbrir = document.getElementById("abrir-carrito");
  const btnCerrar = document.getElementById("cerrar-carrito");
  const btnVaciar = document.getElementById("vaciar-carrito");

  let carritoItems = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderizarCarrito() {
    if (!listaCarrito) return;

    listaCarrito.innerHTML = "";
    let subtotal = 0;

    carritoItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      li.textContent = `${item.titulo} - $${item.precio.toLocaleString()} CLP`;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "❌";
      btnEliminar.classList.add("btn", "btn-sm", "btn-danger", "ms-2");

      btnEliminar.addEventListener("click", () => {
        carritoItems.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carritoItems));
        renderizarCarrito();
      });

      li.appendChild(btnEliminar);
      listaCarrito.appendChild(li);
      subtotal += item.precio;
    });

    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    if (subtotalCarrito) subtotalCarrito.innerHTML = `<strong>Subtotal:</strong> $${subtotal.toLocaleString()} CLP`;
    if (impuestosCarrito) impuestosCarrito.innerHTML = `<strong>Impuestos (IVA 19%):</strong> $${iva.toLocaleString()} CLP`;
    if (totalCarrito) totalCarrito.innerHTML = `<strong>Total:</strong> $${total.toLocaleString()} CLP`;

    if (badge) badge.textContent = carritoItems.length;
  }

  function inicializarBotonesAgregar() {
    const botones = document.querySelectorAll(".btn-agregar, .btn-primary");
    botones.forEach(boton => {
      boton.addEventListener("click", () => {
        const card = boton.closest(".card");
        const titulo = card.querySelector(".card-title").textContent;
        const precioTexto = card.querySelector("p strong")?.nextSibling?.textContent?.trim() 
                          || card.querySelector("p")?.textContent 
                          || "$0 CLP";
        const precio = parseInt(precioTexto.replace(/[^\d]/g, "")) || 0;

        carritoItems.push({ titulo, precio });
        localStorage.setItem("carrito", JSON.stringify(carritoItems));
        renderizarCarrito();

        // abrir carrito automáticamente
        if (panelCarrito) panelCarrito.classList.add("visible");
      });
    });
  }

  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      const confirmar = confirm("¿Estás seguro de que quieres vaciar el carrito?");
      if (confirmar) {
        carritoItems = [];
        localStorage.removeItem("carrito");
        renderizarCarrito();
      }
    });
  }

  // ✅ Toggle en botón flotante
  if (btnAbrir) {
    btnAbrir.addEventListener("click", () => {
      panelCarrito.classList.toggle("visible");
    });
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      panelCarrito.classList.remove("visible");
    });
  }

  const botonesDescripcion = document.querySelectorAll(".btn-descripcion");
  botonesDescripcion.forEach(boton => {
    boton.addEventListener("click", () => {
      const cardBody = boton.closest(".card-body");
      const descripcion = cardBody.querySelector(".card-text");
      if (descripcion.style.display === "none" || descripcion.style.display === "") {
        descripcion.style.display = "block";
        boton.textContent = "Ocultar descripción";
      } else {
        descripcion.style.display = "none";
        boton.textContent = "Ver descripción";
      }
    });
  });

  inicializarBotonesAgregar();
  renderizarCarrito();
});
