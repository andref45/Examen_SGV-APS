const fs = require('fs');
const path = require('path');

class DataLayer {
  constructor() {
    this.dbPath = path.join(__dirname, '../../data.json');
    this.data = this.loadData();
  }

  loadData() {
    if (fs.existsSync(this.dbPath)) {
      const rawData = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(rawData);
    }
    return {
      productos: [],
      pedidos: [],
      pedidoItems: [],
      eventos: [],
      counters: {
        productos: 0,
        pedidos: 0,
        pedidoItems: 0,
        eventos: 0
      }
    };
  }

  saveData() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  insertProducto(tipo, diseno, materiales, precio, stock, artesana) {
    this.data.counters.productos++;
    const id = this.data.counters.productos;
    const producto = {
      id,
      tipo,
      diseno,
      materiales,
      precio,
      stock,
      artesana,
      destacado: 0
    };
    this.data.productos.push(producto);
    this.saveData();
    return id;
  }

  getAllProductos() {
    return [...this.data.productos].sort((a, b) => b.id - a.id);
  }

  getProductoById(id) {
    return this.data.productos.find(p => p.id === id);
  }

  updateStockProducto(id, nuevoStock) {
    const producto = this.data.productos.find(p => p.id === id);
    if (producto) {
      producto.stock = nuevoStock;
      this.saveData();
      return true;
    }
    return false;
  }

  updateDestacadoProducto(id, destacado) {
    const producto = this.data.productos.find(p => p.id === id);
    if (producto) {
      producto.destacado = destacado;
      this.saveData();
      return true;
    }
    return false;
  }

  getProductosDestacados() {
    return this.data.productos.filter(p => p.destacado === 1);
  }

  insertPedido(cliente, formaPago, montoTotal, fecha) {
    this.data.counters.pedidos++;
    const id = this.data.counters.pedidos;
    const pedido = {
      id,
      cliente,
      forma_pago: formaPago,
      estado: 'pendiente',
      monto_total: montoTotal,
      fecha
    };
    this.data.pedidos.push(pedido);
    this.saveData();
    return id;
  }

  insertPedidoItem(pedidoId, productoId, cantidad, precioUnitario) {
    this.data.counters.pedidoItems++;
    const id = this.data.counters.pedidoItems;
    const item = {
      id,
      pedido_id: pedidoId,
      producto_id: productoId,
      cantidad,
      precio_unitario: precioUnitario
    };
    this.data.pedidoItems.push(item);
    this.saveData();
    return id;
  }

  getAllPedidos() {
    return [...this.data.pedidos].sort((a, b) => b.id - a.id);
  }

  getPedidoById(id) {
    return this.data.pedidos.find(p => p.id === id);
  }

  getPedidoItems(pedidoId) {
    return this.data.pedidoItems
      .filter(item => item.pedido_id === pedidoId)
      .map(item => {
        const producto = this.getProductoById(item.producto_id);
        return {
          ...item,
          tipo: producto ? producto.tipo : '',
          diseno: producto ? producto.diseno : ''
        };
      });
  }

  updateEstadoPedido(id, nuevoEstado) {
    const pedido = this.data.pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.estado = nuevoEstado;
      this.saveData();
      return true;
    }
    return false;
  }

  insertEvento(nombre, fecha, descripcion) {
    this.data.counters.eventos++;
    const id = this.data.counters.eventos;
    const evento = {
      id,
      nombre,
      fecha,
      descripcion
    };
    this.data.eventos.push(evento);
    this.saveData();
    return id;
  }

  getAllEventos() {
    return [...this.data.eventos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }

  close() {
  }
}

module.exports = DataLayer;
