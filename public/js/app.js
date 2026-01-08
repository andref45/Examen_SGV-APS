class ArtesaniasApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupTabs();
    this.setupProductos();
    this.setupPedidos();
    this.setupPromociones();
    this.cargarDatos();
  }

  setupTabs() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
  }

  setupProductos() {
    const btnNuevo = document.getElementById('btn-nuevo-producto');
    const formContainer = document.getElementById('form-producto');
    const btnCancelar = document.getElementById('btn-cancelar-producto');
    const form = document.getElementById('producto-form');

    btnNuevo.addEventListener('click', () => {
      formContainer.style.display = 'flex';
      form.reset();
    });

    btnCancelar.addEventListener('click', () => {
      formContainer.style.display = 'none';
      form.reset();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
          alert('Producto creado exitosamente');
          form.reset();
          formContainer.style.display = 'none';
          this.cargarProductos();
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        alert('Error al crear producto: ' + error.message);
      }
    });
  }

  setupPedidos() {
    const btnNuevo = document.getElementById('btn-nuevo-pedido');
    const formContainer = document.getElementById('form-pedido');
    const btnCancelar = document.getElementById('btn-cancelar-pedido');
    const form = document.getElementById('pedido-form');
    const btnAgregar = document.getElementById('btn-agregar-item');

    btnNuevo.addEventListener('click', async () => {
      await this.cargarProductosSelect();
      formContainer.style.display = 'flex';
      form.reset();
      const itemsContainer = document.getElementById('pedido-items');
      itemsContainer.innerHTML = `
        <div class="pedido-item">
          <select name="productoId" class="producto-select" required>
            <option value="">Seleccionar producto...</option>
          </select>
          <input type="number" name="cantidad" placeholder="Cantidad" min="1" required>
        </div>
      `;
      await this.cargarProductosSelect();
    });

    btnCancelar.addEventListener('click', () => {
      formContainer.style.display = 'none';
      form.reset();
    });

    btnAgregar.addEventListener('click', async () => {
      const itemsContainer = document.getElementById('pedido-items');
      const newItem = document.createElement('div');
      newItem.className = 'pedido-item';
      newItem.innerHTML = `
        <select name="productoId" class="producto-select" required>
          <option value="">Seleccionar producto...</option>
        </select>
        <input type="number" name="cantidad" placeholder="Cantidad" min="1" required>
      `;
      itemsContainer.appendChild(newItem);
      await this.cargarProductosSelect();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const productoIds = formData.getAll('productoId');
      const cantidades = formData.getAll('cantidad');

      const items = productoIds.map((id, index) => ({
        productoId: parseInt(id),
        cantidad: parseInt(cantidades[index])
      }));

      const data = {
        cliente: formData.get('cliente'),
        formaPago: formData.get('formaPago'),
        items: items
      };

      try {
        const response = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
          alert(`Pedido creado exitosamente. Total: $${result.data.montoTotal.toFixed(2)}`);
          form.reset();
          formContainer.style.display = 'none';
          this.cargarPedidos();
          this.cargarProductos();
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        alert('Error al crear pedido: ' + error.message);
      }
    });
  }

  setupPromociones() {
    const btnNuevo = document.getElementById('btn-nuevo-evento');
    const formContainer = document.getElementById('form-evento');
    const btnCancelar = document.getElementById('btn-cancelar-evento');
    const form = document.getElementById('evento-form');

    btnNuevo.addEventListener('click', () => {
      formContainer.style.display = 'flex';
      form.reset();
    });

    btnCancelar.addEventListener('click', () => {
      formContainer.style.display = 'none';
      form.reset();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('/api/eventos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
          alert('Evento registrado exitosamente');
          form.reset();
          formContainer.style.display = 'none';
          this.cargarEventos();
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        alert('Error al registrar evento: ' + error.message);
      }
    });
  }

  async cargarDatos() {
    await this.cargarProductos();
    await this.cargarPedidos();
    await this.cargarEventos();
    await this.cargarDestacados();
  }

  async cargarProductos() {
    try {
      const response = await fetch('/api/productos');
      const result = await response.json();

      if (result.success) {
        const lista = document.getElementById('lista-productos');
        lista.innerHTML = result.data.map(p => `
          <div class="product-card">
            <div class="product-header">
              <span class="product-type">${p.tipo}</span>
              ${p.destacado ? '<span class="badge destacado">Destacado</span>' : ''}
            </div>
            <h3 class="product-title">${p.diseno}</h3>
            <div class="product-info">
              <p><strong>Materiales:</strong> ${p.materiales}</p>
              <p><strong>Artesana:</strong> ${p.artesana}</p>
            </div>
            <div class="product-price">$${p.precio.toFixed(2)}</div>
            <div class="stock-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 7h-4V5a3 3 0 0 0-6 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
              </svg>
              Stock: ${p.stock} unidades
            </div>
            <div class="product-actions">
              <button class="btn-secondary" onclick="app.actualizarStock(${p.id})">Actualizar Stock</button>
              <button class="btn-secondary" onclick="app.toggleDestacado(${p.id}, ${p.destacado})">
                ${p.destacado ? 'Quitar Destacado' : 'Destacar'}
              </button>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  async cargarProductosSelect() {
    try {
      const response = await fetch('/api/productos');
      const result = await response.json();

      if (result.success) {
        document.querySelectorAll('.producto-select').forEach(select => {
          select.innerHTML = '<option value="">Seleccionar producto...</option>' +
            result.data.filter(p => p.stock > 0).map(p =>
              `<option value="${p.id}">${p.tipo} - ${p.diseno} ($${p.precio.toFixed(2)}) - Stock: ${p.stock}</option>`
            ).join('');
        });
      }
    } catch (error) {
      console.error('Error al cargar productos select:', error);
    }
  }

  async cargarPedidos() {
    try {
      const response = await fetch('/api/pedidos');
      const result = await response.json();

      if (result.success) {
        const lista = document.getElementById('lista-pedidos');
        lista.innerHTML = result.data.map(p => `
          <div class="order-card">
            <div class="order-header">
              <span class="order-id">Pedido #${p.id}</span>
              <span class="badge ${p.estado}">${p.estado.toUpperCase()}</span>
            </div>
            <div class="order-body">
              <div class="order-info-item">
                <span class="order-info-label">Cliente</span>
                <span class="order-info-value">${p.cliente}</span>
              </div>
              <div class="order-info-item">
                <span class="order-info-label">Forma de Pago</span>
                <span class="order-info-value">${p.forma_pago}</span>
              </div>
              <div class="order-info-item">
                <span class="order-info-label">Fecha</span>
                <span class="order-info-value">${new Date(p.fecha).toLocaleDateString('es-ES')}</span>
              </div>
              <div class="order-info-item">
                <span class="order-info-label">Total</span>
                <span class="order-total">$${p.monto_total.toFixed(2)}</span>
              </div>
            </div>
            ${p.estado !== 'entregado' ? `
              <div class="order-actions">
                ${p.estado === 'pendiente' ?
                  `<button class="btn-primary" onclick="app.cambiarEstadoPedido(${p.id}, 'enviado')">Marcar como Enviado</button>` : ''}
                ${p.estado === 'enviado' ?
                  `<button class="btn-primary" onclick="app.cambiarEstadoPedido(${p.id}, 'entregado')">Marcar como Entregado</button>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  }

  async cargarEventos() {
    try {
      const response = await fetch('/api/eventos');
      const result = await response.json();

      if (result.success) {
        const lista = document.getElementById('lista-eventos');
        lista.innerHTML = result.data.map(e => `
          <div class="event-card">
            <div class="event-date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 4px;">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${new Date(e.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div class="event-title">${e.nombre}</div>
            <div class="event-description">${e.descripcion || 'Sin descripcion'}</div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }

  async cargarDestacados() {
    try {
      const response = await fetch('/api/productos-destacados');
      const result = await response.json();

      if (result.success) {
        const lista = document.getElementById('lista-destacados');
        if (result.data.length === 0) {
          lista.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No hay productos destacados</p>';
        } else {
          lista.innerHTML = result.data.map(p => `
            <div class="featured-card">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                <span class="product-type">${p.tipo}</span>
                <span class="badge destacado">Destacado</span>
              </div>
              <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">${p.diseno}</h4>
              <div style="color: var(--primary); font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0;">$${p.precio.toFixed(2)}</div>
              <div style="color: var(--text-secondary); font-size: 0.875rem;">Stock: ${p.stock} unidades</div>
            </div>
          `).join('');
        }
      }
    } catch (error) {
      console.error('Error al cargar destacados:', error);
    }
  }

  async actualizarStock(id) {
    const nuevoStock = prompt('Ingrese el nuevo stock:');
    if (nuevoStock === null) return;

    try {
      const response = await fetch(`/api/productos/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: parseInt(nuevoStock) })
      });

      const result = await response.json();
      if (result.success) {
        alert('Stock actualizado exitosamente');
        this.cargarProductos();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error al actualizar stock: ' + error.message);
    }
  }

  async toggleDestacado(id, actualDestacado) {
    try {
      const response = await fetch(`/api/productos/${id}/destacado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destacado: !actualDestacado })
      });

      const result = await response.json();
      if (result.success) {
        alert('Producto actualizado exitosamente');
        this.cargarProductos();
        this.cargarDestacados();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error al actualizar producto: ' + error.message);
    }
  }

  async cambiarEstadoPedido(id, nuevoEstado) {
    try {
      const response = await fetch(`/api/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const result = await response.json();
      if (result.success) {
        alert('Estado del pedido actualizado exitosamente');
        this.cargarPedidos();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error al cambiar estado: ' + error.message);
    }
  }
}

const app = new ArtesaniasApp();
