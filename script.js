document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const previewModal = document.getElementById('previewModal');
    const modalClose = document.getElementById('modalClose');
    const previewBtn = document.getElementById('previewBtn');
    const printBtn = document.getElementById('printBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const signaturePlaceholder = document.getElementById('signaturePlaceholder');
    const signaturePreview = document.getElementById('signaturePreview');
    const signatureModal = document.getElementById('signatureModal');
    const signatureModalClose = document.getElementById('signatureModalClose');
    const clearSignatureBtn = document.getElementById('clearSignatureBtn');
    const saveSignatureBtn = document.getElementById('saveSignatureBtn');
    const signaturePad = document.getElementById('signaturePad');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemsBody = document.getElementById('itemsBody');
    const aiFillBtn = document.getElementById('aiFillBtn');
    
    // Variables
    let itemCount = 1;
    let signatureData = null;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    const ctx = signaturePad.getContext('2d');
    
    // Initialize signature pad
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Event Listeners
    previewBtn.addEventListener('click', showPreview);
    modalClose.addEventListener('click', () => previewModal.style.display = 'none');
    printBtn.addEventListener('click', printInvoice);
    downloadPdfBtn.addEventListener('click', downloadPdf);
    sendEmailBtn.addEventListener('click', sendEmail);
    signaturePlaceholder.addEventListener('click', showSignatureModal);
    signatureModalClose.addEventListener('click', () => signatureModal.style.display = 'none');
    clearSignatureBtn.addEventListener('click', clearSignature);
    saveSignatureBtn.addEventListener('click', saveSignature);
    addItemBtn.addEventListener('click', addItem);
    aiFillBtn.addEventListener('click', aiFillDetails);
    
    // Signature pad events
    signaturePad.addEventListener('mousedown', startDrawing);
    signaturePad.addEventListener('mousemove', draw);
    signaturePad.addEventListener('mouseup', stopDrawing);
    signaturePad.addEventListener('mouseout', stopDrawing);
    
    // Template selection
    const templateOptions = document.querySelectorAll('.template-option');
    templateOptions.forEach(option => {
        option.addEventListener('click', function() {
            templateOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            updateTemplatePreview(this.dataset.template);
        });
    });
    
    // Item calculation events
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('item-qty') || e.target.classList.contains('item-price')) {
            calculateItemAmount(e.target.closest('tr'));
        }
    });
    
    // Signature Handling
    function initializeSignaturePad() {
        const canvas = document.getElementById('signaturePad');
        signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)',
            penColor: '#000',
            minWidth: 0.5,
            maxWidth: 2.5,
            throttle: 16
        });
        
        // Resize canvas
        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            signaturePad.clear();
        }
        
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
    }
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function clearSignature() {
        ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
    }
    
    function saveSignature() {
        signatureData = signaturePad.toDataURL();
        signaturePreview.src = signatureData;
        signaturePreview.style.display = 'block';
        signaturePlaceholder.style.display = 'none';
        signatureModal.style.display = 'none';
    }
    
    function removeSignature() {
        document.getElementById('signaturePreview').src = '';
        document.getElementById('signaturePreviewContainer').style.display = 'none';
        document.getElementById('signaturePad').style.display = 'block';
        document.querySelector('.signature-actions').style.display = 'flex';
        if (signaturePad) {
            signaturePad.clear();
        }
    }
    
    // Functions
    function showPreview() {
        // Update preview with current data
        document.getElementById('previewFromName').textContent = document.getElementById('fromName').value || 'Your Business Name';
        document.getElementById('previewFromAddress').textContent = document.getElementById('fromAddress').value || '123 Business St\nCity, Country\nPostal Code';
        document.getElementById('previewFromEmail').textContent = document.getElementById('fromEmail').value || 'your@email.com';
        document.getElementById('previewFromPhone').textContent = document.getElementById('fromPhone').value || '+1 (123) 456-7890';
        
        document.getElementById('previewToName').textContent = document.getElementById('toName').value || 'Client Name';
        document.getElementById('previewToAddress').textContent = document.getElementById('toAddress').value || '123 Client St\nCity, Country\nPostal Code';
        document.getElementById('previewToEmail').textContent = document.getElementById('toEmail').value || 'client@email.com';
        
        document.getElementById('previewInvoiceNumber').textContent = document.getElementById('invoiceNumber').value;
        
        const invoiceDate = new Date(document.getElementById('invoiceDate').value || new Date());
        document.getElementById('previewInvoiceDate').textContent = invoiceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const dueDate = new Date(document.getElementById('dueDate').value || new Date());
        document.getElementById('previewDueDate').textContent = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        document.getElementById('previewNotes').textContent = document.getElementById('notes').value || 'Thank you for your business!';
        
        // Update items in preview
        const previewItemsBody = document.getElementById('previewItemsBody');
        previewItemsBody.innerHTML = '';
        
        const rows = document.querySelectorAll('#itemsBody tr');
        let subtotal = 0;
        
        rows.forEach(row => {
            const desc = row.querySelector('.item-desc').value || 'Item description';
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const amount = qty * price;
            subtotal += amount;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.rowIndex}</td>
                <td>${desc}</td>
                <td class="text-right">${qty}</td>
                <td class="text-right">${formatCurrency(price)}</td>
                <td class="text-right">${formatCurrency(amount)}</td>
            `;
            previewItemsBody.appendChild(tr);
        });
        
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;
        
        document.getElementById('previewSubtotal').textContent = formatCurrency(subtotal);
        document.getElementById('previewTax').textContent = formatCurrency(tax);
        document.getElementById('previewTotal').textContent = formatCurrency(total);
        
        // Show logo if uploaded
        const logoInput = document.getElementById('companyLogo');
        if (logoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewLogo').src = e.target.result;
                document.getElementById('previewLogo').style.display = 'block';
            };
            reader.readAsDataURL(logoInput.files[0]);
        } else {
            document.getElementById('previewLogo').style.display = 'none';
        }
        
        // Show signature if exists
        if (signatureData) {
            signaturePreview.src = signatureData;
            signaturePreview.style.display = 'block';
            signaturePlaceholder.style.display = 'none';
        } else {
            signaturePreview.style.display = 'none';
            signaturePlaceholder.style.display = 'flex';
        }
        
        // Show modal
        previewModal.style.display = 'flex';
    }
    
    function printInvoice() {
        window.print();
    }
    
    function downloadPdf() {
        alert('In a real implementation, this would generate and download a PDF');
        // In a real app, you would use a library like jsPDF or html2pdf.js
    }
    
    function sendEmail() {
        alert('In a real implementation, this would send the invoice via email');
    }
    
    function showSignatureModal() {
        signatureModal.style.display = 'flex';
    }
    
    function addItem() {
        itemCount++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${itemCount}</td>
            <td><input type="text" class="form-control item-desc" placeholder="Item description"></td>
            <td><input type="number" class="form-control item-qty" value="1" min="1"></td>
            <td><input type="number" class="form-control item-price" value="0" min="0" step="0.01"></td>
            <td class="item-amount">$0.00</td>
            <td class="item-actions"><button class="btn btn-danger" style="padding: 0.3rem 0.5rem;">×</button></td>
        `;
        itemsBody.appendChild(tr);
        
        // Add event listener to delete button
        tr.querySelector('.btn-danger').addEventListener('click', function() {
            tr.remove();
            renumberItems();
        });
    }
    
    function renumberItems() {
        const rows = document.querySelectorAll('#itemsBody tr');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
        itemCount = rows.length;
    }
    
    function calculateItemAmount(row) {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = qty * price;
        row.querySelector('.item-amount').textContent = formatCurrency(amount);
    }
    
    function aiFillDetails() {
        // Simulate AI filling details
        document.getElementById('toName').value = 'Acme Corporation';
        document.getElementById('toAddress').value = '123 Business Ave\nNew York, NY 10001\nUnited States';
        document.getElementById('toEmail').value = 'billing@acme.com';
        
        alert('In a real implementation, AI would analyze past invoices or external data to fill details');
    }
    
    function updateTemplatePreview(template) {
        const preview = document.getElementById('templatePreview');
        preview.innerHTML = '';
        
        // In a real app, you would show actual template previews
        const templateNames = {
            'simple': 'Simple Template',
            'modern': 'Modern Template',
            'elegant': 'Elegant Template',
            'minimal': 'Minimal Template',
            'corporate': 'Corporate Template',
            'creative': 'Creative Template'
        };
        
        const p = document.createElement('p');
        p.textContent = templateNames[template];
        p.style.fontWeight = 'bold';
        preview.appendChild(p);
    }
    
    function formatCurrency(amount) {
        const currency = document.getElementById('currency').value || 'USD';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
    }
    
    // Initialize date fields
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    
    document.getElementById('invoiceDate').valueAsDate = today;
    document.getElementById('dueDate').valueAsDate = dueDate;
    
    // Initialize template preview
    updateTemplatePreview('simple');
    
    // Add event listener to delete button for the first item
    document.querySelector('#itemsBody .btn-danger').addEventListener('click', function() {
        const row = this.closest('tr');
        if (document.querySelectorAll('#itemsBody tr').length > 1) {
            row.remove();
            renumberItems();
        } else {
            // Clear inputs if it's the last row
            row.querySelector('.item-desc').value = '';
            row.querySelector('.item-qty').value = 1;
            row.querySelector('.item-price').value = 0;
            row.querySelector('.item-amount').textContent = '$0.00';
        }
    });

    // Initialize signature pad when preview is shown
    previewBtn.addEventListener('click', function() {
        if (!signaturePad) {
            initializeSignaturePad();
        }
    });

    // Update copyright year and invoice number automatically
    function updateYearBasedElements() {
        const currentYear = new Date().getFullYear();
        
        // Update copyright year
        const copyrightElement = document.querySelector('.copyright');
        if (copyrightElement) {
            copyrightElement.innerHTML = `© ${currentYear} InvoicePro. All rights reserved.`;
        }
        
        // Update invoice number with current year
        const invoiceNumberInput = document.getElementById('invoiceNumber');
        if (invoiceNumberInput && !invoiceNumberInput.value) {
            // Generate a random number between 1000 and 9999
            const randomNum = Math.floor(Math.random() * 9000) + 1000;
            invoiceNumberInput.value = `INV-${currentYear}-${randomNum}`;
        }
    }

    // Call the function when the page loads
    updateYearBasedElements();

    // Function to fetch user's saved business information
    function fetchUserBusinessInfo() {
        // Check if user is logged in (you would typically check a session/token)
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            // Get saved business information from localStorage (in a real app, this would come from your backend)
            const savedBusinessInfo = {
                name: localStorage.getItem('businessName') || '',
                address: localStorage.getItem('businessAddress') || '',
                email: localStorage.getItem('businessEmail') || '',
                phone: localStorage.getItem('businessPhone') || '',
                logo: localStorage.getItem('businessLogo') || ''
            };

            // Update form fields if they exist and are empty
            const fromNameInput = document.getElementById('fromName');
            const fromAddressInput = document.getElementById('fromAddress');
            const fromEmailInput = document.getElementById('fromEmail');
            const fromPhoneInput = document.getElementById('fromPhone');
            const companyLogoInput = document.getElementById('companyLogo');

            // Only fill if auto-fill is checked
            const autoFillCheckbox = document.getElementById('autoFillBusinessInfo');
            if (autoFillCheckbox && autoFillCheckbox.checked) {
                if (fromNameInput && !fromNameInput.value) fromNameInput.value = savedBusinessInfo.name;
                if (fromAddressInput && !fromAddressInput.value) fromAddressInput.value = savedBusinessInfo.address;
                if (fromEmailInput && !fromEmailInput.value) fromEmailInput.value = savedBusinessInfo.email;
                if (fromPhoneInput && !fromPhoneInput.value) fromPhoneInput.value = savedBusinessInfo.phone;
                
                // If there's a saved logo, create a File object and set it to the logo input
                if (savedBusinessInfo.logo && companyLogoInput) {
                    fetch(savedBusinessInfo.logo)
                        .then(res => res.blob())
                        .then(blob => {
                            const file = new File([blob], "company-logo.png", { type: "image/png" });
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            companyLogoInput.files = dataTransfer.files;
                        });
                }
            }
        }
    }

    // Add auto-fill checkbox and use saved info button
    function addBusinessInfoControls() {
        const fromNameInput = document.getElementById('fromName');
        if (fromNameInput) {
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'business-info-controls';
            controlsContainer.style.marginTop = '10px';
            controlsContainer.style.display = 'flex';
            controlsContainer.style.alignItems = 'center';
            controlsContainer.style.gap = '10px';

            // Create checkbox container
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.gap = '5px';

            // Create checkbox
            const autoFillCheckbox = document.createElement('input');
            autoFillCheckbox.type = 'checkbox';
            autoFillCheckbox.id = 'autoFillBusinessInfo';
            autoFillCheckbox.style.margin = '0';

            // Create checkbox label
            const checkboxLabel = document.createElement('label');
            checkboxLabel.htmlFor = 'autoFillBusinessInfo';
            checkboxLabel.textContent = 'Auto-fill from profile';
            checkboxLabel.style.margin = '0';

            // Create use saved button
            const useSavedButton = document.createElement('button');
            useSavedButton.type = 'button';
            useSavedButton.className = 'btn btn-secondary btn-sm';
            useSavedButton.innerHTML = '<i class="fas fa-sync"></i> Use Saved Business Info';
            useSavedButton.onclick = fetchUserBusinessInfo;

            // Add elements to containers
            checkboxContainer.appendChild(autoFillCheckbox);
            checkboxContainer.appendChild(checkboxLabel);
            controlsContainer.appendChild(checkboxContainer);
            controlsContainer.appendChild(useSavedButton);

            // Add to the page
            fromNameInput.parentNode.appendChild(controlsContainer);

            // Add event listener to checkbox
            autoFillCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    fetchUserBusinessInfo();
                }
            });
        }
    }

    // Call these functions when the page loads
    addBusinessInfoControls();
    fetchUserBusinessInfo();
}); 