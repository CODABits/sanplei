
let cart = [];
let currentModalProduct = {};
let currentImages = [];
let currentIndex = 0;
let quantity = 1;

const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const carouselDots = document.getElementById('carouselDots');
const cartDrawer = document.getElementById('cartDrawer');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');

function openModal(images, title, price, desc) {
    currentImages = images;
    currentIndex = 0;
    quantity = 1;
    document.getElementById('qtyValue').innerText = quantity;

    currentModalProduct = { title, price, desc };

    modalTitle.innerText = title;
    modalPrice.innerText = "COP " + price.toLocaleString();
    modalDesc.innerHTML = desc;

    updateGallery();
    modal.classList.add('active');
}

function updateGallery() {
    modalImage.src = currentImages[currentIndex];
    carouselDots.innerHTML = '';
    currentImages.forEach((img, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === currentIndex ? 'active' : ''}`;
        dot.onclick = () => { currentIndex = index; updateGallery(); };
        carouselDots.appendChild(dot);
    });
}

function closeModal() {
    modal.classList.remove('active');
}

function changeQty(amount) {
    quantity += amount;
    if (quantity < 1) quantity = 1;
    document.getElementById('qtyValue').innerText = quantity;
}

function toggleCart() {
    cartDrawer.classList.toggle('active');
}

function addToCartFromModal() {
    const existingItem = cart.find(item => item.title === currentModalProduct.title);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            title: currentModalProduct.title,
            price: currentModalProduct.price,
            quantity: quantity
        });
    }
    updateCartUI();
    closeModal();
    toggleCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #777; text-align: center; margin-top: 20px;">Tu carrito está vacío.</p>';
        cartTotalPrice.innerText = 'COP 0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>Cant: ${item.quantity} x COP ${item.price.toLocaleString()}</p>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
    });

    cartTotalPrice.innerText = 'COP ' + total.toLocaleString();
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        event.preventDefault();
        return;
    }

    let message = "Hola, ¡quiero hacer el siguiente pedido desde la web! 📦:\n\n";
    let total = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        message += `- ${item.quantity}x ${item.title} (COP ${subtotal.toLocaleString()})\n`;
    });

    message += `\n*Total a pagar: COP ${total.toLocaleString()}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573332464187?text=${encodedMessage}`;
    
    document.getElementById('whatsappCheckoutBtn').href = whatsappUrl;
}

window.onclick = function(event) {
    if (event.target == modal) closeModal();
}


function filtrarProductos() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const title = card.querySelector('.product-title').innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}


document.getElementById('modal-description').innerHTML = descripcion;
// Función para abrir las políticas y términos legales en el modal
function openLegalModal(type) {
    const modal = document.getElementById('legalModal');
    const titleEl = document.getElementById('legalTitle');
    const bodyEl = document.getElementById('legalBody');
    
    let title = "";
    let content = "";

    if (type === 'terminos') {
        title = "Términos y Condiciones de Uso - SANBREI";
        content = `
            <p><strong>1. Identificación y Aceptación:</strong> Bienvenido a <strong>SANBREI</strong> (sanbrei.com), operado desde Manizales, Caldas, Colombia. El acceso y uso de este sitio web implica la aceptación total y sin reservas de los presentes Términos y Condiciones.</p><br>
            <p><strong>2. Capacidad Legal:</strong> Los servicios y productos ofrecidos en este sitio están disponibles exclusivamente para personas con capacidad legal para contratar. Si el usuario es menor de edad, deberá actuar bajo la supervisión de sus padres o tutores legales.</p><br>
            <p><strong>3. Órdenes y Compra a través de WhatsApp:</strong> Las transacciones gestionadas mediante nuestra pasarela hacia WhatsApp constituyen una oferta de compra sujeta a confirmación de disponibilidad de inventario y validación de datos de entrega por parte de nuestro equipo de atención.</p><br>
            <p><strong>4. Propiedad Intelectual:</strong> Todo el material gráfico, diseño, logotipos, textos y código fuente de sanbrei.com son propiedad exclusiva de SANBREI y están protegidos por las leyes nacionales e internacionales de propiedad intelectual.</p>
        `;
    } else if (type === 'privacidad') {
        title = "Política de Tratamiento de Datos (Habeas Data) - Ley 1581 de 2012";
        content = `
            <p><strong>1. Responsable del Tratamiento:</strong> En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de datos personales (Habeas Data), SANBREI informa que es responsable del manejo de la información recolectada a través de este sitio web y canales de mensajería.</p><br>
            <p><strong>2. Finalidad de la Recolección:</strong> Los datos personales (nombre, teléfono y dirección de envío) solicitados en el formulario de compra son recopilados única y exclusivamente para procesar pedidos, gestionar entregas (pago contra entrega) y enviar notificaciones logísticas o de servicio al cliente.</p><br>
            <p><strong>3. Derechos del Titular:</strong> Como titular de sus datos, usted tiene derecho a conocer, actualizar, rectificar y suprimir su información, así como a revocar la autorización otorgada para su uso, contactándonos a través de nuestros canales oficiales.</p>
        `;
    } else if (type === 'legal') {
        title = "Garantías, Derecho de Retracto y Ley 1480 de 2011";
        content = `
            <p><strong>1. Estatuto del Consumidor:</strong> SANBREI acoge en su totalidad las disposiciones establecidas en la Ley 1480 de 2011 (Estatuto del Consumidor de la República de Colombia) para garantizar los derechos de todos nuestros compradores.</p><br>
            <p><strong>2. Derecho de Retracto:</strong> De conformidad con el artículo 47 de la Ley 1480, en las ventas por métodos no tradicionales o a distancia (como nuestra tienda online), el consumidor podrá ejercer el derecho de retracto dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la entrega del bien. El producto deberá devolverse en las mismas condiciones en que se recibió, sin uso y con sus empaques originales. Los costos de transporte de devolución correrán por cuenta del consumidor.</p><br>
            <p><strong>3. Garantía Legal:</strong> Todos nuestros productos cuentan con garantía por defectos de fabricación. Para hacer efectiva una reclamación de garantía, el usuario debe comunicarse mediante nuestro canal oficial de WhatsApp aportando los datos de la compra.</p>
        `;
    }

    titleEl.innerText = title;
    bodyEl.innerHTML = content;
    modal.classList.add('active');
}

// Función para cerrar el modal legal
function closeLegalModal() {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.classList.remove('active');
    }
}


function filtrarCategoria(categoria) {
    const productos = document.querySelectorAll('.product-card');

    productos.forEach(producto => {
        const categoriaProducto = producto.getAttribute('data-category');

        if (categoria === 'todo' || categoriaProducto === categoria) {
            producto.style.display = 'flex'; // Muestra el producto
        } else {
            producto.style.display = 'none';  // Oculta el producto
        }
    });
}