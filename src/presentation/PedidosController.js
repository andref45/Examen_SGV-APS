class PedidosController {
  constructor(pedidosService) {
    this.pedidosService = pedidosService;
  }

  crearPedido(req, res) {
    try {
      const { cliente, formaPago, items } = req.body;
      const pedido = this.pedidosService.crearPedido(cliente, formaPago, items);
      res.status(201).json({ success: true, data: pedido });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  listarPedidos(req, res) {
    try {
      const pedidos = this.pedidosService.listarPedidos();
      res.json({ success: true, data: pedidos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  obtenerPedido(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pedido = this.pedidosService.obtenerPedido(id);
      res.json({ success: true, data: pedido });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  cambiarEstado(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { estado } = req.body;
      const resultado = this.pedidosService.cambiarEstado(id, estado);
      res.json({ success: true, data: resultado });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = PedidosController;
