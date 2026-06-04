export const customCss = `
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap');

  /* Background and Base Font */
  body {
    background-color: #fff8e8 !important; /* cream */
    font-family: 'Raleway', sans-serif !important;
  }
  .swagger-ui, .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info table {
    font-family: 'Raleway', sans-serif !important;
  }

  /* Topbar */
  .swagger-ui .topbar {
    background-color: #203a25 !important; /* moss */
    border-bottom: 3px solid #4f9f45 !important; /* leaf-500 */
  }

  /* Titles and Headers */
  .swagger-ui .info .title {
    color: #173f26 !important; /* leaf-900 */
    font-family: 'Raleway', sans-serif !important;
    font-weight: 900 !important;
  }
  .swagger-ui h1, .swagger-ui h2, .swagger-ui h3, .swagger-ui h4, .swagger-ui h5 {
    color: #173f26 !important;
    font-family: 'Raleway', sans-serif !important;
    font-weight: 700 !important;
  }

  /* Links */
  .swagger-ui a.nostyle, .swagger-ui a {
    color: #347a37 !important; /* leaf-600 */
  }
  .swagger-ui a.nostyle:hover, .swagger-ui a:hover {
    color: #4f9f45 !important;
  }

  /* BASE BUTTON STYLES (MATCHING FRONTEND rounded-full font-black) */
  .swagger-ui .btn {
    border-radius: 9999px !important;
    font-weight: 900 !important;
    font-family: 'Raleway', sans-serif !important;
    padding: 8px 20px !important;
    transition: all 0.2s !important;
    border-width: 1px !important;
  }

  /* Execute Button (Primary: bg-leaf-600 hover:bg-leaf-900 text-white) */
  .swagger-ui .btn.execute {
    background-color: #347a37 !important; /* leaf-600 */
    color: #ffffff !important;
    border-color: #347a37 !important;
    box-shadow: none !important;
    padding: 12px 24px !important;
  }
  .swagger-ui .btn.execute:hover {
    background-color: #173f26 !important; /* leaf-900 */
    border-color: #173f26 !important;
  }

  /* Authorize & Cancel Buttons (Outline: border-moss/20 text-moss hover:border-leaf-600 hover:text-leaf-700) */
  .swagger-ui .btn.authorize, .swagger-ui .btn.cancel {
    border-color: rgba(32, 58, 37, 0.2) !important; /* moss/20 */
    color: #203a25 !important; /* moss */
    background-color: transparent !important;
  }
  .swagger-ui .btn.authorize:hover, .swagger-ui .btn.cancel:hover {
    border-color: #347a37 !important; /* leaf-600 */
    color: #347a37 !important;
  }
  .swagger-ui .btn.authorize svg {
    fill: currentColor !important;
  }

  /* Try It Out Button (Light Green: bg-[#dce8cf] text-leaf-900 hover:bg-[#e2edd8]) */
  .swagger-ui .btn.try-out__btn {
    background-color: #dce8cf !important;
    color: #173f26 !important;
    border-color: transparent !important;
  }
  .swagger-ui .btn.try-out__btn:hover {
    background-color: #e2edd8 !important;
  }

  /* Clear Button (Light Cream: bg-[#f5f1df] text-moss) */
  .swagger-ui .btn.btn-clear {
    background-color: #f5f1df !important;
    color: #203a25 !important;
    border-color: transparent !important;
  }
  .swagger-ui .btn.btn-clear:hover {
    opacity: 0.8 !important;
  }

  /* Methods Badges */
  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background-color: #4f9f45 !important; /* leaf-500 */
    border-radius: 9999px !important;
  }
  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background-color: #347a37 !important; /* leaf-600 */
    border-radius: 9999px !important;
  }
  .swagger-ui .opblock.opblock-put .opblock-summary-method {
    background-color: #f5b84b !important; /* honey */
    color: #173f26 !important;
    border-radius: 9999px !important;
  }
  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background-color: #b91c1c !important; /* red-700 */
    border-radius: 9999px !important;
  }

  /* Outline Colors for Method Blocks */
  .swagger-ui .opblock.opblock-post {
    border-color: rgba(79, 159, 69, 0.3) !important;
    background: rgba(79, 159, 69, 0.05) !important;
    border-radius: 16px !important;
  }
  .swagger-ui .opblock.opblock-get {
    border-color: rgba(52, 122, 55, 0.3) !important;
    background: rgba(52, 122, 55, 0.05) !important;
    border-radius: 16px !important;
  }
  .swagger-ui .opblock.opblock-put {
    border-color: rgba(245, 184, 75, 0.3) !important;
    background: rgba(245, 184, 75, 0.05) !important;
    border-radius: 16px !important;
  }
  .swagger-ui .opblock.opblock-delete {
    border-color: rgba(185, 28, 28, 0.3) !important;
    background: rgba(185, 28, 28, 0.05) !important;
    border-radius: 16px !important;
  }
`;
